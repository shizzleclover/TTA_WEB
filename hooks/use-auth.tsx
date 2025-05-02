"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService, type LoginData, type RegisterData } from "@/lib/auth-service"
import { toast } from "@/components/ui/use-toast"

interface User {
  _id: string
  name: string
  email: string
  subscription?: {
    status: "free" | "premium" | "education"
    expiresAt: string | null
  }
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  register: (data: RegisterData) => Promise<boolean>
  login: (data: LoginData) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Function to reset auth state
  const resetAuthState = () => {
    localStorage.removeItem("auth_token");
    setToken(null);
    setUser(null);
  };

  // Function to handle token validation
  const validateToken = async (storedToken: string): Promise<boolean> => {
    try {
      console.log("Validating token...");
      
      // Add loading state
      setIsLoading(true);
      
      const userData = await authService.getProfile();
      console.log("Token validation response:", userData);
      
      // Handle empty object response
      if (userData && Object.keys(userData).length === 0) {
        console.log("Empty response object received during validation, treating as invalid token");
        resetAuthState();
        return false;
      }
      
      if (userData && userData.success && userData.user) {
        console.log("Token is valid, user data received");
        setUser(userData.user);
        return true;
      } else {
        console.error("Invalid token response", userData);
        
        // If we receive a successful profile response but it doesn't match our expected format,
        // create a default user for better UI experience
        if (userData && userData.success === true) {
          console.log("Setting default user data from successful but incomplete profile response");
          setUser({
            _id: "unknown",
            name: "User",
            email: "user@example.com",
            subscription: {
              status: "free",
              expiresAt: null
            }
          });
          return true;
        }
        
        // Only show a toast for network or server errors, not for expired tokens
        // which is a normal condition
        if (userData && userData.message && 
            !userData.message.includes("expired") && 
            !userData.message.includes("invalid") &&
            !userData.message.includes("Authentication token")) {
          toast({
            title: "Authentication error",
            description: userData.message || "There was a problem with your token",
            variant: "destructive",
          });
        }
        
        resetAuthState();
        return false;
      }
    } catch (error) {
      console.error("Token validation error:", error);
      
      toast({
        title: "Authentication error",
        description: "Unable to validate your session. Please try logging in again.",
        variant: "destructive",
      });
      
      resetAuthState();
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        console.log("Checking auth status...");
        const storedToken = localStorage.getItem("auth_token");

        if (storedToken) {
          console.log("Found stored token, setting it");
          setToken(storedToken);
          
          // Validate the token
          const isValid = await validateToken(storedToken);
          console.log("Token validation result:", isValid);
          
          if (!isValid) {
            console.warn("Invalid token, clearing authentication");
            resetAuthState();
          }
        } else {
          console.log("No auth token found");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Authentication error",
          description: "There was a problem checking your authentication status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    try {
      console.log("Registering user:", data.email);
      const result = await authService.register(data)
      console.log("Registration result:", result);

      if (result.success && result.token) {
        localStorage.setItem("auth_token", result.token)
        setToken(result.token)
        
        if (result.user) {
          console.log("Setting user data from registration");
          setUser(result.user);
        } else {
          console.error("Registration successful but user data missing");
        }
        
        return true
      }

      return false
    } catch (error) {
      console.error("Registration error in hook:", error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginData): Promise<boolean> => {
    setIsLoading(true)
    try {
      console.log("Logging in user:", data.email);
      const result = await authService.login(data)
      console.log("Login result:", result);

      if (result.success && result.token) {
        // Ensure we're clearing any old token first
        localStorage.removeItem("auth_token");
        // Now set the new token
        localStorage.setItem("auth_token", result.token)
        setToken(result.token)
        
        if (result.user) {
          console.log("Setting user data from login");
          setUser(result.user);
        } else {
          console.error("Login successful but user data missing");
        }
        
        return true
      }

      return false
    } catch (error) {
      console.error("Login error in hook:", error)
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log("Logging out user");
    authService.logout()
    resetAuthState()
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

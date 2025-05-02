import { toast } from "@/components/ui/use-toast"

// Ensure API_BASE_URL has a valid default and log what we're using
const API_BASE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  console.info(`Using API base URL: ${url}`);
  return url;
})();

// Function to get loading context - will be called inside API methods
const getLoadingFunctions = () => {
  // Check if we're on the client side
  if (typeof window !== "undefined") {
    try {
      // Dynamically import loading context
      const loadingModule = require("@/hooks/use-loading");
      const loadingContext = loadingModule.__GLOBAL_LOADING_CONTEXT;
      
      if (loadingContext) {
        return {
          startLoading: loadingContext.startLoading,
          stopLoading: loadingContext.stopLoading
        };
      }
    } catch (e) {
      // Handle any import errors silently
      console.debug("Loading context not initialized yet");
    }
  }
  
  // Return dummy functions if context isn't available
  return {
    startLoading: (message?: string) => {},
    stopLoading: () => {}
  };
};

export interface RegisterData {
  name: string
  email: string
  password: string
  isStudent?: boolean
}

export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AppleAuthData {
  idToken: string
  name?: string
}

export interface AuthResponse {
  success: boolean
  token?: string
  message?: string
  user?: {
    _id: string
    name: string
    email: string
    subscription?: {
      status: string
      expiresAt: string | null
    }
  }
}

export interface PasswordResetRequestData {
  email: string
}

export interface PasswordResetVerifyData {
  email: string
  otp: string
}

export interface PasswordResetData {
  resetToken: string
  newPassword: string
}

export interface PasswordChangeData {
  currentPassword: string
  newPassword: string
}

export const authService = {
  async register(userData: RegisterData): Promise<AuthResponse> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Creating your account...");
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include", // For HTTP-only cookies
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      // Save token to localStorage if received
      if (data.token) {
        localStorage.setItem("auth_token", data.token)
      }

      return data
    } catch (error) {
      console.error("Registration error:", error)

      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })

      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      }
    } finally {
      stopLoading();
    }
  },

  async checkAuthentication(): Promise<AuthResponse> {
    console.log("Checking authentication status...");
    try {
      // Check if we have a token
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        console.log("No token found, user is not authenticated");
        return { 
          success: false, 
          message: "No authentication token found" 
        };
      }
      
      // Basic format check - a JWT should have at least 2 dots
      if (!token.includes('.') || token.split('.').length < 3) {
        console.error("Token format is invalid, clearing token");
        localStorage.removeItem("auth_token");
        return { 
          success: false, 
          message: "Invalid token format" 
        };
      }
      
      // Log token format (first few characters) for debugging
      const tokenPrefix = token.substring(0, 10) + "...";
      console.log("Authentication check: Token format check:", tokenPrefix);
      
      // Verify if token is valid by trying to get profile
      try {
        const profileResponse = await this.getProfile();
        if (profileResponse && profileResponse.success && profileResponse.user) {
          console.log("User is authenticated with valid token");
          return { 
            success: true, 
            token, 
            user: profileResponse.user,
            message: "User is authenticated" 
          };
        } else {
          console.error("Profile response indicates invalid token:", profileResponse);
          // Do not clear token immediately, allow for further debugging
          // localStorage.removeItem("auth_token");
        }
      } catch (error) {
        console.error("Token validation failed with error:", error);
        // Do not clear token immediately, allow for further debugging
        // localStorage.removeItem("auth_token");
      }
      
      // If we reach here, the token is invalid
      console.log("Token is considered invalid, but not cleared for debugging");
      return {
        success: false,
        message: "Invalid authentication token - not cleared for debugging"
      };
    } catch (error) {
      console.error("Error checking authentication:", error);
      return {
        success: false,
        message: "Failed to check authentication status"
      };
    }
  },

  async login(credentials: LoginData): Promise<AuthResponse> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Logging you in...");
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include", // For HTTP-only cookies
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Save token to localStorage if received
      if (data.token) {
        localStorage.setItem("auth_token", data.token)
      }

      return data
    } catch (error) {
      console.error("Login error:", error)

      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })

      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      }
    } finally {
      stopLoading();
    }
  },

  async appleLogin(authData: AppleAuthData): Promise<AuthResponse> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Logging in with Apple...");
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/apple/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authData),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Apple login failed")
      }

      // Save token to localStorage if received
      if (data.token) {
        localStorage.setItem("auth_token", data.token)
      }

      return data
    } catch (error) {
      console.error("Apple login error:", error)

      toast({
        title: "Apple login failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })

      return {
        success: false,
        message: error instanceof Error ? error.message : "Apple login failed",
      }
    } finally {
      stopLoading();
    }
  },

  async getProfile(): Promise<any> {
    try {
      // Check if we have a token
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        console.log("Auth service: No token found when fetching profile");
        return { 
          success: false, 
          message: "Authentication token not found" 
        };
      }
      
      console.log("Auth service: Fetching profile with token present:", !!token);
      
      // Basic format check
      if (!token.includes('.') || token.split('.').length < 3) {
        console.error("Auth service: Token format is invalid");
        return { 
          success: false, 
          message: "Invalid token format" 
        };
      }
      
      const tokenPrefix = token.substring(0, 10) + "...";
      console.log("Auth service: Token format check:", tokenPrefix);
      
      // Try profile/full endpoint
      console.log("Auth service: Trying profile/full endpoint");
      
      try {
        const response = await fetch(`${API_BASE_URL}/profile/full`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        
        console.log("Auth service: profile/full status:", response.status, response.statusText);
        
        if (response.ok) {
          let fullProfileData;
          try {
            fullProfileData = await response.json();
            console.log("Auth service: Got full profile data", fullProfileData);
          } catch (parseError) {
            console.error("Auth service: Failed to parse profile response", parseError);
            return {
              success: false,
              message: "Failed to parse profile data response"
            };
          }
          
          // If response is empty or not in expected format
          if (!fullProfileData || typeof fullProfileData !== 'object') {
            console.error("Auth service: Empty or invalid profile data received");
            return {
              success: false,
              message: "Empty or invalid profile data received"
            };
          }
          
          // If we get a success response with profile data, return it directly
          if (fullProfileData && fullProfileData.success && fullProfileData.user) {
            return {
              success: true,
              user: fullProfileData.user,
              message: "Profile data retrieved successfully"
            };
          } else {
            console.log("Auth service: Profile data doesn't match expected format", fullProfileData);
            // Handling correctly formatted response, but missing expected data
            return {
              success: false,
              message: "Profile data doesn't match expected format"
            };
          }
        } else {
          // Handle non-ok response from profile/full
          console.error("Auth service: Error from profile/full endpoint", response.status);
          return {
            success: false,
            message: `Failed to get profile data: ${response.status} ${response.statusText}`
          };
        }
      } catch (profileError) {
        console.error("Auth service: Full profile endpoint error:", profileError);
        return {
          success: false,
          message: profileError instanceof Error ? profileError.message : "Failed to get profile data"
        };
      }
    } catch (error) {
      console.error("Auth service: Profile fetch error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to get profile data",
      };
    }
  },
  
  async logout(): Promise<void> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Logging you out...");
    
    try {
      const token = localStorage.getItem("auth_token")

      try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        })
        
        // If response was ok, show success message
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            toast({
              title: "Logged out",
              description: data.message || "You have been logged out successfully",
            })
          }
        }
      } catch (error) {
        console.error("Logout error:", error)
      }
      
      // Remove token regardless of response
      localStorage.removeItem("auth_token")
    } finally {
      stopLoading();
    }
  },

  async verifyStudentEmail(token: string): Promise<{success: boolean; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Verifying your student email...");
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-student/${token}`)
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Verification failed")
      }
      
      if (data.success) {
        toast({
          title: "Email Verified",
          description: data.message || "Your student email has been verified successfully",
        })
      }
      
      return data
    } catch (error) {
      console.error("Verification error:", error)
      
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
      
      return {
        success: false,
        message: error instanceof Error ? error.message : "Verification failed",
      }
    } finally {
      stopLoading();
    }
  },

  async changePassword(data: PasswordChangeData): Promise<{success: boolean; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Changing your password...");
    
    try {
      const token = localStorage.getItem("auth_token")
      
      const response = await fetch(`${API_BASE_URL}/profile/password/change`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
        credentials: "include",
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.message || "Password change failed")
      }
      
      if (responseData.success) {
        toast({
          title: "Password Changed",
          description: responseData.message || "Your password has been changed successfully",
        })
      }
      
      return responseData
    } catch (error) {
      console.error("Password change error:", error)
      
      toast({
        title: "Password change failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
      
      return {
        success: false,
        message: error instanceof Error ? error.message : "Password change failed",
      }
    } finally {
      stopLoading();
    }
  },

  async requestPasswordReset(data: PasswordResetRequestData): Promise<{success: boolean; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Requesting password reset...");
    
    try {
      const response = await fetch(`${API_BASE_URL}/profile/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.message || "Password reset request failed")
      }
      
      if (responseData.success) {
        toast({
          title: "Reset Email Sent",
          description: responseData.message || "Check your email for the OTP code",
        })
      }
      
      return responseData
    } catch (error) {
      console.error("Password reset request error:", error)
      
      toast({
        title: "Reset request failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
      
      return {
        success: false,
        message: error instanceof Error ? error.message : "Password reset request failed",
      }
    } finally {
      stopLoading();
    }
  },

  async verifyPasswordResetOTP(data: PasswordResetVerifyData): Promise<{success: boolean; resetToken?: string; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Verifying OTP code...");
    
    try {
      const response = await fetch(`${API_BASE_URL}/profile/password-reset/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.message || "OTP verification failed")
      }
      
      return responseData
    } catch (error) {
      console.error("OTP verification error:", error)
      
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
      
      return {
        success: false,
        message: error instanceof Error ? error.message : "OTP verification failed",
      }
    } finally {
      stopLoading();
    }
  },

  async resetPassword(data: PasswordResetData): Promise<{success: boolean; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Resetting your password...");
    
    try {
      const response = await fetch(`${API_BASE_URL}/profile/password-reset/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.message || "Password reset failed")
      }
      
      if (responseData.success) {
        toast({
          title: "Password Reset",
          description: responseData.message || "Your password has been reset successfully",
        })
      }
      
      return responseData
    } catch (error) {
      console.error("Password reset error:", error)
      
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      })
      
      return {
        success: false,
        message: error instanceof Error ? error.message : "Password reset failed",
      }
    } finally {
      stopLoading();
    }
  },
}

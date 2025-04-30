"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService, type LoginData, type RegisterData } from "@/lib/auth-service"
import { toast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  tier: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  register: (data: RegisterData) => Promise<boolean>
  login: (data: LoginData) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("auth_token")

        if (token) {
          const userData = await authService.getProfile()
          if (userData && userData.user) {
            setUser(userData.user)
          } else {
            // Token invalid or expired
            localStorage.removeItem("auth_token")
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        toast({
          title: "Authentication error",
          description: "There was a problem checking your authentication status",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    try {
      const result = await authService.register(data)

      if (result.success && result.token) {
        localStorage.setItem("auth_token", result.token)
        setUser(result.user || null)
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
      const result = await authService.login(data)

      if (result.success && result.token) {
        localStorage.setItem("auth_token", result.token)
        setUser(result.user || null)
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
    authService.logout()
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
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

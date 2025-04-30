import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tta-kha7.onrender.com/api"

export interface RegisterData {
  name: string
  email: string
  password: string
  accountType: "free" | "premium" | "student"
}

export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface AuthResponse {
  success: boolean
  token?: string
  message?: string
  user?: {
    id: string
    name: string
    email: string
    tier: string
  }
}

export const authService = {
  async register(userData: RegisterData): Promise<AuthResponse> {
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
    }
  },

  async login(credentials: LoginData): Promise<AuthResponse> {
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
    }
  },

  async getProfile(): Promise<any> {
    try {
      const token = localStorage.getItem("auth_token")

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      return await response.json()
    } catch (error) {
      console.error("Profile fetch error:", error)
      return null
    }
  },

  async logout(): Promise<void> {
    try {
      const token = localStorage.getItem("auth_token")

      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      localStorage.removeItem("auth_token")
    } catch (error) {
      console.error("Logout error:", error)
      localStorage.removeItem("auth_token")
    }
  },
}

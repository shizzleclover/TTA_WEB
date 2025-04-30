import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tta-kha7.onrender.com"

// Check if we're in a preview environment (Vercel preview, local dev without API, etc.)
const isPreviewEnvironment = () => {
  return process.env.NEXT_PUBLIC_VERCEL_ENV === "preview" || (process.env.NODE_ENV === "development" && !isApiAvailable)
}

// Flag to track if API is available
let isApiAvailable = true

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

// Mock data for preview environments
const MOCK_USER = {
  id: "preview-user-123",
  name: "Preview User",
  email: "preview@example.com",
  tier: "premium",
}

export const authService = {
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      // For preview environments, return mock data
      if (isPreviewEnvironment()) {
        console.log("Using mock data for register in preview environment")
        return {
          success: true,
          token: "mock-token-123",
          user: MOCK_USER,
        }
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
        credentials: "include", // For HTTP-only cookies
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }

      return data
    } catch (error) {
      console.error("Registration error:", error)

      // Mark API as unavailable if it's a network error
      if (error instanceof TypeError && error.message.includes("fetch")) {
        isApiAvailable = false
        console.warn("API appears to be unavailable, switching to preview mode")
      }

      // If in development and API is unavailable, return mock data
      if (isPreviewEnvironment()) {
        console.log("Using mock data for register after error")
        return {
          success: true,
          token: "mock-token-123",
          user: MOCK_USER,
        }
      }

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
      // For preview environments, return mock data
      if (isPreviewEnvironment()) {
        console.log("Using mock data for login in preview environment")
        return {
          success: true,
          token: "mock-token-123",
          user: MOCK_USER,
        }
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include", // For HTTP-only cookies
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      return data
    } catch (error) {
      console.error("Login error:", error)

      // Mark API as unavailable if it's a network error
      if (error instanceof TypeError && error.message.includes("fetch")) {
        isApiAvailable = false
        console.warn("API appears to be unavailable, switching to preview mode")
      }

      // If in development and API is unavailable, return mock data
      if (isPreviewEnvironment()) {
        console.log("Using mock data for login after error")
        return {
          success: true,
          token: "mock-token-123",
          user: MOCK_USER,
        }
      }

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
      // For preview environments, return mock data
      if (isPreviewEnvironment()) {
        console.log("Using mock data for profile in preview environment")
        return {
          user: MOCK_USER,
        }
      }

      const token = localStorage.getItem("auth_token")

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      return await response.json()
    } catch (error) {
      console.error("Profile fetch error:", error)

      // Mark API as unavailable if it's a network error
      if (error instanceof TypeError && error.message.includes("fetch")) {
        isApiAvailable = false
        console.warn("API appears to be unavailable, switching to preview mode")
      }

      // If in development and API is unavailable, return mock data
      if (isPreviewEnvironment()) {
        console.log("Using mock data for profile after error")
        return {
          user: MOCK_USER,
        }
      }

      return null
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem("auth_token")
    // Additional cleanup if needed
  },
}

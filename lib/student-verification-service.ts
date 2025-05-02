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

export interface VerificationRequest {
  method: "email" | "id"
  email?: string
  schoolName?: string
  country?: string
  studentId?: string
  idImage?: File
}

export const studentVerificationService = {
  async submitVerification(data: VerificationRequest): Promise<{ success: boolean; message?: string }> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Submitting verification request...");
    
    try {
      const token = localStorage.getItem("auth_token")
      
      // Handle file uploads through FormData
      const formData = new FormData()
      formData.append("method", data.method)
      
      if (data.method === "email") {
        formData.append("email", data.email || "")
        formData.append("schoolName", data.schoolName || "")
        formData.append("country", data.country || "")
      } else if (data.method === "id") {
        formData.append("studentId", data.studentId || "")
        if (data.idImage) {
          formData.append("idImage", data.idImage)
        }
      }
      
      const response = await fetch(`${API_BASE_URL}/auth/verify-student`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit verification request");
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Verification Submitted",
          description:
            data.method === "email"
              ? "Please check your school email for a verification link."
              : "Your student ID has been submitted for review.",
        })
      }

      return result
    } catch (error) {
      console.error("Error submitting verification:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit verification request. Please try again later.",
        variant: "destructive",
      })
      return { success: false, message: "Failed to submit verification request" }
    } finally {
      stopLoading();
    }
  },

  async verifyEmail(token: string): Promise<{ success: boolean; message?: string }> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Verifying email...");
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-student/${token}`, {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to verify student email");
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Verification Successful",
          description: result.message || "Your student status has been verified successfully.",
        })
      }

      return result
    } catch (error) {
      console.error("Error verifying student email:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to verify student email. Please try again later.",
        variant: "destructive",
      })
      return { success: false, message: "Failed to verify student email" }
    } finally {
      stopLoading();
    }
  },

  async getVerificationStatus(): Promise<{ status: "pending" | "verified" | "rejected" | "none"; message?: string; success?: boolean }> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Checking verification status...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/auth/verify-student/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch verification status");
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching verification status:", error)
      // Don't show a toast for this as it's a status check
      return { status: "none", message: "Failed to fetch verification status", success: false }
    } finally {
      stopLoading();
    }
  },
}

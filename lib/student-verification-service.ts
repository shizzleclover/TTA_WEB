import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tta-kha7.onrender.com"

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
    try {
      const token = localStorage.getItem("auth_token")

      const formData = new FormData()
      formData.append("method", data.method)

      if (data.method === "email") {
        formData.append("email", data.email || "")
        formData.append("schoolName", data.schoolName || "")
        formData.append("country", data.country || "")
      } else {
        formData.append("studentId", data.studentId || "")
        if (data.idImage) {
          formData.append("idImage", data.idImage)
        }
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/verify-student`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to submit verification request")
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
        description: "Failed to submit verification request. Please try again later.",
        variant: "destructive",
      })
      return { success: false, message: "Failed to submit verification request" }
    }
  },

  async verifyEmail(token: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-student/${token}`, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Failed to verify student email")
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Verification Successful",
          description: "Your student status has been verified successfully.",
        })
      }

      return result
    } catch (error) {
      console.error("Error verifying student email:", error)
      toast({
        title: "Error",
        description: "Failed to verify student email. Please try again later.",
        variant: "destructive",
      })
      return { success: false, message: "Failed to verify student email" }
    }
  },

  async getVerificationStatus(): Promise<{ status: "pending" | "verified" | "rejected" | "none"; message?: string }> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-student/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch verification status")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching verification status:", error)
      return { status: "none", message: "Failed to fetch verification status" }
    }
  },
}

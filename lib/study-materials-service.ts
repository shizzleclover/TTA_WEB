import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tta-kha7.onrender.com/api"

export interface StudyMaterial {
  id: string
  title: string
  subject: string
  pages: number
  questions: number
  date: string
  type: string
}

export interface Question {
  id: string
  question: string
  answer: string
  difficulty: "Easy" | "Medium" | "Hard"
}

export const studyMaterialsService = {
  async getStudyMaterials(): Promise<StudyMaterial[]> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/study-materials`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch study materials")
      }

      const data = await response.json()
      return data.materials
    } catch (error) {
      console.error("Error fetching study materials:", error)
      toast({
        title: "Error",
        description: "Failed to load study materials. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  },

  async uploadMaterial(formData: FormData): Promise<{ success: boolean; materialId?: string; message?: string }> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/study-materials/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload study material")
      }

      return await response.json()
    } catch (error) {
      console.error("Error uploading study material:", error)
      toast({
        title: "Error",
        description: "Failed to upload study material. Please try again later.",
        variant: "destructive",
      })
      return { success: false, message: "Failed to upload study material" }
    }
  },

  async generateQuestions(materialId: string): Promise<Question[]> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/study-materials/${materialId}/generate-questions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to generate questions")
      }

      const data = await response.json()
      return data.questions
    } catch (error) {
      console.error("Error generating questions:", error)
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  },

  async getMaterial(materialId: string): Promise<any> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/study-materials/${materialId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch study material")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching study material:", error)
      toast({
        title: "Error",
        description: "Failed to load study material. Please try again later.",
        variant: "destructive",
      })
      return null
    }
  },
}

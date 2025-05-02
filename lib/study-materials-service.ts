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

export interface StudyMaterial {
  _id: string
  title: string
  description: string
  subject: string
  fileUrl: string
  status: "processing" | "completed" | "failed"
  questionsGenerated?: number
  uploadedAt: string
  userId?: string
}

export interface StudyMaterialDetail extends StudyMaterial {
  questions?: Array<{
    _id: string
    text: string
    correctAnswer: string
    difficulty: string
    explanation?: string
  }>
}

export interface StudyMaterialQuestion {
  text: string
  correctAnswer: string
  difficulty: "easy" | "medium" | "hard"
  explanation?: string
}

export const studyMaterialsService = {
  async getStudyMaterials(): Promise<StudyMaterial[]> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading study materials...");
    
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
      return data.success ? data.materials : []
    } catch (error) {
      console.error("Error fetching study materials:", error)
      toast({
        title: "Error",
        description: "Failed to load study materials. Please try again later.",
        variant: "destructive",
      })
      return []
    } finally {
      stopLoading();
    }
  },

  async uploadStudyMaterial(formData: FormData): Promise<{success: boolean; material?: StudyMaterial; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Uploading study material...");
    
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
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload study material");
      }

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Upload Successful",
          description: "Your study material has been uploaded and is now being processed.",
        });
      }
      
      return data
    } catch (error) {
      console.error("Error uploading study material:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload study material. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        message: "Failed to upload study material",
      }
    } finally {
      stopLoading();
    }
  },

  async getStudyMaterialDetails(id: string): Promise<StudyMaterialDetail | null> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading study material details...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/study-materials/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch study material details")
      }

      const data = await response.json()
      return data.success ? data.material : null
    } catch (error) {
      console.error("Error fetching study material details:", error)
      toast({
        title: "Error",
        description: "Failed to load study material details. Please try again later.",
        variant: "destructive",
      })
      return null
    } finally {
      stopLoading();
    }
  },

  async generateQuestions(id: string): Promise<{success: boolean; message?: string; estimatedTime?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Generating questions...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/study-materials/${id}/generate-questions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to generate questions");
      }

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Generating Questions",
          description: data.message || "Questions are being generated for your study material.",
        });
      }
      
      return data
    } catch (error) {
      console.error("Error generating questions:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate questions. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        message: "Failed to generate questions",
      }
    } finally {
      stopLoading();
    }
  },

  async addQuestion(id: string, question: StudyMaterialQuestion): Promise<{success: boolean; question?: any; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Adding question...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/study-materials/${id}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(question),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add question");
      }

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Question Added",
          description: "Your question has been added successfully.",
        });
      }
      
      return data
    } catch (error) {
      console.error("Error adding question:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add question. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        message: "Failed to add question",
      }
    } finally {
      stopLoading();
    }
  },

  async deleteStudyMaterial(id: string): Promise<{success: boolean; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Deleting study material...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/study-materials/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete study material");
      }

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Study Material Deleted",
          description: data.message || "Your study material has been deleted successfully.",
        });
      }
      
      return data
    } catch (error) {
      console.error("Error deleting study material:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete study material. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        message: "Failed to delete study material",
      }
    } finally {
      stopLoading();
    }
  }
}

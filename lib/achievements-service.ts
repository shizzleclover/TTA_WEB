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

export interface Achievement {
  _id: string
  name: string
  description: string
  icon: string
  type: "daily" | "game" | "streak" | "special"
  requirement: number
  points: number
  unlockedAt?: string
  viewed?: boolean
}

export const achievementsService = {
  async getAllAchievements(): Promise<Achievement[]> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading achievements...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/achievements`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch achievements")
      }

      const data = await response.json()
      return data.success ? data.achievements : []
    } catch (error) {
      console.error("Error fetching achievements:", error)
      toast({
        title: "Error",
        description: "Failed to load achievements. Please try again later.",
        variant: "destructive",
      })
      return []
    } finally {
      stopLoading();
    }
  },

  async getUserAchievements(): Promise<{
    achievements: Achievement[], 
    totalPoints: number, 
    newUnlocks: number
  }> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading your achievements...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/achievements/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user achievements")
      }

      const data = await response.json()
      
      if (data.success) {
        return {
          achievements: data.achievements || [],
          totalPoints: data.totalPoints || 0,
          newUnlocks: data.newUnlocks || 0
        }
      }
      
      return {
        achievements: [],
        totalPoints: 0,
        newUnlocks: 0
      }
    } catch (error) {
      console.error("Error fetching user achievements:", error)
      toast({
        title: "Error",
        description: "Failed to load your achievements. Please try again later.",
        variant: "destructive",
      })
      return {
        achievements: [],
        totalPoints: 0,
        newUnlocks: 0
      }
    } finally {
      stopLoading();
    }
  },

  async markAchievementAsViewed(achievementId: string): Promise<{success: boolean; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Updating achievement...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/achievements/${achievementId}/viewed`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to mark achievement as viewed");
      }

      return await response.json()
    } catch (error) {
      console.error("Error marking achievement as viewed:", error)
      // Don't show a toast for this operation as it's background
      return {
        success: false,
        message: "Failed to mark achievement as viewed"
      }
    } finally {
      stopLoading();
    }
  },

  // Admin functions
  async createAchievement(achievement: Omit<Achievement, '_id'>): Promise<{success: boolean; achievement?: Achievement; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Creating achievement...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/achievements`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(achievement),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create achievement");
      }

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Achievement Created",
          description: "The achievement has been created successfully.",
        });
      }
      
      return data
    } catch (error) {
      console.error("Error creating achievement:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create achievement. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        message: "Failed to create achievement"
      }
    } finally {
      stopLoading();
    }
  },

  async deleteAchievement(achievementId: string): Promise<{success: boolean; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Deleting achievement...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/achievements/${achievementId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete achievement");
      }

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Achievement Deleted",
          description: data.message || "The achievement has been deleted successfully.",
        });
      }
      
      return data
    } catch (error) {
      console.error("Error deleting achievement:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete achievement. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        message: "Failed to delete achievement"
      }
    } finally {
      stopLoading();
    }
  }
} 
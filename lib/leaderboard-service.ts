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

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  correctAnswers?: number;
}

export interface DailyLeaderboardResponse {
  success: boolean;
  leaderboard: LeaderboardEntry[];
  userRank?: number;
  userScore?: number;
}

export interface GameLeaderboardResponse {
  success: boolean;
  leaderboard: Array<{
    position: number;
    userId: string;
    name: string;
    score: number;
    correctAnswers: number;
  }>;
  userPosition?: number;
  userScore?: number;
}

export const leaderboardService = {
  async getDailyLeaderboard(): Promise<DailyLeaderboardResponse> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading daily leaderboard...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/leaderboard/daily`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch daily leaderboard")
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error("Invalid response from server")
      }
      
      return data
    } catch (error) {
      console.error("Error fetching daily leaderboard:", error)
      toast({
        title: "Error",
        description: "Failed to load daily leaderboard. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        leaderboard: []
      }
    } finally {
      stopLoading();
    }
  },

  async getGameLeaderboard(gameId: string): Promise<GameLeaderboardResponse> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading game leaderboard...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/leaderboard/game/${gameId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch game leaderboard")
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error("Invalid response from server")
      }
      
      return data
    } catch (error) {
      console.error("Error fetching game leaderboard:", error)
      toast({
        title: "Error",
        description: "Failed to load game leaderboard. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        leaderboard: []
      }
    } finally {
      stopLoading();
    }
  }
}

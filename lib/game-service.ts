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

export interface CreateLobbyParams {
  name: string
  isPublic: boolean
  maxPlayers: number
  categoryId?: string
  difficulty: "easy" | "medium" | "hard" | "mixed"
  questionCount: number
}

export interface JoinLobbyParams {
  code: string
}

export interface Lobby {
  _id: string
  name: string
  code: string
  isPublic: boolean
  host: {
    id: string
    name: string
  }
  players: {
    id: string
    name: string
    ready: boolean
  }[]
  maxPlayers: number
  status: "waiting" | "in_progress" | "completed"
  category?: string
  difficulty?: string
  createdAt?: string
}

export interface PublicLobby {
  _id: string
  name: string
  code: string
  host: {
    id: string
    name: string
  }
  playerCount: number
  maxPlayers: number
  isFull: boolean
  category?: string
  difficulty?: string
  status: "waiting" | "in_progress" | "completed"
  createdAt?: string
}

export interface GameAnswer {
  gameId: string
  questionId: string
  answer: string
  timeSpent: number
}

export interface GameResult {
  players: Array<{
    userId: string
    name: string
    score: number
    correctAnswers: number
    position: number
  }>
  gameDetails: {
    category: string
    difficulty: string
    totalQuestions: number
    duration: number
  }
}

export interface GameHistoryItem {
  _id: string
  category: string
  difficulty: string
  players: number
  position: number
  score: number
  correctAnswers: number
  playedAt: string
}

export interface GameStats {
  totalGames: number
  wins: number
  topPosition: number
  averagePosition: number
  bestCategory: string
  worstCategory: string
  averageScore: number
  highestScore: number
}

export const gameService = {
  async createLobby(params: CreateLobbyParams): Promise<Lobby | null> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Creating lobby...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/lobby`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      })

      if (response.status === 403) {
        toast({
          title: "Premium Required",
          description: "You need a premium subscription to create multiplayer lobbies.",
          variant: "destructive",
        })
        return null
      }

      if (!response.ok) {
        throw new Error("Failed to create lobby")
      }

      const data = await response.json()

      if (data.success) {
        return data.lobby
      } else {
        throw new Error(data.message || "Failed to create lobby")
      }
    } catch (error) {
      console.error("Error creating lobby:", error)
      toast({
        title: "Error",
        description: "Failed to create lobby. Please try again later.",
        variant: "destructive",
      })
      return null
    } finally {
      stopLoading();
    }
  },

  async joinLobby(params: JoinLobbyParams): Promise<any> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Joining lobby...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/lobby/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        throw new Error("Failed to join lobby")
      }

      return await response.json()
    } catch (error) {
      console.error("Error joining lobby:", error)
      toast({
        title: "Error",
        description: "Failed to join lobby. Please try again later.",
        variant: "destructive",
      })
      return null
    } finally {
      stopLoading();
    }
  },

  async leaveLobby(lobbyId: string): Promise<{success: boolean; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Leaving lobby...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/lobby/${lobbyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to leave lobby")
      }
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Left Lobby",
          description: data.message || "You have left the lobby successfully.",
        })
      }
      
      return data
    } catch (error) {
      console.error("Error leaving lobby:", error)
      toast({
        title: "Error",
        description: "Failed to leave lobby. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        message: "Failed to leave lobby",
      }
    } finally {
      stopLoading();
    }
  },

  async startGame(lobbyId: string): Promise<any> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Starting game...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/lobby/${lobbyId}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error("Failed to start game")
      }

      return await response.json()
    } catch (error) {
      console.error("Error starting game:", error)
      toast({
        title: "Error",
        description: "Failed to start game. Please try again later.",
        variant: "destructive",
      })
      return null
    } finally {
      stopLoading();
    }
  },

  async submitGameAnswer(answer: GameAnswer): Promise<any> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Submitting answer...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answer),
      })

      if (!response.ok) {
        throw new Error("Failed to submit answer")
      }

      return await response.json()
    } catch (error) {
      console.error("Error submitting game answer:", error)
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again later.",
        variant: "destructive",
      })
      return null
    } finally {
      stopLoading();
    }
  },

  async getPublicLobbies(): Promise<PublicLobby[]> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading lobbies...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/lobbies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 403) {
        toast({
          title: "Premium Required",
          description: "You need a premium subscription to access multiplayer features.",
          variant: "destructive",
        })
        return []
      }

      if (!response.ok) {
        throw new Error("Failed to fetch public lobbies")
      }

      const data = await response.json()
      return data.success ? data.lobbies : []
    } catch (error) {
      console.error("Error fetching public lobbies:", error)
      toast({
        title: "Error",
        description: "Failed to load public lobbies. Please try again later.",
        variant: "destructive",
      })
      return []
    } finally {
      stopLoading();
    }
  },

  async getUserLobbies(): Promise<any[]> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading your games...");
    
    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        console.warn("No auth token available for getUserLobbies")
        return []
      }
      
      // First check if the API is available using a simple HEAD request
      try {
        const checkResponse = await fetch(`${API_BASE_URL}/game/health`, {
          method: "HEAD",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (!checkResponse.ok) {
          console.warn("API health check failed, server may be unavailable")
        }
      } catch (error) {
        console.warn("API health check failed:", error)
        // Continue anyway, in case only the health endpoint is down
      }
      
      const response = await fetch(`${API_BASE_URL}/game/lobbies/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Handle different status codes
      if (response.status === 404) {
        console.warn("User lobbies endpoint not found, may not be implemented yet")
        return []
      } else if (response.status === 403) {
        console.warn("User doesn't have permission to access lobbies")
        return []
      } else if (!response.ok) {
        throw new Error(`Failed to fetch user lobbies: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      // Check if the data has the expected structure
      if (!data || typeof data !== 'object') {
        console.warn("Invalid response format from server:", data)
        return []
      }
      
      return data.lobbies || []
    } catch (error) {
      console.error("Error fetching user lobbies:", error)
      // Don't show the toast for this specific error as it's common and expected during development
      // Just return an empty array instead of propagating the error
      return []
    } finally {
      stopLoading();
    }
  },
  
  async getGameResults(gameId: string): Promise<GameResult | null> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading game results...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/results/${gameId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch game results")
      }

      const data = await response.json()
      return data.success ? data.results : null
    } catch (error) {
      console.error("Error fetching game results:", error)
      toast({
        title: "Error",
        description: "Failed to load game results. Please try again later.",
        variant: "destructive",
      })
      return null
    } finally {
      stopLoading();
    }
  },
  
  async getGameHistory(): Promise<GameHistoryItem[]> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading game history...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch game history")
      }

      const data = await response.json()
      return data.success ? data.history : []
    } catch (error) {
      console.error("Error fetching game history:", error)
      toast({
        title: "Error",
        description: "Failed to load game history. Please try again later.",
        variant: "destructive",
      })
      return []
    } finally {
      stopLoading();
    }
  },
  
  async getGameHistoryDetails(gameId: string): Promise<any> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading game details...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/history/${gameId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch game details")
      }

      const data = await response.json()
      return data.success ? data.game : null
    } catch (error) {
      console.error("Error fetching game details:", error)
      toast({
        title: "Error",
        description: "Failed to load game details. Please try again later.",
        variant: "destructive",
      })
      return null
    } finally {
      stopLoading();
    }
  },
  
  async getGameStats(): Promise<GameStats | null> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading game stats...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch game stats")
      }

      const data = await response.json()
      return data.success ? data.stats : null
    } catch (error) {
      console.error("Error fetching game stats:", error)
      toast({
        title: "Error",
        description: "Failed to load game stats. Please try again later.",
        variant: "destructive",
      })
      return null
    } finally {
      stopLoading();
    }
  },
  
  async getGameLeaderboard(gameId: string): Promise<any> {
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
      return data
    } catch (error) {
      console.error("Error fetching game leaderboard:", error)
      toast({
        title: "Error",
        description: "Failed to load game leaderboard. Please try again later.",
        variant: "destructive",
      })
      return { success: false, leaderboard: [] }
    } finally {
      stopLoading();
    }
  },

  async testApiConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/health`, {
        headers: token ? {
          Authorization: `Bearer ${token}`,
        } : undefined,
      })
      
      if (response.ok) {
        return { 
          success: true, 
          message: `API connection successful: ${response.status} ${response.statusText}` 
        }
      } else {
        return { 
          success: false, 
          message: `API connection failed: ${response.status} ${response.statusText}` 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        message: `API connection error: ${error instanceof Error ? error.message : String(error)}` 
      }
    }
  },
}

import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tta-kha7.onrender.com/api"

export interface CreateLobbyParams {
  name: string
  isPublic: boolean
  maxPlayers: number
  categoryId?: string
  difficulty: "easy" | "medium" | "hard" | "mixed"
  questionCount: number
}

export interface JoinLobbyParams {
  lobbyCode: string
}

export const gameService = {
  async createLobby(params: CreateLobbyParams): Promise<any> {
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

      if (!response.ok) {
        throw new Error("Failed to create lobby")
      }

      return await response.json()
    } catch (error) {
      console.error("Error creating lobby:", error)
      toast({
        title: "Error",
        description: "Failed to create lobby. Please try again later.",
        variant: "destructive",
      })
      return null
    }
  },

  async joinLobby(params: JoinLobbyParams): Promise<any> {
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
    }
  },

  async startGame(lobbyId: string): Promise<any> {
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
    }
  },

  async submitGameAnswer(gameId: string, questionId: string, answer: string, timeSpent: number): Promise<any> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          gameId,
          questionId,
          answer,
          timeSpent,
        }),
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
    }
  },

  async getPublicLobbies(): Promise<any[]> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/lobbies/public`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch public lobbies")
      }

      const data = await response.json()
      return data.lobbies || []
    } catch (error) {
      console.error("Error fetching public lobbies:", error)
      toast({
        title: "Error",
        description: "Failed to load public lobbies. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  },

  async getUserLobbies(): Promise<any[]> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/game/lobbies/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user lobbies")
      }

      const data = await response.json()
      return data.lobbies || []
    } catch (error) {
      console.error("Error fetching user lobbies:", error)
      toast({
        title: "Error",
        description: "Failed to load your lobbies. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  },
}

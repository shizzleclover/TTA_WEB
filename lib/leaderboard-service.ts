import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tta-kha7.onrender.com/api"

export interface LeaderboardEntry {
  id: string
  name: string
  avatar?: string
  score: number
  time: string
  tier: "free" | "premium" | "student"
  position: number
}

export const leaderboardService = {
  async getDailyLeaderboard(filter?: string): Promise<LeaderboardEntry[]> {
    try {
      const token = localStorage.getItem("auth_token")
      const url = new URL(`${API_BASE_URL}/leaderboard/daily`)

      if (filter && filter !== "all") {
        url.searchParams.append("tier", filter)
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard")
      }

      const data = await response.json()
      return data.leaderboard
    } catch (error) {
      console.error("Error fetching daily leaderboard:", error)
      toast({
        title: "Error",
        description: "Failed to load leaderboard data. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  },

  async getWeeklyLeaderboard(filter?: string): Promise<LeaderboardEntry[]> {
    try {
      const token = localStorage.getItem("auth_token")
      const url = new URL(`${API_BASE_URL}/leaderboard/weekly`)

      if (filter && filter !== "all") {
        url.searchParams.append("tier", filter)
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard")
      }

      const data = await response.json()
      return data.leaderboard
    } catch (error) {
      console.error("Error fetching weekly leaderboard:", error)
      toast({
        title: "Error",
        description: "Failed to load leaderboard data. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  },

  async getAllTimeLeaderboard(filter?: string): Promise<LeaderboardEntry[]> {
    try {
      const token = localStorage.getItem("auth_token")
      const url = new URL(`${API_BASE_URL}/leaderboard/all-time`)

      if (filter && filter !== "all") {
        url.searchParams.append("tier", filter)
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard")
      }

      const data = await response.json()
      return data.leaderboard
    } catch (error) {
      console.error("Error fetching all-time leaderboard:", error)
      toast({
        title: "Error",
        description: "Failed to load leaderboard data. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  },
}

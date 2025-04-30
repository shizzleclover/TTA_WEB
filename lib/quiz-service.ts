import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tta-kha7.onrender.com"

export interface QuizQuestion {
  id: string
  question: string
  answer?: string
}

export interface QuizAnswer {
  questionId: string
  answer: string
  timeSpent: number
}

export interface QuizSubmissionResult {
  success: boolean
  score: number
  totalTime: number
  correctAnswers: number
  totalQuestions: number
  message?: string
  leaderboardPosition?: number
}

export const quizService = {
  async getDailyQuiz(): Promise<QuizQuestion[]> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/api/quiz/daily`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch daily quiz")
      }

      const data = await response.json()
      return data.questions
    } catch (error) {
      console.error("Error fetching daily quiz:", error)
      toast({
        title: "Error",
        description: "Failed to load daily quiz. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  },

  async submitQuizAnswers(answers: QuizAnswer[]): Promise<QuizSubmissionResult> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/api/quiz/daily/submit-bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit quiz answers")
      }

      return await response.json()
    } catch (error) {
      console.error("Error submitting quiz answers:", error)
      toast({
        title: "Error",
        description: "Failed to submit quiz answers. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        score: 0,
        totalTime: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        message: "Failed to submit quiz answers",
      }
    }
  },

  async getDailyLeaderboard(): Promise<any[]> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/api/quiz/daily/leaderboard`, {
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
      console.error("Error fetching leaderboard:", error)
      toast({
        title: "Error",
        description: "Failed to load leaderboard. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  },
}

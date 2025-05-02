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

export interface QuizQuestion {
  _id: string
  text?: string
  question?: string
  answer?: string
  category?: string
  difficulty?: string
  timeLimit?: number
  options?: string[]
  isMultipleChoice?: boolean
}

export interface QuizAnswer {
  questionId: string
  answer: string
  timeSpent: number
}

export interface QuizSubmissionResult {
  success: boolean
  isCorrect?: boolean
  correctAnswer?: string
  points?: number
  explanation?: string
  questionsAnswered?: number
  correctAnswers?: number
  score?: number
  totalScore?: number
  streak?: number
  withinTimeLimit?: boolean
  results?: Array<{
    questionId: string;
    isCorrect: boolean;
    points: number;
    correctAnswer: string;
  }>;
  message?: string
  leaderboardPosition?: number
}

export interface QuizTheme {
  name: string;
  description: string;
  date?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  correctAnswers: number;
  score: number;
  isPerfectScore?: boolean;
}

export interface QuizCategory {
  _id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export const quizService = {
  async getDailyQuiz(): Promise<{questions: QuizQuestion[], theme?: QuizTheme, questionsAnswered: number, correctAnswers: number}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading daily quiz...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const timestamp = new Date().getTime(); // Cache-busting
      const response = await fetch(`${API_BASE_URL}/quiz/daily?_=${timestamp}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error("Failed to fetch daily quiz")
      }

      const data = await response.json()
      
      if (data.success) {
        return {
          questions: data.questions || [],
          theme: data.theme,
          questionsAnswered: data.questionsAnswered || 0, 
          correctAnswers: data.correctAnswers || 0
        };
      }
      
      console.error("Invalid response format:", data);
      return {
        questions: [],
        questionsAnswered: 0,
        correctAnswers: 0
      };
    } catch (error) {
      console.error("Error fetching daily quiz:", error)
      toast({
        title: "Error",
        description: "Failed to load daily quiz. Please try again later.",
        variant: "destructive",
      })
      return {
        questions: [],
        questionsAnswered: 0,
        correctAnswers: 0
      }
    } finally {
      stopLoading();
    }
  },

  async submitQuizAnswer(answer: QuizAnswer): Promise<QuizSubmissionResult> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Submitting your answer...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/quiz/daily/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answer),
      })

      if (!response.ok) {
        throw new Error("Failed to submit quiz answer")
      }

      return await response.json()
    } catch (error) {
      console.error("Error submitting quiz answer:", error)
      toast({
        title: "Error",
        description: "Failed to submit quiz answer. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        message: "Failed to submit quiz answer",
      }
    } finally {
      stopLoading();
    }
  },

  async submitQuizAnswers(answers: QuizAnswer[]): Promise<QuizSubmissionResult> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Submitting your answers...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/quiz/daily/submit-bulk`, {
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
        totalScore: 0,
        correctAnswers: 0,
        results: [],
        message: "Failed to submit quiz answers",
      }
    } finally {
      stopLoading();
    }
  },

  async getDailyLeaderboard(): Promise<{
    leaderboard: LeaderboardEntry[], 
    userRank?: number, 
    userScore?: number, 
    theme?: QuizTheme,
    winner?: {id: string, score: number}
  }> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading daily leaderboard...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/quiz/daily/leaderboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard")
      }

      const data = await response.json()
      if (data.success) {
        return {
          leaderboard: data.leaderboard || [],
          userRank: data.userRank,
          userScore: data.userScore,
          theme: data.theme,
          winner: data.winner
        };
      }
      return { leaderboard: [] }
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
      toast({
        title: "Error",
        description: "Failed to load leaderboard. Please try again later.",
        variant: "destructive",
      })
      return { leaderboard: [] }
    } finally {
      stopLoading();
    }
  },
  
  async getCategories(): Promise<QuizCategory[]> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading quiz categories...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/quiz/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch quiz categories")
      }

      const data = await response.json()
      return data.success ? data.categories : [];
    } catch (error) {
      console.error("Error fetching quiz categories:", error)
      toast({
        title: "Error",
        description: "Failed to load quiz categories. Please try again later.",
        variant: "destructive",
      })
      return []
    } finally {
      stopLoading();
    }
  },
  
  async getUpcomingThemes(): Promise<QuizTheme[]> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading upcoming themes...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/quiz/upcoming-themes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch upcoming themes")
      }

      const data = await response.json()
      return data.success ? data.upcomingThemes : [];
    } catch (error) {
      console.error("Error fetching upcoming themes:", error)
      toast({
        title: "Error",
        description: "Failed to load upcoming themes. Please try again later.",
        variant: "destructive",
      })
      return []
    } finally {
      stopLoading();
    }
  },
  
  // Admin functions
  async createCategory(category: Omit<QuizCategory, '_id'>): Promise<{success: boolean; category?: QuizCategory; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Creating quiz category...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/quiz/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(category),
      })

      if (!response.ok) {
        throw new Error("Failed to create quiz category")
      }

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Category Created",
          description: "Quiz category has been created successfully.",
        });
      }
      
      return data;
    } catch (error) {
      console.error("Error creating quiz category:", error)
      toast({
        title: "Error",
        description: "Failed to create quiz category. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        message: "Failed to create quiz category",
      }
    } finally {
      stopLoading();
    }
  },
  
  async scheduleTheme(theme: QuizTheme): Promise<{success: boolean; scheduledTheme?: QuizTheme; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Scheduling quiz theme...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/quiz/schedule-theme`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(theme),
      })

      if (!response.ok) {
        throw new Error("Failed to schedule quiz theme")
      }

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Theme Scheduled",
          description: "Quiz theme has been scheduled successfully.",
        });
      }
      
      return data;
    } catch (error) {
      console.error("Error scheduling quiz theme:", error)
      toast({
        title: "Error",
        description: "Failed to schedule quiz theme. Please try again later.",
        variant: "destructive",
      })
      return {
        success: false,
        message: "Failed to schedule quiz theme",
      }
    } finally {
      stopLoading();
    }
  }
}

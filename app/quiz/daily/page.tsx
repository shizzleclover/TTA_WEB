"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { DashboardHeader } from "@/components/dashboard-header"
import { GameCard } from "@/components/ui/game-card"
import { Badge } from "@/components/ui/badge"
import {
  Award,
  Flame,
  SkipForward,
  Zap,
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  Brain,
  Star,
  Sparkles,
  BookOpen,
  Users,
} from "lucide-react"
import confetti from "canvas-confetti"
import { quizService, type QuizQuestion, type QuizAnswer } from "@/lib/quiz-service"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

// Animation variants for framer-motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

const questionVariants = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  exit: { x: -50, opacity: 0, transition: { duration: 0.2 } },
}

export default function DailyQuizPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, token } = useAuth()
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState("")
  const [results, setResults] = useState<Array<{ correct: boolean; time: number }>>([])
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [startTime, setStartTime] = useState(0)
  const [questionStartTime, setQuestionStartTime] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [isStarted, setIsStarted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [showFeedback, setShowFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [points, setPoints] = useState(0)
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [submissionResult, setSubmissionResult] = useState<any>(null)
  const [error, setError] = useState(null)
  const [userProgress, setUserProgress] = useState(null)
  const [userSubscription, setUserSubscription] = useState(null)

  const confettiRef = useRef<HTMLDivElement>(null)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? (currentQuestionIndex / questions.length) * 100 : 0

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const fetchDailyQuiz = async () => {
      setIsLoading(true);
      try {
        // Instead of directly using fetch, let's use our quizService
        const quizQuestions = await quizService.getDailyQuiz();
        
        if (quizQuestions && quizQuestions.length > 0) {
          console.log(`Successfully loaded ${quizQuestions.length} quiz questions`);
          setQuestions(quizQuestions);
          
          // The quiz service doesn't return userProgress directly, so we'll need to 
          // make a separate request or rely on the profile service for streak info
          // For now, we'll initialize with default values
          setUserProgress({
            questionsAnswered: 0,
            correctAnswers: 0,
            score: 0,
            streak: 0
          });
          
          setUserSubscription("free"); // Default to free, update this if you have actual subscription info
        } else {
          console.error("No questions returned from quiz service");
          setError("No questions available for today's quiz");
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDailyQuiz();
    }
  }, [token, isAuthenticated]);

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isStarted && !quizComplete) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime)
      }, 10)
    }

    return () => clearInterval(interval)
  }, [isStarted, quizComplete, startTime])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000)
    const seconds = Math.floor((time % 60000) / 1000)
    const milliseconds = Math.floor((time % 1000) / 10)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`
  }

  const startQuiz = () => {
    setIsStarted(true)
    const now = Date.now()
    setStartTime(now)
    setQuestionStartTime(now)

    // Trigger animation
    const element = document.getElementById("quiz-start-button")
    if (element) {
      element.classList.add("quiz-spin")
      setTimeout(() => {
        element.classList.remove("quiz-spin")
      }, 500)
    }
  }

  const triggerConfetti = () => {
    if (confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        colors: ["#FF0035", "#FF5252", "#FF8A80", "#FFD700", "#FFFFFF"],
      })
    }
  }

  const calculatePoints = (isCorrect: boolean, timeSpent: number) => {
    if (!isCorrect) return 0

    // Base points for correct answer
    let earnedPoints = 50

    // Bonus for speed (faster = more points)
    if (timeSpent < 2000) {
      // Under 2 seconds
      earnedPoints += 30
    } else if (timeSpent < 5000) {
      // Under 5 seconds
      earnedPoints += 20
    } else if (timeSpent < 10000) {
      // Under 10 seconds
      earnedPoints += 10
    }

    // Streak bonus
    if (streak >= 3) {
      earnedPoints += streak * 5 // 5 points per streak level
    }

    return earnedPoints
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentQuestion) return

    const now = Date.now()
    const questionTime = now - questionStartTime
    const isCorrect = answer.toLowerCase().trim() === currentQuestion.answer?.toLowerCase()

    // Add to results for UI feedback
    setResults([...results, { correct: isCorrect, time: questionTime }])

    // Add to answers for API submission
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: answer.trim(),
      timeSpent: questionTime,
    }

    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)

    // Show feedback
    setShowFeedback(isCorrect ? "correct" : "incorrect")

    // Calculate and show points
    const earnedPoints = calculatePoints(isCorrect, questionTime)
    if (isCorrect) {
      setPointsEarned(earnedPoints)
      setPoints(points + earnedPoints)
      setShowPointsAnimation(true)

      // Trigger confetti for correct answers with streak
      if (streak >= 2) {
        triggerConfetti()
      }
    }

    // Update streak
    if (isCorrect) {
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }

    // Animate transition to next question
    setIsTransitioning(true)
    setTimeout(() => {
      setShowFeedback(null)
      setAnswer("")
      setShowPointsAnimation(false)

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setQuestionStartTime(Date.now()) // Reset question timer
      } else {
        // Submit all answers when quiz is complete
        submitQuiz(updatedAnswers)
      }

      setIsTransitioning(false)
    }, 1000)
  }

  const handleSkip = () => {
    if (!currentQuestion) return

    const questionTime = Date.now() - questionStartTime

    // Add to results for UI
    setResults([...results, { correct: false, time: questionTime }])

    // Add to answers for API submission
    const newAnswer: QuizAnswer = {
      questionId: currentQuestion.id,
      answer: "",
      timeSpent: questionTime,
    }

    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)

    setAnswer("")
    setStreak(0)

    // Animate transition
    setIsTransitioning(true)
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setQuestionStartTime(Date.now())
      } else {
        submitQuiz(updatedAnswers)
      }

      setIsTransitioning(false)
    }, 1000)
  }

  const submitQuiz = async (finalAnswers: QuizAnswer[]) => {
    try {
      const result = await quizService.submitQuizAnswers(finalAnswers)
      setSubmissionResult(result)
      setQuizComplete(true)

      // Final confetti celebration
      setTimeout(() => {
        triggerConfetti()
      }, 500)
    } catch (error) {
      console.error("Error submitting quiz:", error)
    }
  }

  const correctAnswers = results.filter((result) => result.correct).length
  const totalTime = results.reduce((total, result) => total + result.time, 0)

  // Decorative elements for quiz page
  const QuizDecorations = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating brain */}
      <motion.div
        className="absolute top-20 right-10 w-24 h-24 opacity-20"
        animate={{
          y: [0, -15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Brain className="w-full h-full" />
      </motion.div>

      {/* Floating stars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-20"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
            width: `${20 + Math.random() * 20}px`,
            height: `${20 + Math.random() * 20}px`,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Star className="w-full h-full" />
        </motion.div>
      ))}

      {/* Sparkles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute opacity-20"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
            width: `${15 + Math.random() * 10}px`,
            height: `${15 + Math.random() * 10}px`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-full h-full" />
        </motion.div>
      ))}

      {/* Decorative circles */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/10"
          style={{
            top: "50%",
            left: "50%",
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            x: "-50%",
            y: "-50%",
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-24 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-8 relative">
          <div className="mx-auto max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GameCard className="border-2 border-white/20 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent z-0"></div>
                <CardHeader className="bg-white/5 relative z-10">
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Clock className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">No Quiz Today</CardTitle>
                  </motion.div>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CardDescription>
                      Today's challenge is taking a break. Check back tomorrow!
                    </CardDescription>
                  </motion.div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6 relative z-10">
                  <div className="flex justify-center py-10">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.4
                      }}
                      className="relative"
                    >
                      <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                        <Brain className="w-16 h-16 text-primary/50" />
                      </div>
                      <motion.div 
                        className="absolute -top-2 -right-2 bg-orange-100 dark:bg-orange-900 p-2 rounded-full text-orange-600 dark:text-orange-200"
                        animate={{ 
                          rotate: [0, 10, -10, 10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <Sparkles className="w-6 h-6" />
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold text-center">What you can do instead:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-4 rounded-lg border border-white/20 bg-white/5 flex flex-col items-center gap-2">
                        <Trophy className="h-8 w-8 text-primary/70" />
                        <p className="text-sm font-medium text-center">Check the leaderboards</p>
                      </div>
                      <div className="p-4 rounded-lg border border-white/20 bg-white/5 flex flex-col items-center gap-2">
                        <BookOpen className="h-8 w-8 text-primary/70" />
                        <p className="text-sm font-medium text-center">Review study materials</p>
                      </div>
                      <div className="p-4 rounded-lg border border-white/20 bg-white/5 flex flex-col items-center gap-2 md:col-span-2">
                        <Users className="h-8 w-8 text-primary/70" />
                        <p className="text-sm font-medium text-center">Join a multiplayer game</p>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
                <CardFooter className="bg-white/5 flex gap-2 relative z-10">
                  <Button
                    onClick={() => router.push("/dashboard")}
                    variant="outline"
                    className="w-full border-white/20"
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    onClick={() => router.push("/multiplayer")}
                    className="w-full game-button-glow"
                  >
                    Try Multiplayer Mode
                  </Button>
                </CardFooter>
              </GameCard>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  if (userSubscription === "free" && userProgress?.questionsAnswered >= 10) {
    return (
      <div className="text-center">
        <p>You have reached your daily limit of 10 questions. Upgrade to access more!</p>
        <Button variant="outline" className="mt-4">Upgrade Now</Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6 md:p-8 relative">
        <QuizDecorations />
        <div className="mx-auto max-w-2xl relative z-10">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="loading" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <GameCard className="border-2 border-white/20 backdrop-blur-sm">
                  <CardHeader className="bg-white/5">
                    <motion.div variants={itemVariants} className="flex items-center gap-2">
                      <Zap className="h-6 w-6 text-primary game-icon-bounce" />
                      <CardTitle className="text-2xl">Loading Daily Quiz</CardTitle>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                      <Clock className="h-12 w-12 text-primary" />
                    </motion.div>
                  </CardContent>
                </GameCard>
              </motion.div>
            ) : !isStarted ? (
              <motion.div key="start" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <GameCard className="border-2 border-white/20 backdrop-blur-sm">
                  <CardHeader className="bg-white/5">
                    <motion.div variants={itemVariants} className="flex items-center gap-2">
                      <Zap className="h-6 w-6 text-primary game-icon-bounce" />
                      <CardTitle className="text-2xl">Daily Quiz Challenge</CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CardDescription>
                        Answer {questions.length} questions as quickly as possible. Type your answers and submit.
                      </CardDescription>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <motion.div variants={itemVariants} className="rounded-lg bg-white/5 border border-white/20 p-4">
                      <h3 className="font-medium">How it works:</h3>
                      <ul className="mt-2 list-disc pl-5 text-sm">
                        <li>You'll be presented with {questions.length} questions one at a time</li>
                        <li>Type your answer and submit as quickly as possible</li>
                        <li>Spelling matters! Be accurate but fast</li>
                        <li>Your score is based on accuracy and speed</li>
                        <li>Build a streak for bonus points!</li>
                      </ul>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="flex justify-between items-center rounded-lg border border-white/20 p-4 bg-white/5"
                    >
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Today's Leaderboard</p>
                          <p className="text-sm text-muted-foreground">Top score: 00:38.76</p>
                        </div>
                      </div>
                      <Badge className="bg-game-gold text-black">
                        <motion.span
                          animate={{
                            scale: [1, 1.2, 1],
                            transition: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
                          }}
                        >
                          #1 Sarah J.
                        </motion.span>
                      </Badge>
                    </motion.div>
                  </CardContent>
                  <CardFooter className="bg-white/5">
                    <motion.div variants={itemVariants} className="w-full">
                      <Button id="quiz-start-button" onClick={startQuiz} className="w-full game-button-glow">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            transition: { repeat: Number.POSITIVE_INFINITY, duration: 1.5 },
                          }}
                          className="flex items-center"
                        >
                          <Flame className="mr-2 h-4 w-4" />
                          Start Quiz
                        </motion.div>
                      </Button>
                    </motion.div>
                  </CardFooter>
                </GameCard>
              </motion.div>
            ) : quizComplete ? (
              <motion.div
                key="results"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                ref={confettiRef}
              >
                <GameCard className="border-2 border-white/20 backdrop-blur-sm">
                  <CardHeader className="bg-white/5">
                    <motion.div variants={itemVariants} className="flex items-center gap-2">
                      <Award className="h-6 w-6 text-primary game-icon-float" />
                      <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <CardDescription>Here's how you did on today's quiz</CardDescription>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <motion.div variants={itemVariants}>
                        <GameCard className="overflow-hidden border-2 border-white/20">
                          <CardHeader className="bg-white/10 p-3">
                            <CardTitle className="text-center">Score</CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 text-center">
                            <motion.p
                              className="text-4xl font-bold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 10,
                                delay: 0.3,
                              }}
                            >
                              {submissionResult?.correctAnswers || correctAnswers}/{questions.length}
                            </motion.p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {correctAnswers === questions.length
                                ? "Perfect Score! 🎉"
                                : correctAnswers >= 7
                                  ? "Great job! 👏"
                                  : "Keep practicing! 💪"}
                            </p>
                          </CardContent>
                        </GameCard>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <GameCard className="overflow-hidden border-2 border-white/20">
                          <CardHeader className="bg-white/10 p-3">
                            <CardTitle className="text-center">Total Time</CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 text-center">
                            <motion.p
                              className="text-4xl font-bold"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 10,
                                delay: 0.5,
                              }}
                            >
                              {formatTime(submissionResult?.totalTime || totalTime)}
                            </motion.p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {totalTime < 45000
                                ? "Lightning fast! ⚡"
                                : totalTime < 60000
                                  ? "Pretty quick! 🚀"
                                  : "Good pace! 👍"}
                            </p>
                          </CardContent>
                        </GameCard>
                      </motion.div>
                    </div>

                    {submissionResult?.leaderboardPosition && (
                      <motion.div
                        variants={itemVariants}
                        className="rounded-lg border-2 border-white/20 bg-white/5 p-4 text-center"
                      >
                        <motion.p
                          className="text-lg font-medium"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          Your leaderboard position:{" "}
                          <span className="text-primary">#{submissionResult.leaderboardPosition}</span>
                        </motion.p>
                      </motion.div>
                    )}

                    <motion.div
                      variants={itemVariants}
                      className="rounded-lg border-2 border-white/20 bg-white/5 p-4 text-center"
                    >
                      <motion.p
                        className="text-lg font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        You've earned <span className="text-primary">{submissionResult?.score || points} XP</span>!
                      </motion.p>
                      <p className="text-sm text-muted-foreground mt-1">Keep playing daily to level up faster</p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-4">
                      <h3 className="font-medium">Question Breakdown:</h3>
                      {questions.map((q, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                          className={`flex items-center justify-between rounded-lg border p-3 ${
                            results[index]?.correct
                              ? "border-green-200 bg-green-50/10 dark:border-green-900/50"
                              : "border-red-200 bg-red-50/10 dark:border-red-900/50"
                          }`}
                        >
                          <div className="flex-1">
                            <p className="text-sm">{q.question}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-muted-foreground">
                                Correct answer: <span className="font-medium">{q.answer}</span>
                              </p>
                              {results[index] && (
                                <div
                                  className={`rounded-full px-2 py-0.5 text-xs ${
                                    results[index].correct
                                      ? "bg-green-100/20 text-green-300"
                                      : "bg-red-100/20 text-red-300"
                                  }`}
                                >
                                  {results[index].correct ? "Correct" : "Incorrect"}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-sm font-medium">{formatTime(results[index]?.time || 0)}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex gap-2 bg-white/5">
                    <Button
                      onClick={() => router.push("/dashboard")}
                      variant="outline"
                      className="w-full border-white/20"
                    >
                      Back to Dashboard
                    </Button>
                    <Button onClick={() => router.push("/leaderboards")} className="w-full game-button-glow">
                      View Leaderboard
                    </Button>
                  </CardFooter>
                </GameCard>
              </motion.div>
            ) : (
              <motion.div key="quiz" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Time: {formatTime(elapsedTime)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">
                      Score: {correctAnswers}/{currentQuestionIndex}
                    </div>
                    {streak > 1 && (
                      <Badge className="bg-primary animate-pulse">
                        <Flame className="h-3 w-3 mr-1" />
                        {streak} streak!
                      </Badge>
                    )}
                  </div>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ originX: 0 }}
                >
                  <Progress value={progress} className="mb-6 h-2" />
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    variants={questionVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <GameCard
                      className={`border-2 ${
                        showFeedback === "correct"
                          ? "border-green-500 bg-green-50/10"
                          : showFeedback === "incorrect"
                            ? "border-red-500 bg-red-50/10"
                            : "border-white/20 bg-white/5"
                      } transition-colors duration-300 backdrop-blur-sm`}
                    >
                      <CardHeader className="bg-white/5">
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Clock className="h-5 w-5 text-primary" />
                          {currentQuestion?.question}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Type your answer here..."
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                              autoFocus
                              className="text-lg pr-10 bg-white/10 border-white/20"
                              disabled={showFeedback !== null || isTransitioning}
                            />
                            {showFeedback && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {showFeedback === "correct" ? (
                                  <CheckCircle className="h-5 w-5 text-green-500 animate-bounce" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500 animate-bounce" />
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="submit"
                              className={`w-full ${showFeedback === "correct" ? "bg-green-500" : showFeedback === "incorrect" ? "bg-red-500" : ""} transition-colors duration-300 game-button-glow`}
                              disabled={showFeedback !== null || isTransitioning}
                            >
                              Submit
                            </Button>
                            <Button
                              type="button"
                              onClick={handleSkip}
                              variant="outline"
                              className="border-white/20"
                              disabled={showFeedback !== null || isTransitioning}
                            >
                              <SkipForward className="h-4 w-4" />
                              <span className="sr-only">Skip</span>
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </GameCard>
                  </motion.div>
                </AnimatePresence>

                {showPointsAnimation && (
                  <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <Badge className="bg-primary px-3 py-1 text-lg">
                      <Trophy className="h-4 w-4 mr-2" />+{pointsEarned} XP
                    </Badge>
                  </motion.div>
                )}

                {streak >= 3 && (
                  <motion.div
                    className="mt-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge className="bg-primary animate-pulse px-3 py-1">
                      <Flame className="h-3 w-3 mr-1" />
                      {streak} answer streak! Keep it up for bonus points!
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

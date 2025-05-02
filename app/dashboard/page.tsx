"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bell, Calendar, Clock, LogOut, Settings, User, Zap, Award, BookOpen, Trophy, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { profileService, type UserProfile } from "@/lib/profile-service"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { getInitials } from "@/lib/utils"
import { authService } from "@/lib/auth-service"
import { toast } from "@/components/ui/use-toast"

// Loading spinner component
const LoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center h-64 gap-4">
    <div className="relative">
      <Loader2 className="h-10 w-10 text-primary animate-spin" />
    </div>
    <p className="text-muted-foreground">{message}</p>
  </div>
);

export default function DashboardPage() {
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const { logout, user } = useAuth()

  // Function to test API connection
  const testApiConnection = async () => {
    console.log("Testing API connection...");
    setApiLoading(true);
    setApiStatus("Testing connection...");
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      console.log("Using API URL:", API_URL);
      
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_URL}/profile/full`, {
        method: "GET",
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : undefined
      });
      
      console.log("API check response:", response.status, response.statusText);
      
      if (response.ok) {
        try {
          const data = await response.json();
          setApiStatus(`Connected to API: ${response.status} ${response.statusText} - Profile data available`);
        } catch (e) {
          setApiStatus(`Connected to API: ${response.status} ${response.statusText} - Could not parse response`);
        }
      } else {
        setApiStatus(`API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("API connection test error:", error);
      setApiStatus(`Connection failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setApiLoading(false);
    }
  };
  
  const handleLoginRedirect = () => {
    router.push("/login");
  };
  
  useEffect(() => {
    // Test API connection when component mounts
    testApiConnection();
    
    const fetchProfile = async () => {
      setLoading(true)
      try {
        // Log the API call for debugging
        console.log("Dashboard: Fetching profile data from profile service");
        
        // Check if we're authenticated first
        const authResult = await authService.checkAuthentication();
        setIsAuthenticated(authResult.success);
        
        if (authResult.success) {
          console.log("Dashboard: User is authenticated, fetching profile");
          
          // Now fetch the profile with the current token
          const data = await profileService.getFullProfile();
          
          console.log("Dashboard: Profile data response:", data);
          
          if (data) {
            console.log("Dashboard: Profile data loaded:", data);
            setProfileData(data);
          } else {
            console.error("Dashboard: Failed to load profile data, null response");
            
            // Try to use data from the auth response as fallback
            if (authResult.user) {
              console.log("Dashboard: Using auth result user data as fallback");
              setProfileData({
                _id: authResult.user._id || "",
                name: authResult.user.name || "User",
                email: authResult.user.email || "",
                bio: "",
                createdAt: new Date().toISOString(),
                subscription: authResult.user.subscription || {
                  status: "free",
                  expiresAt: null
                },
                stats: {
                  totalAnswered: 0,
                  totalCorrect: 0,
                  streak: 0,
                  lastPlayed: new Date().toISOString()
                }
              });
            } else {
              // If no fallback user data is available, set a default profile for display
              console.log("Dashboard: Using default profile data as fallback");
              setProfileData({
                _id: "unknown",
                name: "User",
                email: "user@example.com",
                bio: "",
                createdAt: new Date().toISOString(),
                subscription: {
                  status: "free",
                  expiresAt: null
                },
                stats: {
                  totalAnswered: 0,
                  totalCorrect: 0,
                  streak: 0,
                  lastPlayed: new Date().toISOString()
                }
              });
            }
          }
        } else {
          console.error("Dashboard: User is not authenticated", authResult.message);
          toast({
            title: "Authentication Issue",
            description: authResult.message || "There was a problem with your authentication. Please log in again.",
            variant: "destructive",
          });
          // Don't redirect, we'll show a login button instead
        }
      } catch (error) {
        console.error("Dashboard: Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load your dashboard. Please try logging in again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Helper function to get a formatted date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
    } catch (e) {
      return "Unknown date"
    }
  }

  // Helper function to calculate accuracy percentage
  const getAccuracyPercentage = () => {
    if (profileData?.stats?.totalAnswered && profileData.stats.totalAnswered > 0) {
      return Math.round((profileData.stats.totalCorrect / profileData.stats.totalAnswered) * 100)
    }
    return 0
  }

  // If not authenticated, show login screen
  if (isAuthenticated === false && !loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1 items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-8"
          >
            <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
            <p className="text-lg text-muted-foreground mb-6">
              You need to be logged in to view your dashboard
            </p>
            <Button onClick={handleLoginRedirect} size="lg" className="game-button-glow">
              Go to Login
            </Button>
            {apiStatus && (
              <div className={`mt-4 text-sm p-2 rounded ${apiStatus.includes('Connected') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                {apiLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Testing API connection...
                  </div>
                ) : (
                  apiStatus
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    )
  }

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <div className="flex flex-1">
          <DashboardNav />
          <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
            <LoadingSpinner message="Loading your dashboard data..." />
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-8"
          >
            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-muted-foreground text-lg">
                    Welcome back, {profileData?.name || user?.name || "User"}! Here's what's happening with your account.
                  </p>
                </div>
                <Button onClick={testApiConnection} variant="outline" size="sm" className="gap-2" disabled={apiLoading}>
                  {apiLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Test API
                </Button>
              </div>
              {apiStatus && (
                <div className={`text-sm p-2 rounded ${apiStatus.includes('Connected') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                  {apiLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Testing API connection...
                    </div>
                  ) : (
                    apiStatus
                  )}
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Tier</CardTitle>
                  <div className="rounded-full bg-primary/10 p-1 text-primary">
                    <User className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold capitalize">{profileData?.subscription?.status || "free"}</div>
                      <p className="text-xs text-muted-foreground">
                        {profileData?.subscription?.status === "free" ? "Upgrade for more features" : "Full access"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
                  <div className="rounded-full bg-orange-100 p-1 text-orange-700 dark:bg-orange-900 dark:text-orange-100">
                    <Zap className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{profileData?.stats?.streak || 0} days</div>
                      <p className="text-xs text-muted-foreground">
                        {profileData?.stats?.streak ? `Keep it going!` : "Complete a daily quiz to start your streak"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quiz Accuracy</CardTitle>
                  <div className="rounded-full bg-green-100 p-1 text-green-700 dark:bg-green-900 dark:text-green-100">
                    <Award className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {loading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{getAccuracyPercentage()}%</div>
                      <p className="text-xs text-muted-foreground">
                        {profileData?.stats?.totalCorrect || 0} correct of {profileData?.stats?.totalAnswered || 0} questions
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
                  <div className="rounded-full bg-blue-100 p-1 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                    <Clock className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {loading ? (
                    <Skeleton className="h-8 w-40" />
                  ) : (
                    <>
                      <div className="text-sm font-bold">
                        {profileData?.stats?.lastPlayed ? formatDate(profileData?.stats?.lastPlayed) : "No activity yet"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {profileData?.stats?.lastPlayed ? "Last played quiz" : "Take a quiz to start learning"}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your quiz history and performance</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full rounded" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profileData?.stats?.totalAnswered ? (
                        [1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="flex items-center gap-4 rounded-lg border p-3 hover:bg-secondary/50 transition-colors"
                          >
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                              <Calendar className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Daily Quiz #{i}</p>
                              <p className="text-xs text-muted-foreground">
                                {i === 1 ? "Completed today" : i === 2 ? "Completed yesterday" : "Completed 3 days ago"} • Score: {8 - i}/10
                              </p>
                            </div>
                            <div className="text-sm font-medium">01:{15 + i * 8}.{20 + i * 5}</div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                          <p className="text-muted-foreground mb-2">No recent quiz activity found.</p>
                          <Link href="/quiz/daily">
                            <Button size="sm">Take Daily Quiz</Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 pt-6">
                  {loading ? (
                    <div className="flex flex-col items-center gap-4">
                      <Skeleton className="h-20 w-20 rounded-full" />
                      <div className="space-y-2 text-center">
                        <Skeleton className="h-6 w-32 mx-auto" />
                        <Skeleton className="h-4 w-48 mx-auto" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Avatar className="h-20 w-20 border-2 border-primary/30">
                          <AvatarImage src={profileData?.avatar || "/placeholder.svg?height=40&width=40"} alt={profileData?.name} />
                          <AvatarFallback>{getInitials(profileData?.name || "User")}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          <Zap className="h-4 w-4" />
                          <span className="absolute">{profileData?.stats?.streak || 0}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-medium">{profileData?.name}</p>
                        <p className="text-sm text-muted-foreground">{profileData?.email}</p>
                      </div>
                      <div className="flex gap-2 w-full">
                        <Link href="/profile" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="flex-1" onClick={handleLogout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-24 w-full rounded" />
                  ))
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 ${
                        profileData?.stats?.badges?.includes('streak_7') 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'bg-secondary/50'
                      }`}
                    >
                      <div className="rounded-full bg-primary/20 p-3">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-center">7-Day Streak</h3>
                      <p className="text-xs text-center text-muted-foreground">
                        {profileData?.stats?.badges?.includes('streak_7') 
                          ? 'Completed 7 days in a row' 
                          : `${profileData?.stats?.streak || 0}/7 days completed`}
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 ${
                        profileData?.stats?.badges?.includes('perfect_score') 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'bg-secondary/50'
                      }`}
                    >
                      <div className="rounded-full bg-primary/20 p-3">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-center">Perfect Score</h3>
                      <p className="text-xs text-center text-muted-foreground">
                        {profileData?.stats?.badges?.includes('perfect_score') 
                          ? 'Got all answers correct in a quiz' 
                          : 'Get all answers correct in a quiz'}
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`flex flex-col items-center gap-2 rounded-lg border p-4 ${
                        profileData?.stats?.badges?.includes('quiz_master') 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'bg-secondary/50'
                      }`}
                    >
                      <div className="rounded-full bg-primary/20 p-3">
                        <Trophy className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-center">Quiz Master</h3>
                      <p className="text-xs text-center text-muted-foreground">
                        {profileData?.stats?.badges?.includes('quiz_master') 
                          ? 'Completed 10 quizzes with high scores' 
                          : 'Complete 10 quizzes with high scores'}
                      </p>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

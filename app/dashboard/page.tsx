"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bell, Calendar, Clock, LogOut, Settings, User, Zap, Award, BookOpen, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"

export default function DashboardPage() {
  const [userTier, setUserTier] = useState("free")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-8">
            <motion.div variants={itemVariants} className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground text-lg">Welcome back! Here's what's happening with your account.</p>
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
                  <div className="text-2xl font-bold capitalize">{userTier}</div>
                  <p className="text-xs text-muted-foreground">
                    {userTier === "free" ? "Upgrade for more features" : "Full access"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Daily Quiz</CardTitle>
                  <div className="rounded-full bg-primary/10 p-1 text-primary">
                    <Calendar className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">Available</div>
                  <p className="text-xs text-muted-foreground">Today's quiz is ready to take</p>
                </CardContent>
                <CardFooter className="p-2">
                  <Link href="/quiz/daily" className="w-full">
                    <Button size="sm" className="w-full game-button-glow">
                      <Zap className="mr-2 h-4 w-4" />
                      Start Quiz
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Time</CardTitle>
                  <div className="rounded-full bg-primary/10 p-1 text-primary">
                    <Clock className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">00:42.35</div>
                  <p className="text-xs text-muted-foreground">Your fastest quiz completion</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                  <div className="rounded-full bg-primary/10 p-1 text-primary">
                    <Bell className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">New notifications to review</p>
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
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
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
                          <p className="text-xs text-muted-foreground">Completed yesterday • Score: 8/10</p>
                        </div>
                        <div className="text-sm font-medium">01:23.45</div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>Manage your account settings</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 pt-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-primary/30">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      <Zap className="h-4 w-4" />
                      <span className="absolute">5</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                  </div>
                  <div className="flex gap-2 w-full">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your latest unlocked achievements</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-2 rounded-lg border p-4 bg-secondary/50"
                    >
                      <div className="rounded-full bg-primary/20 p-3">
                        <Trophy className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-center">Quiz Master</h3>
                      <p className="text-xs text-center text-muted-foreground">Complete 10 daily quizzes</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-2 rounded-lg border p-4 bg-secondary/50"
                    >
                      <div className="rounded-full bg-primary/20 p-3">
                        <Award className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-center">Perfect Score</h3>
                      <p className="text-xs text-center text-muted-foreground">Get all answers correct in a quiz</p>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-2 rounded-lg border p-4 bg-secondary/50"
                    >
                      <div className="rounded-full bg-primary/20 p-3">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-center">Knowledge Seeker</h3>
                      <p className="text-xs text-center text-muted-foreground">Upload your first study material</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

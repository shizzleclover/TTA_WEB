"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Award, Calendar, Clock, Medal, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"

// Sample leaderboard data
const dailyLeaderboard = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 10,
    time: "00:42.35",
    tier: "premium",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 10,
    time: "00:45.12",
    tier: "student",
  },
  {
    id: 3,
    name: "Alex Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 9,
    time: "00:38.76",
    tier: "free",
  },
  {
    id: 4,
    name: "Jessica Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 9,
    time: "00:51.23",
    tier: "premium",
  },
  {
    id: 5,
    name: "David Miller",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 8,
    time: "00:40.18",
    tier: "free",
  },
  {
    id: 6,
    name: "Emma Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 8,
    time: "00:44.92",
    tier: "student",
  },
  {
    id: 7,
    name: "James Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 8,
    time: "00:47.65",
    tier: "premium",
  },
  {
    id: 8,
    name: "Olivia Taylor",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 7,
    time: "00:39.54",
    tier: "free",
  },
  {
    id: 9,
    name: "Daniel Anderson",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 7,
    time: "00:43.21",
    tier: "student",
  },
  {
    id: 10,
    name: "Sophia Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 7,
    time: "00:46.87",
    tier: "premium",
  },
]

const weeklyLeaderboard = [
  {
    id: 1,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 48,
    time: "03:15.42",
    tier: "student",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 47,
    time: "03:22.18",
    tier: "premium",
  },
  {
    id: 3,
    name: "David Miller",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 45,
    time: "03:18.76",
    tier: "free",
  },
  {
    id: 4,
    name: "Emma Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 44,
    time: "03:25.93",
    tier: "student",
  },
  {
    id: 5,
    name: "Alex Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 43,
    time: "03:20.54",
    tier: "free",
  },
  {
    id: 6,
    name: "Jessica Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 42,
    time: "03:24.12",
    tier: "premium",
  },
  {
    id: 7,
    name: "James Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 41,
    time: "03:27.65",
    tier: "premium",
  },
  {
    id: 8,
    name: "Olivia Taylor",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 40,
    time: "03:19.34",
    tier: "free",
  },
  {
    id: 9,
    name: "Daniel Anderson",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 39,
    time: "03:23.21",
    tier: "student",
  },
  {
    id: 10,
    name: "Sophia Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 38,
    time: "03:26.87",
    tier: "premium",
  },
]

const allTimeLeaderboard = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 1248,
    time: "42:15.42",
    tier: "premium",
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 1236,
    time: "43:22.18",
    tier: "student",
  },
  {
    id: 3,
    name: "Alex Williams",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 1187,
    time: "44:18.76",
    tier: "free",
  },
  {
    id: 4,
    name: "Jessica Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 1156,
    time: "45:25.93",
    tier: "premium",
  },
  {
    id: 5,
    name: "David Miller",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 1134,
    time: "46:20.54",
    tier: "free",
  },
  {
    id: 6,
    name: "Emma Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 1098,
    time: "47:24.12",
    tier: "student",
  },
  {
    id: 7,
    name: "James Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 1067,
    time: "48:27.65",
    tier: "premium",
  },
  {
    id: 8,
    name: "Olivia Taylor",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 1045,
    time: "49:19.34",
    tier: "free",
  },
  {
    id: 9,
    name: "Daniel Anderson",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 1023,
    time: "50:23.21",
    tier: "student",
  },
  {
    id: 10,
    name: "Sophia Martinez",
    avatar: "/placeholder.svg?height=40&width=40",
    score: 987,
    time: "51:26.87",
    tier: "premium",
  },
]

export default function LeaderboardsPage() {
  const [tierFilter, setTierFilter] = useState("all")

  const filterLeaderboard = (leaderboard: typeof dailyLeaderboard) => {
    if (tierFilter === "all") return leaderboard
    return leaderboard.filter((entry) => entry.tier === tierFilter)
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "premium":
        return (
          <div className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-100">
            Premium
          </div>
        )
      case "student":
        return (
          <div className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            Student
          </div>
        )
      default:
        return (
          <div className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-100">
            Free
          </div>
        )
    }
  }

  const getMedalIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 2:
        return <Award className="h-5 w-5 text-amber-700" />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Leaderboards</h1>
                <p className="text-muted-foreground">See who's at the top of the rankings and how you compare.</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Leaderboard Rankings
                  </CardTitle>
                  <CardDescription>View the top performers across different time periods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">Filter by tier:</span>
                      <Button
                        variant={tierFilter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTierFilter("all")}
                      >
                        All
                      </Button>
                      <Button
                        variant={tierFilter === "free" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTierFilter("free")}
                      >
                        Free
                      </Button>
                      <Button
                        variant={tierFilter === "premium" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTierFilter("premium")}
                      >
                        Premium
                      </Button>
                      <Button
                        variant={tierFilter === "student" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTierFilter("student")}
                      >
                        Student
                      </Button>
                    </div>

                    <Tabs defaultValue="daily">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="allTime">All Time</TabsTrigger>
                      </TabsList>

                      <TabsContent value="daily" className="space-y-4 pt-4">
                        <div className="rounded-lg border">
                          <div className="grid grid-cols-12 gap-2 border-b p-4 font-medium">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-5">User</div>
                            <div className="col-span-2 text-center">Score</div>
                            <div className="col-span-2 text-center">Time</div>
                            <div className="col-span-2 text-center">Tier</div>
                          </div>
                          {filterLeaderboard(dailyLeaderboard).map((entry, index) => (
                            <div key={entry.id} className="grid grid-cols-12 gap-2 border-b p-4 last:border-0">
                              <div className="col-span-1 flex items-center justify-center">
                                {index <= 2 ? (
                                  getMedalIcon(index)
                                ) : (
                                  <span className="text-sm font-medium">{index + 1}</span>
                                )}
                              </div>
                              <div className="col-span-5 flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.name} />
                                  <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{entry.name}</span>
                              </div>
                              <div className="col-span-2 flex items-center justify-center">
                                <span className="font-medium">{entry.score}/10</span>
                              </div>
                              <div className="col-span-2 flex items-center justify-center">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{entry.time}</span>
                                </div>
                              </div>
                              <div className="col-span-2 flex items-center justify-center">
                                {getTierBadge(entry.tier)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="weekly" className="space-y-4 pt-4">
                        <div className="rounded-lg border">
                          <div className="grid grid-cols-12 gap-2 border-b p-4 font-medium">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-5">User</div>
                            <div className="col-span-2 text-center">Score</div>
                            <div className="col-span-2 text-center">Time</div>
                            <div className="col-span-2 text-center">Tier</div>
                          </div>
                          {filterLeaderboard(weeklyLeaderboard).map((entry, index) => (
                            <div key={entry.id} className="grid grid-cols-12 gap-2 border-b p-4 last:border-0">
                              <div className="col-span-1 flex items-center justify-center">
                                {index <= 2 ? (
                                  getMedalIcon(index)
                                ) : (
                                  <span className="text-sm font-medium">{index + 1}</span>
                                )}
                              </div>
                              <div className="col-span-5 flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.name} />
                                  <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{entry.name}</span>
                              </div>
                              <div className="col-span-2 flex items-center justify-center">
                                <span className="font-medium">{entry.score}/50</span>
                              </div>
                              <div className="col-span-2 flex items-center justify-center">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{entry.time}</span>
                                </div>
                              </div>
                              <div className="col-span-2 flex items-center justify-center">
                                {getTierBadge(entry.tier)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="allTime" className="space-y-4 pt-4">
                        <div className="rounded-lg border">
                          <div className="grid grid-cols-12 gap-2 border-b p-4 font-medium">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-5">User</div>
                            <div className="col-span-2 text-center">Score</div>
                            <div className="col-span-2 text-center">Time</div>
                            <div className="col-span-2 text-center">Tier</div>
                          </div>
                          {filterLeaderboard(allTimeLeaderboard).map((entry, index) => (
                            <div key={entry.id} className="grid grid-cols-12 gap-2 border-b p-4 last:border-0">
                              <div className="col-span-1 flex items-center justify-center">
                                {index <= 2 ? (
                                  getMedalIcon(index)
                                ) : (
                                  <span className="text-sm font-medium">{index + 1}</span>
                                )}
                              </div>
                              <div className="col-span-5 flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={entry.avatar || "/placeholder.svg"} alt={entry.name} />
                                  <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{entry.name}</span>
                              </div>
                              <div className="col-span-2 flex items-center justify-center">
                                <span className="font-medium">{entry.score}</span>
                              </div>
                              <div className="col-span-2 flex items-center justify-center">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{entry.time}</span>
                                </div>
                              </div>
                              <div className="col-span-2 flex items-center justify-center">
                                {getTierBadge(entry.tier)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

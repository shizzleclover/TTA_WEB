"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Award, Calendar, Clock, Edit, Save, Trophy, Upload, X, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { GameCard } from "@/components/ui/game-card"
import { LevelBadge } from "@/components/ui/level-badge"
import { XPProgress } from "@/components/ui/xp-progress"
import { AchievementCard } from "@/components/ui/achievement-card"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("John Doe")
  const [bio, setBio] = useState("Quiz enthusiast and knowledge seeker. I love competing in daily challenges!")
  const [email, setEmail] = useState("john.doe@example.com")

  const achievements = [
    {
      id: 1,
      title: "Speed Demon",
      description: "Complete a quiz in under 30 seconds",
      icon: <Clock className="h-8 w-8" />,
      progress: 100,
      completed: true,
      points: 50,
    },
    {
      id: 2,
      title: "Perfect Score",
      description: "Get all questions right in a daily quiz",
      icon: <Award className="h-8 w-8" />,
      progress: 100,
      completed: true,
      points: 100,
    },
    {
      id: 3,
      title: "Quiz Master",
      description: "Win 10 multiplayer quizzes",
      icon: <Trophy className="h-8 w-8" />,
      progress: 70,
      completed: false,
      points: 200,
    },
    {
      id: 4,
      title: "Knowledge Seeker",
      description: "Upload 5 study materials",
      icon: <Upload className="h-8 w-8" />,
      progress: 40,
      completed: false,
      points: 75,
    },
    {
      id: 5,
      title: "Daily Streak",
      description: "Complete daily quizzes for 7 consecutive days",
      icon: <Calendar className="h-8 w-8" />,
      progress: 85,
      completed: false,
      points: 150,
    },
  ]

  const stats = [
    { label: "Quizzes Taken", value: 42 },
    { label: "Correct Answers", value: 378 },
    { label: "Average Time", value: "00:48.32" },
    { label: "Best Rank", value: "#3" },
  ]

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Save profile logic would go here
  }

  // User level and XP
  const userLevel = 12
  const currentXP = 1450
  const maxXP = 2000

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                <p className="text-muted-foreground">View and manage your profile information and achievements.</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <GameCard className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-primary/20">
                        <AvatarImage src="/placeholder.svg?height=128&width=128" alt="User" />
                        <AvatarFallback className="text-4xl bg-primary/10">JD</AvatarFallback>
                      </Avatar>
                      <LevelBadge
                        level={userLevel}
                        icon={<Zap className="h-5 w-5 text-primary" />}
                        className="absolute bottom-0 right-0"
                      />
                    </div>

                    <XPProgress value={currentXP} max={maxXP} className="w-full" />

                    {isEditing ? (
                      <div className="w-full space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <h3 className="text-xl font-bold">{name}</h3>
                        <p className="text-sm text-muted-foreground">{email}</p>
                        <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
                          <p>{bio}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {isEditing ? (
                      <div className="flex w-full gap-2">
                        <Button variant="outline" className="w-full" onClick={() => setIsEditing(false)}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button className="w-full game-button-glow" onClick={handleSaveProfile}>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                  </CardFooter>
                </GameCard>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                    <CardDescription>Your quiz performance statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="stats">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="stats">Statistics</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                      </TabsList>
                      <TabsContent value="stats" className="space-y-6 pt-4">
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                          {stats.map((stat, index) => (
                            <GameCard key={index} className="overflow-hidden">
                              <CardHeader className="bg-primary/5 p-3">
                                <CardTitle className="text-sm">{stat.label}</CardTitle>
                              </CardHeader>
                              <CardContent className="p-6">
                                <p className="text-2xl font-bold">{stat.value}</p>
                              </CardContent>
                            </GameCard>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-semibold">Recent Performance</h3>
                          <div className="h-[200px] rounded-lg border bg-muted/40 p-4">
                            <div className="flex h-full items-center justify-center">
                              <p className="text-sm text-muted-foreground">Performance chart would go here</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="achievements" className="space-y-4 pt-4">
                        {achievements.map((achievement) => (
                          <AchievementCard
                            key={achievement.id}
                            title={achievement.title}
                            description={achievement.description}
                            unlocked={achievement.completed}
                            progress={achievement.progress}
                            icon={achievement.icon}
                            points={achievement.points}
                          />
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              <div className="game-divider" />

              <Card>
                <CardHeader>
                  <CardTitle>Quiz History</CardTitle>
                  <CardDescription>Your recent quiz activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <div className="grid grid-cols-12 gap-2 border-b p-4 font-medium">
                      <div className="col-span-4 md:col-span-3">Quiz</div>
                      <div className="col-span-2 text-center">Score</div>
                      <div className="col-span-2 text-center">Time</div>
                      <div className="col-span-2 text-center md:col-span-3">Date</div>
                      <div className="col-span-2 text-center">Rank</div>
                    </div>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="grid grid-cols-12 gap-2 border-b p-4 last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <div className="col-span-4 md:col-span-3">
                          <div className="font-medium">Daily Quiz #{i}</div>
                          <div className="text-xs text-muted-foreground md:hidden">April {20 - i}, 2023</div>
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <span className="font-medium">{10 - (i % 3)}/10</span>
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <span>
                            00:{40 + i}.{10 + i * 5}
                          </span>
                        </div>
                        <div className="col-span-2 hidden items-center justify-center text-muted-foreground md:col-span-3 md:flex">
                          April {20 - i}, 2023
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                          <Badge
                            className={`${i === 0 ? "bg-game-gold text-black" : i === 1 ? "bg-game-silver text-black" : i === 2 ? "bg-game-bronze text-black" : "bg-primary"}`}
                          >
                            #{i + 1}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All History
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

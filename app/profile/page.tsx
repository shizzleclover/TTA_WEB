"use client"

import { useEffect, useState } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { profileService, type UserProfile } from "@/lib/profile-service"
import { getInitials } from "@/lib/utils"

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [profilePicture, setProfilePicture] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getFullProfile()
        setProfileData(data)
        if (data) {
          setName(data.name)
          setBio(data.bio)
          setEmail(data.email)
          // Check for location and profilePicture in profile data
          setLocation(data.profile?.location || "")
          setProfilePicture(data.profile?.imageUrl || data.avatar || "")
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Simulating achievements based on badges and stats from the profile
  const getAchievements = () => {
    const badges = profileData?.stats?.badges || []
    const achievements = [
      {
        id: 1,
        title: "Speed Demon",
        description: "Complete a quiz in under 30 seconds",
        icon: <Clock className="h-8 w-8" />,
        progress: badges.includes("speed_demon") ? 100 : 60,
        completed: badges.includes("speed_demon"),
        points: 50,
      },
      {
        id: 2,
        title: "Perfect Score",
        description: "Get all questions right in a daily quiz",
        icon: <Award className="h-8 w-8" />,
        progress: badges.includes("perfect_score") ? 100 : 30,
        completed: badges.includes("perfect_score"),
        points: 100,
      },
      {
        id: 3,
        title: "Quiz Master",
        description: "Win 10 multiplayer quizzes",
        icon: <Trophy className="h-8 w-8" />,
        progress: badges.includes("quiz_master") ? 100 : 70,
        completed: badges.includes("quiz_master"),
        points: 200,
      },
      {
        id: 4,
        title: "Knowledge Seeker",
        description: "Upload 5 study materials",
        icon: <Upload className="h-8 w-8" />,
        progress: badges.includes("knowledge_seeker") ? 100 : 40,
        completed: badges.includes("knowledge_seeker"),
        points: 75,
      },
      {
        id: 5,
        title: "Daily Streak",
        description: "Complete daily quizzes for 7 consecutive days",
        icon: <Calendar className="h-8 w-8" />,
        progress: badges.includes("streak_7") ? 100 : (profileData?.stats?.streak || 0) * 100 / 7,
        completed: badges.includes("streak_7"),
        points: 150,
      },
    ];

    return achievements;
  };

  // Stats based on profile data
  const getStats = () => {
    return [
      { 
        label: "Quizzes Taken", 
        value: profileData?.stats?.totalAnswered ? 
          Math.floor(profileData?.stats?.totalAnswered / 10) || 0 : 0 
      },
      { 
        label: "Correct Answers", 
        value: profileData?.stats?.totalCorrect || 0 
      },
      { 
        label: "Accuracy", 
        value: profileData?.stats?.totalAnswered ? 
          Math.round((profileData.stats.totalCorrect / profileData.stats.totalAnswered) * 100) + "%" : "0%" 
      },
      { 
        label: "Streak", 
        value: profileData?.stats?.streak || 0 
      },
    ];
  };

  const handleSaveProfile = async () => {
    if (!profileData) return;

    setIsEditing(false);
    try {
      const result = await profileService.updateProfile({
        name,
        bio,
        location,
        profilePicture
      });
      
      if (result.success) {
        // Update the local profileData state to reflect changes
        setProfileData({
          ...profileData,
          name,
          bio,
          avatar: profilePicture || profileData.avatar, // Update avatar with new profilePicture if provided
          profile: {
            ...profileData.profile,
            location,
            imageUrl: profilePicture
          }
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Calculate user level and XP based on total correct answers
  const calculateLevelAndXP = () => {
    const totalCorrect = profileData?.stats?.totalCorrect || 0;
    const userLevel = Math.floor(totalCorrect / 100) + 1; // 1 level for every 100 correct answers
    const currentXP = totalCorrect % 100; // XP is the remainder
    const maxXP = 100; // Always need 100 XP to level up
    
    return { userLevel, currentXP, maxXP };
  };
  
  const { userLevel, currentXP, maxXP } = calculateLevelAndXP();

  // Helper function to format a date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return "Unknown date";
    }
  };

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
                    {loading ? (
                      <>
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-32 w-full" />
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <Avatar className="h-32 w-32 border-4 border-primary/20">
                            <AvatarImage src={profileData?.avatar || "/placeholder.svg?height=128&width=128"} alt={profileData?.name} />
                            <AvatarFallback className="text-4xl bg-primary/10">{getInitials(profileData?.name || "User")}</AvatarFallback>
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
                            <div className="space-y-2">
                              <Label htmlFor="location">Location</Label>
                              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="profilePicture">Profile Picture URL</Label>
                              <Input id="profilePicture" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} />
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <h3 className="text-xl font-bold">{profileData?.name}</h3>
                            <p className="text-sm text-muted-foreground">{profileData?.email}</p>
                            <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
                              <p>{profileData?.bio || "No bio provided"}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    {loading ? (
                      <Skeleton className="h-10 w-full" />
                    ) : isEditing ? (
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
                        {loading ? (
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {[1, 2, 3, 4].map((i) => (
                              <Skeleton key={i} className="h-32 rounded" />
                            ))}
                          </div>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                              {getStats().map((stat, index) => (
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
                          </>
                        )}
                      </TabsContent>
                      <TabsContent value="achievements" className="space-y-4 pt-4">
                        {loading ? (
                          [1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-20 rounded" />
                          ))
                        ) : (
                          getAchievements().map((achievement) => (
                            <AchievementCard
                              key={achievement.id}
                              title={achievement.title}
                              description={achievement.description}
                              unlocked={achievement.completed}
                              progress={achievement.progress}
                              icon={achievement.icon}
                              points={achievement.points}
                            />
                          ))
                        )}
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
                  {loading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <div className="rounded-lg border">
                      <div className="grid grid-cols-12 gap-2 border-b p-4 font-medium">
                        <div className="col-span-4 md:col-span-3">Quiz</div>
                        <div className="col-span-2 text-center">Score</div>
                        <div className="col-span-2 text-center">Time</div>
                        <div className="col-span-2 text-center md:col-span-3">Date</div>
                        <div className="col-span-2 text-center">Rank</div>
                      </div>
                      {profileData?.stats?.totalAnswered ? (
                        [1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className="grid grid-cols-12 gap-2 border-b p-4 last:border-0 hover:bg-muted/50 transition-colors"
                          >
                            <div className="col-span-4 md:col-span-3">
                              <div className="font-medium">Daily Quiz #{i}</div>
                              <div className="text-xs text-muted-foreground md:hidden">
                                {formatDate(new Date(Date.now() - i * 86400000).toISOString())}
                              </div>
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
                              {formatDate(new Date(Date.now() - i * 86400000).toISOString())}
                            </div>
                            <div className="col-span-2 flex items-center justify-center">
                              <Badge
                                className={`${i === 0 ? "bg-game-gold text-black" : i === 1 ? "bg-game-silver text-black" : i === 2 ? "bg-game-bronze text-black" : "bg-primary"}`}
                              >
                                #{i + 1}
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-center p-4">
                          <p className="text-muted-foreground mb-2">No quiz history found.</p>
                          <Button size="sm" asChild>
                            <a href="/quiz/daily">Take Daily Quiz</a>
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  {!loading && profileData?.stats?.totalAnswered ? (
                    <Button variant="outline" className="w-full">
                      View All History
                    </Button>
                  ) : null}
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

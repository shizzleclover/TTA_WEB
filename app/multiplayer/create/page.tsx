"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Users, Trophy, AlarmClock, Sparkles, Zap, Lock, Globe, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { GameCard } from "@/components/ui/game-card"
import { useAuth } from "@/hooks/use-auth"
import { gameService, type CreateLobbyParams } from "@/lib/game-service"
import { toast } from "@/components/ui/use-toast"

export default function CreateGamePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)
  
  // Form state
  const [lobbyName, setLobbyName] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [maxPlayers, setMaxPlayers] = useState(5)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("medium")
  const [questionCount, setQuestionCount] = useState(10)
  const [category, setCategory] = useState("")

  // UI state
  const [activeTab, setActiveTab] = useState("quick")

  // Handle form submission
  const handleCreateLobby = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!lobbyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a lobby name",
        variant: "destructive",
      })
      return
    }

    setIsCreating(true)
    try {
      const params: CreateLobbyParams = {
        name: lobbyName.trim(),
        isPublic,
        maxPlayers,
        difficulty,
        questionCount,
      }

      // Only add category if selected
      if (category) {
        params.categoryId = category
      }

      const lobby = await gameService.createLobby(params)
      
      if (lobby) {
        toast({
          title: "Success",
          description: `Lobby "${lobby.name}" created!`,
        })
        router.push(`/multiplayer/${lobby.id}`)
      } else {
        // Error already displayed by service
        setIsCreating(false)
      }
    } catch (error) {
      console.error("Error in create page:", error)
      toast({
        title: "Error",
        description: "Failed to create lobby. Please try again.",
        variant: "destructive",
      })
      setIsCreating(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Create Multiplayer Game</h1>
            <p className="text-muted-foreground">Set up your own trivia battle and invite friends to play.</p>
          </div>

          <Tabs defaultValue="quick" onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick">Quick Setup</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
            </TabsList>
            
            <div className="space-y-6">
              <GameCard>
                <form onSubmit={handleCreateLobby}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="h-6 w-6 text-primary" />
                      <CardTitle>Game Settings</CardTitle>
                    </div>
                    <CardDescription>Configure your multiplayer trivia battle</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="lobbyName">Lobby Name</Label>
                        <Input
                          id="lobbyName"
                          placeholder={`${user?.name || 'Your'}'s Trivia Battle`}
                          value={lobbyName}
                          onChange={(e) => setLobbyName(e.target.value)}
                          maxLength={30}
                          className="mt-1"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col space-y-1">
                          <Label htmlFor="isPublic">Public Lobby</Label>
                          <span className="text-sm text-muted-foreground">
                            {isPublic ? 
                              "Anyone can join with the code" : 
                              "Players must be invited directly"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="isPublic"
                            checked={isPublic} 
                            onCheckedChange={setIsPublic}
                          />
                          {isPublic ? 
                            <Globe className="h-4 w-4 text-primary" /> : 
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          }
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <Label htmlFor="maxPlayers">Max Players: {maxPlayers}</Label>
                          <span className="text-sm text-muted-foreground">2-8 players</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <Slider 
                            id="maxPlayers"
                            defaultValue={[5]} 
                            max={8} 
                            min={2} 
                            step={1} 
                            className="flex-1"
                            onValueChange={(value) => setMaxPlayers(value[0])} 
                          />
                          <span className="font-medium text-lg w-5 text-center">{maxPlayers}</span>
                        </div>
                      </div>
                    </div>

                    {activeTab === "advanced" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-4 border-t"
                      >
                        <div>
                          <Label htmlFor="difficulty">Difficulty</Label>
                          <RadioGroup
                            id="difficulty"
                            value={difficulty}
                            onValueChange={(v) => setDifficulty(v as any)}
                            className="grid grid-cols-4 gap-2 mt-2"
                          >
                            <Label
                              htmlFor="difficulty-easy"
                              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground [&:has(:checked)]:border-primary ${difficulty === 'easy' ? 'border-primary' : ''}`}
                            >
                              <RadioGroupItem
                                value="easy"
                                id="difficulty-easy"
                                className="sr-only"
                              />
                              <Zap className="mb-2 h-5 w-5" />
                              <span>Easy</span>
                            </Label>
                            <Label
                              htmlFor="difficulty-medium"
                              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground [&:has(:checked)]:border-primary ${difficulty === 'medium' ? 'border-primary' : ''}`}
                            >
                              <RadioGroupItem
                                value="medium"
                                id="difficulty-medium"
                                className="sr-only"
                              />
                              <Sparkles className="mb-2 h-5 w-5" />
                              <span>Medium</span>
                            </Label>
                            <Label
                              htmlFor="difficulty-hard"
                              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground [&:has(:checked)]:border-primary ${difficulty === 'hard' ? 'border-primary' : ''}`}
                            >
                              <RadioGroupItem
                                value="hard"
                                id="difficulty-hard"
                                className="sr-only"
                              />
                              <Trophy className="mb-2 h-5 w-5" />
                              <span>Hard</span>
                            </Label>
                            <Label
                              htmlFor="difficulty-mixed"
                              className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground [&:has(:checked)]:border-primary ${difficulty === 'mixed' ? 'border-primary' : ''}`}
                            >
                              <RadioGroupItem
                                value="mixed"
                                id="difficulty-mixed"
                                className="sr-only"
                              />
                              <AlarmClock className="mb-2 h-5 w-5" />
                              <span>Mixed</span>
                            </Label>
                          </RadioGroup>
                        </div>

                        <div>
                          <Label htmlFor="category">Category (Optional)</Label>
                          <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">All Categories</SelectItem>
                              <SelectItem value="general">General Knowledge</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="history">History</SelectItem>
                              <SelectItem value="geography">Geography</SelectItem>
                              <SelectItem value="entertainment">Entertainment</SelectItem>
                              <SelectItem value="sports">Sports</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <div className="flex justify-between">
                            <Label htmlFor="questionCount">Question Count: {questionCount}</Label>
                            <span className="text-sm text-muted-foreground">5-20 questions</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <AlarmClock className="h-5 w-5 text-muted-foreground" />
                            <Slider 
                              id="questionCount"
                              defaultValue={[10]} 
                              max={20} 
                              min={5} 
                              step={5} 
                              className="flex-1"
                              onValueChange={(value) => setQuestionCount(value[0])} 
                            />
                            <span className="font-medium text-lg w-5 text-center">{questionCount}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push("/multiplayer")}>
                      Cancel
                    </Button>
                    <Button type="submit" className="game-button-glow" disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create Game"}
                    </Button>
                  </CardFooter>
                </form>
              </GameCard>
            </div>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import { GameCard } from "@/components/ui/game-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { gameService, type PublicLobby } from "@/lib/game-service"
import { toast } from "@/components/ui/use-toast"
import { 
  Plus, 
  ChevronsRight, 
  ExternalLink, 
  Clock, 
  Crown,
  Users,
  RefreshCw
} from "lucide-react"

export default function MultiplayerPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [lobbyCode, setLobbyCode] = useState("")
  const [publicLobbies, setPublicLobbies] = useState<PublicLobby[]>([])
  const [userLobbies, setUserLobbies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  
  useEffect(() => {
    fetchLobbies()
  }, [])
  
  const fetchLobbies = async () => {
    setIsLoading(true)
    try {
      // First try to get public lobbies
      let publicData: PublicLobby[] = [];
      try {
        publicData = await gameService.getPublicLobbies();
      } catch (publicError) {
        console.error("Error fetching public lobbies:", publicError);
        // Don't fail the whole operation, just set empty public lobbies
      }
      
      // Then try to get user's lobbies
      let userData: any[] = [];
      try {
        userData = await gameService.getUserLobbies();
      } catch (userError) {
        console.error("Error fetching user lobbies:", userError);
        // Don't fail the whole operation, just set empty user lobbies
      }
      
      // Update state with whatever data we got
      setPublicLobbies(publicData);
      setUserLobbies(userData);
    } catch (error) {
      console.error("Error fetching lobbies:", error);
      // Show a general error toast only if both requests failed completely
      toast({
        title: "Connection Error",
        description: "Could not load game data. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchLobbies()
    setRefreshing(false)
  }
  
  const handleJoinLobby = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!lobbyCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a lobby code",
        variant: "destructive",
      })
      return
    }
    
    setIsJoining(true)
    try {
      const result = await gameService.joinLobby({ code: lobbyCode.trim() })
      
      if (result?.success) {
        toast({
          title: "Success",
          description: `Joined lobby "${result.lobby.name}"`,
        })
        router.push(`/multiplayer/${result.lobby._id}`)
      } else {
        toast({
          title: "Error",
          description: result?.message || "Failed to join lobby",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error joining lobby:", error)
    } finally {
      setIsJoining(false)
    }
  }
  
  // Helper function to format relative time
  const getTimeAgo = (dateString: string): string => {
    const now = new Date()
    const date = new Date(dateString)
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours ago`
    const days = Math.floor(hours / 24)
    return `${days} days ago`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Multiplayer</h1>
                <p className="text-muted-foreground">Challenge friends or other players in real-time trivia battles.</p>
              </div>
              
              <Button onClick={() => router.push("/multiplayer/create")} className="game-button-glow" size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Create Game
              </Button>
            </div>
            
            <GameCard className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              <CardContent className="p-6 relative">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Have a game code?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Enter the 6-digit code provided by the host to join an existing game.
                    </p>
                    
                    <form onSubmit={handleJoinLobby} className="flex gap-2">
                      <Input
                        placeholder="Enter code (e.g. ABC123)"
                        value={lobbyCode}
                        onChange={(e) => setLobbyCode(e.target.value)}
                        maxLength={6}
                        className="uppercase"
                      />
                      <Button type="submit" disabled={isJoining}>
                        {isJoining ? "Joining..." : "Join"}
                        <ChevronsRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                  
                  <div className="hidden md:block border-l pl-6">
                    <h3 className="text-xl font-semibold mb-2">Quick Start</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create your own lobby or join one of the public games below.
                    </p>
                    
                    <Button onClick={handleRefresh} variant="outline" className="w-full">
                      <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                      {refreshing ? "Refreshing..." : "Refresh Games"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </GameCard>
          </div>
          
          <Tabs defaultValue="public" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="public">Public Games</TabsTrigger>
              <TabsTrigger value="my-games">My Games</TabsTrigger>
            </TabsList>
            
            <TabsContent value="public" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Available Lobbies</h2>
                <Button onClick={handleRefresh} variant="outline" size="sm" className="md:hidden">
                  <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={`public-skeleton-${i}`} className="bg-background border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="ml-4 h-4 w-16 rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : publicLobbies.length === 0 ? (
                <div className="bg-background border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground mb-4">No public lobbies available at the moment.</p>
                  <Button onClick={() => router.push("/multiplayer/create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Lobby
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {publicLobbies.map((lobby) => (
                    <motion.div 
                      key={lobby._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-background border rounded-lg p-4 hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{lobby.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Users className="h-4 w-4" />
                            <span>{lobby.playerCount} / {lobby.maxPlayers} players</span>
                            <div className="flex items-center ml-4">
                              <Crown className="h-4 w-4 mr-2" />
                              <span>{lobby.host.name}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          {!lobby.isFull ? (
                            <Button
                              size="sm"
                              onClick={async () => {
                                try {
                                  const result = await gameService.joinLobby({ code: lobby.code });
                                  if (result?.success) {
                                    router.push(`/multiplayer/${result.lobby._id}`);
                                  }
                                } catch (error) {
                                  console.error("Error joining lobby:", error);
                                }
                              }}
                            >
                              Join
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </Button>
                          ) : (
                            <Badge variant="outline">Full</Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="my-games" className="space-y-4">
              <h2 className="text-xl font-semibold">Your Active Games</h2>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={`my-games-skeleton-${i}`} className="bg-background border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : userLobbies.length === 0 ? (
                <div className="bg-background border rounded-lg p-8 text-center">
                  <p className="text-muted-foreground mb-4">You don't have any active games.</p>
                  <Button onClick={() => router.push("/multiplayer/create")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Start New Game
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userLobbies.map((lobby) => (
                    <motion.div 
                      key={lobby._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-background border rounded-lg p-4 hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{lobby.name}</h3>
                            {lobby.host._id === user?._id && (
                              <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Host</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Users className="h-4 w-4" />
                            <span>{lobby.players?.length || 0} / {lobby.maxPlayers} players</span>
                            <div className="flex items-center ml-4">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{getTimeAgo(lobby.createdAt || new Date().toISOString())}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <Button size="sm" onClick={() => router.push(`/multiplayer/${lobby._id}`)}>
                            {lobby.status === 'waiting' ? 'Lobby' : 'Resume'}
                            <ChevronsRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  )
}

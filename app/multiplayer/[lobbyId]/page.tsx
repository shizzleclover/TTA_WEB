"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { DashboardHeader } from "@/components/dashboard-header"
import { GameCard } from "@/components/ui/game-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useLoading } from "@/hooks/use-loading"
import { useAuth } from "@/hooks/use-auth"
import { gameService, type Lobby } from "@/lib/game-service"
import { getInitials } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { socketService } from "@/lib/socket-service"
import { 
  Users, 
  Trophy, 
  Copy, 
  ChevronsRight,
  Clock,
  Crown,
  PlayCircle,
  X,
  MessageSquare,
  UserCheck,
  UserPlus,
  ArrowLeft,
  CheckCircle2
} from "lucide-react"

export default function LobbyWaitingRoom() {
  const { lobbyId } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { startLoading, stopLoading } = useLoading()
  
  const [lobby, setLobby] = useState<Lobby | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chatMessage, setChatMessage] = useState("")
  const [messages, setMessages] = useState<{sender: string, message: string}[]>([])
  const [copied, setCopied] = useState(false)
  
  // Check if the current user is the host
  const isHost = user && lobby?.host?._id === user._id
  
  // Determine if the game can start (at least 2 players and current user is host)
  const canStartGame = isHost && lobby?.players && lobby.players.length >= 2
  
  // Check if the minimum player requirement is met
  const hasMinimumPlayers = lobby?.players && lobby.players.length >= 2
  
  useEffect(() => {
    fetchLobbyData()
    
    // Set up socket connection to receive updates
    if (typeof lobbyId === 'string') {
      setupSocketConnection(lobbyId)
    }
    
    return () => {
      // Clean up socket connection
      socketService.disconnect()
    }
  }, [lobbyId])
  
  const setupSocketConnection = (roomId: string) => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to join a lobby",
        variant: "destructive"
      })
      router.push('/login')
      return
    }
    
    socketService.connect(token)
    
    socketService.joinRoom('lobby', roomId)
    
    socketService.on('lobbyUpdate', (updatedLobby) => {
      setLobby(updatedLobby)
    })
    
    socketService.on('chatMessage', (message) => {
      setMessages(prev => [...prev, message])
    })
    
    socketService.on('gameStarting', () => {
      toast({
        title: "Game Starting",
        description: "The game is about to begin!"
      })
      
      // Redirect to the game page
      router.push(`/multiplayer/game/${lobbyId}`)
    })
    
    socketService.on('playerJoined', (player) => {
      toast({
        title: "Player Joined",
        description: `${player.name} has joined the lobby`
      })
    })
    
    socketService.on('playerLeft', (player) => {
      toast({
        title: "Player Left",
        description: `${player.name} has left the lobby`
      })
    })
  }
  
  const fetchLobbyData = async () => {
    if (typeof lobbyId !== 'string') return
    
    setLoading(true)
    try {
      // In our implementation, we'll use our game service instead of fetch
      const response = await fetch(`/api/game/lobby/${lobbyId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch lobby data")
      }
      
      const data = await response.json()
      setLobby(data.lobby)
    } catch (error) {
      console.error("Error fetching lobby:", error)
      setError("Failed to load lobby data. The lobby may no longer exist.")
    } finally {
      setLoading(false)
    }
  }
  
  const copyInviteCode = () => {
    if (!lobby) return
    
    navigator.clipboard.writeText(lobby.code)
    setCopied(true)
    
    toast({
      title: "Invite Code Copied",
      description: `Share the code "${lobby.code}" with your friends`
    })
    
    setTimeout(() => setCopied(false), 3000)
  }
  
  const handleStartGame = async () => {
    if (!lobby || !isHost) return
    
    startLoading("Starting game...")
    try {
      const result = await gameService.startGame(lobby._id)
      
      if (result?.success) {
        toast({
          title: "Game Started",
          description: "The quiz battle is about to begin!"
        })
      } else {
        throw new Error(result?.message || "Failed to start game")
      }
    } catch (error) {
      console.error("Error starting game:", error)
      toast({
        title: "Error",
        description: "Failed to start game. Please try again.",
        variant: "destructive"
      })
    } finally {
      stopLoading()
    }
  }
  
  const handleReadyToggle = async () => {
    if (!lobby) return
    
    try {
      // In a real app, you'd have an API endpoint to toggle ready status
      await fetch(`/api/game/lobby/${lobby._id}/ready`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      // The socket connection will update the lobby state
    } catch (error) {
      console.error("Error toggling ready status:", error)
      toast({
        title: "Error",
        description: "Failed to update ready status",
        variant: "destructive"
      })
    }
  }
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!chatMessage.trim() || !user) return
    
    // In a real app, you'd emit a socket event with the message
    socketService.emit('sendMessage', {
      lobbyId,
      message: chatMessage,
      sender: user.name
    })
    
    setChatMessage("")
  }
  
  const handleLeaveLobby = async () => {
    if (!lobby) return
    
    try {
      // Use our game service instead
      const result = await gameService.leaveLobby(lobby._id)
      
      if (result.success) {
        toast({
          title: "Left Lobby",
          description: result.message || "You have left the lobby"
        })
        
        router.push('/multiplayer')
      } else {
        throw new Error(result.message || "Failed to leave lobby")
      }
    } catch (error) {
      console.error("Error leaving lobby:", error)
      toast({
        title: "Error",
        description: "Failed to leave the lobby. Please try again.",
        variant: "destructive"
      })
    }
  }
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
          <LoadingSpinner size="lg" message="Loading lobby..." />
        </main>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
          <GameCard className="max-w-md w-full text-center">
            <CardHeader>
              <CardTitle>Lobby Not Found</CardTitle>
              <CardDescription>
                {error}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push('/multiplayer')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Multiplayer
              </Button>
            </CardFooter>
          </GameCard>
        </main>
      </div>
    )
  }
  
  if (!lobby) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-8 flex items-center justify-center">
          <GameCard className="max-w-md w-full text-center">
            <CardHeader>
              <CardTitle>Oops!</CardTitle>
              <CardDescription>
                There was an issue loading the lobby. Please try again.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push('/multiplayer')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Multiplayer
              </Button>
            </CardFooter>
          </GameCard>
        </main>
      </div>
    )
  }

  const host = lobby?.host?._id

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 p-6 md:p-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-6xl"
        >
          {/* Lobby Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                {lobby.name}
                {isHost && (
                  <Badge className="bg-primary/20 text-primary ml-2">Host</Badge>
                )}
              </h1>
              <div className="flex items-center mt-1 gap-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {lobby.players.length} / {lobby.maxPlayers} Players
                  </span>
                </div>
                <div className="flex items-center">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-xs"
                    onClick={copyInviteCode}
                  >
                    <span className="mr-1">Code: {lobby.code}</span>
                    <Copy className={`h-3 w-3 ${copied ? "text-green-500" : "text-muted-foreground"}`} />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleLeaveLobby}
                className="border-destructive/20 text-destructive hover:bg-destructive/10"
              >
                <X className="mr-2 h-4 w-4" />
                Leave Lobby
              </Button>
              
              {isHost ? (
                <Button 
                  className="game-button-glow"
                  disabled={!canStartGame}
                  onClick={handleStartGame}
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  {hasMinimumPlayers ? "Start Game" : "Need 2+ Players"}
                </Button>
              ) : (
                <Button 
                  className="game-button-glow"
                  onClick={handleReadyToggle}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Ready
                </Button>
              )}
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left Panel - Player List */}
            <div className="md:col-span-1">
              <GameCard>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>Players</CardTitle>
                  </div>
                  <CardDescription>
                    {lobby.players.length} of {lobby.maxPlayers} joined
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {lobby.players.map((player) => (
                      <div
                        key={player._id}
                        className={`flex items-center justify-between p-4 ${
                          host === player._id ? "bg-primary/5" : ""
                        } border-b border-border last:border-0`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${player._id}`} alt={player.name} />
                            <AvatarFallback>{getInitials(player.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {player.name}
                              {host === player._id && (
                                <Crown className="h-3.5 w-3.5 text-primary inline ml-2" />
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {player.ready ? "Ready" : "Not Ready"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={player.ready ? "default" : "outline"}
                          className={player.ready ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" : ""}
                        >
                          {player.ready ? (
                            <UserCheck className="h-3 w-3 mr-1" />
                          ) : (
                            <Clock className="h-3 w-3 mr-1" />
                          )}
                          {player.ready ? "Ready" : "Waiting"}
                        </Badge>
                      </div>
                    ))}
                    
                    {/* Empty slots */}
                    {Array.from({
                      length: Math.max(0, lobby.maxPlayers - lobby.players.length),
                    }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="flex items-center justify-between p-4 border-b border-border last:border-0 opacity-50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                            <UserPlus className="h-4 w-4 text-muted-foreground/50" />
                          </div>
                          <p className="text-sm text-muted-foreground">Waiting for player...</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/10">
                  <p className="text-xs text-muted-foreground w-full text-center">
                    {hasMinimumPlayers
                      ? "Minimum player requirement met!"
                      : "Waiting for more players to join..."}
                  </p>
                </CardFooter>
              </GameCard>
            </div>
            
            {/* Right Panel - Game Info and Chat */}
            <div className="md:col-span-2">
              <div className="grid gap-6">
                <GameCard>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <CardTitle>Game Details</CardTitle>
                    </div>
                    <CardDescription>
                      Quiz settings and information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-3 rounded-lg bg-muted/20 border border-muted">
                        <p className="text-xs text-muted-foreground">Difficulty</p>
                        <p className="font-medium">
                          {lobby.settings?.difficulty || "Medium"}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/20 border border-muted">
                        <p className="text-xs text-muted-foreground">Questions</p>
                        <p className="font-medium">
                          {lobby.settings?.questionCount || 10} questions
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/20 border border-muted">
                        <p className="text-xs text-muted-foreground">Category</p>
                        <p className="font-medium">
                          {lobby.settings?.category || "Mixed"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border border-border p-4 bg-muted/10">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-primary" />
                        Lobby Chat
                      </h4>
                      
                      <div className="h-[200px] overflow-y-auto mb-3 rounded border border-border p-2 bg-background">
                        {messages.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                            No messages yet. Start the conversation!
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {messages.map((msg, i) => (
                              <div key={i} className="text-sm">
                                <span className="font-medium">{msg.sender}: </span>
                                <span>{msg.message}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="sm">
                          Send
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                  {isHost && (
                    <CardFooter className="border-t flex justify-between items-center bg-muted/10">
                      <p className="text-sm text-muted-foreground">
                        As the host, you can start the game when everyone is ready.
                      </p>
                      <Button
                        className="game-button-glow"
                        disabled={!canStartGame}
                        onClick={handleStartGame}
                      >
                        <PlayCircle className="mr-2 h-4 w-4" />
                        {hasMinimumPlayers ? "Start Game" : "Need 2+ Players"}
                      </Button>
                    </CardFooter>
                  )}
                </GameCard>
                
                <GameCard className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                  <CardContent className="relative p-6 text-center">
                    <h3 className="text-lg font-bold mb-1">
                      {isHost 
                        ? "Waiting for players to get ready..." 
                        : "Get ready for the quiz battle!"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isHost
                        ? "You can start the game once everyone is ready."
                        : "The host will start the game soon."}
                    </p>
                  </CardContent>
                </GameCard>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
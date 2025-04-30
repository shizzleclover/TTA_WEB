"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Copy, Plus, RefreshCw, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"

// Sample lobby data
const publicLobbies = [
  { id: 1, name: "Science Quiz", host: "Sarah J.", players: 3, maxPlayers: 6, status: "waiting" },
  { id: 2, name: "History Trivia", host: "Michael C.", players: 4, maxPlayers: 8, status: "waiting" },
  { id: 3, name: "Math Challenge", host: "Alex W.", players: 2, maxPlayers: 4, status: "waiting" },
  { id: 4, name: "Geography Masters", host: "Emma D.", players: 5, maxPlayers: 6, status: "in-progress" },
  { id: 5, name: "Literature Quiz", host: "David M.", players: 3, maxPlayers: 8, status: "waiting" },
]

export default function MultiplayerPage() {
  const [lobbyCode, setLobbyCode] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // Show toast notification
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
                <h1 className="text-3xl font-bold tracking-tight">Multiplayer</h1>
                <p className="text-muted-foreground">
                  Create or join multiplayer quiz lobbies to compete with friends.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Join a Lobby</CardTitle>
                    <CardDescription>Enter a lobby code to join an existing game</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter lobby code"
                        value={lobbyCode}
                        onChange={(e) => setLobbyCode(e.target.value)}
                      />
                      <Button disabled={!lobbyCode}>Join</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Create a Lobby</CardTitle>
                    <CardDescription>Start a new multiplayer quiz session</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/multiplayer/create">
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Lobby
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Public Lobbies</CardTitle>
                    <CardDescription>Join an existing public lobby</CardDescription>
                  </div>
                  <Button variant="outline" size="icon" onClick={handleRefresh} disabled={refreshing}>
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  </Button>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="available">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="available">Available</TabsTrigger>
                      <TabsTrigger value="inProgress">In Progress</TabsTrigger>
                    </TabsList>

                    <TabsContent value="available" className="space-y-4 pt-4">
                      {publicLobbies
                        .filter((lobby) => lobby.status === "waiting")
                        .map((lobby) => (
                          <div key={lobby.id} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>{lobby.host.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{lobby.name}</h3>
                                <p className="text-sm text-muted-foreground">Hosted by {lobby.host}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>
                                  {lobby.players}/{lobby.maxPlayers}
                                </span>
                              </div>
                              <Button size="sm">Join</Button>
                            </div>
                          </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="inProgress" className="space-y-4 pt-4">
                      {publicLobbies
                        .filter((lobby) => lobby.status === "in-progress")
                        .map((lobby) => (
                          <div key={lobby.id} className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarFallback>{lobby.host.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{lobby.name}</h3>
                                <p className="text-sm text-muted-foreground">Hosted by {lobby.host}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>
                                  {lobby.players}/{lobby.maxPlayers}
                                </span>
                              </div>
                              <div className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                                In Progress
                              </div>
                            </div>
                          </div>
                        ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Your Active Lobbies</CardTitle>
                  <CardDescription>Lobbies you've created or joined</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <div className="flex items-center justify-between border-b p-4">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-medium">Science Quiz</h3>
                          <p className="text-sm text-muted-foreground">Created by you • 3/6 players</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 rounded-lg border px-3 py-1">
                          <span className="text-sm font-medium">ABC123</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5"
                            onClick={() => handleCopyCode("ABC123")}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button size="sm">Resume</Button>
                      </div>
                    </div>
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

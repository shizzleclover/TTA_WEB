import { io, type Socket } from "socket.io-client"
import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://tta-kha7.onrender.com/api"

let socket: Socket | null = null

export const socketService = {
  connect(token: string): Socket {
    if (socket) {
      return socket
    }

    socket = io(`${API_BASE_URL.replace("/api", "")}/game`, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
    })

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id)
    })

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to game server. Please try again.",
        variant: "destructive",
      })
    })

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason)
    })

    return socket
  },

  disconnect() {
    if (socket) {
      socket.disconnect()
      socket = null
    }
  },

  joinLobby(lobbyId: string) {
    if (!socket) {
      throw new Error("Socket not connected")
    }

    socket.emit("joinLobby", { lobbyId })
  },

  leaveLobby(lobbyId: string) {
    if (!socket) {
      throw new Error("Socket not connected")
    }

    socket.emit("leaveLobby", { lobbyId })
  },

  joinGame(gameId: string) {
    if (!socket) {
      throw new Error("Socket not connected")
    }

    socket.emit("joinGame", { gameId })
  },

  leaveGame(gameId: string) {
    if (!socket) {
      throw new Error("Socket not connected")
    }

    socket.emit("leaveGame", { gameId })
  },

  submitAnswer(gameId: string, questionId: string, answer: string, timeSpent: number) {
    if (!socket) {
      throw new Error("Socket not connected")
    }

    socket.emit("answer", { gameId, questionId, answer, timeSpent })
  },

  setReady(gameId: string, ready: boolean) {
    if (!socket) {
      throw new Error("Socket not connected")
    }

    socket.emit("ready", { gameId, ready })
  },

  onPlayerJoined(callback: (player: any) => void) {
    if (!socket) {
      throw new Error("Socket not connected")
    }

    socket.on("playerJoined", callback)
    return () => socket?.off("playerJoined", callback)
  },

  onPlayerLeft(callback: (player: any) => void) {
    if (!socket) {
      throw new Error("Socket not connected")
    }

    socket.on("playerLeft", callback)
    return () => socket?.off("playerLeft", callback)
  },

  onQuestion(callback: (question: any) => void) {
    if (!socket) {
      throw new Error("Socket not connected")
    }

    socket.on("question", callback)
    return () => socket?.off("question", callback)
  },

  onResults(callback: (results: any) => void) {
    if (!socket) {
      throw new Error("Socket not connected")
    }

    socket.on("results", callback)
    return () => socket?.off("results", callback)
  },

  onGameStart(callback: () => void) {
    if (!socket) {
      throw new Error("Socket not connected")
    }

    socket.on("gameStart", callback)
    return () => socket?.off("gameStart", callback)
  },

  onGameEnd(callback: (results: any) => void) {
    if (!socket) {
      throw new Error("Socket not connected")
    }

    socket.on("gameEnd", callback)
    return () => socket?.off("gameEnd", callback)
  },
}

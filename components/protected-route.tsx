"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredTier?: "free" | "premium" | "student"
}

export function ProtectedRoute({ children, requiredTier }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }

    if (!isLoading && isAuthenticated && requiredTier && user?.tier !== requiredTier) {
      if (requiredTier === "premium" && user?.tier === "student") {
        // Student tier includes premium features
        return
      }

      // Redirect to subscription page if user doesn't have required tier
      router.push("/subscription")
    }
  }, [isAuthenticated, isLoading, router, requiredTier, user])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredTier && user?.tier !== requiredTier) {
    if (requiredTier === "premium" && user?.tier === "student") {
      // Student tier includes premium features
      return <>{children}</>
    }
    return null
  }

  return <>{children}</>
}

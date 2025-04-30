import type * as React from "react"
import { cn } from "@/lib/utils"

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
  premium?: boolean
  highlight?: boolean
  children: React.ReactNode
}

export function GameCard({ premium, highlight, className, children, ...props }: GameCardProps) {
  return (
    <div
      className={cn("game-card", premium && "game-card-premium", highlight && "game-card-highlight", className)}
      {...props}
    >
      {children}
    </div>
  )
}

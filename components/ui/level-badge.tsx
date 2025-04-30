import type * as React from "react"
import { cn } from "@/lib/utils"

interface LevelBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  level: number
  icon: React.ReactNode
}

export function LevelBadge({ level, icon, className, ...props }: LevelBadgeProps) {
  return (
    <div className={cn("game-badge", className)} {...props}>
      {icon}
      <span className="game-badge-level">{level}</span>
    </div>
  )
}

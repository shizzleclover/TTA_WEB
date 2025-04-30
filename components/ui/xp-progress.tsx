import type * as React from "react"
import { cn } from "@/lib/utils"

interface XPProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max: number
  showText?: boolean
}

export function XPProgress({ value, max, showText = true, className, ...props }: XPProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn("space-y-1", className)} {...props}>
      <div className="game-progress">
        <div className="game-progress-bar game-progress-xp" style={{ width: `${percentage}%` }} />
      </div>
      {showText && (
        <div className="flex justify-between text-xs">
          <span>
            XP: {value}/{max}
          </span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
    </div>
  )
}

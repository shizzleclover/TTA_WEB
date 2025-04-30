import type * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Trophy, Lock } from "lucide-react"

interface AchievementCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  unlocked: boolean
  progress?: number
  icon?: React.ReactNode
  points?: number
}

export function AchievementCard({
  title,
  description,
  unlocked,
  progress = 0,
  icon,
  points = 0,
  className,
  ...props
}: AchievementCardProps) {
  return (
    <div
      className={cn("game-achievement", unlocked ? "game-achievement-unlocked" : "game-achievement-locked", className)}
      {...props}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn("rounded-full p-3", unlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}
        >
          {icon || (unlocked ? <Trophy className="h-6 w-6" /> : <Lock className="h-6 w-6" />)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{title}</h3>
            {points > 0 && (
              <Badge variant={unlocked ? "default" : "outline"} className={unlocked ? "" : "text-muted-foreground"}>
                {points} XP
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          {progress > 0 && progress < 100 && (
            <div className="mt-2 space-y-1">
              <div className="game-progress">
                <div className="game-progress-bar" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

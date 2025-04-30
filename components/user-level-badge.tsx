"use client"

import { useState } from "react"
import { Zap } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { XPProgress } from "@/components/ui/xp-progress"

interface UserLevelBadgeProps {
  level: number
  xp: number
  maxXp: number
}

export function UserLevelBadge({ level, xp, maxXp }: UserLevelBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
        <TooltipTrigger asChild>
          <div
            className="flex items-center gap-1 cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Zap className="h-3 w-3" />
            </div>
            <span className="font-bold text-sm">Lvl {level}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="w-64 p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium">Level {level}</span>
              <span className="text-xs text-muted-foreground">
                {xp}/{maxXp} XP
              </span>
            </div>
            <XPProgress value={xp} max={maxXp} showText={false} />
            <p className="text-xs text-muted-foreground">
              {maxXp - xp} XP needed for Level {level + 1}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

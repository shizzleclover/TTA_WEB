import Link from "next/link"
import { BarChart, BookOpen, CreditCard, Crown, GraduationCap, Home, Settings, Trophy, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardNav() {
  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
      active: true,
    },
    {
      title: "Daily Quiz",
      href: "/quiz/daily",
      icon: <Crown className="h-5 w-5" />,
    },
    {
      title: "Multiplayer",
      href: "/multiplayer",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Study Materials",
      href: "/study",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Leaderboards",
      href: "/leaderboards",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Subscription",
      href: "/subscription",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Verify Student",
      href: "/verify-student",
      icon: <GraduationCap className="h-5 w-5" />,
    },
    {
      title: "Statistics",
      href: "/statistics",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <nav className="hidden w-64 flex-col gap-4 p-4 md:flex">
      <div className="flex flex-col gap-1">
        {navItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Button variant={item.active ? "secondary" : "ghost"} className="w-full justify-start">
              {item.icon}
              <span className="ml-2">{item.title}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  )
}

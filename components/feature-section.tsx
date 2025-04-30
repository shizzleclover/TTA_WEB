"use client"

import { motion } from "framer-motion"
import { BookOpen, Brain, Clock, Trophy, Users } from "lucide-react"

export function FeatureSection() {
  const features = [
    {
      icon: <Clock className="h-10 w-10" />,
      title: "Daily Quizzes",
      description: "Participate in daily global quizzes with 10 questions. The fastest correct answers rank highest.",
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: "Multiplayer Games",
      description: "Premium users can create or join private or public lobbies for custom quiz experiences.",
    },
    {
      icon: <BookOpen className="h-10 w-10" />,
      title: "Study Material Upload",
      description: "Upload your study materials and automatically generate questions to test your knowledge.",
    },
    {
      icon: <Trophy className="h-10 w-10" />,
      title: "Leaderboards",
      description: "Compete on daily and game-specific leaderboards to show off your knowledge and speed.",
    },
    {
      icon: <Brain className="h-10 w-10" />,
      title: "Educational Focus",
      description: "Special features for verified students, including exclusive educational content.",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-12 py-10">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary w-16 h-16 flex items-center justify-center">
            {feature.icon}
          </div>
          <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
          <p className="text-muted-foreground">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  )
}

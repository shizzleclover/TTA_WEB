"use client"

import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function PricingTable() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      description: "Basic access to daily quizzes",
      features: [
        "Daily global quiz (10 questions)",
        "Basic profile creation",
        "View public leaderboards",
        "Chance to win Premium access",
      ],
      cta: "Sign Up",
      popular: false,
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      description: "Full access to all features",
      features: [
        "Everything in Free tier",
        "Create and join multiplayer lobbies",
        "Upload study materials",
        "Generate custom quizzes",
        "View upcoming quiz themes",
      ],
      cta: "Get Premium",
      popular: true,
    },
    {
      name: "Student",
      price: "$4.99",
      period: "per month",
      description: "Special access for verified students",
      features: [
        "Everything in Premium tier",
        "Verified student status",
        "Access to educational content",
        "Exclusive student-only quizzes",
        "Academic-focused features",
      ],
      cta: "Verify as Student",
      popular: false,
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 py-8">
      {tiers.map((tier, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className={`pricing-card h-full flex flex-col ${tier.popular ? "pricing-card-popular" : ""}`}>
            {tier.popular && (
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Popular
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold">{tier.price}</span>
                {tier.period && <span className="ml-1 text-sm text-muted-foreground">{tier.period}</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{tier.description}</p>
            </div>
            <div className="flex-1 mb-6">
              <ul className="space-y-3">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
              {tier.cta}
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 hero-pattern">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
              >
                Fast-paced educational quizzes
              </motion.div>
              <motion.h1
                className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="gradient-text">Type your answers</span>, compete for the fastest time
              </motion.h1>
              <motion.p
                className="max-w-[600px] text-xl text-muted-foreground md:text-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Text the Answer is a fast-paced, educational quiz platform where users compete by typing answers.
              </motion.p>
              <motion.p
                className="max-w-[600px] text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                Correct spelling and fastest submission time determine winners. Climb the leaderboards and prove your
                knowledge!
              </motion.p>
            </div>
            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link href="/register">
                <Button size="lg" className="w-full min-[400px]:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto">
                  Try Demo
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative w-full aspect-video overflow-hidden rounded-xl border bg-card shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background p-6">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded-lg bg-primary/10"></div>
                  <div className="h-8 w-full max-w-[250px] rounded-lg bg-primary/20"></div>
                </div>
                <div className="mt-8 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-primary/20"></div>
                    <div className="h-4 w-24 rounded-lg bg-primary/10"></div>
                  </div>
                  <div className="h-12 w-full rounded-lg bg-primary/5 p-2">
                    <div className="h-full w-1/3 rounded bg-primary/20"></div>
                  </div>
                </div>
                <div className="absolute bottom-6 right-6">
                  <div className="h-10 w-20 rounded-lg bg-primary"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

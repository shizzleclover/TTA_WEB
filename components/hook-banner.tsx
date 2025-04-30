"use client"

import { motion } from "framer-motion"

export function HookBanner() {
  return (
    <div className="w-full py-8 bg-primary">
      <div className="container px-4 md:px-6">
        <motion.h2
          className="text-center text-xl md:text-2xl lg:text-3xl font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Type your answers, compete for the fastest time, and climb the leaderboards.
        </motion.h2>
      </div>
    </div>
  )
}

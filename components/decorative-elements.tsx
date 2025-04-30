"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function DecorativeElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Large circles */}
      <motion.div
        className="decorative-circle"
        style={{
          width: "300px",
          height: "300px",
          top: "10%",
          left: "-150px",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="decorative-circle"
        style={{
          width: "200px",
          height: "200px",
          bottom: "5%",
          right: "-100px",
        }}
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Squares */}
      <motion.div
        className="decorative-square"
        style={{
          width: "100px",
          height: "100px",
          top: "30%",
          right: "10%",
        }}
        animate={{
          rotate: [0, 45, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="decorative-square"
        style={{
          width: "50px",
          height: "50px",
          bottom: "20%",
          left: "15%",
        }}
        animate={{
          rotate: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Triangles */}
      <motion.div
        className="decorative-triangle"
        style={{
          top: "15%",
          right: "20%",
        }}
        animate={{
          rotate: [0, 360],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />

      {/* Lines */}
      <motion.div
        className="decorative-line"
        style={{
          width: "200px",
          top: "40%",
          left: "5%",
        }}
        animate={{
          scaleX: [1, 1.5, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="decorative-line"
        style={{
          width: "150px",
          bottom: "30%",
          right: "10%",
          transform: "rotate(45deg)",
        }}
        animate={{
          scaleX: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Dots */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="decorative-dot"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Stars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="decorative-star"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

export function TestimonialSection() {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Student",
      content:
        "Text the Answer has completely changed how I study. The daily quizzes keep me engaged and I've seen my grades improve significantly.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Sarah Williams",
      role: "Teacher",
      content:
        "I use Text the Answer to create custom quizzes for my students. It's an incredible tool that makes learning more interactive and fun.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Michael Chen",
      role: "Premium User",
      content:
        "The multiplayer lobbies are addictive! I've made friends while competing in quizzes about topics we're all passionate about.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <section id="testimonials" className="py-20 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-2">
            Testimonials
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What our users say</h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Don't just take our word for it. Here's what people are saying about Text the Answer.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="testimonial-card h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">&ldquo;{testimonial.content}&rdquo;</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

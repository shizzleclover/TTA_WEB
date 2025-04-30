"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, CreditCard, Crown, GraduationCap, Shield, Star, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardNav } from "@/components/dashboard-nav"
import { Badge } from "@/components/ui/badge"

export default function SubscriptionPage() {
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [currentPlan, setCurrentPlan] = useState("premium")
  const [isChangingPlan, setIsChangingPlan] = useState(false)

  const plans = [
    {
      id: "free",
      name: "Free",
      description: "Basic access to daily quizzes",
      price: { monthly: "$0", annually: "$0" },
      features: [
        "Daily global quiz (10 questions)",
        "Basic profile creation",
        "View public leaderboards",
        "Chance to win Premium access",
      ],
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: "premium",
      name: "Premium",
      description: "Full access to all features",
      price: { monthly: "$9.99", annually: "$99.99" },
      features: [
        "Everything in Free tier",
        "Create and join multiplayer lobbies",
        "Upload study materials",
        "Generate custom quizzes",
        "View upcoming quiz themes",
      ],
      icon: <Crown className="h-5 w-5" />,
      popular: true,
    },
    {
      id: "student",
      name: "Student",
      description: "Special access for verified students",
      price: { monthly: "$4.99", annually: "$49.99" },
      features: [
        "Everything in Premium tier",
        "Verified student status",
        "Access to educational content",
        "Exclusive student-only quizzes",
        "Academic-focused features",
      ],
      icon: <GraduationCap className="h-5 w-5" />,
    },
  ]

  const handleChangePlan = (planId: string) => {
    setIsChangingPlan(true)

    // Simulate API call
    setTimeout(() => {
      setCurrentPlan(planId)
      setIsChangingPlan(false)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1">
        <DashboardNav />
        <main className="flex-1 p-6 md:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Subscription</h1>
                <p className="text-muted-foreground">Manage your subscription plan and billing information.</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>You are currently on the {currentPlan} plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        {plans.find((p) => p.id === currentPlan)?.icon || <Crown className="h-5 w-5" />}
                      </div>
                      <div>
                        <h3 className="font-medium capitalize">{currentPlan} Plan</h3>
                        <p className="text-sm text-muted-foreground">
                          {currentPlan === "free"
                            ? "Basic access to daily quizzes"
                            : currentPlan === "premium"
                              ? "Full access to all features"
                              : "Special access for verified students"}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <Badge variant="outline" className="capitalize">
                          {currentPlan}
                        </Badge>
                      </div>
                    </div>
                    {currentPlan !== "free" && (
                      <div className="mt-4 rounded-lg bg-muted p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p>
                              Next billing date: <span className="font-medium">May 15, 2023</span>
                            </p>
                            <p className="text-muted-foreground">
                              You will be charged {billingCycle === "monthly" ? "monthly" : "annually"}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Update Payment
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Change Plan</CardTitle>
                  <CardDescription>Choose a different subscription plan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <Tabs
                      defaultValue="monthly"
                      value={billingCycle}
                      onValueChange={setBillingCycle}
                      className="w-[400px]"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        <TabsTrigger value="annually">
                          Annually
                          <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">
                            Save 15%
                          </Badge>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <RadioGroup className="grid gap-4 md:grid-cols-3">
                    {plans.map((plan) => (
                      <Label
                        key={plan.id}
                        htmlFor={plan.id}
                        className={`flex cursor-pointer flex-col rounded-lg border p-4 ${
                          plan.popular ? "border-primary" : ""
                        } ${currentPlan === plan.id ? "bg-primary/5" : ""}`}
                      >
                        {plan.popular && <Badge className="mb-2 w-fit">Popular</Badge>}
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value={plan.id} id={plan.id} checked={currentPlan === plan.id} />
                          <span className="font-medium">{plan.name}</span>
                        </div>
                        <div className="mt-2 space-y-2">
                          <div className="text-2xl font-bold">
                            {plan.price[billingCycle as keyof typeof plan.price]}
                            {billingCycle === "monthly" && (
                              <span className="text-sm font-normal text-muted-foreground"> /month</span>
                            )}
                            {billingCycle === "annually" && (
                              <span className="text-sm font-normal text-muted-foreground"> /year</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{plan.description}</p>
                          <ul className="space-y-1 pt-2">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Check className="h-4 w-4 text-primary" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={isChangingPlan || currentPlan === "free"}
                    onClick={() => handleChangePlan("free")}
                  >
                    {isChangingPlan ? "Processing..." : "Downgrade to Free"}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>View your past payments and invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border">
                    <div className="grid grid-cols-12 gap-2 border-b p-4 font-medium">
                      <div className="col-span-4">Date</div>
                      <div className="col-span-3">Amount</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-2 text-right">Invoice</div>
                    </div>
                    {currentPlan !== "free" ? (
                      [1, 2, 3].map((i) => (
                        <div key={i} className="grid grid-cols-12 gap-2 border-b p-4 last:border-0">
                          <div className="col-span-4">April {15 - i * 30}, 2023</div>
                          <div className="col-span-3 font-medium">{currentPlan === "premium" ? "$9.99" : "$4.99"}</div>
                          <div className="col-span-3">
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-100"
                            >
                              Paid
                            </Badge>
                          </div>
                          <div className="col-span-2 text-right">
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        No payment history available for free plan
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Manage your billing details and address</CardDescription>
                </CardHeader>
                <CardContent>
                  {currentPlan !== "free" ? (
                    <div className="space-y-4">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                              <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">Payment Method</h3>
                              <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-primary/10 p-2 text-primary">
                              <Shield className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-medium">Billing Address</h3>
                              <p className="text-sm text-muted-foreground">123 Main St, Anytown, CA 12345</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border p-8 text-center">
                      <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 w-fit">
                        <Star className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-medium">No billing information</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        You're currently on the free plan. Upgrade to add billing information.
                      </p>
                      <Button className="mt-4">Upgrade Now</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

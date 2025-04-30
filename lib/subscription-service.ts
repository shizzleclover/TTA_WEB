import { toast } from "@/components/ui/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export interface SubscriptionDetails {
  tier: "free" | "premium" | "student"
  status: "active" | "canceled" | "expired"
  nextBillingDate?: string
  billingCycle?: "monthly" | "annually"
  paymentMethod?: {
    type: string
    last4?: string
    expiryDate?: string
  }
}

export interface PaymentHistory {
  id: string
  date: string
  amount: string
  status: "paid" | "failed" | "refunded"
  invoiceUrl?: string
}

export const subscriptionService = {
  async getSubscriptionDetails(): Promise<SubscriptionDetails | null> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/api/subscription/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch subscription details")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching subscription details:", error)
      toast({
        title: "Error",
        description: "Failed to load subscription details. Please try again later.",
        variant: "destructive",
      })
      return null
    }
  },

  async getPaymentHistory(): Promise<PaymentHistory[]> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/api/subscription/payment-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch payment history")
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching payment history:", error)
      toast({
        title: "Error",
        description: "Failed to load payment history. Please try again later.",
        variant: "destructive",
      })
      return []
    }
  },

  async initiateCheckout(plan: string, billingCycle: "monthly" | "annually"): Promise<{ checkoutUrl: string } | null> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/api/subscription/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan, billingCycle }),
      })

      if (!response.ok) {
        throw new Error("Failed to initiate checkout")
      }

      return await response.json()
    } catch (error) {
      console.error("Error initiating checkout:", error)
      toast({
        title: "Error",
        description: "Failed to initiate checkout. Please try again later.",
        variant: "destructive",
      })
      return null
    }
  },

  async cancelSubscription(): Promise<boolean> {
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/api/subscription/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to cancel subscription")
      }

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Subscription Canceled",
          description: "Your subscription has been canceled successfully.",
        })
        return true
      } else {
        throw new Error(result.message || "Failed to cancel subscription")
      }
    } catch (error) {
      console.error("Error canceling subscription:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel subscription. Please try again later.",
        variant: "destructive",
      })
      return false
    }
  },
}

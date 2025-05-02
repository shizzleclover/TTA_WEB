import { toast } from "@/components/ui/use-toast"

// Ensure API_BASE_URL has a valid default and log what we're using
const API_BASE_URL = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
  console.info(`Using API base URL: ${url}`);
  return url;
})();

// Function to get loading context - will be called inside API methods
const getLoadingFunctions = () => {
  // Check if we're on the client side
  if (typeof window !== "undefined") {
    try {
      // Dynamically import loading context
      const loadingModule = require("@/hooks/use-loading");
      const loadingContext = loadingModule.__GLOBAL_LOADING_CONTEXT;
      
      if (loadingContext) {
        return {
          startLoading: loadingContext.startLoading,
          stopLoading: loadingContext.stopLoading
        };
      }
    } catch (e) {
      // Handle any import errors silently
      console.debug("Loading context not initialized yet");
    }
  }
  
  // Return dummy functions if context isn't available
  return {
    startLoading: (message?: string) => {},
    stopLoading: () => {}
  };
};

export interface CheckoutParams {
  plan: "premium" | "student";
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutResponse {
  success: boolean;
  sessionId: string;
  url: string;
  message?: string;
}

export interface SubscriptionDetails {
  status: "free" | "premium" | "education";
  stripeCustomerId?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  features?: string[];
}

export interface SubscriptionDetailsResponse {
  success: boolean;
  subscription: SubscriptionDetails;
  message?: string;
}

export interface AwardFreeMonthsParams {
  userId: string;
  months: number;
}

export const subscriptionService = {
  async createCheckoutSession(params: CheckoutParams): Promise<CheckoutResponse> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Creating checkout session...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/subscription/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create checkout session");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create checkout session. Please try again later.",
        variant: "destructive",
      });
      return {
        success: false,
        sessionId: "",
        url: "",
        message: "Failed to create checkout session"
      };
    } finally {
      stopLoading();
    }
  },

  async getSubscriptionDetails(): Promise<SubscriptionDetailsResponse> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading subscription details...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/subscription/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch subscription details");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching subscription details:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load subscription details. Please try again later.",
        variant: "destructive",
      });
      return {
        success: false,
        subscription: {
          status: "free"
        },
        message: "Failed to fetch subscription details"
      };
    } finally {
      stopLoading();
    }
  },

  async cancelSubscription(): Promise<{ success: boolean; message?: string; currentPeriodEnd?: string }> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Cancelling subscription...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/subscription/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel subscription");
      }

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Subscription Cancelled",
          description: data.message || "Your subscription has been cancelled successfully.",
        });
      }
      
      return data;
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel subscription. Please try again later.",
        variant: "destructive",
      });
      return {
        success: false,
        message: "Failed to cancel subscription"
      };
    } finally {
      stopLoading();
    }
  },

  async awardFreeMonths(params: AwardFreeMonthsParams): Promise<{ success: boolean; message?: string; expiryDate?: string }> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Awarding free months...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/subscription/award-free-month`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to award free months");
      }

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Free Months Awarded",
          description: data.message || "Free premium months have been awarded successfully.",
        });
      }
      
      return data;
    } catch (error) {
      console.error("Error awarding free months:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to award free months. Please try again later.",
        variant: "destructive",
      });
      return {
        success: false,
        message: "Failed to award free months"
      };
    } finally {
      stopLoading();
    }
  }
}

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

export interface UserProfile {
  _id: string
  name: string
  email: string
  bio: string
  location?: string
  avatar?: string
  imageUrl?: string
  createdAt: string
  subscription: {
    status: "free" | "premium" | "education"
    expiresAt: string | null
    features?: string[]
  }
  stats: {
    totalAnswered: number
    totalCorrect: number
    streak: number
    lastPlayed: string
    badges?: string[]
  }
  preferences?: {
    notifications: boolean
    shareActivity: boolean
    theme: "dark" | "light"
  }
  education?: {
    isStudent: boolean
    verificationStatus: "pending" | "verified" | "rejected"
    studentEmail: string
    yearOfStudy: number
  }
}

export interface ProfileResponse {
  success: boolean
  user: UserProfile
}

export interface ProfileUpdateData {
  name?: string;
  bio?: string;
  location?: string;
}

export interface ProfileCreateData {
  bio?: string;
  location?: string;
}

export const profileService = {
  async getFullProfile(): Promise<UserProfile | null> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Loading your profile...");
    
    try {
      const token = localStorage.getItem("auth_token")
      console.log("Fetching profile with token:", token ? "Token exists" : "No token found");
      console.log("API URL for profile:", `${API_BASE_URL}/profile/full`);

      const response = await fetch(`${API_BASE_URL}/profile/full`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      console.log("Profile request status:", response.status, response.statusText);
      
      if (!response.ok) {
        console.error("Profile fetch failed with status:", response.status);
        let errorText;
        try {
          errorText = await response.text();
          console.error("Error response:", errorText);
        } catch (e) {
          console.error("Could not read error response text");
        }
        
        // Return default profile data instead of null for better UI experience
        return {
          _id: "unknown",
          name: "User",
          email: "user@example.com",
          bio: "",
          createdAt: new Date().toISOString(),
          subscription: {
            status: "free",
            expiresAt: null
          },
          stats: {
            totalAnswered: 0,
            totalCorrect: 0,
            streak: 0,
            lastPlayed: new Date().toISOString()
          }
        };
      }

      let data;
      try {
        data = await response.json();
        console.log("Profile data received:", data);
      } catch (parseError) {
        console.error("Failed to parse profile response:", parseError);
        return {
          _id: "parse-error",
          name: "Profile Error",
          email: "error@example.com",
          bio: "There was an error parsing the profile data",
          createdAt: new Date().toISOString(),
          subscription: {
            status: "free",
            expiresAt: null
          },
          stats: {
            totalAnswered: 0,
            totalCorrect: 0,
            streak: 0,
            lastPlayed: new Date().toISOString()
          }
        };
      }
      
      // Check if data is empty or undefined
      if (!data || Object.keys(data).length === 0) {
        console.error("Empty profile data received");
        return {
          _id: "empty-data",
          name: "Empty Profile",
          email: "empty@example.com",
          bio: "Empty profile data was received",
          createdAt: new Date().toISOString(),
          subscription: {
            status: "free",
            expiresAt: null
          },
          stats: {
            totalAnswered: 0,
            totalCorrect: 0,
            streak: 0,
            lastPlayed: new Date().toISOString()
          }
        };
      }
      
      if (!data.success || !data.user) {
        console.error("Invalid profile data received:", data);
        
        // Return default profile data instead of null for better UI experience
        return {
          _id: "unknown",
          name: "Guest User",
          email: "guest@example.com",
          bio: "",
          createdAt: new Date().toISOString(),
          subscription: {
            status: "free",
            expiresAt: null
          },
          stats: {
            totalAnswered: 0,
            totalCorrect: 0,
            streak: 0,
            lastPlayed: new Date().toISOString()
          }
        };
      }
      
      return data.user;
    } catch (error) {
      console.error("Profile fetch error:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Using default data for now.",
        variant: "destructive",
      });
      
      // Return default profile data instead of null for better UI experience
      return {
        _id: "default",
        name: "Default User",
        email: "default@example.com",
        bio: "",
        createdAt: new Date().toISOString(),
        subscription: {
          status: "free",
          expiresAt: null
        },
        stats: {
          totalAnswered: 0,
          totalCorrect: 0,
          streak: 0,
          lastPlayed: new Date().toISOString()
        }
      };
    } finally {
      stopLoading();
    }
  },
  
  async createProfile(profileData: ProfileCreateData): Promise<{success: boolean; message?: string; profile?: any}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Creating your profile...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/profile/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create profile");
      }

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Profile Created",
          description: data.message || "Your profile has been created successfully.",
        });
      }
      
      return data;
    } catch (error) {
      console.error("Profile creation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create profile. Please try again later.",
        variant: "destructive",
      });
      return { success: false, message: "Failed to create profile" };
    } finally {
      stopLoading();
    }
  },
  
  async updateProfile(profileData: ProfileUpdateData): Promise<{success: boolean; message?: string; user?: UserProfile}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Updating your profile...");
    
    try {
      const token = localStorage.getItem("auth_token")
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Profile Updated",
          description: data.message || "Your profile has been updated successfully.",
        });
      }
      
      return data;
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again later.",
        variant: "destructive",
      });
      return { success: false, message: "Failed to update profile" };
    } finally {
      stopLoading();
    }
  },
  
  async uploadProfileImage(file: File): Promise<{success: boolean; imageUrl?: string; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Uploading profile image...");
    
    try {
      const token = localStorage.getItem("auth_token")
      
      const formData = new FormData();
      formData.append("image", file);
      
      const response = await fetch(`${API_BASE_URL}/profile/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload profile image");
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Image Uploaded",
          description: "Your profile image has been uploaded successfully.",
        });
      }
      
      return data;
    } catch (error) {
      console.error("Profile image upload error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload profile image. Please try again later.",
        variant: "destructive",
      });
      return { success: false, message: "Failed to upload profile image" };
    } finally {
      stopLoading();
    }
  },
  
  async deleteProfileImage(): Promise<{success: boolean; message?: string}> {
    const { startLoading, stopLoading } = getLoadingFunctions();
    startLoading("Deleting profile image...");
    
    try {
      const token = localStorage.getItem("auth_token")
      
      const response = await fetch(`${API_BASE_URL}/profile/image`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete profile image");
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Image Deleted",
          description: data.message || "Your profile image has been deleted successfully.",
        });
      }
      
      return data;
    } catch (error) {
      console.error("Profile image deletion error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete profile image. Please try again later.",
        variant: "destructive",
      });
      return { success: false, message: "Failed to delete profile image" };
    } finally {
      stopLoading();
    }
  }
}
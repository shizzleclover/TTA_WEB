"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Create a global reference that can be accessed by service modules
let __GLOBAL_LOADING_CONTEXT: LoadingContextType | undefined;

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>(undefined);

  const startLoading = (loadingMessage?: string) => {
    setMessage(loadingMessage);
    setLoading(true);
  };

  const stopLoading = () => {
    setLoading(false);
    setMessage(undefined);
  };

  // Create the context value object
  const contextValue = {
    isLoading: loading,
    startLoading,
    stopLoading,
  };

  // Store a reference to the context value
  __GLOBAL_LOADING_CONTEXT = contextValue;

  return (
    <LoadingContext.Provider value={contextValue}>
      <AnimatePresence>
        {loading && <LoadingSpinner fullscreen size="lg" message={message} />}
      </AnimatePresence>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  
  return context;
};

// Export the global context reference for use in service modules
export { __GLOBAL_LOADING_CONTEXT };
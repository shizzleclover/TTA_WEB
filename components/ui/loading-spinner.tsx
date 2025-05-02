import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullscreen?: boolean;
  message?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className,
  fullscreen = false,
  message,
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const spinner = (
    <motion.div
      className={cn(
        "flex flex-col items-center justify-center",
        fullscreen ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50" : "",
        className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={cn("text-primary", sizeClasses[size])} />
      </motion.div>
      {message && <p className="text-sm text-muted-foreground mt-2">{message}</p>}
    </motion.div>
  );

  return spinner;
};

export default LoadingSpinner;
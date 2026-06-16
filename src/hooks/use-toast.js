"use client";
import { useContext } from "react";

// Import the ToastProvider context - this will be provided by the ToastProvider component
// For now, we'll create a wrapper that calls the notify function with the proper API

export const useToast = () => {
  // Get access to the window object to trigger a custom event
  // This is a workaround for when ToastProvider context isn't directly available

  return {
    toast: ({
      title = "",
      description = "",
      variant = "default",
    }) => {
      const message = title ? `${title}: ${description}` : description;
      const type =
        variant === "destructive"
          ? "error"
          : variant === "default"
            ? "success"
            : "info";

      // Dispatch a custom event for toast notifications
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("show-toast", {
            detail: { message, type },
          })
        );
      }
    },
  };
};


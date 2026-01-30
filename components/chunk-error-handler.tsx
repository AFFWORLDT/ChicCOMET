"use client"

import { useEffect } from "react"

export function ChunkErrorHandler() {
  useEffect(() => {
    // Handle chunk loading errors
    const handleChunkError = (event: ErrorEvent) => {
      const error = event.error
      
      // Check if it's a chunk loading error
      if (
        error?.name === "ChunkLoadError" ||
        error?.message?.includes("Loading chunk") ||
        error?.message?.includes("Failed to fetch dynamically imported module")
      ) {
        console.warn("Chunk loading error detected, reloading page...")
        
        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    }

    // Handle unhandled promise rejections (chunk loading errors often appear here)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      
      if (
        reason?.name === "ChunkLoadError" ||
        reason?.message?.includes("Loading chunk") ||
        reason?.message?.includes("Failed to fetch dynamically imported module")
      ) {
        console.warn("Chunk loading error detected in promise rejection, reloading page...")
        event.preventDefault()
        
        // Reload the page after a short delay
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    }

    // Add event listeners
    window.addEventListener("error", handleChunkError)
    window.addEventListener("unhandledrejection", handleUnhandledRejection)

    // Cleanup
    return () => {
      window.removeEventListener("error", handleChunkError)
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [])

  return null
}


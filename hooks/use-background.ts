"use client"

import { useState, useEffect } from "react"

// A unique name for our custom event
const EVENT_NAME = "flashquest-bg-change"

export function useBackground() {
  // 1. Initialize state safely
  const [activeBackground, setActiveBackground] = useState<string>("default")
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>(["default"])
  const [mounted, setMounted] = useState(false)

  // 2. Load data on startup AND listen for changes
  useEffect(() => {
    setMounted(true)
    
    // Helper to read from storage
    const loadFromStorage = () => {
      const storedActive = localStorage.getItem("flashquest-active-bg")
      const storedOwned = localStorage.getItem("flashquest-owned-bgs")
      
      if (storedActive) setActiveBackground(storedActive)
      if (storedOwned) setOwnedBackgrounds(JSON.parse(storedOwned))
    }

    // Load immediately
    loadFromStorage()

    // LISTEN: If another component changes the background, update this one too!
    window.addEventListener(EVENT_NAME, loadFromStorage)
    
    // Cleanup listener when component dies
    return () => window.removeEventListener(EVENT_NAME, loadFromStorage)
  }, [])

  const buyBackground = (id: string) => {
    const newOwned = [...ownedBackgrounds, id]
    setOwnedBackgrounds(newOwned)
    localStorage.setItem("flashquest-owned-bgs", JSON.stringify(newOwned))
    // Notify other components
    window.dispatchEvent(new Event(EVENT_NAME))
  }

  const equipBackground = (id: string) => {
    setActiveBackground(id)
    localStorage.setItem("flashquest-active-bg", id)
    // Notify other components (This fixes your bug!)
    window.dispatchEvent(new Event(EVENT_NAME))
  }

  return {
    activeBackground: mounted ? activeBackground : "default",
    ownedBackgrounds: mounted ? ownedBackgrounds : ["default"],
    buyBackground,
    equipBackground,
  }
}
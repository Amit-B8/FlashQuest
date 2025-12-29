"use client"

import { useState, useEffect } from "react"

export function useBackground() {
  const [ownedBackgrounds, setOwnedBackgrounds] = useState<string[]>(["default"])
  const [activeBackground, setActiveBackground] = useState<string>("default")

  useEffect(() => {
    const savedOwned = localStorage.getItem("flashquest-backgrounds-owned")
    const savedActive = localStorage.getItem("flashquest-background-active")
    
    if (savedOwned) setOwnedBackgrounds(JSON.parse(savedOwned))
    if (savedActive) setActiveBackground(savedActive)
  }, [])

  const buyBackground = (id: string) => {
    if (!ownedBackgrounds.includes(id)) {
      const newOwned = [...ownedBackgrounds, id]
      setOwnedBackgrounds(newOwned)
      localStorage.setItem("flashquest-backgrounds-owned", JSON.stringify(newOwned))
      // Optional: Auto-equip on buy
      setActiveBackground(id)
      localStorage.setItem("flashquest-background-active", id)
    }
  }

  const equipBackground = (id: string) => {
    if (ownedBackgrounds.includes(id)) {
      // Toggle logic: If clicking the active one, revert to default, otherwise set new
      const newBg = activeBackground === id ? "default" : id
      setActiveBackground(newBg)
      localStorage.setItem("flashquest-background-active", newBg)
    }
  }

  return { ownedBackgrounds, activeBackground, buyBackground, equipBackground }
}
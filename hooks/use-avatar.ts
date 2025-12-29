"use client"

import { useState, useEffect } from "react"

// This allows you to check if a specific avatar is owned
export function useAvatar() {
  const [ownedAvatars, setOwnedAvatars] = useState<string[]>(["default"]) // Everyone starts with 'default'
  const [currentAvatar, setCurrentAvatar] = useState<string>("default")

  useEffect(() => {
    // Load saved data
    const savedOwned = localStorage.getItem("flashquest-avatars-owned")
    const savedCurrent = localStorage.getItem("flashquest-avatar-current")
    
    if (savedOwned) setOwnedAvatars(JSON.parse(savedOwned))
    if (savedCurrent) setCurrentAvatar(savedCurrent)
  }, [])

  const buyAvatar = (id: string) => {
    if (!ownedAvatars.includes(id)) {
      const newOwned = [...ownedAvatars, id]
      setOwnedAvatars(newOwned)
      localStorage.setItem("flashquest-avatars-owned", JSON.stringify(newOwned))
    }
  }

  const equipAvatar = (id: string) => {
    if (ownedAvatars.includes(id)) {
      setCurrentAvatar(id)
      localStorage.setItem("flashquest-avatar-current", id)
    }
  }

  return { ownedAvatars, currentAvatar, buyAvatar, equipAvatar }
}
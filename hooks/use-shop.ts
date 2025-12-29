"use client"

import { useState, useEffect } from "react"

export function useShop() {
  const [unlockedGames, setUnlockedGames] = useState<string[]>([])

  // 1. LOAD: Check storage when app starts
  useEffect(() => {
    const stored = localStorage.getItem("flashquest-shop")
    if (stored) {
      setUnlockedGames(JSON.parse(stored))
    }
  }, [])

  // 2. UNLOCK: Adds a game to the list
  const unlockGame = (gameId: string) => {
    if (!unlockedGames.includes(gameId)) {
      const newUnlocked = [...unlockedGames, gameId]
      setUnlockedGames(newUnlocked)
      localStorage.setItem("flashquest-shop", JSON.stringify(newUnlocked))
    }
  }

  // 3. LOCK: Removes a game from the list (The missing piece!)
  const lockGame = (gameId: string) => {
    const newUnlocked = unlockedGames.filter((id) => id !== gameId)
    setUnlockedGames(newUnlocked)
    localStorage.setItem("flashquest-shop", JSON.stringify(newUnlocked))
  }

  // 4. RETURN: Make sure 'lockGame' is in this list!
  return { unlockedGames, unlockGame, lockGame }
}
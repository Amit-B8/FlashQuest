"use client"

import { useState, useEffect } from "react"

export function useShop() {
  const [unlockedGames, setUnlockedGames] = useState<string[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("flashquest-unlocked-games")
    if (stored) {
      setUnlockedGames(JSON.parse(stored))
    }
  }, [])

  const unlockGame = (gameId: string) => {
    const newUnlocked = [...unlockedGames, gameId]
    setUnlockedGames(newUnlocked)
    localStorage.setItem("flashquest-unlocked-games", JSON.stringify(newUnlocked))
  }

  return { unlockedGames, unlockGame }
}

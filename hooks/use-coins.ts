"use client"

import { useState, useEffect } from "react"

export function useCoins() {
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem("flashquest-coins")
    if (stored) {
      setCoins(Number.parseInt(stored, 10))
    }
  }, [])

  const addCoins = (amount: number) => {
    const newTotal = coins + amount
    setCoins(newTotal)
    localStorage.setItem("flashquest-coins", newTotal.toString())
  }

  const removeCoins = (amount: number) => {
    const newTotal = Math.max(0, coins - amount)
    setCoins(newTotal)
    localStorage.setItem("flashquest-coins", newTotal.toString())
  }

  return { coins, addCoins, removeCoins }
}

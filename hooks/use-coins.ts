"use client"

import { useState, useEffect } from "react"

export function useCoins() {
  const [coins, setCoins] = useState(0)

  // 1. LOAD: Run this once when the game loads
  useEffect(() => {
    const stored = localStorage.getItem("flashquest-coins")
    if (stored) {
      setCoins(parseInt(stored, 10))
    }
  }, [])

  // 2. SAVE (Add): We use 'prev' to make sure we have the latest number
  const addCoins = (amount: number) => {
    setCoins((prevCoins) => {
      const newTotal = prevCoins + amount
      localStorage.setItem("flashquest-coins", newTotal.toString())
      return newTotal
    })
  }

  // 3. SAVE (Remove): Same here, using 'prevCoins' is safer
  const removeCoins = (amount: number) => {
    setCoins((prevCoins) => {
      // Math.max(0, ...) ensures we never go below zero
      const newTotal = Math.max(0, prevCoins - amount)
      localStorage.setItem("flashquest-coins", newTotal.toString())
      return newTotal
    })
  }

  return { coins, addCoins, removeCoins }
}
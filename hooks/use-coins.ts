"use client"

import { useState, useEffect } from "react"

export function useCoins() {
  const [coins, setCoins] = useState(0)

  // Function to read from storage
  const getCoins = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("flashquest-coins")
      return saved ? parseInt(saved) : 0
    }
    return 0
  }

  // 1. Listen for changes so Shop updates instantly
  useEffect(() => {
    // Load initial
    setCoins(getCoins())

    // Create a listener for when coins change anywhere in the app
    const handleStorageChange = () => setCoins(getCoins())
    
    // Listen for our custom event
    window.addEventListener("coins-updated", handleStorageChange)
    
    return () => window.removeEventListener("coins-updated", handleStorageChange)
  }, [])

  const addCoins = (amount: number) => {
    const current = getCoins()
    const newAmount = current + amount
    localStorage.setItem("flashquest-coins", newAmount.toString())
    setCoins(newAmount)
    
    // BROADCAST the change to the Shop component
    window.dispatchEvent(new Event("coins-updated"))
  }

  const removeCoins = (amount: number) => {
    addCoins(-amount)
  }

  return { coins, addCoins, removeCoins }
}
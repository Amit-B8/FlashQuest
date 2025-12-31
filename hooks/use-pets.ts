"use client"

import { useState, useEffect } from "react"
import { PETS } from "@/lib/data"
import { useCoins } from "./use-coins"

type PetStatus = {
  id: string
  deathTime: number 
}

export function usePets() {
  const { coins, addCoins } = useCoins()
  const [ownedPets, setOwnedPets] = useState<PetStatus[]>([])
  const [isLoaded, setIsLoaded] = useState(false) // <--- NEW: Prevents overwriting data

  // 1. LOAD DATA ON START
  useEffect(() => {
    const saved = localStorage.getItem("flashquest-pets")
    if (saved) {
      try {
        setOwnedPets(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse pets", e)
      }
    }
    setIsLoaded(true) // <--- Mark as loaded
  }, [])

  // 2. SAVE DATA (Only if loaded!)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("flashquest-pets", JSON.stringify(ownedPets))
    }
  }, [ownedPets, isLoaded])

  const buyPet = (id: string) => {
    const petData = PETS.find(p => p.id === id)
    if (!petData) return false

    // Check coins
    if (coins < petData.price) {
      alert("Not enough coins!")
      return false
    }

    // Check if already owned
    if (ownedPets.some(p => p.id === id)) {
      return false
    }

    const twentyHours = 20 * 60 * 60 * 1000
    const newPet: PetStatus = {
      id,
      deathTime: Date.now() + twentyHours
    }
    
    // Deduct coins and Add Pet
    addCoins(-petData.price)
    setOwnedPets((prev) => [...prev, newPet])
    return true
  }

  const feedPet = (id: string) => {
    const cost = 10
    if (coins < cost) {
      alert("Not enough coins to feed!")
      return
    }

    addCoins(-cost)
    
    setOwnedPets((prev) => prev.map(p => {
      if (p.id === id) {
        if (Date.now() > p.deathTime) return p 
        return { ...p, deathTime: p.deathTime + (30 * 60 * 1000) }
      }
      return p
    }))
  }

  const revivePet = (id: string) => {
    const petData = PETS.find(p => p.id === id)
    if (!petData) return

    const reviveCost = Math.floor(petData.price / 2)
    
    if (coins < reviveCost) {
      alert(`Not enough coins! You need ${reviveCost} coins to revive.`)
      return
    }

    setOwnedPets((prev) => prev.map(p => {
      if (p.id === id) {
        const twentyHours = 20 * 60 * 60 * 1000
        addCoins(-reviveCost)
        return { ...p, deathTime: Date.now() + twentyHours }
      }
      return p
    }))
  }

  const isPetAlive = (deathTime: number) => Date.now() < deathTime

  return { ownedPets, buyPet, feedPet, revivePet, isPetAlive }
}
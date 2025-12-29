"use client"

import { useState, useEffect } from "react"

// 1. DEFINE THE TYPES HERE (Removes the red line)
export type Flashcard = {
  question: string
  answer: string
}

export type FlashcardSet = {
  id: string
  name: string
  cards: Flashcard[]
}

export function useSets() {
  const [sets, setSets] = useState<FlashcardSet[]>([])

  // Load data when the component starts
  useEffect(() => {
    const stored = localStorage.getItem("flashquest-sets")
    if (stored) {
      setSets(JSON.parse(stored))
    }
  }, [])

  // Helper to save to state AND local storage at the same time
  const saveSets = (newSets: FlashcardSet[]) => {
    setSets(newSets)
    localStorage.setItem("flashquest-sets", JSON.stringify(newSets))
  }

  const addSet = (set: FlashcardSet) => {
    const newSets = [...sets, set]
    saveSets(newSets)
  }

  const removeSet = (id: string) => {
    const newSets = sets.filter((s) => s.id !== id)
    saveSets(newSets)
  }

  // --- NEW: RENAME FUNCTION ---
  const renameSet = (id: string, newName: string) => {
    const newSets = sets.map((s) => 
      // If IDs match, update the name. Otherwise, keep it the same.
      s.id === id ? { ...s, name: newName } : s
    )
    saveSets(newSets)
  }

  return { sets, addSet, removeSet, renameSet }
}
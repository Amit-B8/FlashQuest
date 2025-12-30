"use client"

import { useState, useEffect } from "react"

export type Flashcard = {
  question: string
  answer: string
}

export type FlashcardSet = {
  id: string
  name: string
  cards: Flashcard[]
}

// --- 1. DEFINE THE DEFAULT SET HERE ---
const DEFAULT_SET: FlashcardSet = {
  id: "demo-set",
  name: "🚀 Start Here: Demo",
  cards: [
    { question: "What is Iron Man's real name?", answer: "Tony Stark" },
    { question: "What is the name of the basketball team in Illinois?", answer: "Chicago Bulls" },
    { question: "What is 12 x 12?", answer: "144" },
    { question: "What is the chemical formula for water?", answer: "H2O" },
    { question: "What is the capital of France?", answer: "Paris" }
  ]
}

export function useSets() {
  const [sets, setSets] = useState<FlashcardSet[]>([])

  // --- 2. UPDATE INITIALIZATION LOGIC ---
  useEffect(() => {
    // Check if running in browser
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("flashquest-sets")
      
      if (stored) {
        // If user has data, load it
        setSets(JSON.parse(stored))
      } else {
        // If user is NEW, load the Default Set and save it
        const initialSets = [DEFAULT_SET]
        setSets(initialSets)
        localStorage.setItem("flashquest-sets", JSON.stringify(initialSets))
      }
    }
  }, [])

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

  const renameSet = (id: string, newName: string) => {
    const newSets = sets.map((s) => 
      s.id === id ? { ...s, name: newName } : s
    )
    saveSets(newSets)
  }

  const addCardToSet = (setId: string, card: Flashcard) => {
    const newSets = sets.map((s) => 
      s.id === setId ? { ...s, cards: [...s.cards, card] } : s
    )
    saveSets(newSets)
  }

  const updateCard = (setId: string, cardIndex: number, newCard: Flashcard) => {
    const newSets = sets.map((s) => {
      if (s.id === setId) {
        const newCards = [...s.cards]
        newCards[cardIndex] = newCard
        return { ...s, cards: newCards }
      }
      return s
    })
    saveSets(newSets)
  }

  const deleteCard = (setId: string, cardIndex: number) => {
    const newSets = sets.map((s) => {
      if (s.id === setId) {
        const newCards = s.cards.filter((_, i) => i !== cardIndex)
        return { ...s, cards: newCards }
      }
      return s
    })
    saveSets(newSets)
  }

  return { sets, addSet, removeSet, renameSet, addCardToSet, updateCard, deleteCard }
}
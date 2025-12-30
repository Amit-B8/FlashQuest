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

export function useSets() {
  const [sets, setSets] = useState<FlashcardSet[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("flashquest-sets")
    if (stored) {
      setSets(JSON.parse(stored))
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

  // --- NEW: EDIT A SPECIFIC CARD ---
  const updateCard = (setId: string, cardIndex: number, newCard: Flashcard) => {
    const newSets = sets.map((s) => {
      if (s.id === setId) {
        const newCards = [...s.cards]
        newCards[cardIndex] = newCard // Update the specific card
        return { ...s, cards: newCards }
      }
      return s
    })
    saveSets(newSets)
  }

  // --- NEW: DELETE A SPECIFIC CARD ---
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
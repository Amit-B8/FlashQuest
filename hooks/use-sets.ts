"use client"

import { useState, useEffect } from "react"
import type { FlashcardSet } from "@/app/page"

export function useSets() {
  const [sets, setSets] = useState<FlashcardSet[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("flashquest-sets")
    if (stored) {
      setSets(JSON.parse(stored))
    }
  }, [])

  const addSet = (set: FlashcardSet) => {
    const newSets = [...sets, set]
    setSets(newSets)
    localStorage.setItem("flashquest-sets", JSON.stringify(newSets))
  }

  return { sets, addSet }
}

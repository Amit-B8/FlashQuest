"use client"

import { useState } from "react"
import { HomeScreen } from "@/components/home-screen"
import { CreateSet } from "@/components/create-set"
import { TestMode } from "@/components/test-mode"
import { Shop } from "@/components/shop"
import { MemoryGame } from "@/components/memory-game"

export type FlashcardSet = {
  id: string
  name: string
  cards: { question: string; answer: string }[]
}

export type Screen = "home" | "create" | "test" | "shop" | "memory-game"

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home")

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {screen === "home" && <HomeScreen onNavigate={setScreen} />}
      {screen === "create" && <CreateSet onBack={() => setScreen("home")} />}
      {screen === "test" && <TestMode onBack={() => setScreen("home")} />}
      {screen === "shop" && <Shop onBack={() => setScreen("home")} onPlayGame={(game) => setScreen(game as Screen)} />}
      {screen === "memory-game" && <MemoryGame onBack={() => setScreen("shop")} />}
    </main>
  )
  
}

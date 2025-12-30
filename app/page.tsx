"use client"

import { useState } from "react"
import { MemoryGame } from "@/components/memory-game"
import { HomeScreen } from "@/components/home-screen"
import { CreateSet } from "@/components/create-set"
import { QuizMode } from "@/components/quiz-mode"
import { Shop } from "@/components/shop"
import { BACKGROUNDS } from "@/lib/data"
import { useBackground } from "@/hooks/use-background"

export type Screen = "home" | "create" | "test" | "shop" | "memory-game"

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const { activeBackground } = useBackground()

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen)
  }

  const handlePlayGame = (gameId: string) => {
    if (gameId === "memory-game") {
        setCurrentScreen("memory-game")
    }
  }

  const renderBackground = () => {
    const bgItem = BACKGROUNDS.find(b => b.id === activeBackground)
    const bgClass = bgItem ? bgItem.class : "bg-gradient-to-br from-blue-50 to-purple-50"
    return <div className={`fixed inset-0 ${bgClass} -z-50 transition-colors duration-500`} />
  }

  return (
    // 1. CHANGED: Added flex-col so footer pushes to bottom naturally
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {renderBackground()}

      {/* 2. WRAPPER: flex-1 ensures this takes up all available space, pushing footer down */}
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        {currentScreen === "home" && <HomeScreen onNavigate={navigateTo} />}
        {currentScreen === "create" && <CreateSet onBack={() => navigateTo("home")} />}
        {currentScreen === "test" && <QuizMode onBack={() => navigateTo("home")} />}
        {currentScreen === "shop" && <Shop onBack={() => navigateTo("home")} onPlayGame={handlePlayGame} />}
        {currentScreen === "memory-game" && <MemoryGame onBack={() => navigateTo("shop")} />}
      </div>

      {/* 3. REAL FOOTER: Sits below content, center aligned, darker text */}
      <footer className="py-6 text-center z-10">
         <p className="font-medium text-sm text-black/60">
            Built with Next.js and Tailwind CSS. © 2025 Amit Boodhoo.
         </p>
      </footer>

    </main>
  )
}
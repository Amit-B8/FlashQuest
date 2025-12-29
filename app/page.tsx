"use client"

import { useState } from "react"
import { HomeScreen } from "@/components/home-screen"
import { CreateSet } from "@/components/create-set"
import { QuizMode } from "@/components/quiz-mode"
import { Shop } from "@/components/shop"
import { BACKGROUNDS } from "@/lib/data" // Import data
import { useBackground } from "@/hooks/use-background" // Import hook

export type Screen = "home" | "create" | "test" | "shop"

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [selectedGame, setSelectedGame] = useState<string | null>(null)
  
  // 1. GLOBAL BACKGROUND LOGIC
  const { activeBackground } = useBackground()
  
  const renderBackground = () => {
    const bgItem = BACKGROUNDS.find(b => b.id === activeBackground)
    const bgClass = bgItem ? bgItem.class : "bg-gradient-to-br from-blue-50 to-purple-50"
    // Fixed: z-0 puts it behind content, fixed inset-0 stretches it to full screen
    return <div className={`fixed inset-0 ${bgClass} -z-50 transition-colors duration-500`} />
  }

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen)
    setSelectedGame(null)
  }

  const handlePlayGame = (gameId: string) => {
    console.log(`Playing game: ${gameId}`)
    // Add logic here if you have minigames screens later
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* 2. RENDER IT ONCE HERE FOR EVERYONE */}
      {renderBackground()}

      {currentScreen === "home" && <HomeScreen onNavigate={navigateTo} />}
      {currentScreen === "create" && <CreateSet onBack={() => navigateTo("home")} />}
      {currentScreen === "test" && <QuizMode onBack={() => navigateTo("home")} />}
      {currentScreen === "shop" && <Shop onBack={() => navigateTo("home")} onPlayGame={handlePlayGame} />}
    </main>
  )
}
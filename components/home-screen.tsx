"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Trophy, ShoppingBag, Sparkles } from "lucide-react"
import { useCoins } from "@/hooks/use-coins"
import { useSets } from "@/hooks/use-sets"
// 1. Make sure this import is here
import { useAvatar } from "@/hooks/use-avatar"
import type { Screen } from "@/app/page"

type HomeScreenProps = {
  onNavigate: (screen: Screen) => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { coins } = useCoins()
  const { sets } = useSets()
  
  // 2. Get the current avatar from the hook
  const { currentAvatar } = useAvatar()

  // 3. Helper function to get the emoji based on ID
  const getAvatarEmoji = (id: string) => {
    switch (id) {
      case 'robot': return '🤖'
      case 'ninja': return '🥷'
      case 'alien': return '👽'
      case 'king':  return '👑'
      default:      return '🙂' // Default face
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      
      {/* 4. NEW: Top Right Avatar Display */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <span className="font-bold text-gray-700 hidden sm:inline">Player</span>
        <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-300 flex items-center justify-center text-2xl shadow-sm cursor-pointer hover:scale-110 transition-transform" 
             onClick={() => onNavigate("shop")} // Optional: Clicking face goes to shop
             title="Go to Shop to change avatar"
        >
           {getAvatarEmoji(currentAvatar)}
        </div>
      </div>

      <div className="text-center mb-12 space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Sparkles className="w-12 h-12 text-yellow-500 animate-pulse" />
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            FlashQuest
          </h1>
          <Sparkles className="w-12 h-12 text-yellow-500 animate-pulse" />
        </div>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Create flashcards, test your knowledge, earn coins, and unlock epic minigames
        </p>
      </div>

      <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300 shadow-lg">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-600" />
          <div>
            <p className="text-sm text-yellow-800 font-medium">Your Coins</p>
            <p className="text-3xl font-bold text-yellow-900">{coins}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <Button
          size="lg"
          className="h-32 flex flex-col gap-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg"
          onClick={() => onNavigate("create")}
        >
          <BookOpen className="w-10 h-10" />
          <div className="text-center">
            <p className="font-bold text-lg">Create Set</p>
            <p className="text-sm text-blue-100">{sets.length} sets created</p>
          </div>
        </Button>

        <Button
          size="lg"
          className="h-32 flex flex-col gap-3 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg"
          onClick={() => onNavigate("test")}
          disabled={sets.length === 0}
        >
          <Trophy className="w-10 h-10" />
          <div className="text-center">
            <p className="font-bold text-lg">Test Yourself</p>
            <p className="text-sm text-purple-100">Earn coins here</p>
          </div>
        </Button>

        <Button
          size="lg"
          className="h-32 flex flex-col gap-3 bg-gradient-to-br from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white shadow-lg"
          onClick={() => onNavigate("shop")}
        >
          <ShoppingBag className="w-10 h-10" />
          <div className="text-center">
            <p className="font-bold text-lg">Shop</p>
            <p className="text-sm text-pink-100">Buy minigames, avatars,</p>
            <p className="text-sm text-pink-100">backgrounds and more</p>
          </div>
        </Button>
      </div>
    </div>
  )
}
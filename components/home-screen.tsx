"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Trophy, ShoppingBag, Sparkles } from "lucide-react"
import { useCoins } from "@/hooks/use-coins"
import { useSets } from "@/hooks/use-sets"
import { useAvatar } from "@/hooks/use-avatar"
import { AVATARS } from "@/lib/data"
import type { Screen } from "@/app/page"

type HomeScreenProps = {
  onNavigate: (screen: Screen) => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { coins } = useCoins()
  const { sets } = useSets()
  const { currentAvatar } = useAvatar()
  
  const currentAvatarData = AVATARS.find(a => a.id === currentAvatar) || AVATARS[0]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 w-full overflow-hidden">
      
      {/* AVATAR POSITIONING FIX:
          - 'mb-6': On phone, adds space below avatar so it doesn't touch title.
          - 'md:absolute md:top-4 md:right-4': On Computer, it ignores the flow and sticks to top-right.
          - 'md:mb-0': On Computer, removes the bottom margin since it's floating.
      */}
      <div className="flex items-center gap-3 mb-6 md:absolute md:top-6 md:right-6 md:mb-0">
        <div className="w-14 h-14 bg-white/80 backdrop-blur rounded-full border-2 border-white/50 flex items-center justify-center shadow-md overflow-hidden">
           {currentAvatarData.image ? (
              <img src={currentAvatarData.image} alt="Avatar" className="w-full h-full object-cover" />
           ) : (
              <span className="text-3xl">{currentAvatarData.icon}</span>
           )}
        </div>
      </div>

      {/* HEADER TEXT */}
      <div className="text-center mb-12 space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-yellow-500 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
            FlashQuest
          </h1>
          <Sparkles className="w-10 h-10 md:w-12 md:h-12 text-yellow-500 animate-pulse" />
        </div>
        
        <p className="text-lg text-slate-700 font-medium max-w-md mx-auto">
          Create flashcards, test your knowledge, earn coins, and unlock epic minigames
        </p>
      </div>

      {/* COINS CARD - Reverted to your ORIGINAL styling (removed w-full) */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300 shadow-lg">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-600" />
          <div>
            <p className="text-sm text-yellow-800 font-medium">Your Coins</p>
            <p className="text-3xl font-bold text-yellow-900">{coins}</p>
          </div>
        </div>
      </Card>

      {/* BUTTONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <Button
          size="lg"
          className="h-32 flex flex-col gap-3 bg-blue-600 hover:bg-blue-700 text-white shadow-xl border-b-4 border-blue-800"
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
          className="h-32 flex flex-col gap-3 bg-purple-600 hover:bg-purple-700 text-white shadow-xl border-b-4 border-purple-800"
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
          className="h-32 flex flex-col gap-3 bg-pink-600 hover:bg-pink-700 text-white shadow-xl border-b-4 border-pink-800"
          onClick={() => onNavigate("shop")}
        >
          <ShoppingBag className="w-10 h-10" />
          <div className="text-center">
            <p className="font-bold text-lg">Shop</p>
            <p className="text-sm text-pink-100">Unlock Avatars & Backgrounds</p>
          </div>
        </Button>
      </div>
    </div>
  )
}
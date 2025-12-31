"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Trophy, ShoppingBag, Sparkles } from "lucide-react"
import { useCoins } from "@/hooks/use-coins"
import { useSets } from "@/hooks/use-sets"
import { useAvatar } from "@/hooks/use-avatar"
import { usePets } from "@/hooks/use-pets"
import { AVATARS, PETS } from "@/lib/data"
import type { Screen } from "@/app/page"

type HomeScreenProps = {
  onNavigate: (screen: Screen) => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { coins } = useCoins()
  const { sets } = useSets()
  const { currentAvatar } = useAvatar()
  const { ownedPets, feedPet, revivePet, isPetAlive } = usePets()

  const currentAvatarData = AVATARS.find(a => a.id === currentAvatar) || AVATARS[0]

  // TICKER: Updates every second now (1000ms) for the seconds counter
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000); 
    return () => clearInterval(timer);
  }, []);

  // UPDATED HELPER: Now includes Seconds
  const getTimeLeft = (deathTime: number) => {
    const total = deathTime - Date.now()
    if (total <= 0) return "0h 0m 0s"
    
    const hours = Math.floor(total / (1000 * 60 * 60))
    const mins = Math.floor((total / 1000 / 60) % 60)
    const secs = Math.floor((total / 1000) % 60) // Logic for seconds
    
    return `${hours}h ${mins}m ${secs}s`
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10 w-full overflow-y-auto overflow-x-hidden">
      
      {/* Top Right Avatar */}
      <div className="flex items-center gap-3 mb-6 md:absolute md:top-6 md:right-6 md:mb-0">
        <div className="w-14 h-14 bg-white/80 backdrop-blur rounded-full border-2 border-white/50 flex items-center justify-center shadow-md overflow-hidden">
           {currentAvatarData.image ? (
              <img src={currentAvatarData.image} alt="Avatar" className="w-full h-full object-cover" />
           ) : (
              <span className="text-3xl">{currentAvatarData.icon}</span>
           )}
        </div>
      </div>

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

      {/* Coins Card */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300 shadow-lg">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-yellow-600" />
          <div>
            <p className="text-sm text-yellow-800 font-medium">Your Coins</p>
            <p className="text-3xl font-bold text-yellow-900">{coins}</p>
          </div>
        </div>
      </Card>

      {/* Buttons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-12">
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
            <p className="text-sm text-pink-100">Unlock Avatars & Pets</p>
          </div>
        </Button>
      </div>

      {/* --- PETS & PLANTS SECTION --- */}
      {ownedPets.length > 0 && (
        <div className="w-full max-w-2xl pt-8 border-t border-slate-200/50 mb-12">
          <h2 className="text-center text-slate-400 font-bold uppercase tracking-widest text-xs mb-8">
            Your Companions
          </h2>
          
          <div className="flex flex-wrap justify-center gap-10">
            {ownedPets.map((status) => {
              const data = PETS.find(p => p.id === status.id);
              if (!data) return null;
              
              const alive = isPetAlive(status.deathTime);

              return (
                <div key={status.id} className="flex flex-col items-center min-w-[100px]">
                  
                  {/* ICON CONTAINER: 
                      We put the 'group' class here on the box. 
                      The animation happens on the SPAN inside.
                      This prevents the 'spazzing' bug. 
                  */}
                  <div className="h-20 w-20 flex items-center justify-center group cursor-pointer">
                    <span className={`text-6xl transition-all duration-300 ${alive ? data.hoverAnim : "opacity-40 grayscale"}`}>
                      {alive ? data.icon : "👻"}
                    </span>
                  </div>

                  {/* Name, Timer & Interaction */}
                  <div className="text-center mt-1 flex flex-col items-center">
                    <p className="text-sm font-bold text-slate-600">{data.name}</p>
                    
                    {/* Timer Logic */}
                    <p className={`text-[10px] font-mono font-bold mt-1 ${alive ? "text-green-500" : "text-red-400"}`}>
                      {alive ? getTimeLeft(status.deathTime) : "Needs Revive"}
                    </p>

                    {alive ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 px-3 mt-2 text-[10px] font-bold bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-700 rounded-full shadow-sm"
                        onClick={() => feedPet(status.id)}
                      >
                        FEED (10¢)
                      </Button>
                    ) : (
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="h-7 px-3 mt-2 text-[10px] font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-md animate-pulse"
                        onClick={() => revivePet(status.id)}
                      >
                        REVIVE ({Math.floor(data.price / 2)}¢)
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
}
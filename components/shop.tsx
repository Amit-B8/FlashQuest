"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Trophy, Gamepad2, User, Palette, Check } from "lucide-react"
import { useCoins } from "@/hooks/use-coins"
import { useShop } from "@/hooks/use-shop"
import { useAvatar } from "@/hooks/use-avatar"
import { useBackground } from "@/hooks/use-background"

type ShopProps = {
  onBack: () => void
  onPlayGame: (game: string) => void
}

// --- DATA ---
const GAMES = [
  { id: "memory-game", name: "Memory Match", description: "Classic card game", cost: 10, icon: "🎴" },
]

const AVATARS = [
  { id: "robot", name: "Cool Robot", cost: 50, icon: "🤖" },
  { id: "ninja", name: "Ninja", cost: 100, icon: "🥷" },
  { id: "alien", name: "Alien", cost: 150, icon: "👽" },
  { id: "king", name: "King", cost: 500, icon: "👑" },
]

const BACKGROUNDS = [
  { id: "blue-sky", name: "Blue Sky", cost: 50, class: "bg-gradient-to-b from-blue-300 to-blue-100" },
  { id: "sunset", name: "Sunset", cost: 100, class: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" },
  { id: "forest", name: "Forest", cost: 75, class: "bg-gradient-to-br from-green-600 to-emerald-900" },
  { id: "dark-mode", name: "Dark Mode", cost: 150, class: "bg-slate-900" },
]
// ------------

export function Shop({ onBack, onPlayGame }: ShopProps) {
  const { coins, removeCoins } = useCoins()
  const { unlockedGames, unlockGame, lockGame } = useShop()
  const { ownedAvatars, currentAvatar, buyAvatar, equipAvatar } = useAvatar()
  const { ownedBackgrounds, activeBackground, buyBackground, equipBackground } = useBackground()

  // --- BACKGROUND RENDERER ---
  const renderBackground = () => {
    const bgItem = BACKGROUNDS.find(b => b.id === activeBackground)
    const bgClass = bgItem ? bgItem.class : "bg-gradient-to-br from-blue-50 to-purple-50"
    return <div className={`fixed inset-0 ${bgClass} -z-50 transition-colors duration-500`} />
  }

  // --- HANDLERS ---
  const handlePurchaseGame = (id: string, cost: number) => {
    if (coins >= cost && !unlockedGames.includes(id)) {
      removeCoins(cost); unlockGame(id);
    }
  }

  const handlePurchaseAvatar = (id: string, cost: number) => {
    if (coins >= cost && !ownedAvatars.includes(id)) {
      removeCoins(cost); buyAvatar(id);
    }
  }

  const handlePurchaseBackground = (id: string, cost: number) => {
    if (coins >= cost && !ownedBackgrounds.includes(id)) {
      removeCoins(cost); buyBackground(id);
    }
  }

  return (
    <div className="min-h-screen relative pb-20">
      {renderBackground()}

      {/* --- FIXED HEADER (Pinned to top) --- */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b shadow-sm p-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          
          <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border border-yellow-300">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-900">{coins} Available</span>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT (Added pt-28 so it doesn't hide behind the header) --- */}
      <div className="max-w-3xl mx-auto px-6 pt-28">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Item Shop
        </h1>

        {/* --- SECTION 1: MINIGAMES --- */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4 border-b border-black/10 pb-2">
            <Gamepad2 className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-800">Minigames</h2>
          </div>
          <div className="grid gap-6">
            {GAMES.map((game) => {
              const isUnlocked = unlockedGames.includes(game.id)
              return (
                <Card key={game.id} className="p-6 bg-white/90 shadow-lg backdrop-blur">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{game.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold">{game.name}</h3>
                        <p className="text-muted-foreground">{game.description}</p>
                      </div>
                    </div>
                    {isUnlocked ? (
                      <Button onClick={() => { lockGame(game.id); onPlayGame(game.id) }} className="bg-green-600 hover:bg-green-700">
                        Play (1 Use)
                      </Button>
                    ) : (
                      <Button onClick={() => handlePurchaseGame(game.id, game.cost)} disabled={coins < game.cost}>
                        Buy Ticket ({game.cost})
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* --- SECTION 2: AVATARS --- */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4 border-b border-black/10 pb-2">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-800">Avatars</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {AVATARS.map((avatar) => {
              const isOwned = ownedAvatars.includes(avatar.id)
              const isActive = currentAvatar === avatar.id
              return (
                <Card key={avatar.id} className={`p-4 flex flex-col items-center text-center bg-white/90 ${isActive ? 'border-4 border-blue-500' : ''}`}>
                  <div className="text-6xl mb-4">{avatar.icon}</div>
                  <h3 className="font-bold mb-1">{avatar.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">Cost: {avatar.cost}</p>
                  
                  {isOwned ? (
                    <Button 
                      variant={isActive ? "secondary" : "default"} 
                      onClick={() => equipAvatar(avatar.id)}
                      className="w-full"
                    >
                      {isActive ? <><Check className="w-4 h-4 mr-2"/> Equipped</> : "Equip"}
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handlePurchaseAvatar(avatar.id, avatar.cost)} 
                      disabled={coins < avatar.cost}
                      className="w-full bg-pink-500 hover:bg-pink-600"
                    >
                      Buy
                    </Button>
                  )}
                </Card>
              )
            })}
            {/* Default Avatar Card */}
            <Card className={`p-4 flex flex-col items-center text-center bg-white/90 ${currentAvatar === 'default' ? 'border-4 border-blue-500' : ''}`}>
              <div className="text-6xl mb-4">🙂</div>
              <h3 className="font-bold mb-1">Default</h3>
              <p className="text-sm text-gray-500 mb-4">Free</p>
              
              <Button 
                variant={currentAvatar === 'default' ? "secondary" : "default"} 
                onClick={() => equipAvatar("default")}
                disabled={currentAvatar === 'default'}
                className="w-full"
              >
                {currentAvatar === 'default' ? <><Check className="w-4 h-4 mr-2"/> Equipped</> : "Equip"}
              </Button>
            </Card>
          </div>
        </div>

        {/* --- SECTION 3: BACKGROUNDS --- */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4 border-b border-black/10 pb-2">
            <Palette className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-800">Backgrounds</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {BACKGROUNDS.map((bg) => {
              const isOwned = ownedBackgrounds.includes(bg.id)
              const isActive = activeBackground === bg.id
              return (
                <Card key={bg.id} className={`overflow-hidden bg-white/90 ${isActive ? 'ring-4 ring-orange-500' : ''}`}>
                  {/* Preview Area */}
                  <div className={`h-24 w-full ${bg.class}`} />
                  
                  <div className="p-4 text-center">
                    <h3 className="font-bold mb-1">{bg.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">Cost: {bg.cost}</p>
                    
                    {isOwned ? (
                      <Button 
                        variant={isActive ? "secondary" : "default"} 
                        onClick={() => equipBackground(bg.id)}
                        className="w-full"
                      >
                        {isActive ? "Active" : "Activate"}
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handlePurchaseBackground(bg.id, bg.cost)} 
                        disabled={coins < bg.cost}
                        className="w-full bg-orange-500 hover:bg-orange-600"
                      >
                        Buy
                      </Button>
                    )}
                  </div>
                </Card>
              )
            })}
             {/* Default Background Card */}
             <Card className={`overflow-hidden bg-white/90 ${activeBackground === 'default' ? 'ring-4 ring-orange-500' : ''}`}>
                  <div className="h-24 w-full bg-gradient-to-br from-blue-50 to-purple-50" />
                  <div className="p-4 text-center">
                    <h3 className="font-bold mb-1">Default</h3>
                    <p className="text-sm text-gray-500 mb-3">Free</p>
                    <Button 
                      variant={activeBackground === 'default' ? "secondary" : "default"} 
                      onClick={() => equipBackground("default")}
                      className="w-full"
                    >
                      {activeBackground === 'default' ? "Active" : "Activate"}
                    </Button>
                  </div>
              </Card>
          </div>
        </div>

      </div>
    </div>
  )
}
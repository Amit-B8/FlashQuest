"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Trophy, Lock, Unlock, User, Gamepad2 } from "lucide-react"
import { useCoins } from "@/hooks/use-coins"
import { useShop } from "@/hooks/use-shop"
import { useAvatar } from "@/hooks/use-avatar" // <--- NEW IMPORT

type ShopProps = {
  onBack: () => void
  onPlayGame: (game: string) => void
}

// --- DATA LISTS ---
const GAMES = [
  {
    id: "memory-game",
    name: "Memory Match",
    description: "Match pairs of cards",
    cost: 10,
    icon: "🎴",
  },
]

const AVATARS = [
  { id: "robot", name: "Cool Robot", cost: 50, icon: "🤖" },
  { id: "ninja", name: "Ninja", cost: 100, icon: "🥷" },
  { id: "alien", name: "Alien", cost: 150, icon: "👽" },
  { id: "king", name: "King", cost: 500, icon: "👑" },
]
// ------------------

export function Shop({ onBack, onPlayGame }: ShopProps) {
  const { coins, removeCoins } = useCoins()
  const { unlockedGames, unlockGame, lockGame } = useShop()
  
  // New Hook Logic
  const { ownedAvatars, currentAvatar, buyAvatar, equipAvatar } = useAvatar()

  // Game Buy Logic
  const handlePurchaseGame = (gameId: string, cost: number) => {
    if (coins >= cost && !unlockedGames.includes(gameId)) {
      removeCoins(cost)
      unlockGame(gameId)
    }
  }

  // Avatar Buy Logic
  const handlePurchaseAvatar = (avatarId: string, cost: number) => {
    if (coins >= cost && !ownedAvatars.includes(avatarId)) {
      removeCoins(cost)
      buyAvatar(avatarId)
    }
  }

  return (
    <div className="min-h-screen p-6 pb-20"> {/* pb-20 adds space for footer */}
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Item Shop
        </h1>

        {/* COIN DISPLAY */}
        <Card className="p-4 mb-8 bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300 sticky top-4 z-10 shadow-md">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <span className="font-bold text-yellow-900 text-xl">{coins} coins available</span>
          </div>
        </Card>

        {/* SECTION 1: MINIGAMES */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <Gamepad2 className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-purple-900">Minigames</h2>
          </div>
          
          <div className="grid gap-6">
            {GAMES.map((game) => {
              const isUnlocked = unlockedGames.includes(game.id)
              const canAfford = coins >= game.cost

              return (
                <Card key={game.id} className="p-6 bg-white shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{game.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                      <p className="text-muted-foreground mb-4">{game.description}</p>
                      <div className="flex items-center gap-4">
                        {isUnlocked ? (
                          <Button
                            onClick={() => {
                              lockGame(game.id)
                              onPlayGame(game.id)
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Play (1 Use)
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handlePurchaseGame(game.id, game.cost)}
                            disabled={!canAfford}
                          >
                            {canAfford ? `Buy Ticket (${game.cost})` : "Need Coins"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* SECTION 2: AVATARS */}
        <div>
          <div className="flex items-center gap-2 mb-4 border-b pb-2">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-blue-900">Avatars</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {AVATARS.map((avatar) => {
              const isOwned = ownedAvatars.includes(avatar.id)
              const isEquipped = currentAvatar === avatar.id
              const canAfford = coins >= avatar.cost

              return (
                <Card key={avatar.id} className={`p-4 flex flex-col items-center text-center transition-all ${isEquipped ? 'border-4 border-blue-500 bg-blue-50' : ''}`}>
                  <div className="text-6xl mb-4">{avatar.icon}</div>
                  <h3 className="font-bold mb-2">{avatar.name}</h3>
                  
                  {isOwned ? (
                    <Button 
                      variant={isEquipped ? "secondary" : "default"}
                      onClick={() => equipAvatar(avatar.id)}
                      disabled={isEquipped}
                      className="w-full"
                    >
                      {isEquipped ? "Equipped" : "Equip"}
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handlePurchaseAvatar(avatar.id, avatar.cost)}
                      disabled={!canAfford}
                      className="w-full bg-pink-500 hover:bg-pink-600"
                    >
                      {canAfford ? `${avatar.cost} coins` : "Locked"}
                    </Button>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
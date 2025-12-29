"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Trophy, Lock, Unlock } from "lucide-react"
import { useCoins } from "@/hooks/use-coins"
import { useShop } from "@/hooks/use-shop"

type ShopProps = {
  onBack: () => void
  onPlayGame: (game: string) => void
}

const GAMES = [
  {
    id: "memory-game",
    name: "Memory Match",
    description: "Match pairs of cards in this classic memory game",
    cost: 10,
    icon: "🎴",
  },
]

export function Shop({ onBack, onPlayGame }: ShopProps) {
  const { coins, removeCoins } = useCoins()
  
  // 1. UPDATED: Added 'lockGame' to the imports here
  const { unlockedGames, unlockGame, lockGame } = useShop()

  const handlePurchase = (gameId: string, cost: number) => {
    if (coins >= cost && !unlockedGames.includes(gameId)) {
      removeCoins(cost)
      unlockGame(gameId)
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Minigame Shop
        </h1>

        <Card className="p-4 mb-8 bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-300">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <span className="font-bold text-yellow-900 text-xl">{coins} coins available</span>
          </div>
        </Card>

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
                        <>
                          <div className="flex items-center gap-2 text-green-600">
                            <Unlock className="w-5 h-5" />
                            <span className="font-bold">Unlocked</span>
                          </div>
                          
                          {/* 2. UPDATED: The Play Button now locks the game immediately */}
                          <Button
                            onClick={() => {
                              lockGame(game.id) // <--- Consumes the ticket
                              onPlayGame(game.id) // <--- Starts the game
                            }}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                          >
                            Play (1 Use)
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <Lock className="w-5 h-5 text-muted-foreground" />
                            <span className="font-bold text-xl">{game.cost} coins</span>
                          </div>
                          <Button
                            onClick={() => handlePurchase(game.id, game.cost)}
                            disabled={!canAfford}
                            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                          >
                            {canAfford ? "Buy Ticket" : "Not Enough Coins"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
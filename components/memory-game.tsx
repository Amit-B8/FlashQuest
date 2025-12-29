"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Trophy } from "lucide-react"
import { useCoins } from "@/hooks/use-coins"

type MemoryGameProps = {
  onBack: () => void
}

const EMOJIS = ["🎯", "🎨", "🎭", "🎪", "🎬", "🎮", "🎲", "🎸"]

export function MemoryGame({ onBack }: MemoryGameProps) {
  const { coins, addCoins } = useCoins()
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([])
  const [flippedIndices, setFlippedIndices] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, idx) => (idx === first || idx === second ? { ...card, matched: true } : card)),
          )
          setFlippedIndices([])

          // Check if game is complete
          const allMatched = cards.every((card, idx) => card.matched || idx === first || idx === second)
          if (allMatched) {
            setGameComplete(true)
            addCoins(5)
          }
        }, 500)
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, idx) => (idx === first || idx === second ? { ...card, flipped: false } : card)),
          )
          setFlippedIndices([])
        }, 1000)
      }
      setMoves(moves + 1)
    }
  }, [flippedIndices, cards])

  const initializeGame = () => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, id) => ({ id, emoji, flipped: false, matched: false }))
    setCards(shuffled)
    setFlippedIndices([])
    setMoves(0)
    setGameComplete(false)
  }

  const handleCardClick = (index: number) => {
    if (flippedIndices.length < 2 && !cards[index].flipped && !cards[index].matched) {
      setCards((prev) => prev.map((card, idx) => (idx === index ? { ...card, flipped: true } : card)))
      setFlippedIndices([...flippedIndices, index])
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Memory Match</h1>
          <div className="flex gap-4 items-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Moves</p>
              <p className="text-2xl font-bold">{moves}</p>
            </div>
            <Card className="px-4 py-2 bg-yellow-100 border-yellow-300">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-yellow-900">{coins}</span>
              </div>
            </Card>
          </div>
        </div>

        {gameComplete && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-green-100 to-emerald-100 border-green-300">
            <h2 className="text-2xl font-bold text-green-900 mb-2">You Won!</h2>
            <p className="text-green-800 mb-4">Completed in {moves} moves. +5 coins!</p>
            
            {/* --- OLD CODE: Play Again button (Deleted) --- */}
            {/* <Button onClick={initializeGame} ... > Play Again </Button> */}

            {/* --- NEW CODE: Only allow them to leave --- */}
            <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
              Return to Shop
            </Button>
          </Card>
        )}

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <Card
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square flex items-center justify-center text-4xl cursor-pointer transition-all ${
                card.flipped || card.matched
                  ? "bg-white shadow-lg"
                  : "bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              } ${card.matched ? "opacity-50" : ""}`}
            >
              {card.flipped || card.matched ? card.emoji : "?"}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

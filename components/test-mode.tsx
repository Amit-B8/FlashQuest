"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// 1. ADDED: Trash2 icon
import { ArrowLeft, Check, X, Trophy, Trash2 } from "lucide-react"
import { useSets } from "@/hooks/use-sets"
import { useCoins } from "@/hooks/use-coins"

type TestModeProps = {
  onBack: () => void
}

export function TestMode({ onBack }: TestModeProps) {
  // 2. UPDATED: Grab 'removeSet' from the hook
  const { sets, removeSet } = useSets()
  
  const { coins, addCoins } = useCoins()
  const [selectedSet, setSelectedSet] = useState<string | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [shuffledCards, setShuffledCards] = useState<{ question: string; answer: string }[]>([])

  const currentSet = sets.find((s) => s.id === selectedSet)

  useEffect(() => {
    if (currentSet) {
      const shuffled = [...currentSet.cards].sort(() => Math.random() - 0.5)
      setShuffledCards(shuffled)
    }
  }, [currentSet])

  const handleCorrect = () => {
    addCoins(1)
    setScore(score + 1)
    nextCard()
  }

  const handleWrong = () => {
    nextCard()
  }

  const nextCard = () => {
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setShowAnswer(false)
    } else {
      setCurrentCardIndex(0)
      setShowAnswer(false)
      const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5)
      setShuffledCards(shuffled)
    }
  }

  // --- SELECTION SCREEN ---
  if (!selectedSet) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-3xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Test Yourself
          </h1>

          <div className="grid gap-4">
            {sets.map((set) => (
              // 3. UPDATED: Wrapped in a relative div to position the delete button
              <div key={set.id} className="relative group">
                <Card
                  className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedSet(set.id)}
                >
                  {/* Added padding-right (pr-12) so text doesn't hit the trash button */}
                  <h3 className="text-xl font-bold mb-2 pr-12">{set.name}</h3>
                  <p className="text-sm text-muted-foreground">{set.cards.length} cards</p>
                </Card>

                {/* 4. NEW: The Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-red-400 hover:text-red-600 hover:bg-red-50 z-10"
                  onClick={(e) => {
                    e.stopPropagation() // Stops the click from starting the game
                    if (confirm("Are you sure you want to delete this set?")) {
                      removeSet(set.id)
                    }
                  }}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // --- GAME SCREEN (Unchanged logic below) ---
  if (shuffledCards.length === 0) return null

  const currentCard = shuffledCards[currentCardIndex]

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Question {currentCardIndex + 1} of {shuffledCards.length}
            </p>
            <p className="text-2xl font-bold">Score: {score}</p>
          </div>
          <Card className="px-4 py-2 bg-yellow-100 border-yellow-300">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-bold text-yellow-900">{coins} coins</span>
            </div>
          </Card>
        </div>

        <Card className="p-8 bg-white shadow-xl mb-6 min-h-[300px] flex flex-col justify-center">
          <p className="text-sm text-muted-foreground mb-4">Question:</p>
          <p className="text-3xl font-bold mb-8 text-balance">{currentCard.question}</p>

          {!showAnswer ? (
            <Button
              onClick={() => setShowAnswer(true)}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              Show Answer
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                <p className="text-sm text-green-800 mb-2">Answer:</p>
                <p className="text-2xl font-bold text-green-900 text-balance">{currentCard.answer}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleWrong}
                  variant="outline"
                  className="h-14 text-lg border-2 border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <X className="w-5 h-5 mr-2" />
                  Missed It
                </Button>
                <Button
                  onClick={handleCorrect}
                  className="h-14 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Got It! (+1 coin)
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// 1. ADD: Pencil icon
import { ArrowLeft, Check, X, Trophy, Trash2, Pencil } from "lucide-react"
import { useSets } from "@/hooks/use-sets"
import { useCoins } from "@/hooks/use-coins"

type QuizModeProps = {
  onBack: () => void
}

export function QuizMode({ onBack }: QuizModeProps) {
  // 2. GET: renameSet from the hook
  const { sets, removeSet, renameSet } = useSets()
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
      setCurrentCardIndex(0)
      setScore(0)
      setShowAnswer(false)
    }
  }, [currentSet])

  // --- NEW: EDIT HANDLER ---
  const handleEditSet = (e: React.MouseEvent, id: string, currentName: string) => {
    e.stopPropagation() // Stop click from starting the quiz
    
    // Simple prompt to get new name
    const newName = prompt("Enter a new name for this set:", currentName)
    
    if (newName && newName.trim().length > 0) {
      const formattedName = newName.trim()
      
      // Check for duplicates (excluding itself)
      const nameExists = sets.some(
        s => s.name.toLowerCase() === formattedName.toLowerCase() && s.id !== id
      )
      
      if (nameExists) {
        alert("A set with this name already exists!")
        return
      }

      renameSet(id, formattedName)
    }
  }

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
      const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5)
      setShuffledCards(shuffled)
      setCurrentCardIndex(0)
      setShowAnswer(false)
    }
  }

  // --- SELECTION SCREEN ---
  if (!selectedSet) {
    return (
      <div className="min-h-screen p-6 relative z-10">
        <div className="max-w-3xl mx-auto">
          
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm mb-8 border border-white/50">
            <Button variant="ghost" onClick={onBack} className="mb-2 pl-0 hover:bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Test Yourself
            </h1>
          </div>

          <div className="grid gap-4">
            {sets.length === 0 ? (
              <div className="text-center p-8 bg-white/80 rounded-xl border-2 border-dashed border-gray-300">
                <p className="text-gray-500 mb-4">No flashcards found!</p>
                <Button onClick={onBack} variant="outline">Go Create One</Button>
              </div>
            ) : (
              sets.map((set) => (
                <div key={set.id} className="relative group">
                  <Card
                    className="p-6 bg-white/95 backdrop-blur shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500"
                    onClick={() => setSelectedSet(set.id)}
                  >
                    <div className="pr-24"> {/* Extra padding for buttons */}
                      <h3 className="text-xl font-bold mb-1 text-slate-800">{set.name}</h3>
                      <p className="text-sm text-slate-500">{set.cards.length} cards</p>
                    </div>
                  </Card>

                  {/* ACTION BUTTONS */}
                  <div className="absolute top-4 right-4 flex gap-2 z-20">
                    
                    {/* 3. NEW: Edit Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                      onClick={(e) => handleEditSet(e, set.id, set.name)}
                    >
                      <Pencil className="w-5 h-5" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm("Are you sure you want to delete this set?")) {
                          removeSet(set.id)
                        }
                      }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  // --- GAME SCREEN (Unchanged) ---
  if (shuffledCards.length === 0) return null
  const currentCard = shuffledCards[currentCardIndex]
  
  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm mb-6 border border-white/50">
          <Button variant="ghost" onClick={() => setSelectedSet(null)} className="mb-2 pl-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sets
          </Button>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-slate-500 font-medium">
                Question {currentCardIndex + 1} of {shuffledCards.length}
              </p>
              <p className="text-2xl font-bold text-slate-800">Score: {score}</p>
            </div>
            <div className="bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="font-bold text-yellow-900 text-sm">{coins} coins</span>
            </div>
          </div>
        </div>

        <Card className="p-8 bg-white/95 backdrop-blur shadow-xl mb-6 min-h-[300px] flex flex-col justify-center border-t-4 border-t-blue-500">
          <p className="text-sm text-slate-400 uppercase tracking-widest mb-4 font-bold">Question</p>
          <p className="text-3xl font-bold mb-8 text-slate-900 text-balance">{currentCard.question}</p>

          {!showAnswer ? (
            <Button
              onClick={() => setShowAnswer(true)}
              className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-md transition-transform active:scale-95"
            >
              Show Answer
            </Button>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <p className="text-sm text-green-700 uppercase tracking-widest mb-1 font-bold">Answer</p>
                <p className="text-2xl font-bold text-green-900">{currentCard.answer}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={handleWrong}
                  variant="outline"
                  className="h-14 text-lg border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                >
                  <X className="w-5 h-5 mr-2" />
                  Missed It
                </Button>
                <Button
                  onClick={handleCorrect}
                  className="h-14 text-lg bg-green-600 hover:bg-green-700 shadow-md"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Got It! (+1)
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
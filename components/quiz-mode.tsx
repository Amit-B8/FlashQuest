"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Check, X, RotateCw, Trophy, Trash2 } from "lucide-react"
import { useSets } from "@/hooks/use-sets"
import { useCoins } from "@/hooks/use-coins"
import { motion } from "framer-motion"

type QuizModeProps = {
  onBack: () => void
}

export function QuizMode({ onBack }: QuizModeProps) {
  // 1. Get 'removeSet' so we can delete stuff
  const { sets, removeSet } = useSets() 
  const { addCoins } = useCoins()
  
  // States
  const [selectedSetId, setSelectedSetId] = useState<string | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [sessionCoins, setSessionCoins] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Derived state
  const currentSet = sets.find(s => s.id === selectedSetId)
  const activeCard = currentSet?.cards[currentCardIndex]

  const handleSelectSet = (id: string) => {
    setSelectedSetId(id)
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setSessionCoins(0)
    setIsComplete(false)
  }

  const handleDeleteSet = (e: React.MouseEvent, id: string) => {
    e.stopPropagation() // Stop the click from opening the set
    if (confirm("Are you sure you want to delete this set?")) {
      removeSet(id)
    }
  }

  const handleNextCard = (correct: boolean) => {
    if (correct) {
      addCoins(10) // Reward for correct answer
      setSessionCoins(prev => prev + 10)
    }

    setIsFlipped(false)

    if (currentSet && currentCardIndex < currentSet.cards.length - 1) {
      setTimeout(() => setCurrentCardIndex(prev => prev + 1), 200)
    } else {
      setIsComplete(true)
    }
  }

  // --- SCREEN 1: SELECT A SET ---
  if (!selectedSetId) {
    return (
      <div className="max-w-3xl mx-auto p-6 z-10 relative">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        
        <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Choose a Set to Study
        </h2>
        
        <div className="grid gap-4">
          {sets.length === 0 ? (
            <div className="text-center p-8 bg-white/50 rounded-xl border-2 border-dashed border-gray-300">
              <p className="text-gray-500 mb-4">No flashcards found!</p>
              <Button onClick={onBack} variant="outline">Go Create One</Button>
            </div>
          ) : (
            sets.map((set) => (
              <div key={set.id} className="relative group">
                <Card 
                  className="p-6 cursor-pointer hover:border-purple-500 transition-all hover:shadow-md bg-white/90 backdrop-blur"
                  onClick={() => handleSelectSet(set.id)}
                >
                  <div className="flex justify-between items-center pr-12">
                    <div>
                      <h3 className="text-xl font-bold">{set.title}</h3>
                      <p className="text-gray-500">{set.cards.length} cards</p>
                    </div>
                    <Button variant="secondary" className="hidden sm:flex">Start Quiz</Button>
                  </div>
                </Card>

                {/* DELETE BUTTON */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-red-600 hover:bg-red-50 z-20"
                  onClick={(e) => handleDeleteSet(e, set.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  // --- SCREEN 2: QUIZ COMPLETE ---
  if (isComplete) {
    return (
      <div className="max-w-md mx-auto p-6 text-center pt-20 z-10 relative">
        <Card className="p-8 bg-white/90 backdrop-blur border-2 border-yellow-400 shadow-xl animate-in zoom-in">
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-gray-600 mb-6">You earned</p>
          
          <div className="text-5xl font-bold text-yellow-600 mb-8">
            +{sessionCoins} Coins
          </div>
          
          <div className="flex flex-col gap-3">
            <Button onClick={() => setSelectedSetId(null)} size="lg" className="w-full">
              Study Another Set
            </Button>
            <Button onClick={onBack} variant="outline" className="w-full">
              Back to Menu
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // --- SCREEN 3: ACTIVE FLASHCARD (The Game) ---
  return (
    <div className="max-w-xl mx-auto p-6 flex flex-col items-center pt-10 z-10 relative">
      <div className="w-full flex justify-between items-center mb-8">
        <Button variant="ghost" onClick={() => setSelectedSetId(null)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Exit
        </Button>
        <span className="font-bold text-lg text-slate-700 bg-white/50 px-3 py-1 rounded-full">
          Card {currentCardIndex + 1} / {currentSet?.cards.length}
        </span>
      </div>

      {/* FLASHCARD AREA */}
      <div className="w-full h-80 relative perspective-1000 mb-8 cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="w-full h-full relative preserve-3d"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRONT (Question) */}
          <Card className="absolute inset-0 flex items-center justify-center p-8 text-center text-2xl font-bold backface-hidden border-2 border-white/50 bg-white/80 backdrop-blur shadow-xl">
            {activeCard?.term}
            <div className="absolute bottom-4 text-xs text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <RotateCw className="w-3 h-3" /> Click to Flip
            </div>
          </Card>

          {/* BACK (Answer) */}
          <Card 
            className="absolute inset-0 flex items-center justify-center p-8 text-center text-xl bg-blue-50 border-2 border-blue-400 shadow-xl"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            {activeCard?.definition}
          </Card>
        </motion.div>
      </div>

      {/* CONTROLS */}
      {isFlipped ? (
        <div className="flex gap-4 w-full animate-in fade-in slide-in-from-bottom-4">
          <Button 
            className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 border-red-300 h-14 text-lg hover:scale-105 transition-transform" 
            variant="outline"
            onClick={() => handleNextCard(false)}
          >
            <X className="w-6 h-6 mr-2" /> Incorrect
          </Button>
          <Button 
            className="flex-1 bg-green-100 text-green-700 hover:bg-green-200 border-green-300 h-14 text-lg hover:scale-105 transition-transform" 
            variant="outline"
            onClick={() => handleNextCard(true)}
          >
            <Check className="w-6 h-6 mr-2" /> Correct
          </Button>
        </div>
      ) : (
        <p className="text-slate-500 animate-pulse font-medium">Tap the card to see the answer</p>
      )}

    </div>
  )
}
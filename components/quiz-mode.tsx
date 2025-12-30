"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// Added Chevron icons
import { ArrowLeft, Check, X, Trophy, Trash2, Pencil, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { useSets } from "@/hooks/use-sets"
import { useCoins } from "@/hooks/use-coins"

type QuizModeProps = {
  onBack: () => void
}

export function QuizMode({ onBack }: QuizModeProps) {
  // 1. GET updateCard and deleteCard
  const { sets, removeSet, renameSet, addCardToSet, updateCard, deleteCard } = useSets()
  const { coins, addCoins } = useCoins()

  const [selectedSetId, setSelectedSetId] = useState<string | null>(null)
  
  // New State for Accordion
  const [expandedSetId, setExpandedSetId] = useState<string | null>(null)

  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [shuffledCards, setShuffledCards] = useState<{ question: string; answer: string }[]>([])

  const currentSet = sets.find((s) => s.id === selectedSetId)

  useEffect(() => {
    if (currentSet) {
      const shuffled = [...currentSet.cards].sort(() => Math.random() - 0.5)
      setShuffledCards(shuffled)
      setCurrentCardIndex(0)
      setScore(0)
      setShowAnswer(false)
    }
  }, [currentSet])

  // --- HANDLERS ---

  const handleEditSet = (e: React.MouseEvent, id: string, currentName: string) => {
    e.stopPropagation()
    const newName = prompt("Enter a new name for this set:", currentName)
    if (newName && newName.trim().length > 0) {
      const formattedName = newName.trim()
      const nameExists = sets.some(s => s.name.toLowerCase() === formattedName.toLowerCase() && s.id !== id)
      if (nameExists) { alert("Name already exists!"); return }
      renameSet(id, formattedName)
    }
  }

  const handleAddCard = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const question = prompt("Enter the new question:")
    if (!question?.trim()) return
    const answer = prompt("Enter the answer:")
    if (!answer?.trim()) return
    addCardToSet(id, { question: question.trim(), answer: answer.trim() })
  }

  // --- NEW: EDIT SPECIFIC CARD ---
  const handleEditCard = (setId: string, index: number, currentQ: string, currentA: string) => {
    const newQ = prompt("Edit Question:", currentQ)
    if (!newQ?.trim()) return
    
    const newA = prompt("Edit Answer:", currentA)
    if (!newA?.trim()) return

    updateCard(setId, index, { question: newQ.trim(), answer: newA.trim() })
  }

  // --- NEW: DELETE SPECIFIC CARD ---
  const handleDeleteCard = (setId: string, index: number) => {
    if (confirm("Delete this card permanently?")) {
      deleteCard(setId, index)
    }
  }

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setExpandedSetId(expandedSetId === id ? null : id)
  }

  // --- GAME LOGIC ---
  const handleCorrect = () => { addCoins(1); setScore(score + 1); nextCard() }
  const handleWrong = () => { nextCard() }
  const nextCard = () => {
    if (currentCardIndex < shuffledCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1); setShowAnswer(false)
    } else {
      const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5)
      setShuffledCards(shuffled); setCurrentCardIndex(0); setShowAnswer(false)
    }
  }

  // --- 1. SELECTION DASHBOARD ---
  if (!selectedSetId) {
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
              sets.map((set) => {
                const isOpen = expandedSetId === set.id
                
                return (
                  <div key={set.id} className="relative group">
                    <Card
                      className={`p-6 bg-white/95 backdrop-blur shadow-md hover:shadow-xl transition-all cursor-pointer border-l-4 border-l-purple-500 ${isOpen ? 'ring-2 ring-purple-400' : ''}`}
                      onClick={() => setSelectedSetId(set.id)}
                    >
                      <div className="pr-32 flex justify-between items-center">
                         <div>
                            <h3 className="text-xl font-bold mb-1 text-slate-800">{set.name}</h3>
                            <p className="text-sm text-slate-500">{set.cards.length} cards</p>
                         </div>
                         
                         {/* EXPAND TOGGLE */}
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="text-slate-400 hover:bg-slate-100"
                           onClick={(e) => toggleExpand(e, set.id)}
                         >
                            {isOpen ? <ChevronUp /> : <ChevronDown />}
                         </Button>
                      </div>
                    </Card>

                    {/* TOP ACTION BUTTONS */}
                    <div className="absolute top-4 right-4 flex gap-1 z-20">
                      <Button
                        variant="ghost" size="icon" className="text-gray-400 hover:text-green-600 hover:bg-green-50"
                        title="Add Question" onClick={(e) => handleAddCard(e, set.id)}
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                        title="Rename Set" onClick={(e) => handleEditSet(e, set.id, set.name)}
                      >
                        <Pencil className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon" className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete Set"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm("Are you sure you want to delete this set?")) { removeSet(set.id) }
                        }}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* EXPANDED CARD LIST (THE DECK MANAGER) */}
                    {isOpen && (
                      <div className="mt-2 ml-4 p-4 bg-white/80 rounded-lg border border-white shadow-inner animate-in slide-in-from-top-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Manage Cards</h4>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                          {set.cards.map((card, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white border rounded shadow-sm">
                              <div className="text-sm mr-2">
                                <span className="font-bold text-blue-600">Q:</span> {card.question} <br/>
                                <span className="font-bold text-green-600">A:</span> {card.answer}
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  size="icon" variant="ghost" className="h-6 w-6" 
                                  onClick={(e) => { e.stopPropagation(); handleEditCard(set.id, index, card.question, card.answer) }}
                                >
                                  <Pencil className="w-3 h-3 text-slate-400 hover:text-blue-600" />
                                </Button>
                                <Button 
                                  size="icon" variant="ghost" className="h-6 w-6"
                                  onClick={(e) => { e.stopPropagation(); handleDeleteCard(set.id, index) }}
                                >
                                  <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-600" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    )
  }

  // --- 2. GAME SCREEN ---
  if (shuffledCards.length === 0) return null
  const currentCard = shuffledCards[currentCardIndex]
  
  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm mb-6 border border-white/50">
          <Button variant="ghost" onClick={() => setSelectedSetId(null)} className="mb-2 pl-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sets
          </Button>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-slate-500 font-medium">Question {currentCardIndex + 1} of {shuffledCards.length}</p>
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
            <Button onClick={() => setShowAnswer(true)} className="w-full h-14 text-lg bg-blue-600 hover:bg-blue-700 shadow-md">
              Show Answer
            </Button>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <p className="text-sm text-green-700 uppercase tracking-widest mb-1 font-bold">Answer</p>
                <p className="text-2xl font-bold text-green-900">{currentCard.answer}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleWrong} variant="outline" className="h-14 text-lg border-2 border-red-200 text-red-600 hover:bg-red-50">
                  <X className="w-5 h-5 mr-2" /> Missed It
                </Button>
                <Button onClick={handleCorrect} className="h-14 text-lg bg-green-600 hover:bg-green-700 shadow-md">
                  <Check className="w-5 h-5 mr-2" /> Got It! (+1)
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
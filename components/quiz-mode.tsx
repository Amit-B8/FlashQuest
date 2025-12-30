"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, Check, X, Trophy, Trash2, Pencil, Plus, 
  ChevronDown, ChevronUp, RotateCw, Keyboard, AlertCircle, Upload, ImageIcon 
} from "lucide-react"
import { useSets, FlashcardSet, Flashcard } from "@/hooks/use-sets"
import { useCoins } from "@/hooks/use-coins"

type QuizModeProps = {
  onBack: () => void
}

export function QuizMode({ onBack }: QuizModeProps) {
  // 1. HOOKS
  const { sets, removeSet, renameSet, addCardToSet, updateCard, deleteCard } = useSets()
  const { coins, addCoins } = useCoins()

  // 2. DASHBOARD STATE
  const [expandedSetId, setExpandedSetId] = useState<string | null>(null)

  // 3. GAME STATE
  const [activeSet, setActiveSet] = useState<FlashcardSet | null>(null)
  const [gameMode, setGameMode] = useState<"dashboard" | "flip" | "type">("dashboard")
  
  // Randomization & Stats
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([])
  const [missedQuestions, setMissedQuestions] = useState<Flashcard[]>([])

  // Flashcard Logic State
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  
  // Type Logic State
  const [inputAnswer, setInputAnswer] = useState("")
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong" | "skipped">("idle")
  
  // Shared Stats
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  // --- MODAL & FORM STATE (For Images) ---
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null)
  const [editingSetId, setEditingSetId] = useState<string | null>(null)
  
  const [formQuestion, setFormQuestion] = useState("")
  const [formAnswer, setFormAnswer] = useState("")
  const [formImage, setFormImage] = useState<string | undefined>(undefined)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- HANDLERS: IMAGE UPLOAD ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 500000) { 
        alert("Image is too large! Please use an image under 500KB.")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // --- HANDLERS: MODAL OPEN/CLOSE ---
  const openAddModal = (e: React.MouseEvent, setId: string) => {
    e.stopPropagation()
    setEditingSetId(setId)
    setEditingCardIndex(null) // Adding new
    setFormQuestion("")
    setFormAnswer("")
    setFormImage(undefined)
    setIsModalOpen(true)
  }

  const openEditModal = (e: React.MouseEvent, setId: string, index: number, card: Flashcard) => {
    e.stopPropagation()
    setEditingSetId(setId)
    setEditingCardIndex(index)
    setFormQuestion(card.question)
    setFormAnswer(card.answer)
    setFormImage(card.image)
    setIsModalOpen(true)
  }

  const handleSaveCard = () => {
    if (!formQuestion.trim() || !formAnswer.trim() || !editingSetId) return

    const newCard: Flashcard = {
      question: formQuestion.trim(),
      answer: formAnswer.trim(),
      image: formImage
    }

    if (editingCardIndex !== null) {
      updateCard(editingSetId, editingCardIndex, newCard)
    } else {
      addCardToSet(editingSetId, newCard)
    }
    setIsModalOpen(false)
  }

  // --- MANAGEMENT HANDLERS ---
  const handleEditSet = (e: React.MouseEvent, id: string, currentName: string) => {
    e.stopPropagation()
    const newName = prompt("Enter a new name for this set:", currentName)
    if (newName && newName.trim().length > 0) renameSet(id, newName.trim())
  }

  const handleDeleteCard = (setId: string, index: number) => {
    if (confirm("Delete this card permanently?")) deleteCard(setId, index)
  }

  const toggleExpand = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setExpandedSetId(expandedSetId === id ? null : id)
  }

  // --- GAME LOGIC ---

  const startGame = (set: FlashcardSet, mode: "flip" | "type") => {
    setActiveSet(set)
    setGameMode(mode)
    
    // Randomize
    const shuffled = [...set.cards].sort(() => Math.random() - 0.5)
    setShuffledCards(shuffled)
    
    // Reset stats
    setMissedQuestions([])
    setCurrentIndex(0)
    setScore(0)
    setIsFinished(false)
    
    // Reset inputs
    setShowAnswer(false)
    setInputAnswer("")
    setFeedback("idle")
  }

  const nextCard = () => {
    setShowAnswer(false)
    setInputAnswer("")
    setFeedback("idle")

    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  // --- ACTION HANDLERS ---

  // 1. Flip Mode
  const handleFlipCorrect = () => { addCoins(1); setScore(s => s + 1); nextCard() }
  const handleFlipWrong = () => { setMissedQuestions(prev => [...prev, shuffledCards[currentIndex]]); nextCard() }

  // 2. Type Mode
  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const cleanInput = inputAnswer.trim().toLowerCase()
    const cleanAnswer = shuffledCards[currentIndex].answer.trim().toLowerCase()

    if (cleanInput === cleanAnswer) {
      setFeedback("correct")
      setScore(s => s + 1)
      addCoins(2) 
      // Waits for user to click "Next"
    } else {
      setFeedback("wrong")
    }
  }

  const handleTypeSkip = () => {
    setFeedback("skipped")
    setMissedQuestions(prev => [...prev, shuffledCards[currentIndex]])
    // Waits for user to click "Next"
  }

  // --- VIEW 1: DASHBOARD ---
  if (gameMode === "dashboard") {
    return (
      <div className="min-h-screen p-6 relative z-10">
        
        {/* --- MODAL OVERLAY --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-6 bg-white shadow-2xl animate-in zoom-in-95">
              <h2 className="text-xl font-bold mb-4">{editingCardIndex !== null ? "Edit Card" : "Add New Card"}</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">Question</label>
                  <Input 
                    value={formQuestion} 
                    onChange={(e) => setFormQuestion(e.target.value)} 
                    placeholder="e.g. What is the powerhouse of the cell?"
                  />
                </div>

                {/* IMAGE UPLOADER */}
                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    <Button 
                      type="button" variant="outline" size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-slate-50 border-dashed border-2 text-slate-500"
                    >
                      <Upload className="w-4 h-4 mr-2" /> {formImage ? "Change Image" : "Upload Image"}
                    </Button>
                    
                    {/* Hidden Input */}
                    <input 
                      type="file" ref={fileInputRef} className="hidden" 
                      accept="image/*" onChange={handleImageUpload} 
                    />

                    {/* Preview */}
                    {formImage && (
                       <div className="relative w-12 h-12 rounded border overflow-hidden group">
                          <img src={formImage} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                             onClick={() => setFormImage(undefined)}
                             className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <X className="w-4 h-4 text-white" />
                          </button>
                       </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-500 mb-1 block">Answer</label>
                  <Input 
                    value={formAnswer} 
                    onChange={(e) => setFormAnswer(e.target.value)} 
                    placeholder="e.g. Mitochondria"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSaveCard} disabled={!formQuestion || !formAnswer}>Save Card</Button>
              </div>
            </Card>
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm mb-8 border border-white/50">
            <Button variant="ghost" onClick={onBack} className="mb-2 pl-0 hover:bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Study Dashboard
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
                    <Card className={`p-6 bg-white/95 backdrop-blur shadow-md transition-all border-l-4 border-l-purple-500 ${isOpen ? 'ring-2 ring-purple-400' : ''}`}>
                      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                         
                         {/* LEFT: Info & Play */}
                         <div className="flex-1">
                            <h3 className="text-xl font-bold text-slate-800">{set.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{set.cards.length} cards</p>
                            
                            <div className="flex gap-3">
                                <Button 
                                  onClick={() => startGame(set, "flip")}
                                  disabled={set.cards.length === 0}
                                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
                                >
                                    <RotateCw className="w-4 h-4 mr-2" /> Flashcards
                                </Button>
                                <Button 
                                  onClick={() => startGame(set, "type")}
                                  disabled={set.cards.length === 0}
                                  className="bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200"
                                >
                                    <Keyboard className="w-4 h-4 mr-2" /> Type Test
                                </Button>
                            </div>
                         </div>

                         {/* RIGHT: Management */}
                         <div className="flex gap-1 self-start">
                            <Button variant="ghost" size="icon" onClick={(e) => openAddModal(e, set.id)} title="Add Card">
                                <Plus className="w-5 h-5 text-gray-400 hover:text-green-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={(e) => handleEditSet(e, set.id, set.name)} title="Rename">
                                <Pencil className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={(e) => {
                                e.stopPropagation();
                                if(confirm("Delete set?")) removeSet(set.id);
                            }} title="Delete Set">
                                <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-600" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={(e) => toggleExpand(e, set.id)}>
                                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </Button>
                         </div>
                      </div>
                    </Card>

                    {/* EXPANDED LIST */}
                    {isOpen && (
                      <div className="mt-2 ml-4 p-4 bg-white/80 rounded-lg border border-white shadow-inner animate-in slide-in-from-top-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Manage Cards</h4>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                          {set.cards.map((card, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white border rounded shadow-sm">
                              <div className="flex items-center gap-3 overflow-hidden">
                                {card.image && (
                                   <div className="w-10 h-10 rounded bg-slate-100 flex-shrink-0 border">
                                      <img src={card.image} alt="thumb" className="w-full h-full object-cover rounded" />
                                   </div>
                                )}
                                <div className="text-sm mr-2 truncate">
                                  <span className="font-bold text-blue-600">Q:</span> {card.question} <br/>
                                  <span className="font-bold text-green-600">A:</span> {card.answer}
                                </div>
                              </div>
                              <div className="flex gap-1 flex-shrink-0">
                                <Button size="icon" variant="ghost" className="h-6 w-6" 
                                  onClick={() => openEditModal(null as any, set.id, index, card)}>
                                  <Pencil className="w-3 h-3 text-slate-400 hover:text-blue-600" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-6 w-6" 
                                  onClick={() => handleDeleteCard(set.id, index)}>
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

  // --- VIEW 2: GAME OVER ---
  if (isFinished && activeSet) {
    const percentage = Math.round((score / shuffledCards.length) * 100)
    
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-4">
          
          {/* Main Result Card */}
          <Card className="p-8 bg-white/95 backdrop-blur shadow-xl text-center border-t-4 border-t-purple-500">
            <h2 className="text-3xl font-bold mb-4">Set Complete!</h2>
            <div className="text-6xl font-black text-purple-600 mb-2">{percentage}%</div>
            <p className="text-muted-foreground mb-6">You got {score} out of {shuffledCards.length} correct.</p>
            
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => setGameMode("dashboard")}>Back to Dashboard</Button>
              <Button onClick={() => startGame(activeSet, gameMode === "flip" ? "flip" : "type")}>Play Again</Button>
            </div>
          </Card>

          {/* Missed Questions Review */}
          {missedQuestions.length > 0 && (
            <Card className="p-6 bg-red-50 border border-red-100 shadow-inner">
               <div className="flex items-center gap-2 mb-4 text-red-700">
                 <AlertCircle className="w-5 h-5" />
                 <h3 className="font-bold text-lg">Missed Questions</h3>
               </div>
               
               <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                 {missedQuestions.map((card, idx) => (
                   <div key={idx} className="bg-white p-3 rounded border border-red-100 text-left flex gap-3">
                     {card.image && (
                         <div className="w-12 h-12 rounded bg-slate-100 flex-shrink-0 border">
                             <img src={card.image} alt="Review" className="w-full h-full object-cover rounded" />
                         </div>
                     )}
                     <div>
                         <p className="text-sm font-bold text-slate-700 mb-1">Q: {card.question}</p>
                         <p className="text-sm font-medium text-green-600">A: {card.answer}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </Card>
          )}

        </div>
      </div>
    )
  }

  // --- VIEW 3: ACTIVE GAME ---
  if (activeSet && shuffledCards.length > 0) {
    const currentCard = shuffledCards[currentIndex]
    
    return (
      <div className="min-h-screen p-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          
          {/* HEADER */}
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm mb-6 border border-white/50">
            <Button variant="ghost" onClick={() => setGameMode("dashboard")} className="mb-2 pl-0 hover:bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Exit to Dashboard
            </Button>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-slate-500 font-medium">Question {currentIndex + 1} of {shuffledCards.length}</p>
                <p className="text-2xl font-bold text-slate-800">Score: {score}</p>
              </div>
              <div className="bg-yellow-100 px-3 py-1 rounded-full border border-yellow-300 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="font-bold text-yellow-900 text-sm">{coins} coins</span>
              </div>
            </div>
          </div>

          {/* MAIN CARD */}
          <Card className="p-8 bg-white/95 backdrop-blur shadow-xl mb-6 min-h-[300px] flex flex-col justify-center border-t-4 border-t-blue-500">
            
            {/* --- IMAGE DISPLAY AREA (Only shows if image exists) --- */}
            {currentCard.image && (
                <div className="mb-6 rounded-lg overflow-hidden border border-slate-200 max-h-64 flex justify-center bg-slate-50">
                    <img src={currentCard.image} alt="Card visual" className="h-full object-contain" />
                </div>
            )}

            {/* --- FLASHCARD MODE --- */}
            {gameMode === "flip" && (
                <>
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
                                <Button onClick={handleFlipWrong} variant="outline" className="h-14 text-lg border-2 border-red-200 text-red-600 hover:bg-red-50">
                                    <X className="w-5 h-5 mr-2" /> Missed It
                                </Button>
                                <Button onClick={handleFlipCorrect} className="h-14 text-lg bg-green-600 hover:bg-green-700 shadow-md">
                                    <Check className="w-5 h-5 mr-2" /> Got It! (+1)
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* --- TYPE MODE --- */}
            {gameMode === "type" && (
                <>
                    <p className="text-sm text-slate-400 uppercase tracking-widest mb-4 font-bold">Type the Answer</p>
                    <p className="text-3xl font-bold mb-8 text-slate-900 text-balance">{currentCard.question}</p>
                    
                    {/* FEEDBACK AREAS */}
                    {feedback === "wrong" && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm font-bold animate-in fade-in">
                            Incorrect. Try again or check spelling.
                        </div>
                    )}

                    {feedback === "correct" && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm font-bold animate-in fade-in">
                            Correct! +2 Coins
                        </div>
                    )}

                    {feedback === "skipped" && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 animate-in fade-in">
                            <span className="text-xs font-bold uppercase tracking-widest block mb-1">Missed</span>
                            <span className="font-bold text-lg">{currentCard.answer}</span>
                        </div>
                    )}

                    {/* INPUT FORM */}
                    <form onSubmit={handleTypeSubmit} className="space-y-4">
                        <Input 
                            autoFocus 
                            placeholder="Type answer here..." 
                            value={inputAnswer}
                            onChange={(e) => setInputAnswer(e.target.value)}
                            disabled={feedback === "correct" || feedback === "skipped"}
                            className="h-14 text-lg"
                        />
                        
                        {feedback === "idle" || feedback === "wrong" ? (
                            <Button type="submit" className="w-full h-14 text-lg bg-purple-600 hover:bg-purple-700 shadow-md">
                                Check Answer
                            </Button>
                        ) : null}
                    </form>
                    
                    {(feedback === "correct" || feedback === "skipped") && (
                         <Button onClick={nextCard} className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 shadow-md animate-in zoom-in-50 mt-4">
                             Next Card &rarr;
                         </Button> 
                    )}
                        
                    {feedback !== "correct" && feedback !== "skipped" && (
                        <Button type="button" variant="ghost" onClick={handleTypeSkip} className="w-full text-slate-400 hover:text-red-500 mt-2">
                            Skip this card
                        </Button>
                    )}
                </>
            )}

          </Card>
        </div>
      </div>
    )
  }

  return null
}
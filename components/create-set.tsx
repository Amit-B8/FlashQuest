"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// 1. NEW ICONS: ChevronDown and ChevronUp
import { ArrowLeft, Plus, Save, Pencil, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { useSets } from "@/hooks/use-sets"

type CreateSetProps = {
  onBack: () => void
}

export function CreateSet({ onBack }: CreateSetProps) {
  const { addSet, sets } = useSets()
  
  const [setName, setSetName] = useState("")
  const [cards, setCards] = useState<{ question: string; answer: string }[]>([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [currentAnswer, setCurrentAnswer] = useState("")
  
  // 2. NEW STATE: Track which set is currently open
  const [expandedSetId, setExpandedSetId] = useState<string | null>(null)

  const handleAddCard = () => {
    if (currentQuestion.trim() && currentAnswer.trim()) {
      setCards([...cards, { question: currentQuestion, answer: currentAnswer }])
      setCurrentQuestion("")
      setCurrentAnswer("")
    }
  }

  const handleEditCard = (index: number) => {
    const cardToEdit = cards[index]
    setCurrentQuestion(cardToEdit.question)
    setCurrentAnswer(cardToEdit.answer)
    const newCards = cards.filter((_, i) => i !== index)
    setCards(newCards)
  }

  const handleDeleteCard = (index: number) => {
    const newCards = cards.filter((_, i) => i !== index)
    setCards(newCards)
  }

  const handleSaveSet = () => {
    if (setName.trim() && cards.length > 0) {
      const formattedName = setName.trim()
      
      const nameExists = sets.some(
        (s) => s.name.toLowerCase() === formattedName.toLowerCase()
      )

      if (nameExists) {
        alert("A set with this name already exists! Please choose a different name.")
        return
      }

      addSet({
        id: Date.now().toString(),
        name: formattedName,
        cards,
      })
      onBack()
    }
  }

  // 3. Helper to toggle the accordion
  const toggleSet = (id: string) => {
    if (expandedSetId === id) {
      setExpandedSetId(null) // Close it if it's already open
    } else {
      setExpandedSetId(id) // Open the new one
    }
  }

  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Container */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm mb-8 border border-white/50">
          <Button variant="ghost" onClick={onBack} className="mb-2 pl-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Flashcard Set
          </h1>
        </div>

        {/* INPUT FORM */}
        <Card className="p-6 mb-6 bg-white/95 backdrop-blur shadow-lg">
          <Input
            placeholder="Set Name (e.g., Spanish Vocab, History Quiz)"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            className="text-lg mb-6"
          />

          <div className="space-y-4">
            <Textarea
              placeholder="Question"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              className="min-h-[100px]"
            />
            <Textarea
              placeholder="Answer"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleAddCard} className="w-full bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>
        </Card>

        {/* DRAFT CARDS LIST */}
        {cards.length > 0 && (
          <Card className="p-6 mb-6 bg-white/95 backdrop-blur shadow-lg">
            <h3 className="font-bold text-lg mb-4">Cards in this set ({cards.length})</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {cards.map((card, index) => (
                <div key={index} className="p-3 bg-slate-100 rounded-lg border border-slate-200 flex justify-between items-center group">
                  <div className="flex-1 mr-2">
                    <p className="font-medium text-sm text-slate-500">Q: {card.question}</p>
                    <p className="text-sm font-semibold text-slate-800">A: {card.answer}</p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleEditCard(index)}
                      className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => handleDeleteCard(index)}
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Button
          onClick={handleSaveSet}
          disabled={!setName.trim() || cards.length === 0}
          className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl mb-12"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Set
        </Button>

        {/* EXISTING SETS (With Expand Feature) */}
        {sets.length > 0 && (
          <div>
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-t-xl border-b border-slate-200 inline-block">
               <h3 className="font-bold text-slate-700">Your Existing Sets</h3>
            </div>
            
            <div className="grid gap-4 bg-white/50 p-6 rounded-b-xl rounded-tr-xl border border-white/50 backdrop-blur-sm">
              {sets.map((set) => {
                const isOpen = expandedSetId === set.id
                
                return (
                  <Card 
                    key={set.id} 
                    className={`bg-white shadow-sm transition-all overflow-hidden cursor-pointer ${isOpen ? 'ring-2 ring-blue-400' : 'hover:shadow-md'}`}
                    onClick={() => toggleSet(set.id)}
                  >
                    {/* Card Header */}
                    <div className="p-6 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{set.name}</h3>
                        <p className="text-sm text-muted-foreground">{set.cards.length} cards</p>
                      </div>
                      <div className="text-slate-400">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Expanded Content (The Q&As) */}
                    {isOpen && (
                      <div className="bg-slate-50 border-t border-slate-100 p-4 animate-in slide-in-from-top-2">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-3">Cards Preview</p>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                          {set.cards.map((c, i) => (
                            <div key={i} className="text-sm p-2 bg-white border rounded shadow-sm">
                              <span className="font-bold text-blue-600">Q:</span> {c.question} <br/>
                              <span className="font-bold text-green-600">A:</span> {c.answer}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
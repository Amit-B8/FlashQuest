"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ArrowLeft, Plus, Save, Pencil, Trash2, ChevronDown, ChevronUp, Upload, X 
} from "lucide-react"
import { useSets, Flashcard } from "@/hooks/use-sets" // This imports the type we just fixed

type CreateSetProps = {
  onBack: () => void
}

export function CreateSet({ onBack }: CreateSetProps) {
  const { addSet, sets, updateCard, deleteCard, addCardToSet } = useSets()
  
  // Form State
  const [setName, setSetName] = useState("")
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [currentImage, setCurrentImage] = useState<string | undefined>(undefined)
  
  // Data State: Explicitly using Flashcard type
  const [cards, setCards] = useState<Flashcard[]>([])
  
  // UI State
  const [expandedSetId, setExpandedSetId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // --- ADDED: MODAL STATE FOR EDITING ---
  const modalFileInputRef = useRef<HTMLInputElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null)
  const [editingSetId, setEditingSetId] = useState<string | null>(null)
  const [formQuestion, setFormQuestion] = useState("")
  const [formAnswer, setFormAnswer] = useState("")
  const [formImage, setFormImage] = useState<string | undefined>(undefined)

  // --- ADDED: MODAL & EXISTING CARD HANDLERS ---
  const openEditModal = (e: React.MouseEvent, setId: string, index: number, card: Flashcard) => {
    e.stopPropagation() // Prevents the set from collapsing when you click edit
    setEditingSetId(setId)
    setEditingCardIndex(index)
    setFormQuestion(card.question)
    setFormAnswer(card.answer)
    setFormImage(card.image)
    setIsModalOpen(true)
  }

  const openAddModal = (e: React.MouseEvent, setId: string) => {
    e.stopPropagation()
    setEditingSetId(setId)
    setEditingCardIndex(null) // null means we are adding
    setFormQuestion("")
    setFormAnswer("")
    setFormImage(undefined)
    setIsModalOpen(true)
  }

  const handleModalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 500000) { 
        alert("Image is too large! Please use an image under 500KB.")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setFormImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSaveModalCard = () => {
    if (!formQuestion.trim() || !formAnswer.trim() || !editingSetId) return

    const newCard: Flashcard = {
      question: formQuestion.trim(),
      answer: formAnswer.trim(),
      image: formImage
    }

    if (editingCardIndex !== null) {
      updateCard(editingSetId, editingCardIndex, newCard) // Editing
    } else {
      addCardToSet(editingSetId, newCard) // Adding new
    }
    setIsModalOpen(false)
  }

  const handleDeleteExistingCard = (e: React.MouseEvent, setId: string, index: number) => {
    e.stopPropagation()
    if (confirm("Delete this card permanently?")) {
      deleteCard(setId, index)
    }
  }

  // --- IMAGE HANDLING LOGIC ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 500000) { // 500KB limit
        alert("Image is too large! Please use an image under 500KB.")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setCurrentImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddCard = () => {
    if (!setName.trim()) {
      alert("Please enter a Set Name before adding cards!")
      return
    }

    if (currentQuestion.trim() && currentAnswer.trim()) {
      setCards([...cards, { 
        question: currentQuestion, 
        answer: currentAnswer,
        image: currentImage
      }])
      // Reset inputs
      setCurrentQuestion("")
      setCurrentAnswer("")
      setCurrentImage(undefined)
    }
  }

  const handleEditCard = (index: number) => {
    const cardToEdit = cards[index]
    setCurrentQuestion(cardToEdit.question)
    setCurrentAnswer(cardToEdit.answer)
    setCurrentImage(cardToEdit.image)
    
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
        alert("A set with this name already exists!")
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

  const toggleSet = (id: string) => {
    if (expandedSetId === id) {
      setExpandedSetId(null)
    } else {
      setExpandedSetId(id)
    }
  }

  return (
    <div className="min-h-screen p-6 relative z-10">
      {/* --- ADDED: EDIT MODAL OVERLAY --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-white shadow-2xl animate-in zoom-in-95">
            <h2 className="text-xl font-bold mb-4">
              {editingCardIndex !== null ? "Edit Card" : "Add New Card"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Question</label>
                <Textarea 
                  value={formQuestion} 
                  onChange={(e) => setFormQuestion(e.target.value)} 
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500 mb-1 block">Image (Optional)</label>
                <div className="flex items-center gap-4">
                  <Button 
                    type="button" variant="outline" size="sm" 
                    onClick={() => modalFileInputRef.current?.click()}
                    className="bg-slate-50 border-dashed border-2 text-slate-500"
                  >
                    <Upload className="w-4 h-4 mr-2" /> {formImage ? "Change Image" : "Upload Image"}
                  </Button>
                  
                  <input 
                    type="file" ref={modalFileInputRef} className="hidden" 
                    accept="image/*" onChange={handleModalImageUpload} 
                  />

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
                <Textarea 
                  value={formAnswer} 
                  onChange={(e) => setFormAnswer(e.target.value)} 
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveModalCard} disabled={!formQuestion || !formAnswer}>Save Card</Button>
            </div>
          </Card>
        </div>
      )}
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
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
            placeholder="Set Name (e.g., Spanish Vocab, Anatomy)"
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            className="text-lg mb-6"
          />

          <div className="space-y-4">
            <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Question</label>
                <Textarea
                    placeholder="Enter question text..."
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    className="min-h-[80px]"
                />
            </div>

            {/* IMAGE UPLOADER UI */}
            <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Image (Optional)</label>
                <div className="flex items-center gap-4">
                    <Button 
                        type="button" variant="outline" size="sm" 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-slate-50 border-dashed border-2 text-slate-500"
                    >
                        <Upload className="w-4 h-4 mr-2" /> 
                        {currentImage ? "Change Image" : "Upload Image"}
                    </Button>
                    
                    <input 
                        type="file" ref={fileInputRef} className="hidden" 
                        accept="image/*" onChange={handleImageUpload} 
                    />

                    {currentImage && (
                       <div className="relative w-12 h-12 rounded border overflow-hidden group">
                          <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                             onClick={() => setCurrentImage(undefined)}
                             className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <X className="w-4 h-4 text-white" />
                          </button>
                       </div>
                    )}
                </div>
            </div>

            <div>
                <label className="text-xs font-bold uppercase text-slate-400 mb-1 block">Answer</label>
                <Textarea
                    placeholder="Enter answer text..."
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    className="min-h-[80px]"
                />
            </div>

            <Button 
                onClick={handleAddCard} 
                disabled={!currentQuestion || !currentAnswer || !setName.trim()} 
                className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              {setName.trim() ? "Add Card" : "Name your set first"}
            </Button>
          </div>
        </Card>

        {/* DRAFT CARDS LIST */}
        {cards.length > 0 && (
          <Card className="p-6 mb-6 bg-white/95 backdrop-blur shadow-lg">
            <h3 className="font-bold text-lg mb-4">Cards in this set ({cards.length})</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {cards.map((card, index) => (
                <div key={index} className="p-3 bg-slate-100 rounded-lg border border-slate-200 flex justify-between items-center group">
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    {card.image && (
                        <div className="w-10 h-10 bg-white rounded border flex-shrink-0 overflow-hidden">
                            <img src={card.image} alt="Thumb" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="min-w-0">
                        <p className="font-medium text-sm text-slate-500 truncate">Q: {card.question}</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">A: {card.answer}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1 flex-shrink-0 ml-2">
                    <Button 
                      size="icon" variant="ghost" onClick={() => handleEditCard(index)}
                      className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" variant="ghost" onClick={() => handleDeleteCard(index)}
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
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

        {/* EXISTING SETS */}
        {sets.length > 0 && (
          <div>
            <div className="bg-white/90 backdrop-blur-md p-3 rounded-t-xl border-b border-slate-200 inline-block">
               <h3 className="font-bold text-slate-700">Your Existing Sets</h3>
            </div>
            
            <div className="grid gap-4 bg-white/50 p-6 rounded-b-xl rounded-tr-xl border border-white/50 backdrop-blur-sm">
              {sets.map((set) => {
                const isOpen = expandedSetId === set.id
                return (
                  <Card key={set.id} className={`bg-white shadow-sm transition-all overflow-hidden cursor-pointer ${isOpen ? 'ring-2 ring-blue-400' : 'hover:shadow-md'}`} onClick={() => toggleSet(set.id)}>
                    <div className="p-6 flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{set.name}</h3>
                        <p className="text-sm text-muted-foreground">{set.cards.length} cards</p>
                      </div>
                      <div className="text-slate-400">
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="bg-slate-50 border-t border-slate-100 p-4 animate-in slide-in-from-top-2">
                        
                        {/* --- ADDED: The Add Card Button Header --- */}
                        <div className="flex justify-between items-center mb-3">
                          <p className="text-xs font-bold text-slate-400 uppercase">Cards Preview</p>
                          <Button size="sm" variant="outline" onClick={(e) => openAddModal(e, set.id)} className="h-7 text-xs">
                            <Plus className="w-3 h-3 mr-1" /> Add Card
                          </Button>
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                          {set.cards.map((c, i) => (
                            <div key={i} className="text-sm p-2 bg-white border rounded shadow-sm flex items-center justify-between gap-3">
                              
                              {/* ADDED flex-1 HERE TO FIX SPACING */}
                              <div className="flex items-center gap-3 overflow-hidden flex-1">
                                {c.image && (
                                  <div className="w-8 h-8 bg-slate-100 rounded border flex-shrink-0 overflow-hidden">
                                      <img src={c.image} alt="Thumb" className="w-full h-full object-cover" />
                                  </div>
                                )}
                                <div>
                                    <span className="font-bold text-blue-600">Q:</span> {c.question} <br/>
                                    <span className="font-bold text-green-600">A:</span> {c.answer}
                                </div>
                              </div>
                              {/* --- ADDED: EDIT/DELETE BUTTONS FOR EXISTING CARDS --- */}
                              <div className="flex gap-1 flex-shrink-0">
                                <Button 
                                  size="icon" variant="ghost" className="h-6 w-6" 
                                  onClick={(e) => openEditModal(e, set.id, i, c)}
                                >
                                  <Pencil className="w-3 h-3 text-slate-400 hover:text-blue-600" />
                                </Button>
                                <Button 
                                  size="icon" variant="ghost" className="h-6 w-6" 
                                  onClick={(e) => handleDeleteExistingCard(e, set.id, i)}
                                >
                                  <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-600" />
                                </Button>
                              </div>
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
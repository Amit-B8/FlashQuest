"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Save } from "lucide-react"
import { useSets } from "@/hooks/use-sets"

type CreateSetProps = {
  onBack: () => void
}

export function CreateSet({ onBack }: CreateSetProps) {
  // 1. Destructure 'sets' so we can check against existing ones
  const { addSet, sets } = useSets()
  
  const [setName, setSetName] = useState("")
  const [cards, setCards] = useState<{ question: string; answer: string }[]>([])
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [currentAnswer, setCurrentAnswer] = useState("")

  const handleAddCard = () => {
    if (currentQuestion.trim() && currentAnswer.trim()) {
      setCards([...cards, { question: currentQuestion, answer: currentAnswer }])
      setCurrentQuestion("")
      setCurrentAnswer("")
    }
  }

  const handleSaveSet = () => {
    if (setName.trim() && cards.length > 0) {
      const formattedName = setName.trim()

      // 2. CHECK FOR DUPLICATES
      // We look for any set that has the EXACT same name (case-insensitive)
      const nameExists = sets.some(
        (s) => s.name.toLowerCase() === formattedName.toLowerCase()
      )

      if (nameExists) {
        alert("A set with this name already exists! Please choose a different name.")
        return // Stop the function here so we don't save
      }

      // 3. Save if valid
      addSet({
        id: Date.now().toString(),
        name: formattedName,
        cards,
      })
      onBack()
    }
  }

  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Container (The Safe Box) */}
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-sm mb-8 border border-white/50">
          <Button variant="ghost" onClick={onBack} className="mb-2 pl-0 hover:bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create Flashcard Set
          </h1>
        </div>

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

        {cards.length > 0 && (
          <Card className="p-6 mb-6 bg-white/95 backdrop-blur shadow-lg">
            <h3 className="font-bold text-lg mb-4">Cards in this set ({cards.length})</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {cards.map((card, index) => (
                <div key={index} className="p-3 bg-slate-100 rounded-lg border border-slate-200">
                  <p className="font-medium text-sm text-slate-500">Q: {card.question}</p>
                  <p className="text-sm font-semibold text-slate-800">A: {card.answer}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Button
          onClick={handleSaveSet}
          disabled={!setName.trim() || cards.length === 0}
          className="w-full h-14 text-lg bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Set
        </Button>
      </div>
    </div>
  )
}
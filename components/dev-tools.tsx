"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, PlusCircle, Wrench } from "lucide-react"

export function DevTools() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleResetAll = () => {
    if (confirm("⚠️ RESET ALL DATA?")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleAddCoins = () => {
    const current = Number(localStorage.getItem("flashquest-coins") || 0)
    localStorage.setItem("flashquest-coins", (current + 1000).toString())
    window.location.reload()
  }

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        // CHANGED: bottom-4 to bottom-20 to move it up
        className="fixed bottom-20 left-4 z-[9999] rounded-full h-12 w-12 bg-black text-white border-2 border-white/20 shadow-2xl"
      >
        <Wrench className="w-5 h-5" />
      </Button>
    )
  }

  return (
    // CHANGED: bottom-4 to bottom-20 here as well
    <div className="fixed bottom-20 left-4 z-[9999] p-4 bg-black text-white rounded-xl border border-white/20 shadow-2xl w-64">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
        <h3 className="font-bold text-xs text-gray-400">DEV TOOLS</h3>
        <button onClick={() => setIsOpen(false)} className="hover:text-red-500">✕</button>
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={handleAddCoins} className="bg-green-700 hover:bg-green-600">
          <PlusCircle className="w-4 h-4 mr-2" /> Add 1000 Coins
        </Button>
        <Button onClick={handleResetAll} className="bg-red-700 hover:bg-red-600">
          <Trash2 className="w-4 h-4 mr-2" /> Reset All Data
        </Button>
      </div>
    </div>
  )
}
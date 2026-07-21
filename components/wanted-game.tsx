"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Trophy, Timer, Crosshair, CheckCircle2, AlertOctagon, Skull } from "lucide-react"
import { useCoins } from "@/hooks/use-coins"

// GAME CONFIGURATION
const CONFIG = {
  GAME_DURATION: 30,       // 30 Seconds for the Matrix Mode
  WIN_REWARD: 30,          // 30 Coins for finding both!
  TIME_PENALTY: 3,         // 3 Second penalty for clicking a decoy
  TARGETS: ["🦁", "🦊", "🐼", "🐨", "🐯", "🐸", "🐙", "🦄", "🐵", "🐥", "🐝", "🦖"],
  DECOYS: ["🐱", "🐶", "🐹", "🐰", "🐻", "🐷", "🐮", "🐗", "🐣", "🦉", "🐊", "🐢", "🦎", "🐍", "🐠", "🦋", "🐜", "🐞", "🦞", "🦕", "🐆", "🦓", "🦍", "🦛"],
}

type EmojiItem = {
  id: string
  char: string
  isTarget: boolean
}

type WantedGameProps = {
  onBack: () => void
}

export function WantedGame({ onBack }: WantedGameProps) {
  const { coins, addCoins } = useCoins()
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle")
  
  // Matrix State
  const [targetEmojis, setTargetEmojis] = useState<string[]>([])
  const [rowLanes, setRowLanes] = useState<EmojiItem[][]>([])
  const [colLanes, setColLanes] = useState<EmojiItem[][]>([])
  const [foundIds, setFoundIds] = useState<string[]>([])
  const [clickedDecoyIds, setClickedDecoyIds] = useState<string[]>([])
  
  const [timeLeft, setTimeLeft] = useState(CONFIG.GAME_DURATION)

  // Timer Effect
  useEffect(() => {
    if (gameState !== "playing") return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameState("lost")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState])

  const startHunt = () => {
    // 1. Pick TWO unique targets
    const shuffledTargets = [...CONFIG.TARGETS].sort(() => Math.random() - 0.5)
    const selectedTargets = [shuffledTargets[0], shuffledTargets[1]]
    
    // 2. Build the decoy pool (118 decoys to reach exactly 120 total items)
    const decoyPool: string[] = []
    for (let i = 0; i < 118; i++) {
      let randomDecoy = CONFIG.DECOYS[Math.floor(Math.random() * CONFIG.DECOYS.length)]
      // Prevent decoy from matching our active targets
      while (selectedTargets.includes(randomDecoy)) {
        randomDecoy = CONFIG.DECOYS[Math.floor(Math.random() * CONFIG.DECOYS.length)]
      }
      decoyPool.push(randomDecoy)
    }

    // 3. Combine and shuffle all 120 items with unique IDs
    const allItems: EmojiItem[] = [
      { id: "t1", char: selectedTargets[0], isTarget: true },
      { id: "t2", char: selectedTargets[1], isTarget: true },
      ...decoyPool.map((char, index) => ({ id: `d${index}`, char, isTarget: false }))
    ].sort(() => Math.random() - 0.5)

    // 4. Split into Horizontal Rows and Vertical Columns
    // 5 Rows × 12 Items = 60 Items
    const rLanes: EmojiItem[][] = []
    for (let i = 0; i < 5; i++) {
      rLanes.push(allItems.slice(i * 12, (i + 1) * 12))
    }
    
    // 6 Columns × 10 Items = 60 Items
    const cLanes: EmojiItem[][] = []
    for (let i = 0; i < 6; i++) {
      cLanes.push(allItems.slice(60 + i * 10, 60 + (i + 1) * 10))
    }

    setTargetEmojis(selectedTargets)
    setRowLanes(rLanes)
    setColLanes(cLanes)
    setFoundIds([])
    setClickedDecoyIds([])
    setTimeLeft(CONFIG.GAME_DURATION)
    setGameState("playing")
  }

  const handleEmojiClick = (item: EmojiItem) => {
    if (gameState !== "playing") return

    if (item.isTarget) {
      if (foundIds.includes(item.id)) return // Already found
      
      const newFound = [...foundIds, item.id]
      setFoundIds(newFound)

      // Did they find BOTH?
      if (newFound.length === 2) {
        setGameState("won")
        addCoins(CONFIG.WIN_REWARD)
      }
    } else {
      // Clicked a decoy
      if (clickedDecoyIds.includes(item.id)) return
      
      setClickedDecoyIds((prev) => [...prev, item.id])

      // Time Penalty
      if (CONFIG.TIME_PENALTY > 0) {
        setTimeLeft((prev) => {
          const nextTime = Math.max(0, prev - CONFIG.TIME_PENALTY)
          if (nextTime === 0) setGameState("lost")
          return nextTime
        })
      }
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-6 flex flex-col justify-center items-center relative z-10 w-full overflow-hidden">
      
      {/* CSS For the Matrix Scrolling Mechanics */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}} />

      <div className="w-full max-w-4xl flex flex-col flex-1">
        
        {/* HEADER BAR */}
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={onBack} size="sm" className="bg-white/50 hover:bg-white/80 backdrop-blur">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
          </Button>

          <Card className="px-4 py-2 bg-slate-900 border-cyan-500/50 flex items-center gap-2 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-cyan-400">{coins} Coins</span>
          </Card>
        </div>

        {/* --- IDLE / PRE-GAME STATE (Vibrant Arcade Pop) --- */}
        {gameState === "idle" && (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <Card className="max-w-md w-full bg-slate-950 border-4 border-pink-500 rounded-3xl p-8 shadow-[0_0_50px_rgba(236,72,153,0.4)] text-center flex flex-col items-center relative overflow-hidden">
              
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500" />
              
              <Crosshair className="w-14 h-14 text-cyan-400 mb-2 animate-pulse" />
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-pink-400 tracking-widest uppercase mb-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                CYBER BOUNTY
              </h1>
              <p className="text-xs font-bold text-pink-300 tracking-[0.4em] uppercase mb-8">
                Matrix Intercept Mode
              </p>

              {/* Suspicious Target Box */}
              <div className="flex gap-4 mb-8">
                <div className="w-24 h-24 bg-white/5 border-2 border-dashed border-cyan-400/70 rounded-xl flex items-center justify-center shadow-inner relative backdrop-blur-md">
                  <span className="text-5xl animate-pulse">❓</span>
                </div>
                <div className="w-24 h-24 bg-white/5 border-2 border-dashed border-pink-400/70 rounded-xl flex items-center justify-center shadow-inner relative backdrop-blur-md">
                  <span className="text-5xl animate-pulse" style={{ animationDelay: '0.5s' }}>❓</span>
                </div>
              </div>

              <div className="space-y-4 mb-8 w-full px-2">
                <div className="flex items-center justify-center gap-2 text-yellow-300 font-black text-xl bg-black/60 py-3 rounded-lg border border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <span>REWARD: {CONFIG.WIN_REWARD} COINS</span>
                </div>
                <p className="text-sm text-cyan-100 font-medium leading-relaxed bg-white/5 p-4 rounded-lg border border-white/10">
                  <span className="text-pink-400 font-bold">TWO suspects</span> are moving through the matrix grid! Columns move vertically, rows move horizontally. Catch both before the <span className="text-yellow-300 font-bold">{CONFIG.GAME_DURATION}s</span> timer runs out.
                </p>
                <p className="text-xs text-red-400 font-bold uppercase tracking-wider">
                  ⚠️ Penalty: Wrong clicks lose {CONFIG.TIME_PENALTY} seconds!
                </p>
              </div>

              <Button 
                onClick={startHunt} 
                size="lg"
                className="w-full bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-500 hover:to-pink-500 text-white font-black py-7 text-xl rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all hover:scale-[1.02] uppercase tracking-widest border-b-4 border-slate-900 active:border-b-0 active:translate-y-1"
              >
                Enter the Matrix
              </Button>
            </Card>
          </div>
        )}

        {/* --- PLAYING / ACTIVE HUNT STATE --- */}
        {gameState === "playing" && (
          <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto">
            
            {/* HUD / GAME INFOBAR */}
            <Card className="p-4 mb-4 bg-slate-900 border-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.15)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Dual Targets Display */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-cyan-500 tracking-widest uppercase">Targets:</span>
                
                <div className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 text-3xl relative transition-all ${foundIds.includes("t1") ? "bg-green-900/50 border-green-500 opacity-60" : "bg-slate-800 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]"}`}>
                  {targetEmojis[0]}
                  {foundIds.includes("t1") && <CheckCircle2 className="absolute inset-0 m-auto text-green-400 w-8 h-8 drop-shadow-md" />}
                </div>

                <div className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 text-3xl relative transition-all ${foundIds.includes("t2") ? "bg-green-900/50 border-green-500 opacity-60" : "bg-slate-800 border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.3)]"}`}>
                  {targetEmojis[1]}
                  {foundIds.includes("t2") && <CheckCircle2 className="absolute inset-0 m-auto text-green-400 w-8 h-8 drop-shadow-md" />}
                </div>
              </div>

              {/* Progress-based Timer */}
              <div className="flex-1 max-w-sm flex items-center gap-3">
                <Timer className={`w-6 h-6 ${timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-cyan-400"}`} />
                <div className="flex-1 bg-slate-800 h-6 rounded-full overflow-hidden border-2 border-slate-700 relative shadow-inner">
                  <div 
                    className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 10 ? "bg-red-500" : "bg-gradient-to-r from-cyan-500 to-pink-500"}`}
                    style={{ width: `${(timeLeft / CONFIG.GAME_DURATION) * 100}%` }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white drop-shadow-md">
                    {timeLeft} SECONDS
                  </span>
                </div>
              </div>
            </Card>

            {/* THE MATRIX ARENA (Overlapping Marquees) */}
            <div className="relative w-full h-[60vh] min-h-[400px] bg-slate-950/80 backdrop-blur-md border-2 border-cyan-500/40 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              
              {/* === HORIZONTAL LANES (Rows) === */}
              {rowLanes.map((lane, rIdx) => {
                const isLeft = rIdx % 2 === 0
                // Randomize speed slightly between 25s and 35s
                const speed = isLeft ? '30s' : '26s' 
                
                return (
                  <div 
                    key={`row-${rIdx}`} 
                    className="absolute w-[200%] h-[20%] flex items-center justify-around z-10"
                    style={{ 
                      top: `${rIdx * 20}%`, 
                      animation: `scroll-${isLeft ? 'left' : 'right'} ${speed} linear infinite` 
                    }}
                  >
                    {[...lane, ...lane].map((item, i) => {
                      const isFound = foundIds.includes(item.id)
                      const isClicked = clickedDecoyIds.includes(item.id)
                      
                      return (
                        <button
                          key={`${item.id}-${i}`}
                          onClick={() => handleEmojiClick(item)}
                          disabled={isFound || isClicked}
                          className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-3xl md:text-4xl rounded-xl transition-all duration-200 cursor-pointer
                            ${isFound ? 'bg-green-500/20 border border-green-500/50 scale-90 opacity-50' : ''}
                            ${isClicked ? 'bg-red-500/20 border border-red-500/50 scale-90 opacity-50' : ''}
                            ${!isFound && !isClicked ? 'bg-slate-800/80 border border-cyan-500/30 hover:bg-cyan-900 hover:scale-125 hover:z-50 shadow-lg' : ''}
                          `}
                        >
                          <span className={`${isFound || isClicked ? 'grayscale opacity-50' : ''} drop-shadow-md`}>{item.char}</span>
                          {isClicked && <span className="absolute text-red-500 font-black text-2xl">X</span>}
                        </button>
                      )
                    })}
                  </div>
                )
              })}

              {/* === VERTICAL LANES (Columns) === */}
              {colLanes.map((lane, cIdx) => {
                const isUp = cIdx % 2 === 0
                // Randomize speed slightly between 32s and 38s
                const speed = isUp ? '35s' : '28s'
                
                return (
                  <div 
                    key={`col-${cIdx}`} 
                    className="absolute h-[200%] w-[16.66%] flex flex-col items-center justify-around z-20 pointer-events-none"
                    style={{ 
                      left: `${cIdx * 16.66}%`, 
                      animation: `scroll-${isUp ? 'up' : 'down'} ${speed} linear infinite` 
                    }}
                  >
                    {[...lane, ...lane].map((item, i) => {
                      const isFound = foundIds.includes(item.id)
                      const isClicked = clickedDecoyIds.includes(item.id)
                      
                      return (
                        <button
                          key={`${item.id}-${i}`}
                          onClick={() => handleEmojiClick(item)}
                          disabled={isFound || isClicked}
                          // Re-enable pointer events on the actual buttons!
                          className={`pointer-events-auto w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-3xl md:text-4xl rounded-xl transition-all duration-200 cursor-pointer
                            ${isFound ? 'bg-green-500/20 border border-green-500/50 scale-90 opacity-50' : ''}
                            ${isClicked ? 'bg-red-500/20 border border-red-500/50 scale-90 opacity-50' : ''}
                            ${!isFound && !isClicked ? 'bg-slate-800/80 border border-pink-500/30 hover:bg-pink-900 hover:scale-125 hover:z-50 shadow-lg' : ''}
                          `}
                        >
                          <span className={`${isFound || isClicked ? 'grayscale opacity-50' : ''} drop-shadow-md`}>{item.char}</span>
                          {isClicked && <span className="absolute text-red-500 font-black text-2xl">X</span>}
                        </button>
                      )
                    })}
                  </div>
                )
              })}

            </div>
          </div>
        )}

        {/* --- WON STATE --- */}
        {gameState === "won" && (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <Card className="max-w-md w-full bg-slate-950 border-4 border-green-500 rounded-3xl p-8 shadow-[0_0_50px_rgba(34,197,94,0.4)] text-center flex flex-col items-center relative overflow-hidden">
              <CheckCircle2 className="w-20 h-20 text-green-400 mb-4 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
              <h1 className="text-4xl font-black text-white mb-2 tracking-widest uppercase">
                HACK SECURE
              </h1>
              <p className="text-xs font-bold text-green-400 tracking-[0.3em] uppercase mb-8">
                Bounty Acquired
              </p>

              <div className="flex gap-6 mb-8">
                <div className="w-24 h-24 bg-green-950/50 border-2 border-green-500 rounded-xl flex items-center justify-center shadow-inner relative">
                  <span className="text-5xl z-10">{targetEmojis[0]}</span>
                  <CheckCircle2 className="absolute -bottom-3 -right-3 w-8 h-8 text-green-400 bg-slate-950 rounded-full" />
                </div>
                <div className="w-24 h-24 bg-green-950/50 border-2 border-green-500 rounded-xl flex items-center justify-center shadow-inner relative">
                  <span className="text-5xl z-10">{targetEmojis[1]}</span>
                  <CheckCircle2 className="absolute -bottom-3 -right-3 w-8 h-8 text-green-400 bg-slate-950 rounded-full" />
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-sm text-slate-300 font-medium">
                  Targets successfully extracted from the matrix with <span className="font-bold text-green-400">{timeLeft} seconds</span> remaining.
                </p>
                <div className="inline-flex items-center gap-2 bg-yellow-900/50 border border-yellow-500/50 px-6 py-3 rounded-xl text-yellow-400 font-black text-2xl shadow-md">
                  <Trophy className="w-8 h-8" />
                  <span>+{CONFIG.WIN_REWARD} COINS</span>
                </div>
              </div>

              <Button 
                onClick={onBack} 
                size="lg"
                className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-7 text-xl rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] uppercase tracking-widest transition-transform hover:-translate-y-1"
              >
                Claim Reward
              </Button>
            </Card>
          </div>
        )}

        {/* --- LOST STATE --- */}
        {gameState === "lost" && (
          <div className="flex-1 flex flex-col items-center justify-center py-8">
            <Card className="max-w-md w-full bg-slate-950 border-4 border-red-600 rounded-3xl p-8 shadow-[0_0_50px_rgba(220,38,38,0.4)] text-center flex flex-col items-center relative overflow-hidden">
              <Skull className="w-16 h-16 text-red-500 mb-4 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse" />
              <h2 className="text-4xl font-black text-white uppercase tracking-widest mb-2">
                SYSTEM FAILURE
              </h2>
              <p className="text-xs font-bold text-red-400 tracking-[0.3em] uppercase mb-8">
                Targets Escaped
              </p>
              
              <div className="flex gap-4 mb-8 opacity-40 grayscale">
                <div className="w-20 h-20 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center">
                  <span className="text-5xl">{targetEmojis[0]}</span>
                </div>
                <div className="w-20 h-20 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-center">
                  <span className="text-5xl">{targetEmojis[1]}</span>
                </div>
              </div>
              
              <p className="text-red-200 font-medium text-sm mb-8 bg-red-950/50 p-4 border border-red-900/50 rounded-lg">
                Time expired. The suspects vanished into the data stream. Your bounty is forfeit.
              </p>
              
              <Button onClick={onBack} size="lg" className="w-full bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest py-7 rounded-xl transition-transform hover:-translate-y-1 border-b-4 border-slate-950 active:border-b-0 active:translate-y-1">
                Return to Shop
              </Button>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}
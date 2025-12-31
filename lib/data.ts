"use client"

// --- TYPES ---

export type AvatarItem = {
  id: string
  name: string
  cost: number
  icon: string | null
  image: string | null
}

export type BackgroundItem = {
  id: string
  name: string
  cost: number
  class: string
}

export type PetItem = {
  id: string
  name: string
  type: "pet" | "plant"
  price: number
  icon: string
  hoverAnim: string
  interactAnim: string
}

// --- DATA LISTS ---

export const AVATARS: AvatarItem[] = [
  { id: "default", name: "Default", cost: 0, icon: "🙂", image: null },
  { id: "robot", name: "Cool Robot", cost: 150, icon: "🤖", image: null },
  { id: "pirate", name: "Pirate", cost: 200, icon: "🏴‍☠️", image: null },
  { id: "ninja", name: "Ninja", cost: 250, icon: "🥷", image: null },
  { id: "knight", name: "Knight", cost: 300, icon: "🛡️", image: null },
  { id: "ghost", name: "Ghost", cost: 350, icon: "👻", image: null },
  { id: "alien", name: "Alien", cost: 400, icon: "👽", image: null },
  { id: "vampire", name: "Vampire", cost: 450, icon: "🧛‍♂️", image: null },
  { id: "samurai", name: "Samurai", cost: 500, icon: "⚔️", image: null },
  { id: "wizard", name: "Wizard", cost: 600, icon: "🧙‍♂️", image: null },
  { id: "dragon", name: "Dragon", cost: 700, icon: "🐉", image: null },
  { id: "king", name: "King", cost: 800, icon: "👑", image: null },
  { id: "phoenix", name: "Phoenix", cost: 900, icon: "🔥", image: null },
  { id: "god", name: "Lightning", cost: 1100, icon: "⚡", image: null },
  { id: "galaxy", name: "Galaxy", cost: 1300, icon: "🌌", image: null },
]

export const BACKGROUNDS: BackgroundItem[] = [
  { id: "default", name: "Default", cost: 0, class: "bg-gradient-to-br from-blue-50 to-purple-50" },
  { id: "blue-sky", name: "Blue Sky", cost: 100, class: "bg-gradient-to-b from-blue-300 to-blue-100" },
  { id: "sunset", name: "Sunset", cost: 400, class: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" },
  { id: "forest", name: "Forest", cost: 250, class: "bg-gradient-to-br from-green-600 to-emerald-900" },
  { id: "sunshine", name: "Sunshine", cost: 150, class: "bg-gradient-to-br from-yellow-200 to-yellow-400" },
  { id: "lemonade", name: "Lemonade", cost: 180, class: "bg-gradient-to-br from-yellow-100 via-amber-200 to-orange-200" },
  { id: "mint", name: "Mint", cost: 200, class: "bg-gradient-to-br from-green-200 to-emerald-300" },
  { id: "spring", name: "Spring", cost: 220, class: "bg-gradient-to-br from-lime-200 to-green-300" },
  { id: "peach", name: "Peach", cost: 260, class: "bg-gradient-to-br from-orange-200 to-pink-300" },
  { id: "blossom", name: "Blossom", cost: 300, class: "bg-gradient-to-br from-pink-200 via-rose-300 to-fuchsia-300" },
  { id: "cotton-candy", name: "Cotton Candy", cost: 350, class: "bg-gradient-to-br from-pink-200 to-purple-300" },
  { id: "midnight-blue", name: "Midnight Blue", cost: 450, class: "bg-gradient-to-br from-blue-800 to-indigo-900" },
  { id: "royal-purple", name: "Royal Purple", cost: 500, class: "bg-gradient-to-br from-purple-700 to-violet-900" },
  { id: "crimson", name: "Crimson", cost: 480, class: "bg-gradient-to-br from-red-700 to-rose-900" },
  { id: "deep-teal", name: "Deep Teal", cost: 420, class: "bg-gradient-to-br from-teal-700 to-cyan-900" },
]

export const PETS: PetItem[] = [
  { 
    id: "dog", 
    name: "Buddy", 
    type: "pet", 
    price: 50, 
    icon: "🐶", 
    hoverAnim: "group-hover:animate-wiggle",
    interactAnim: "animate-spin" 
  },
  { 
    id: "snake", 
    name: "Sly", 
    type: "pet", 
    price: 40, 
    icon: "🐍", 
    hoverAnim: "hover:scale-125", 
    interactAnim: "animate-pulse" 
  },
  { 
    id: "cactus", 
    name: "Spike", 
    type: "plant", 
    price: 20, 
    icon: "🌵", 
    hoverAnim: "hover:animate-pulse", 
    interactAnim: "animate-bounce" 
  },
]
// lib/data.ts

// 1. Define the rules for what an Avatar looks like
export type AvatarItem = {
  id: string
  name: string
  cost: number
  icon: string | null
  image: string | null // <--- Explicitly saying this can be a string
}

export type BackgroundItem = {
  id: string
  name: string
  cost: number
  class: string
}

// 2. Apply the rules to the lists using ': AvatarItem[]'
export const AVATARS: AvatarItem[] = [
  { id: "default", name: "Default", cost: 0, icon: "🙂", image: null },
  { id: "robot", name: "Cool Robot", cost: 50, icon: "🤖", image: null },
  { id: "ninja", name: "Ninja", cost: 100, icon: "🥷", image: null },
  { id: "alien", name: "Alien", cost: 150, icon: "👽", image: null },
  { id: "wizard", name: "Wizard", cost: 200, icon: "🧙‍♂️", image: null },
  { id: "king", name: "King", cost: 500, icon: "👑", image: null },
  
  
  // Now if you uncomment this, it fits the rules perfectly:
  // { id: "wizard", name: "Wizard", cost: 200, icon: null, image: "/avatars/wizard.png" },
]

export const BACKGROUNDS: BackgroundItem[] = [
  { id: "default", name: "Default", cost: 0, class: "bg-gradient-to-br from-blue-50 to-purple-50" },
  { id: "blue-sky", name: "Blue Sky", cost: 50, class: "bg-gradient-to-b from-blue-300 to-blue-100" },
  { id: "sunset", name: "Sunset", cost: 100, class: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" },
  { id: "forest", name: "Forest", cost: 75, class: "bg-gradient-to-br from-green-600 to-emerald-900" },
  { id: "dark-mode", name: "Dark Mode", cost: 150, class: "bg-slate-900" },
]
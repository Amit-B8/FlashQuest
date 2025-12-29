import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlashQuest - Gamified Flashcard Learning",
  description: "Create flashcards, test your knowledge, earn coins, and unlock minigames",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {/* The Main App Content */}
        {children}

        {/* --- ADD FOOTER HERE --- */}
        <footer className="py-8 text-center text-sm text-gray-500 border-t mt-12 bg-white/50 backdrop-blur-sm">
          <p className="font-medium">Built with Next.js and Tailwind CSS. © 2025 Amit Boodhoo.</p>
        </footer>
        {/* ----------------------- */}

        <Analytics />
      </body>
    </html>
  )
}
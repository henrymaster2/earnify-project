import dynamic from "next/dynamic"
import { useState } from "react"
import { Board, initializeBoard, movePiece, PlayerColor, Position } from "@/lib/checkers/logic"

const CheckersBoard = dynamic(() => import("@/components/games/checkers/CheckersBoard"), {
  ssr: false,
})

export default function GamePage() {
  const [gameState, setGameState] = useState<Board>(initializeBoard())
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>("green")
  const [winner, setWinner] = useState<PlayerColor | null>(null)

  const onMove = (from: Position, to: Position) => {
    const updatedBoard = movePiece(gameState, from, to)
    setGameState(updatedBoard)
    setCurrentPlayer(currentPlayer === "green" ? "yellow" : "green")
    // Add logic to determine if game is over
  }

  const sessionCode = "ABC123"

  return (
    <main className="p-8">
      <CheckersBoard
        sessionCode={sessionCode}
        gameState={gameState}
        currentPlayer={currentPlayer}
        winner={winner}
        onMove={onMove}
      />
    </main>
  )
}

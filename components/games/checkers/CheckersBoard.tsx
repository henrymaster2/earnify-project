// components/games/checkers/CheckersBoard.tsx
import React from "react"
import { Board, Position, PlayerColor } from "@/types/checkers"
import { cn } from "@/lib/utils"

interface CheckersBoardProps {
  gameState: Board
  currentPlayer: PlayerColor
  winner: PlayerColor | null
  onMove: (from: Position, to: Position) => void
}

const boardSize = 8

const CheckersBoard: React.FC<CheckersBoardProps> = ({
  gameState,
  currentPlayer,
  winner,
  onMove,
}) => {
  const [selected, setSelected] = React.useState<Position | null>(null)

  const handleClick = (row: number, col: number) => {
    const piece = gameState[row][col]
    if (selected) {
      onMove(selected, { row, col })
      setSelected(null)
    } else if (piece && piece.color === currentPlayer) {
      setSelected({ row, col })
    }
  }

  return (
    <div className="grid grid-cols-8 w-full max-w-[512px] aspect-square border-4 border-yellow-300 rounded-xl overflow-hidden shadow-lg">
      {Array.from({ length: boardSize }).flatMap((_, row) =>
        Array.from({ length: boardSize }).map((_, col) => {
          const isDark = (row + col) % 2 === 1
          const piece = gameState[row][col]
          const isSelected = selected?.row === row && selected?.col === col

          return (
            <div
              key={`${row}-${col}`}
              onClick={() => handleClick(row, col)}
              className={cn(
                "flex items-center justify-center cursor-pointer",
                isDark ? "bg-green-700" : "bg-yellow-100",
                isSelected && "ring-4 ring-blue-500"
              )}
            >
              {piece && (
                <div
                  className={cn(
                    "w-10 h-10 rounded-full",
                    piece.color === "black" ? "bg-black" : "bg-white",
                    piece.isKing && "border-4 border-red-500"
                  )}
                />
              )}
            </div>
          )
        })
      )}
    </div>
  )
}

export default CheckersBoard

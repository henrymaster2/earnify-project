import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

const initialBoard = () => {
  const board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) board[row][col] = "yellow";
    }
  }
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) board[row][col] = "green";
    }
  }
  return board;
};

export default function CheckersGame() {
  const router = useRouter();
  const { sessionCode } = router.query;
  const [board, setBoard] = useState(initialBoard);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("green");
  const [info, setInfo] = useState("Game started");
  const [greenCount, setGreenCount] = useState(12);
  const [yellowCount, setYellowCount] = useState(12);
  const wagerAmount = 100; // mock value, replace with dynamic if needed

  const handleClick = (row, col) => {
    const piece = board[row][col];

    if (selected) {
      const [selRow, selCol] = selected;
      const selPiece = board[selRow][selCol];
      const dx = row - selRow;
      const dy = col - selCol;

      if (
        Math.abs(dx) === 1 &&
        Math.abs(dy) === 1 &&
        !piece &&
        ((selPiece === "green" && dx === -1) || (selPiece === "yellow" && dx === 1))
      ) {
        const newBoard = board.map((r) => [...r]);
        newBoard[row][col] = selPiece;
        newBoard[selRow][selCol] = null;
        setBoard(newBoard);
        setSelected(null);
        setTurn(turn === "green" ? "yellow" : "green");
        setInfo(`${selPiece} moved from ${String.fromCharCode(65 + selCol)}${8 - selRow} to ${String.fromCharCode(65 + col)}${8 - row}`);
      } else if (
        Math.abs(dx) === 2 &&
        Math.abs(dy) === 2 &&
        !piece &&
        board[(row + selRow) / 2][(col + selCol) / 2] &&
        board[(row + selRow) / 2][(col + selCol) / 2] !== selPiece
      ) {
        const newBoard = board.map((r) => [...r]);
        newBoard[row][col] = selPiece;
        newBoard[selRow][selCol] = null;
        newBoard[(row + selRow) / 2][(col + selCol) / 2] = null;
        setBoard(newBoard);
        setSelected(null);
        if (selPiece === "green") setYellowCount((c) => c - 1);
        else setGreenCount((c) => c - 1);
        setTurn(turn === "green" ? "yellow" : "green");
        setInfo(`${selPiece} captured a piece at ${String.fromCharCode(65 + (col + selCol) / 2)}${8 - (row + selRow) / 2}`);
      } else {
        setSelected(null);
      }
    } else {
      if (piece === turn) setSelected([row, col]);
    }
  };

  const renderSquare = (row, col) => {
    const isDark = (row + col) % 2 === 1;
    const piece = board[row][col];
    const isSelected = selected && selected[0] === row && selected[1] === col;

    return (
      <div
        key={`${row}-${col}`}
        className={cn(
          "w-full aspect-square flex items-center justify-center text-xl sm:text-2xl md:text-3xl",
          isDark ? "bg-[#5e3b1d]" : "bg-[#eac79c]",
          isSelected && "ring-4 ring-yellow-400"
        )}
        onClick={() => handleClick(row, col)}
      >
        {piece && (
          <div
            className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-white text-xs font-bold transition-transform hover:scale-110 shadow-md border-2 border-white",
              piece === "green" ? "bg-green-600" : "bg-yellow-400 text-black"
            )}
          >
            H
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#020024] via-[#090979] to-[#00d4ff] text-white px-4 py-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">Checkers Game</h1>

      <div className="bg-white text-black rounded-lg shadow-lg p-3 mb-4 text-center font-medium max-w-xl mx-auto">
        <p className="mb-1">{turn === "green" ? "🟢 Green's Turn" : "🟡 Yellow's Turn"}</p>
        <p className="text-sm italic">{info}</p>
        <p className="text-sm mt-2">🟢 Green Pieces: {greenCount} | 🟡 Yellow Pieces: {yellowCount}</p>
        <p className="text-sm">🏆 Winner will earn: {(wagerAmount * 2 * 0.8).toFixed(0)} coins</p>
      </div>

      <div className="grid grid-cols-8 gap-1 max-w-4xl mx-auto">
        {board.map((row, rowIndex) =>
          row.map((_, colIndex) => renderSquare(rowIndex, colIndex))
        )}
      </div>
    </div>
  );
}

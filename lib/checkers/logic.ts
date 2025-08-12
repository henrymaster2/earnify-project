export type Position = [number, number];

export type PlayerColor = "green" | "yellow";

export type Piece = {
  color: PlayerColor;
  king: boolean;
};

export type Board = (Piece | null)[][];

export function initializeBoard(): Board {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));

  for (let y = 0; y < 3; y++) {
    for (let x = (y + 1) % 2; x < 8; x += 2) {
      board[y][x] = { color: "yellow", king: false };
    }
  }

  for (let y = 5; y < 8; y++) {
    for (let x = (y + 1) % 2; x < 8; x += 2) {
      board[y][x] = { color: "green", king: false };
    }
  }

  return board;
}

export function movePiece(board: Board, from: Position, to: Position): Board {
  const newBoard = board.map(row => row.slice());
  const [fromY, fromX] = from;
  const [toY, toX] = to;

  const piece = newBoard[fromY][fromX];
  if (!piece) return board;

  newBoard[toY][toX] = { ...piece };

  if ((piece.color === "green" && toY === 0) || (piece.color === "yellow" && toY === 7)) {
    newBoard[toY][toX]!.king = true;
  }

  newBoard[fromY][fromX] = null;
  return newBoard;
}

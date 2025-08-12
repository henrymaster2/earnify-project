// /types/checkers.ts

export type PlayerColor = "Red" | "White";

export type Position = {
  row: number;
  col: number;
};

export type Piece = {
  color: PlayerColor;
  isKing: boolean;
};

export type Board = (Piece | null)[][];

export type Move = {
  from: Position;
  to: Position;
};

export type GameState = {
  board: Board;
  currentTurn: PlayerColor;
  selectedPosition: Position | null;
  possibleMoves: Position[];
  redPlayerId: string;
  whitePlayerId: string;
  winnerId?: string | null;
};

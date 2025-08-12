import React from "react";

interface CheckersBoardProps {
  sessionCode: string;
  currentPlayerColor: "green" | "yellow" | null;
  userId: string;
}

export default function CheckersBoard({
  sessionCode,
  currentPlayerColor,
  userId,
}: CheckersBoardProps) {
  return (
    <div className="bg-gray-700 text-white p-4 rounded-lg shadow-lg">
      <p>Checkers board placeholder</p>
      <p>Session: {sessionCode}</p>
      <p>You are: {currentPlayerColor}</p>
      <p>User ID: {userId}</p>
    </div>
  );
}

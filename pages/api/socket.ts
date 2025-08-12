// /pages/api/socket.ts
import { Server as IOServer } from "socket.io";
import type { NextApiRequest } from "next";
import type { NextApiResponseServerIO } from "../../types/next"; // ✅ Correct import path

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    console.log("🚀 Starting Socket.io server...");

    const io = new IOServer(res.socket.server, {
      path: "/api/socketio",
      cors: {
        origin: "*", // Change to your frontend domain in production
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("✅ A user connected:", socket.id);

      socket.on("message", (msg: { user: string; text: string }) => {
        console.log("📨 Message received:", msg);
        io.emit("message", msg);
      });

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("⚡ Socket.io server already running.");
  }

  res.end();
}

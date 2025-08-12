import { Server as IOServer } from "socket.io";
import type { Socket as NetSocket } from "net";
import type { NextApiResponse } from "next";

declare module "net" {
  interface Socket {
    server: any & { io?: IOServer };
  }
}

declare module "http" {
  interface Server {
    io?: IOServer;
  }
}

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: NetSocket & {
    server: any & { io?: IOServer };
  };
}

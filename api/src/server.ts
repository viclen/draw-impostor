import express from "express";
import http from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./game";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// This creates a dynamic namespace like /game/game-001
io.of(/^\/game\/\w+$/).on("connection", (socket) => {
  const namespace = socket.nsp;
  const gameId = namespace.name.split("/").pop(); // e.g. "game-001"
  console.log(
    `Player connected to namespace ${namespace.name} (gameId=${gameId})`
  );

  registerSocketHandlers(socket, gameId!);
});

// Basic route for health check
app.get("/game", (_, res) => {
  res.status(200).json({ status: "Game server is running" });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

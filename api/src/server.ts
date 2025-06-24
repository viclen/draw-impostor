import express from "express";
import http from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./game";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Basic route for health check
app.get("/game", (_, res) => {
  res.status(200).json({ status: "Game server is running" });
});

// Register socket handling
registerSocketHandlers(io);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

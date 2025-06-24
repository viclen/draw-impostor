import { Server, Socket } from "socket.io";
import { Game, Stroke } from "./models/Game";
import { Player } from "./models/Player";
import { v4 as uuidv4 } from "uuid";

const games = new Map<string, Game>();

games.set("1", { id: "1", players: [], currentDrawerId: "", strokes: [] });

export function registerSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`Player connected: ${socket.id}`);

    socket.on("join_game", ({ gameId, playerName }) => {
      let game = games.get(gameId);
      if (!game) {
        game = {
          id: gameId,
          players: [],
          currentDrawerId: socket.id,
          strokes: [],
        };
        games.set(gameId, game);
      }

      const player: Player = {
        id: uuidv4(),
        name: playerName,
        socketId: socket.id,
        score: 0,
        isConnected: true,
      };

      game.players.push(player);
      socket.join(gameId);

      game.strokes.forEach((stroke) => socket.emit("draw", stroke));
      io.to(gameId).emit("player_joined", { players: game.players });
    });

    socket.on(
      "draw",
      ({ gameId, stroke }: { gameId: string; stroke: Stroke }) => {
        const game = games.get(gameId);
        if (!game) return;

        game.strokes.push(stroke);
        socket.to(gameId).emit("draw", stroke);
      }
    );

    socket.on("disconnect", () => {
      console.log(`Player disconnected: ${socket.id}`);
      for (const [gameId, game] of games.entries()) {
        const player = game.players.find((p) => p.socketId === socket.id);
        if (player) {
          player.isConnected = false;
          io.to(gameId).emit("player_disconnected", player.id);
        }
      }
    });
  });
}

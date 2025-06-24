import { Server, Socket } from "socket.io";
import { Game, Stroke } from "./models/Game";
import { Player } from "./models/Player";
import { v4 as uuidv4 } from "uuid";
import { STROKE_COLORS } from "./helpers/colors";

const games = new Map<string, Game>();

export function registerSocketHandlers(socket: Socket, gameId: string) {
  let game = games.get(gameId);
  if (!game) {
    game = { id: gameId, players: [], currentDrawerId: socket.id, strokes: [] };
    games.set(gameId, game);
  }

  console.log(`Player connected: ${socket.id}`);

  socket.on("join_game", ({ gameId, playerName, playerId }) => {
    let game = games.get(gameId);
    console.log(game);

    if (!game) {
      game = {
        id: gameId,
        players: [],
        currentDrawerId: socket.id,
        strokes: [],
      };
      games.set(gameId, game);
    }

    const playerFound = game.players.find(({ id }) => id === playerId);

    const player: Player = playerFound || {
      id: uuidv4(),
      name: playerName,
      socketId: socket.id,
      score: 0,
      isConnected: true,
      color: STROKE_COLORS[game.players.length % STROKE_COLORS.length],
    };
    if (!playerFound) {
      game.players.push(player);
    }
    socket.join(gameId);

    game.strokes.forEach((stroke) => socket.emit("draw", stroke));
    socket.emit("player", player);
    socket.nsp.to(gameId).emit("player_joined", { players: game.players });
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

  socket.on("clear", ({ gameId }: { gameId: string }) => {
    const game = games.get(gameId);
    if (!game) return;

    game.strokes = [];
    socket.to(gameId).emit("clear");
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
    for (const [gameId, game] of games.entries()) {
      const player = game.players.find((p) => p.socketId === socket.id);
      if (player) {
        player.isConnected = false;
        socket.nsp.to(gameId).emit("player_disconnected", player.id);
      }
    }
  });
}

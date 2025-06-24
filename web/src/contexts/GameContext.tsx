import React, { createContext, useContext, useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import type { Player } from '../types';
import { useParams } from 'react-router';

interface GameContextType {
  socket: Socket;
  player: Player | undefined;
  send: (name: string, data?: object) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [player, setPlayer] = useState<Player | undefined>(undefined);

  const { id: gameId } = useParams();
  const socketRef = useRef<Socket>(null);

  useEffect(() => {
    socketRef.current = io(`http://localhost:3000/game/${gameId}`);
  }, [gameId]);

  const { current: socket } = socketRef;

  useEffect(() => {
    const storagePlayer = JSON.parse(sessionStorage.getItem("player") || "null");
    if (storagePlayer) {
      setPlayer(storagePlayer);
    } else {
      socket?.on("player", (data: Player) => {
        setPlayer(data);
        sessionStorage.setItem("player", JSON.stringify(data));
      });
    }
    socket?.on("connect", () => {
      socket?.emit("join_game", { gameId, playerName: "Player 1", playerId: storagePlayer?.id });
    });
  }, [gameId, socket]);

  const send = useCallback((name: string, data?: object) => {
    socket?.emit(name, {
      ...(data || {}),
      gameId,
    });
  }, [gameId, socket]);

  const value = useMemo(() => ({
    socket: socketRef.current!,
    player,
    send,
  }), [player, send]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}

export interface Player {
  id: string;
  name: string;
  socketId: string;
  score: number;
  isConnected: boolean;
  color: string;
}

export interface RoundPlayer {
  impostor: boolean;
  player: Player;
}

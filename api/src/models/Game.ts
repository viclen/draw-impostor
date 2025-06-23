import { Player } from "./Player";

export interface Game {
  id: string;
  players: Player[];
  currentDrawerId: string;
  strokes: Stroke[]; // history for replay or validation
}

export interface Stroke {
  playerId: string;
  points: Point[]; // sequence of x,y coordinates
  color: string;
  width: number;
}

export interface Point {
  x: number;
  y: number;
  timestamp: number;
}

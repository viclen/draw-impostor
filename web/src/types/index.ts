export type Point = { x: number; y: number; timestamp: number };
export type Stroke = {
  playerId: string;
  points: Point[];
  color: string;
  width: number;
};

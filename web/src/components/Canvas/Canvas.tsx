import React, { useEffect, useRef, useState } from 'react';
import type { Point, Stroke } from '../../types';
import { StyledCanvas } from './Canvas.styles';
import { useGameContext } from '../../contexts/GameContext';

const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);

  const { socket, player, send } = useGameContext();

  const { color, id: playerId } = player || { color: "", id: "" };

  const width = 2;

  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctxRef.current = ctx;

    socket.on('draw', (stroke: Stroke) => {
      drawStroke(stroke);
    });

    socket.on('clear', () => {
      const canvas = canvasRef.current;
      if (canvas && ctxRef.current) {
        ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    return () => {
      socket.off('draw');
    };
  }, [socket]);

  const startDrawing = (x: number, y: number) => {
    setDrawing(true);
    const newPoint = { x, y, timestamp: Date.now() };
    setPoints([newPoint]);
  };

  const continueDrawing = (x: number, y: number) => {
    if (!drawing) return;
    const newPoint = { x, y, timestamp: Date.now() };
    setPoints(prev => {
      const newPoints = [...prev, newPoint];
      drawStroke({ points: newPoints, color, width, playerId });
      return newPoints;
    });
  };

  const endDrawing = () => {
    setDrawing(false);
    if (points.length > 1) {
      send('draw', {
        stroke: {
          playerId,
          points,
          color,
          width,
        },
      });
    }
    setPoints([]);
  };

  const drawStroke = (stroke: Stroke) => {
    const ctx = ctxRef.current!;
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.beginPath();
    const pts = stroke.points;
    if (pts.length < 2) return;

    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
    ctx.closePath();
  };

  const getEventPos = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: touch.clientX, y: touch.clientY };
    } else {
      return { x: e.clientX, y: e.clientY };
    }
  };

  return (
    <StyledCanvas
      ref={canvasRef}
      onMouseDown={e => startDrawing(e.clientX, e.clientY)}
      onMouseMove={e => continueDrawing(e.clientX, e.clientY)}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
      onTouchStart={e => {
        const { x, y } = getEventPos(e);
        startDrawing(x, y);
      }}
      onTouchMove={e => {
        const { x, y } = getEventPos(e);
        continueDrawing(x, y);
      }}
      onTouchEnd={endDrawing}
    />
  );
};

export default Canvas;

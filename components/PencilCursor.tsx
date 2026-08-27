"use client";

import { useEffect, useRef } from "react";

type Point = { x: number; y: number; t: number };

/**
 * Faint pencil-stroke trail that follows the mouse. Skipped on touch devices,
 * small screens, and when the user prefers reduced motion — same guards as
 * the reference site this was adapted from.
 */
export default function PencilCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canHover = window.matchMedia && window.matchMedia("(hover: hover)").matches;
    if (reduceMotion || !canHover || window.innerWidth < 900) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.style.display = "block";

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    let points: Point[] = [];
    let looping = false;

    function draw() {
      if (!ctx || !canvas) {
        looping = false;
        return;
      }
      const now = Date.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = "round";
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const age = (now - b.t) / 620;
        if (age >= 1) continue;
        ctx.globalAlpha = Math.max(0, 0.34 * (1 - age));
        ctx.strokeStyle = "#1F3B2C";
        ctx.lineWidth = 2.1 * (1 - age) + 0.4;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      points = points.filter((p) => now - p.t < 640);
      if (points.length > 1) {
        requestAnimationFrame(draw);
      } else {
        looping = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    function onMove(e: MouseEvent) {
      points.push({ x: e.clientX, y: e.clientY, t: Date.now() });
      if (points.length > 26) points.shift();
      if (!looping) {
        looping = true;
        requestAnimationFrame(draw);
      }
    }

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: "none" }}
      className="pointer-events-none fixed inset-0 z-[95]"
    />
  );
}

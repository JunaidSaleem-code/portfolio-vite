"use client";

// Realistic WebGL globe powered by `cobe` — same library used by Vercel/Linear
// marketing pages. Tiny (~3KB), no three.js / fiber dependency, so it stays
// compatible with the React 18 + Next 15 stack documented in AUDIT.md.

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

const RENDER_SIZE = 600; // fixed drawing-buffer size; CSS scales the canvas down to fit

export function GlobeDemo() {
  const canvasRef = useRef(null);
  const pointerInteracting = useRef(null);
  const pointerInteractionMovement = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    let phi = 0;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: RENDER_SIZE * 2,
      height: RENDER_SIZE * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.6],
      markerColor: [0.65, 0.4, 1],
      glowColor: [0.6, 0.4, 1],
      markers: [
        { location: [31.5204, 74.3587], size: 0.1 }, // Lahore
        { location: [40.7128, -74.006], size: 0.06 }, // NYC
        { location: [51.5072, -0.1276], size: 0.06 }, // London
        { location: [35.6762, 139.6503], size: 0.06 }, // Tokyo
        { location: [37.7749, -122.4194], size: 0.06 }, // SF
        { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
        { location: [1.3521, 103.8198], size: 0.05 }, // Singapore
        { location: [25.2048, 55.2708], size: 0.05 }, // Dubai
        { location: [48.8566, 2.3522], size: 0.05 }, // Paris
        { location: [52.52, 13.405], size: 0.05 }, // Berlin
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) phi += 0.004;
        state.phi = phi + pointerInteractionMovement.current;
      },
    });

    // fade in once the first frame paints
    const canvas = canvasRef.current;
    if (canvas) {
      requestAnimationFrame(() => {
        canvas.style.opacity = "1";
      });
    }

    return () => globe.destroy();
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = "grab";
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 100;
          }
        }}
        style={{
          width: RENDER_SIZE,
          height: RENDER_SIZE,
          maxWidth: "100%",
          maxHeight: "100%",
          aspectRatio: "1 / 1",
          cursor: "grab",
          contain: "layout paint size",
          opacity: 0,
          transition: "opacity 1s ease",
          pointerEvents: "auto",
        }}
      />
    </div>
  );
}

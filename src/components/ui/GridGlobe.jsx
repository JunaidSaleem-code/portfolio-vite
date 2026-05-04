"use client";

// Pure-CSS rotating "globe" — a gradient sphere with latitude/longitude
// rings, animated to rotate. No three.js / fiber dependencies.

export function GlobeDemo() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
        <div className="globe-3d">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={`lat-${i}`} className="globe-lat" style={{ transform: `rotateX(${(i - 4) * 20}deg)` }} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={`lng-${i}`} className="globe-lng" style={{ transform: `rotateY(${i * 15}deg)` }} />
          ))}
        </div>
        <div className="globe-glow" />
      </div>

      <style jsx>{`
        .globe-3d {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: radial-gradient(
            circle at 30% 30%,
            #38bdf8 0%,
            #1d4ed8 35%,
            #062056 75%,
            #020617 100%
          );
          box-shadow:
            inset -20px -20px 40px rgba(0, 0, 0, 0.6),
            inset 8px 8px 20px rgba(255, 255, 255, 0.08),
            0 0 60px rgba(56, 189, 248, 0.25);
          transform-style: preserve-3d;
          animation: globe-spin 18s linear infinite;
        }
        .globe-lat,
        .globe-lng {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100%;
          height: 100%;
          margin-left: -50%;
          margin-top: -50%;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          pointer-events: none;
        }
        .globe-lng {
          border-top-color: rgba(255, 255, 255, 0.18);
          border-bottom-color: rgba(255, 255, 255, 0.18);
          border-left-color: transparent;
          border-right-color: transparent;
        }
        .globe-lat {
          border-left-color: rgba(255, 255, 255, 0.15);
          border-right-color: rgba(255, 255, 255, 0.15);
          border-top-color: transparent;
          border-bottom-color: transparent;
        }
        .globe-glow {
          position: absolute;
          inset: -10%;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 60%);
          pointer-events: none;
          filter: blur(8px);
        }
        @keyframes globe-spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
      `}</style>
    </div>
  );
}

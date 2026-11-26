import React, { useEffect, useRef, useState } from 'react';
import './AnimatedBackground.css';

/**
 * Easy-to-tweak configuration constants for PriceLens Living Price Graph background.
 */
export const BG_CONFIG = {
  baseColor: '#F8F9FD',
  colors: {
    indigo: '#4F46E5',
    violet: '#7C3AED',
    green: '#16A34A',
    sky: '#0EA5E9',
    dotBase: [100, 116, 139], // Slate-500 RGB
    dotActive: [79, 70, 229], // Indigo-600 RGB
  },
  blobOpacity: 0.24, // Clearly visible yet soft fintech aurora
  speedMultiplier: 1, // Increase (>1) to slow down, decrease (<1) to speed up
  blobCount: 4, // 4 on desktop; automatically reduced to 2 on mobile
  gridSpacing: 26,
  dotRadius: 1.25,
  dotBaseAlpha: 0.28,
  interactionRadius: 145,
  sparklineCount: 6, // 6 visible Keepa-style price lines
  sparklineOpacity: 0.58,
  ghostLabelOpacity: 0.78,
};

const GHOST_LABELS = ['₹69,990', '-22%', '₹24,990', '-18%', '₹62,990', '-15%'];

// Safe edge/right-side zones (% coordinates) so lines never obscure headline or search bar
const SAFE_ZONES = [
  { xMin: 68, xMax: 88, yMin: 6, yMax: 22 },   // Top-right above cards
  { xMin: 82, xMax: 94, yMin: 35, yMax: 58 },  // Far-right edge
  { xMin: 56, xMax: 78, yMin: 76, yMax: 88 },  // Bottom-right below cards
  { xMin: 44, xMax: 60, yMin: 8, yMax: 22 },   // Top-center-right gap
  { xMin: 2, xMax: 12, yMin: 74, yMax: 88 },   // Bottom-left margin
  { xMin: 80, xMax: 93, yMin: 72, yMax: 88 },  // Far bottom-right corner
];

function createSparklineData(index, seedOffset = 0) {
  const zone = SAFE_ZONES[index % SAFE_ZONES.length];
  const left = zone.xMin + ((index * 7 + seedOffset * 13) % Math.max(1, zone.xMax - zone.xMin));
  const top = zone.yMin + ((index * 11 + seedOffset * 5) % Math.max(1, zone.yMax - zone.yMin));

  // Generate a mostly downward Keepa-style stepped/smooth price curve (120x44 viewBox)
  const pts = [];
  let y = 8 + ((seedOffset + index) % 6);
  const steps = 6;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 108 + 6;
    if (i > 0) {
      // Mostly downward (increasing SVG y), occasional tiny bounce
      const delta = i === steps ? 7 : ((i + seedOffset + index) % 3 === 0 ? -2 : 5.5);
      y = Math.min(37, Math.max(6, y + delta));
    }
    pts.push({ x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) });
  }

  const path = pts
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(' ');
  const endPoint = pts[pts.length - 1];
  const label = GHOST_LABELS[(index + seedOffset) % GHOST_LABELS.length];

  return {
    id: `${index}-${seedOffset}`,
    left: `${left}%`,
    top: `${top}%`,
    path,
    endPoint,
    label,
    showLabel: (index + seedOffset) % 2 === 0,
    duration: (7.5 + (index % 3) * 1.6) * BG_CONFIG.speedMultiplier,
    delay: (index * 1.1) % 4,
  };
}

export const AnimatedBackground = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  const [sparklines, setSparklines] = useState(() =>
    Array.from({ length: BG_CONFIG.sparklineCount }, (_, i) => createSparklineData(i, 0))
  );

  // Listen for prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Periodically regenerate floating sparklines at new positions
  useEffect(() => {
    if (reducedMotion) return;
    let tick = 1;
    const interval = setInterval(() => {
      if (document.hidden) return;
      tick += 1;
      setSparklines((prev) =>
        prev.map((item, idx) => {
          // Regenerate 2 sparklines per cycle for organic, non-synchronized turnover
          if ((idx + tick) % 3 === 0) {
            return createSparklineData(idx, tick);
          }
          return item;
        })
      );
    }, 4500 * BG_CONFIG.speedMultiplier);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  // Layer 2: Interactive DPR-aware dot grid on single <canvas>
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = null;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let dots = [];
    let isVisible = true;
    let isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;

    const mouse = { x: -9999, y: -9999, active: false };

    const buildDots = () => {
      const spacing = BG_CONFIG.gridSpacing;
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;

      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: offsetX + c * spacing,
            y: offsetY + r * spacing,
            intensity: 0, // smoothed 0..1 proximity factor
          });
        }
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      isMobile = window.innerWidth <= 768 || window.matchMedia('(pointer: coarse)').matches;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildDots();
      if (reducedMotion) {
        drawFrame(true);
      }
    };

    const drawFrame = (isStatic = false, timeMs = 0) => {
      ctx.clearRect(0, 0, width, height);
      const [br, bg, bb] = BG_CONFIG.colors.dotBase;
      const [ar, ag, ab] = BG_CONFIG.colors.dotActive;
      const radiusSq = BG_CONFIG.interactionRadius * BG_CONFIG.interactionRadius;
      const wavePhase = (timeMs * 0.0012) / BG_CONFIG.speedMultiplier;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        let target = 0;

        // Subtle ambient diagonal data shimmer wave across the grid
        if (!isStatic) {
          const wave = Math.sin((dot.x + dot.y) * 0.012 - wavePhase);
          if (wave > 0.65) {
            target = ((wave - 0.65) / 0.35) * 0.28;
          }
        }

        if (!isStatic && !isMobile && mouse.active) {
          const dx = dot.x - mouse.x;
          const dy = dot.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < radiusSq) {
            const dist = Math.sqrt(distSq);
            const hoverStrength = Math.pow(1 - dist / BG_CONFIG.interactionRadius, 1.4);
            target = Math.max(target, hoverStrength);
          }
        }

        // Smooth easing toward target and gentle relaxation back
        dot.intensity += (target - dot.intensity) * (target > dot.intensity ? 0.22 : 0.09);
        if (dot.intensity < 0.004) dot.intensity = 0;

        const t = dot.intensity;
        const r = Math.round(br + (ar - br) * t);
        const g = Math.round(bg + (ag - bg) * t);
        const b = Math.round(bb + (ab - bb) * t);
        const alpha = BG_CONFIG.dotBaseAlpha + t * 0.56;
        const dotR = BG_CONFIG.dotRadius + t * 2.1;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now) => {
      if (!document.hidden && isVisible && !reducedMotion) {
        drawFrame(false, now);
        rafId = window.requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    };

    const startLoop = () => {
      if (!rafId && !reducedMotion && !document.hidden && isVisible) {
        rafId = window.requestAnimationFrame(loop);
      }
    };

    const handleMouseMove = (e) => {
      if (isMobile || reducedMotion) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouse.x = x;
        mouse.y = y;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        startLoop();
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
      { threshold: 0.01 }
    );
    intersectionObserver.observe(container);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resize();
    if (!reducedMotion) {
      startLoop();
    }

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reducedMotion]);

  const blobVars = {
    '--pl-bg-base': BG_CONFIG.baseColor,
    '--pl-blob-opacity': BG_CONFIG.blobOpacity,
    '--pl-spark-opacity': BG_CONFIG.sparklineOpacity,
    '--pl-label-opacity': BG_CONFIG.ghostLabelOpacity,
    '--pl-speed-mult': BG_CONFIG.speedMultiplier,
  };

  return (
    <div
      ref={containerRef}
      className={`pl-living-bg ${reducedMotion ? 'pl-reduced-motion' : ''}`}
      style={blobVars}
      aria-hidden="true"
    >
      {/* Layer 1: Aurora Mesh Gradient (GPU transform-only drift) */}
      <div className="pl-aurora-layer">
        <div className="pl-aurora-blob pl-blob-indigo" />
        <div className="pl-aurora-blob pl-blob-violet" />
        {BG_CONFIG.blobCount >= 3 && <div className="pl-aurora-blob pl-blob-green" />}
        {BG_CONFIG.blobCount >= 4 && <div className="pl-aurora-blob pl-blob-sky" />}
      </div>

      {/* Layer 2: Interactive DPR-aware Dot Grid */}
      <canvas ref={canvasRef} className="pl-dot-grid-canvas" />

      {/* Layer 3: Floating Keepa-Style Price-Trend Sparklines (Edges & Right Space) */}
      <div className="pl-sparklines-layer">
        {sparklines.map((item) => (
          <div
            key={item.id}
            className="pl-floating-sparkline"
            style={{
              left: item.left,
              top: item.top,
              '--spark-duration': `${item.duration}s`,
              '--spark-delay': `${item.delay}s`,
            }}
          >
            <svg viewBox="0 0 120 44" className="pl-floating-spark-svg" fill="none">
              <defs>
                <linearGradient id={`sparkGrad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BG_CONFIG.colors.indigo} stopOpacity="0.22" />
                  <stop offset="100%" stopColor={BG_CONFIG.colors.indigo} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`${item.path} L 114 42 L 6 42 Z`}
                fill={`url(#sparkGrad-${item.id})`}
                className="pl-floating-spark-area"
              />
              <path
                d={item.path}
                className="pl-floating-spark-path"
                stroke={BG_CONFIG.colors.indigo}
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength="100"
              />
              <circle
                cx={item.endPoint.x}
                cy={item.endPoint.y}
                r="7"
                fill={BG_CONFIG.colors.green}
                fillOpacity="0.24"
                className="pl-floating-drop-ring"
              />
              <circle
                cx={item.endPoint.x}
                cy={item.endPoint.y}
                r="3.8"
                fill={BG_CONFIG.colors.green}
                stroke="#FFFFFF"
                strokeWidth="1.4"
                className="pl-floating-drop-dot"
              />
            </svg>
            {item.showLabel && (
              <span className="pl-floating-ghost-label">{item.label}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;

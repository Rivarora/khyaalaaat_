import { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

const GlowingParticles = () => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLight = theme === "light";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame = 0;
    const colors = isLight
      ? ["#ec4899", "#a855f7", "#06b6d4", "#10b981", "#f97316"]
      : ["#93c5fd", "#a78bfa", "#22d3ee", "#f472b6"];

    const getTheme = () => ({
      pointCount: isLight ? 68 : 56,
      maxDistance: isLight ? 145 : 130,
      speed: isLight ? 0.45 : 0.4,
      lineOpacity: isLight ? 0.22 : 0.18,
      dotOpacity: isLight ? 0.6 : 0.48,
      dotMin: 1,
      dotMax: isLight ? 2.5 : 2.2,
    });

    const settings = getTheme();
    const points = Array.from({ length: settings.pointCount }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * settings.speed,
      vy: (Math.random() - 0.5) * settings.speed,
      size: settings.dotMin + Math.random() * (settings.dotMax - settings.dotMin),
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = settings.dotOpacity;
        ctx.fill();
      }

      for (let i = 0; i < points.length; i += 1) {
        for (let j = i + 1; j < points.length; j += 1) {
          const p1 = points[i];
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < settings.maxDistance) {
            const opacity = (1 - dist / settings.maxDistance) * settings.lineOpacity;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isLight ? "#d946ef" : "#7c3aed";
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrame = window.requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [isLight]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default GlowingParticles;
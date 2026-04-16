'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  opacitySpeed: number;
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height - height,
    size: Math.random() * 1.5 + 0.5,
    speedY: Math.random() * 0.4 + 0.1,
    speedX: (Math.random() - 0.5) * 0.2,
    opacity: 0,
    opacitySpeed: Math.random() * 0.003 + 0.001,
  };
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const PARTICLE_COUNT = 60;
    const particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = createParticle(canvas.width, canvas.height);
      p.y = Math.random() * canvas.height; // 초기엔 화면 전체에 분산
      particles.push(p);
    }

    function draw() {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity = Math.min(p.opacity + p.opacitySpeed, 0.55);

        // 화면 밖으로 나가면 위에서 다시
        if (p.y > canvas.height + 10) {
          const fresh = createParticle(canvas.width, canvas.height);
          Object.assign(p, fresh);
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 185, 120, ${p.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-10"
    />
  );
}

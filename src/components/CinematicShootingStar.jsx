import React, { useEffect, useRef } from 'react';

/**
 * CinematicShootingStar
 * High-end Hollywood VFX-style meteor transition using additive WebGL-style
 * optical blending ('lighter'), glowing stardust spark dispersion, multi-layered
 * plasma comet tail, and an expansive celestial light flash.
 */
export default function CinematicShootingStar({ onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = window.innerWidth);
    const height = (canvas.height = window.innerHeight);

    let animationFrameId;
    const startTime = performance.now();
    const duration = 900; // ms

    // Trajectory: starts off-screen top-left, crosses diagonally to bottom-right
    const startX = -width * 0.15;
    const startY = -height * 0.15;
    const endX = width * 1.25;
    const endY = height * 1.25;

    // Trail history points
    const history = [];
    const maxHistory = 42;

    // Stardust spark particles peeled off the comet head
    const particles = [];

    let completedTriggered = false;

    const render = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Smooth custom acceleration curve (slow entrance -> hypersonic mid-flight -> smooth exit)
      // EaseInOutCubic
      const easeProgress =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const currentX = startX + (endX - startX) * easeProgress;
      const currentY = startY + (endY - startY) * easeProgress;

      // Add to trail history
      history.unshift({ x: currentX, y: currentY });
      if (history.length > maxHistory) history.pop();

      // Spawn stardust sparks
      if (progress < 0.92) {
        for (let i = 0; i < 4; i++) {
          const angle = Math.atan2(endY - startY, endX - startX) + Math.PI + (Math.random() - 0.5) * 0.9;
          const speed = Math.random() * 5 + 2;
          particles.push({
            x: currentX + (Math.random() - 0.5) * 8,
            y: currentY + (Math.random() - 0.5) * 8,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: Math.random() * 0.04 + 0.025,
            size: Math.random() * 3 + 1.5,
            color: Math.random() > 0.4 ? '245, 215, 127' : '255, 141, 161',
          });
        }
      }

      ctx.clearRect(0, 0, width, height);

      // 1. FULL-SCREEN CELESTIAL LIGHT BLOOM / FLASH
      // Peaks at progress ~ 0.55 - 0.75
      const flashAlpha = Math.sin(progress * Math.PI) * 0.92;
      if (flashAlpha > 0.01) {
        const flashGrad = ctx.createRadialGradient(
          currentX,
          currentY,
          10,
          currentX,
          currentY,
          Math.max(width, height) * 0.95
        );
        flashGrad.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha * 0.95})`);
        flashGrad.addColorStop(0.2, `rgba(255, 240, 190, ${flashAlpha * 0.7})`);
        flashGrad.addColorStop(0.5, `rgba(245, 215, 127, ${flashAlpha * 0.35})`);
        flashGrad.addColorStop(0.8, `rgba(255, 100, 140, ${flashAlpha * 0.15})`);
        flashGrad.addColorStop(1, 'rgba(6, 9, 19, 0)');

        ctx.fillStyle = flashGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Switch to additive optical blending for incandescent light
      ctx.globalCompositeOperation = 'lighter';

      // 2. MULTI-LAYER COMET TRAIL
      if (history.length > 2) {
        // PASS A: Outer Golden-Pink Plasma Glow
        for (let i = 0; i < history.length - 1; i++) {
          const p1 = history[i];
          const p2 = history[i + 1];
          const segProgress = 1 - i / history.length;
          const lineWidth = segProgress * 65;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(245, 215, 127, ${segProgress * 0.28})`;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // PASS B: Mid Magenta/Rose Core Aura
        for (let i = 0; i < history.length - 1; i++) {
          const p1 = history[i];
          const p2 = history[i + 1];
          const segProgress = 1 - i / history.length;
          const lineWidth = segProgress * 28;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 110, 150, ${segProgress * 0.6})`;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        // PASS C: Incandescent White Core Beam
        for (let i = 0; i < history.length - 1; i++) {
          const p1 = history[i];
          const p2 = history[i + 1];
          const segProgress = 1 - i / history.length;
          const lineWidth = segProgress * 8;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${segProgress * 0.95})`;
          ctx.lineWidth = lineWidth;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      // 3. STARDUST PARTICLES WAKE
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.9})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${p.color}, 1)`;
        ctx.fill();
      }

      // 4. METEOR HEAD & ANAMORPHIC LENS FLARE
      if (progress < 0.98) {
        // Outer Radial Corona
        const headGrad = ctx.createRadialGradient(
          currentX,
          currentY,
          2,
          currentX,
          currentY,
          65
        );
        headGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        headGrad.addColorStop(0.2, 'rgba(255, 235, 160, 0.95)');
        headGrad.addColorStop(0.5, 'rgba(255, 110, 160, 0.6)');
        headGrad.addColorStop(1, 'rgba(245, 215, 127, 0)');

        ctx.beginPath();
        ctx.arc(currentX, currentY, 65, 0, Math.PI * 2);
        ctx.fillStyle = headGrad;
        ctx.fill();

        // Anamorphic Cross Flares (Diagonal along flight path & Orthogonal)
        const angle = Math.atan2(endY - startY, endX - startX);
        const flareLength = 140;

        ctx.save();
        ctx.translate(currentX, currentY);
        ctx.rotate(angle);

        // Beam parallel to movement
        const beamGrad1 = ctx.createLinearGradient(-flareLength, 0, flareLength, 0);
        beamGrad1.addColorStop(0, 'rgba(255, 255, 255, 0)');
        beamGrad1.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
        beamGrad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = beamGrad1;
        ctx.fillRect(-flareLength, -2.5, flareLength * 2, 5);

        // Perpendicular cross spike
        const beamGrad2 = ctx.createLinearGradient(0, -70, 0, 70);
        beamGrad2.addColorStop(0, 'rgba(255, 240, 180, 0)');
        beamGrad2.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
        beamGrad2.addColorStop(1, 'rgba(255, 240, 180, 0)');
        ctx.fillStyle = beamGrad2;
        ctx.fillRect(-2, -70, 4, 140);

        ctx.restore();

        // Brilliant Center Core
        ctx.beginPath();
        ctx.arc(currentX, currentY, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
      }

      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowBlur = 0;

      // Trigger scene advance when flash peaks
      if (progress >= 0.72 && !completedTriggered) {
        completedTriggered = true;
        onComplete?.();
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        pointerEvents: 'none',
      }}
    />
  );
}


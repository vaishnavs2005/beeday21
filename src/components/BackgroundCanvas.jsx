import React, { useEffect, useRef } from 'react';

/**
 * BackgroundCanvas renders a soothing, high-performance 60fps night sky
 * with twinkling stars, warm drifting firefly-like sparkles, and shooting star showers.
 */
export default function BackgroundCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Stars
    const starCount = Math.floor(Math.min(width, height) > 600 ? 100 : 60);
    let stars = [];

    // Warm drifting sparkles
    const sparkleCount = Math.floor(Math.min(width, height) > 600 ? 35 : 20);
    let sparkles = [];

    // Shooting stars array (supports multiple concurrent shooting stars & showers)
    let shootingStars = [];

    function initParticles() {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.7 + 0.3,
          speed: Math.random() * 0.02 + 0.005,
          phase: Math.random() * Math.PI * 2,
        });
      }

      sparkles = [];
      for (let i = 0; i < sparkleCount; i++) {
        sparkles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 1,
          baseY: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: -Math.random() * 0.5 - 0.2, // slowly floating up
          alpha: Math.random() * 0.6 + 0.2,
          color: Math.random() > 0.4 ? '245, 215, 127' : '255, 141, 161',
          pulse: Math.random() * Math.PI * 2,
        });
      }
    }

    function createShootingStar(customSpeed, customLength) {
      return {
        x: Math.random() * (width * 0.9),
        y: Math.random() * (height * 0.4),
        length: customLength || Math.random() * 100 + 70,
        speed: customSpeed || Math.random() * 10 + 8,
        angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.3,
        opacity: 1,
        color: Math.random() > 0.3 ? '#f5d77f' : '#ff8da1',
        width: Math.random() * 1.5 + 1.5,
      };
    }

    initParticles();

    // Event listener to trigger a meteor shower (e.g. when candle is blown)
    const handleMeteorShower = (e) => {
      const count = e?.detail?.count || 24;
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          shootingStars.push(createShootingStar(Math.random() * 12 + 10, Math.random() * 140 + 80));
        }, i * 180 + Math.random() * 120);
      }
    };

    window.addEventListener('trigger-meteor-shower', handleMeteorShower);

    let nextShootingStarTime = Date.now() + 3000;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#060913');
      grad.addColorStop(0.6, '#0B132B');
      grad.addColorStop(1, '#080E1F');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Draw Stars
      for (let star of stars) {
        star.phase += star.speed;
        const currentAlpha = Math.max(0.1, star.alpha + Math.sin(star.phase) * 0.35);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      }

      // Draw warm floating sparkles
      for (let s of sparkles) {
        s.x += s.vx;
        s.y += s.vy;
        s.pulse += 0.04;

        if (s.y < -10) s.y = height + 10;
        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;

        const currentAlpha = Math.max(0.15, s.alpha + Math.sin(s.pulse) * 0.25);

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color}, ${currentAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${s.color}, 0.9)`;
        ctx.fill();
      }

      // Occasional background shooting star
      const now = Date.now();
      if (shootingStars.length === 0 && now > nextShootingStarTime) {
        shootingStars.push(createShootingStar());
        nextShootingStarTime = now + Math.random() * 5000 + 4000;
      }

      // Draw & update all active shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const star = shootingStars[i];
        const endX = star.x - Math.cos(star.angle) * star.length;
        const endY = star.y - Math.sin(star.angle) * star.length;

        const sGrad = ctx.createLinearGradient(star.x, star.y, endX, endY);
        sGrad.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        sGrad.addColorStop(0.2, star.color === '#f5d77f' ? `rgba(245, 215, 127, ${star.opacity * 0.9})` : `rgba(255, 141, 161, ${star.opacity * 0.9})`);
        sGrad.addColorStop(1, 'rgba(245, 215, 127, 0)');

        ctx.strokeStyle = sGrad;
        ctx.lineWidth = star.width;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Glowing star head point
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.width * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffffff';
        ctx.fill();

        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.opacity -= 0.015;

        if (star.opacity <= 0 || star.x > width + 100 || star.y > height + 100) {
          shootingStars.splice(i, 1);
        }
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('trigger-meteor-shower', handleMeteorShower);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}

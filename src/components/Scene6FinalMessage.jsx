import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RotateCcw, Heart, Sparkles } from 'lucide-react';
import { config } from '../config';

/**
 * SkyLantern: Warm floating lantern drifting upwards with gentle flicker
 */
function SkyLantern({ left, delay, duration, size, scale }) {
  return (
    <motion.div
      initial={{ y: '110vh', opacity: 0, x: 0 }}
      animate={{
        y: '-20vh',
        opacity: [0, 0.9, 0.85, 0],
        x: [0, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 80],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        delay: delay,
        ease: 'linear',
      }}
      style={{
        position: 'fixed',
        left: `${left}%`,
        width: `${size}px`,
        height: `${size * 1.3}px`,
        pointerEvents: 'none',
        zIndex: 3,
        transform: `scale(${scale})`,
      }}
    >
      {/* Outer Flame Glow */}
      <div
        style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: '10px 10px 4px 4px',
          background: 'radial-gradient(circle, rgba(255, 170, 50, 0.4) 0%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />
      {/* Lantern Body */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px 8px 3px 3px',
          background: 'linear-gradient(to bottom, #ffbe0b 10%, #fb5607 70%, #ff006e 100%)',
          opacity: 0.85,
          boxShadow: '0 0 15px rgba(255, 190, 11, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Inner Candle Flame */}
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            width: '6px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            boxShadow: '0 0 8px #ffffff',
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Scene6FinalMessage({ onReplay }) {
  useEffect(() => {
    // Gentle golden confetti shower on entrance
    const end = Date.now() + 3500;
    const colors = ['#f5d77f', '#ff8da1', '#ffffff', '#ffd166'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const lanterns = [
    { left: 8, delay: 0.2, duration: 16, size: 26, scale: 0.9 },
    { left: 22, delay: 4.5, duration: 20, size: 32, scale: 1.1 },
    { left: 40, delay: 2.1, duration: 18, size: 24, scale: 0.8 },
    { left: 62, delay: 6.0, duration: 19, size: 30, scale: 1.0 },
    { left: 78, delay: 1.2, duration: 22, size: 34, scale: 1.15 },
    { left: 90, delay: 3.8, duration: 17, size: 25, scale: 0.85 },
  ];

  const paragraphs = config.scene6.finalMessage || [];

  return (
    <div
      className="scene-wrapper"
      style={{
        padding: '2rem 1.25rem',
        maxWidth: '720px',
        width: '100%',
        textAlign: 'center',
        position: 'relative',
        zIndex: 5,
      }}
    >
      {/* Floating Sky Lanterns in background */}
      {lanterns.map((l, i) => (
        <SkyLantern key={i} {...l} />
      ))}

      {/* Decorative Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 141, 161, 0.3), transparent 70%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto',
          border: '1px solid rgba(245, 215, 127, 0.3)',
        }}
      >
        <Heart size={28} color="#f5d77f" fill="#ff4d6d" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="script-title"
        style={{
          fontSize: 'clamp(2.6rem, 7.5vw, 4.2rem)',
          color: '#f5d77f',
          marginBottom: '1.75rem',
          lineHeight: 1.15,
        }}
      >
        {config.scene6.title}
      </motion.h1>

      {/* Message Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.9 }}
        className="glass-panel"
        style={{
          padding: 'clamp(1.75rem, 5vw, 2.5rem)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(245, 215, 127, 0.08)',
          marginBottom: '2.5rem',
        }}
      >
        {paragraphs.map((line, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + idx * 0.3, duration: 0.7 }}
            style={{
              fontSize: 'clamp(1rem, 2.8vw, 1.15rem)',
              lineHeight: 1.8,
              color: '#fdfbf7',
              fontWeight: 400,
            }}
          >
            {line}
          </motion.p>
        ))}

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 + paragraphs.length * 0.3 + 0.3, duration: 0.8 }}
          style={{ marginTop: '1.25rem', textAlign: 'right' }}
        >
          <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic', display: 'block' }}>
            {config.scene6.signature}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(1.8rem, 4.5vw, 2.5rem)',
              color: '#ff8da1',
              textShadow: '0 0 12px rgba(255, 141, 161, 0.4)',
              display: 'inline-block',
              marginTop: '4px',
            }}
          >
            {config.scene6.authorName || config.senderName}
          </span>
        </motion.div>
      </motion.div>

      {/* Replay Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        onClick={onReplay}
        className="btn-primary"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(245, 215, 127, 0.25))',
          color: '#fdfbf7',
          border: '1px solid rgba(245, 215, 127, 0.4)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        }}
      >
        <RotateCcw size={18} />
        <span>{config.scene6.replayButton}</span>
      </motion.button>
    </div>
  );
}


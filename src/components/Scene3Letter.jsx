import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { config } from '../config';

export default function Scene3Letter({ onComplete }) {
  // 'closed' | 'breaking' | 'opening' | 'sliding' | 'open'
  const [stage, setStage] = useState('closed');

  const handleOpenEnvelope = () => {
    if (stage !== 'closed') return;
    setStage('breaking');

    // Haptic vibration feedback
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([30, 20, 30]);
      } catch (e) {}
    }

    // Wax seal break sparkle effect
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#c9184a', '#ff4d6d', '#f5d77f', '#ffffff'],
      ticks: 150,
      gravity: 0.9,
    });

    // Step 2: Open top flap in 3D
    setTimeout(() => {
      setStage('opening');
    }, 350);

    // Step 3: Slide letter paper up out of the envelope
    setTimeout(() => {
      setStage('sliding');
    }, 850);

    // Step 4: Expand into full readable paper card
    setTimeout(() => {
      setStage('open');
    }, 1550);
  };

  return (
    <div className="scene-wrapper" style={{ padding: '2rem 1rem' }}>
      <AnimatePresence mode="wait">
        {stage !== 'open' ? (
          /* REALISTIC ENVELOPE VIEW */
          <motion.div
            key="envelope-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.5 } }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              perspective: '1200px',
            }}
          >
            {/* Instruction Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hint-text"
              style={{ marginBottom: '2.5rem', cursor: 'pointer' }}
              onClick={handleOpenEnvelope}
            >
              <Sparkles size={14} color="#f5d77f" />
              <span>Tap the wax seal to open</span>
            </motion.p>

            {/* Physical Envelope Container */}
            <div
              onClick={handleOpenEnvelope}
              style={{
                position: 'relative',
                width: 'clamp(300px, 88vw, 360px)',
                height: '230px',
                cursor: stage === 'closed' ? 'pointer' : 'default',
                perspective: '1200px',
                touchAction: 'manipulation',
              }}
            >
              {/* Soft Ambient Lighting Glow under the envelope */}
              <div
                style={{
                  position: 'absolute',
                  inset: '8px',
                  borderRadius: '16px',
                  background: 'radial-gradient(circle, rgba(245, 215, 127, 0.25) 0%, rgba(255, 77, 109, 0.1) 50%, transparent 70%)',
                  filter: 'blur(25px)',
                  zIndex: 0,
                }}
              />

              {/* Envelope Back Wall */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#121a2d',
                  borderRadius: '14px',
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.75), 0 2px 10px rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(245, 215, 127, 0.18)',
                  overflow: 'hidden',
                  zIndex: 1,
                }}
              >
                {/* Elegant Inner Lining Pattern */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 50% 20%, rgba(245, 215, 127, 0.15) 0%, transparent 60%), linear-gradient(135deg, #18223c 0%, #0f1626 100%)',
                  }}
                />
              </div>

              {/* Real Paper Letter Peeking Inside & Sliding Up */}
              <motion.div
                initial={{ y: 0, scale: 0.95 }}
                animate={
                  stage === 'sliding'
                    ? { y: -130, scale: 0.98 }
                    : stage === 'opening'
                    ? { y: -25, scale: 0.96 }
                    : { y: 0, scale: 0.95 }
                }
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '18px',
                  right: '18px',
                  height: '190px',
                  backgroundColor: '#fbf7ee',
                  borderRadius: '6px',
                  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.25), inset 0 0 20px rgba(215, 185, 140, 0.3)',
                  border: '1px solid rgba(200, 170, 110, 0.4)',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  zIndex: 2,
                }}
              >
                {/* Simulated handwritten ink lines on paper peek */}
                <div style={{ width: '45%', height: '8px', background: 'rgba(44, 24, 16, 0.35)', borderRadius: '4px' }} />
                <div style={{ width: '85%', height: '5px', background: 'rgba(44, 24, 16, 0.2)', borderRadius: '3px' }} />
                <div style={{ width: '92%', height: '5px', background: 'rgba(44, 24, 16, 0.2)', borderRadius: '3px' }} />
                <div style={{ width: '70%', height: '5px', background: 'rgba(44, 24, 16, 0.2)', borderRadius: '3px' }} />
                <div style={{ width: '60%', height: '5px', background: 'rgba(44, 24, 16, 0.15)', borderRadius: '3px' }} />
              </motion.div>

              {/* Realistic Envelope Pocket (Front Side & Bottom Flaps) */}
              <svg
                viewBox="0 0 360 230"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 3,
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 -2px 6px rgba(0, 0, 0, 0.25))',
                }}
              >
                <defs>
                  <clipPath id="envPocketClip">
                    <rect width="360" height="230" rx="14" ry="14" />
                  </clipPath>
                  {/* Left flap gradient */}
                  <linearGradient id="envLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e2a47" />
                    <stop offset="100%" stopColor="#141d32" />
                  </linearGradient>
                  {/* Right flap gradient */}
                  <linearGradient id="envRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1c2742" />
                    <stop offset="100%" stopColor="#121a2c" />
                  </linearGradient>
                  {/* Bottom flap gradient */}
                  <linearGradient id="envBottomGrad" x1="50%" y1="100%" x2="50%" y2="0%">
                    <stop offset="0%" stopColor="#243354" />
                    <stop offset="100%" stopColor="#162036" />
                  </linearGradient>
                </defs>

                <g clipPath="url(#envPocketClip)">
                  {/* Left Side Flap */}
                  <path
                    d="M 0,0 L 180,118 L 0,230 Z"
                    fill="url(#envLeftGrad)"
                    stroke="rgba(245, 215, 127, 0.14)"
                    strokeWidth="0.8"
                  />

                  {/* Right Side Flap */}
                  <path
                    d="M 360,0 L 180,118 L 360,230 Z"
                    fill="url(#envRightGrad)"
                    stroke="rgba(245, 215, 127, 0.14)"
                    strokeWidth="0.8"
                  />

                  {/* Bottom Pocket Flap */}
                  <path
                    d="M 0,230 L 180,118 L 360,230 Z"
                    fill="url(#envBottomGrad)"
                    stroke="rgba(245, 215, 127, 0.18)"
                    strokeWidth="0.9"
                  />
                </g>
              </svg>

              {/* Top Flap with True 3D Flip (Perspective rotateX) */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '135px',
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  zIndex: stage === 'opening' || stage === 'sliding' ? 1 : 5,
                }}
                animate={
                  stage === 'opening' || stage === 'sliding'
                    ? { rotateX: 180 }
                    : { rotateX: 0 }
                }
                transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
              >
                <svg
                  viewBox="0 0 360 135"
                  style={{ width: '100%', height: '100%', overflow: 'visible' }}
                >
                  <defs>
                    <clipPath id="envTopClip">
                      <rect width="360" height="135" rx="14" ry="14" />
                    </clipPath>
                    <linearGradient id="envTopGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#27375a" />
                      <stop offset="100%" stopColor="#1a253e" />
                    </linearGradient>
                  </defs>
                  {/* Flap contour with smooth unified diagonal angles and rounded tip */}
                  <path
                    d="M 14,0 L 346,0 Q 360,0 360,14 L 192,120 Q 180,128 168,120 L 0,14 Q 0,0 14,0 Z"
                    fill="url(#envTopGrad)"
                    stroke="rgba(245, 215, 127, 0.22)"
                    strokeWidth="0.9"
                  />
                </svg>

                {/* Wax Seal Container (Guaranteed perfect center alignment) */}
                {stage === 'closed' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '118px',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '80px',
                      height: '80px',
                      zIndex: 10,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* Glowing pulse ring behind seal */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: '4px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(245, 215, 127, 0.45) 0%, rgba(200, 30, 60, 0.25) 50%, transparent 70%)',
                          filter: 'blur(8px)',
                          animation: 'soundPulse 2s infinite alternate',
                        }}
                      />

                      {/* Wax seal image on envelope (B monogram) */}
                      <img
                        src="/wax%20seal.png"
                        alt="Wax Seal"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          display: 'block',
                          filter: 'drop-shadow(0 6px 14px rgba(0, 0, 0, 0.6))',
                          userSelect: 'none',
                          pointerEvents: 'none',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextSibling.style.display = 'flex';
                        }}
                      />

                      {/* Fallback seal if image isn't loaded */}
                      <div
                        style={{
                          display: 'none',
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, #c9184a 0%, #800f2f 100%)',
                          border: '2px solid #f5d77f',
                          boxShadow: '0 4px 15px rgba(201, 24, 74, 0.6)',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Heart size={22} color="#f5d77f" fill="#f5d77f" />
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* REALISTIC PROPER PARCHMENT PAPER LETTER */
          <motion.div
            key="proper-paper-letter"
            initial={{ opacity: 0, scale: 0.88, y: 35 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            style={{
              maxWidth: '580px',
              width: '100%',
              maxHeight: '82vh',
              overflowY: 'auto',
              position: 'relative',
              borderRadius: '8px',
              // Rich vintage stationery parchment gradient
              background: 'linear-gradient(135deg, #fdfbf7 0%, #faf6ec 45%, #f4eee0 100%)',
              padding: 'clamp(1.75rem, 5vw, 2.75rem)',
              boxShadow:
                '0 25px 65px rgba(0, 0, 0, 0.75), 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 0 50px rgba(215, 185, 140, 0.28)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
            }}
          >
            {/* Elegant double-line gold filigree inset border */}
            <div
              style={{
                position: 'absolute',
                inset: '10px',
                border: '1px solid rgba(195, 155, 80, 0.3)',
                borderRadius: '6px',
                pointerEvents: 'none',
              }}
            />

            {/* Realistic horizontal paper fold crease across the center */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(to bottom, rgba(160, 130, 95, 0.15) 0%, rgba(255, 255, 255, 0.5) 100%)',
                boxShadow: '0 1px 3px rgba(160, 130, 95, 0.1)',
                pointerEvents: 'none',
              }}
            />

            {/* Letter Salutation in Deep Ink Calligraphy */}
            <motion.h2
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(2.4rem, 6vw, 3.2rem)',
                color: '#2c1515',
                marginBottom: '1.5rem',
                lineHeight: 1.15,
                textShadow: '0 1px 2px rgba(44, 21, 21, 0.15)',
              }}
            >
              {config.scene3.letterSalutation}
            </motion.h2>

            {/* Letter Body Paragraphs (Rich vintage ink on paper) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
              {config.scene3.letterParagraphs.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.35 + index * 0.25,
                    duration: 0.65,
                    ease: 'easeOut',
                  }}
                  style={{
                    fontSize: 'clamp(0.98rem, 2.6vw, 1.08rem)',
                    lineHeight: 1.85,
                    color: '#2e2520',
                    fontWeight: 450,
                    letterSpacing: '0.015em',
                  }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Closing, Signature, and Miniature Wax Stamp */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.35 + config.scene3.letterParagraphs.length * 0.25 + 0.2,
                duration: 0.6,
              }}
              style={{
                marginTop: '2.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '1.25rem',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* Miniature wax seal stamp emblem on paper */}
              <img
                src="/wax%20seal%20v.png"
                alt="Stamp"
                style={{
                  width: '42px',
                  height: '42px',
                  objectFit: 'contain',
                  opacity: 0.85,
                  filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.3))',
                }}
              />

              <div style={{ textAlign: 'right' }}>
                <p
                  style={{
                    fontSize: '0.88rem',
                    color: '#786458',
                    fontStyle: 'italic',
                    marginBottom: '0.2rem',
                  }}
                >
                  {config.scene3.letterClosing}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-script)',
                    fontSize: 'clamp(1.9rem, 4.5vw, 2.5rem)',
                    color: '#8b1e2f',
                    lineHeight: 1.1,
                  }}
                >
                  {config.scene3.letterSignature}
                </p>
              </div>
            </motion.div>

            {/* Continue Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.35 + config.scene3.letterParagraphs.length * 0.25 + 0.5,
                duration: 0.5,
              }}
              style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem', position: 'relative', zIndex: 2 }}
            >
              <button
                onClick={onComplete}
                className="btn-primary"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
                }}
              >
                <span>{config.scene3.continueButton}</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { config } from '../config';

export default function Scene1SplitHeart({ onComplete }) {
  // Placement states
  const [leftPlaced, setLeftPlaced] = useState(false);
  const [rightPlaced, setRightPlaced] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [titleReady, setTitleReady] = useState(false);

  // Drag states
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);

  // Large arena resting offsets (responsive for mobile & Android viewports)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const defaultLeft = isMobile ? { x: -105, y: -2 } : { x: -140, y: -4 };
  const defaultRight = isMobile ? { x: 105, y: 2 } : { x: 140, y: 4 };

  const [leftPos, setLeftPos] = useState(defaultLeft);
  const [rightPos, setRightPos] = useState(defaultRight);

  const activeDragRef = useRef(null);
  const startPointerRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const SNAP_DISTANCE = isMobile ? 48 : 56; // Generous magnetic snap threshold

  // When both pieces lock into the center pattern
  useEffect(() => {
    if (leftPlaced && rightPlaced && !isCompleted) {
      setIsCompleted(true);

      // Heartbeat haptic pulse pattern
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([45, 60, 35, 90, 40]);
        } catch (e) {}
      }

      // Grand golden & ruby celebratory fireworks
      confetti({
        particleCount: 90,
        spread: 85,
        origin: { y: 0.46 },
        colors: ['#ff3366', '#f5d77f', '#ffffff', '#ff8da1', '#ffd166', '#c9184a'],
        ticks: 260,
        gravity: 0.72,
        scalar: 1.25,
      });

      // Secondary star burst
      setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 55,
          origin: { x: 0.35, y: 0.46 },
          colors: ['#f5d77f', '#ffffff', '#ff758c'],
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 55,
          origin: { x: 0.65, y: 0.46 },
          colors: ['#f5d77f', '#ffffff', '#ff758c'],
        });
      }, 300);

      // Reveal title after the heartbeat fuse
      setTimeout(() => {
        setTitleReady(true);
      }, 850);
    }
  }, [leftPlaced, rightPlaced, isCompleted]);

  // Pointer drag handler for Left & Right pieces
  const handlePointerDown = (piece, e) => {
    if ((piece === 'left' && leftPlaced) || (piece === 'right' && rightPlaced) || isCompleted) return;

    try {
      e.target.setPointerCapture?.(e.pointerId);
    } catch (err) {}

    activeDragRef.current = piece;
    startPointerRef.current = { x: e.clientX, y: e.clientY };
    startPosRef.current = piece === 'left' ? { ...leftPos } : { ...rightPos };

    if (piece === 'left') setIsDraggingLeft(true);
    if (piece === 'right') setIsDraggingRight(true);

    const onPointerMove = (ev) => {
      if (!activeDragRef.current) return;
      const dx = ev.clientX - startPointerRef.current.x;
      const dy = ev.clientY - startPointerRef.current.y;

      const newPos = {
        x: startPosRef.current.x + dx,
        y: startPosRef.current.y + dy,
      };

      if (activeDragRef.current === 'left') {
        const dist = Math.hypot(newPos.x, newPos.y);
        if (dist < SNAP_DISTANCE) {
          setLeftPos({ x: 0, y: 0 });
          setLeftPlaced(true);
          setIsDraggingLeft(false);
          if ('vibrate' in navigator) {
            try { navigator.vibrate(25); } catch (err) {}
          }
          cleanup();
        } else {
          setLeftPos(newPos);
        }
      } else if (activeDragRef.current === 'right') {
        const dist = Math.hypot(newPos.x, newPos.y);
        if (dist < SNAP_DISTANCE) {
          setRightPos({ x: 0, y: 0 });
          setRightPlaced(true);
          setIsDraggingRight(false);
          if ('vibrate' in navigator) {
            try { navigator.vibrate(25); } catch (err) {}
          }
          cleanup();
        } else {
          setRightPos(newPos);
        }
      }
    };

    const onPointerUp = () => {
      if (activeDragRef.current === 'left') {
        setIsDraggingLeft(false);
        if (!leftPlaced) {
          if (Math.hypot(leftPos.x, leftPos.y) < SNAP_DISTANCE) {
            setLeftPos({ x: 0, y: 0 });
            setLeftPlaced(true);
          } else {
            setLeftPos(defaultLeft);
          }
        }
      } else if (activeDragRef.current === 'right') {
        setIsDraggingRight(false);
        if (!rightPlaced) {
          if (Math.hypot(rightPos.x, rightPos.y) < SNAP_DISTANCE) {
            setRightPos({ x: 0, y: 0 });
            setRightPlaced(true);
          } else {
            setRightPos(defaultRight);
          }
        }
      }
      activeDragRef.current = null;
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  // Tap-to-fix helper (accessibility fallback)
  const handlePieceClick = (piece) => {
    if (piece === 'left' && !leftPlaced) {
      setLeftPos({ x: 0, y: 0 });
      setLeftPlaced(true);
      setIsDraggingLeft(false);
      if ('vibrate' in navigator) {
        try { navigator.vibrate(25); } catch (e) {}
      }
    } else if (piece === 'right' && !rightPlaced) {
      setRightPos({ x: 0, y: 0 });
      setRightPlaced(true);
      setIsDraggingRight(false);
      if ('vibrate' in navigator) {
        try { navigator.vibrate(25); } catch (e) {}
      }
    }
  };

  const fullTitle = `${config.scene1.burstTitle} ${config.recipientName}!`;

  return (
    <div className="scene-wrapper" style={{ minHeight: '100vh', justifyContent: 'center' }}>
      {/* GRAND INTERACTIVE ARENA */}
      <div
        style={{
          position: 'relative',
          width: 'clamp(320px, 92vw, 540px)',
          height: 'clamp(280px, 70vw, 360px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
        }}
      >
        {/* CENTER CELESTIAL BLUEPRINT SILHOUETTE - ROMANTIC GLASS CRADLE */}
        <div
          style={{
            position: 'absolute',
            width: 'clamp(260px, 68vw, 330px)',
            height: 'clamp(234px, 61.2vw, 297px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          <svg
            viewBox="0 0 400 360"
            style={{ width: '100%', height: '100%', overflow: 'visible', display: 'block' }}
          >
            <defs>
              <linearGradient id="cradleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 77, 109, 0.14)" />
                <stop offset="50%" stopColor="rgba(245, 215, 127, 0.08)" />
                <stop offset="100%" stopColor="rgba(11, 19, 43, 0.25)" />
              </linearGradient>

              <linearGradient id="cradleRim" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f5d77f" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#ff8da1" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#f5d77f" stopOpacity="0.75" />
              </linearGradient>
            </defs>

            {/* Glowing Ethereal Glass Silhouette */}
            <path
              d="M 200,335 C 30,225 5,110 85,45 C 150,-10 190,40 200,70 C 210,40 250,-10 315,45 C 395,110 370,225 200,335 Z"
              fill="url(#cradleGrad)"
              stroke="url(#cradleRim)"
              strokeWidth="1.6"
              style={{
                filter: isCompleted
                  ? 'drop-shadow(0 0 35px rgba(255, 77, 109, 0.95))'
                  : 'drop-shadow(0 0 12px rgba(245, 215, 127, 0.35)) drop-shadow(0 0 24px rgba(255, 77, 109, 0.25))',
              }}
            />

            {/* Delicate Starlight Sparkle at the cleft */}
            {!isCompleted && (
              <g opacity="0.8">
                <circle cx="200" cy="70" r="2.8" fill="#ffffff" />
                <circle cx="200" cy="70" r="6" fill="#f5d77f" opacity="0.4" style={{ filter: 'blur(2px)' }} />
              </g>
            )}
          </svg>
        </div>

        {/* Shockwave Rings on Fusion */}
        {isCompleted && (
          <>
            <motion.div
              initial={{ scale: 0.4, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                border: '3px solid rgba(245, 215, 127, 0.85)',
                boxShadow: '0 0 30px rgba(255, 77, 109, 0.8)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
            <motion.div
              initial={{ scale: 0.6, opacity: 0.7 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.4, ease: 'easeOut', delay: 0.15 }}
              style={{
                position: 'absolute',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                border: '2px solid rgba(255, 141, 161, 0.7)',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            />
          </>
        )}

        {/* Ambient Halo when fixed */}
        {isCompleted && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [1, 1.45, 1.25], opacity: [0.75, 1, 0.6] }}
            transition={{ duration: 2.0, repeat: Infinity, repeatType: 'reverse' }}
            style={{
              position: 'absolute',
              width: '360px',
              height: '360px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(255, 77, 109, 0.7) 0%, rgba(245, 215, 127, 0.35) 50%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
        )}

        {/* GRAND HEART CONTAINER */}
        <motion.div
          animate={
            isCompleted
              ? {
                  // Dramatic double heartbeat pulse
                  scale: [1, 1.28, 1.04, 1.18, 0.96, 1],
                  filter: 'drop-shadow(0 0 45px rgba(255, 77, 109, 0.95))',
                }
              : {
                  scale: 1,
                  filter: 'drop-shadow(0 0 15px rgba(255, 77, 109, 0.45))',
                }
          }
          transition={
            isCompleted
              ? { duration: 1.2, ease: [0.25, 1, 0.5, 1] }
              : { duration: 0.3 }
          }
          style={{
            position: 'relative',
            width: 'clamp(260px, 68vw, 330px)',
            height: 'clamp(234px, 61.2vw, 297px)',
            zIndex: 4,
          }}
        >
          {/* Fusion Seam Beam Flash */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 1, scaleY: 0 }}
              animate={{ opacity: [1, 1, 0], scaleY: [0, 1.2, 1] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '18%',
                bottom: '8%',
                width: '6px',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(to bottom, #ffffff, #f5d77f, #ffffff)',
                boxShadow: '0 0 20px #ffffff, 0 0 40px #f5d77f',
                borderRadius: '99px',
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* LEFT PIECE (Large, Glossy, Floating in Zero-G) */}
          <motion.div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '50%',
              height: '100%',
              overflow: 'hidden',
              cursor: leftPlaced ? 'default' : 'grab',
              touchAction: 'none',
              zIndex: leftPlaced ? 5 : 6,
            }}
            animate={
              leftPlaced
                ? { x: 0, y: 0, rotate: 0 }
                : isDraggingLeft
                ? { x: leftPos.x, y: leftPos.y, rotate: -2 }
                : {
                    x: leftPos.x,
                    y: [leftPos.y - 9, leftPos.y + 9, leftPos.y - 9],
                    rotate: [-3.5, 2.5, -3.5],
                  }
            }
            transition={
              leftPlaced
                ? { type: 'spring', stiffness: 450, damping: 28 }
                : isDraggingLeft
                ? { duration: 0 }
                : {
                    y: { duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
                    rotate: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
                  }
            }
            onPointerDown={(e) => handlePointerDown('left', e)}
            onClick={() => handlePieceClick('left')}
            title={leftPlaced ? 'Left piece locked' : 'Drag or tap to place left piece'}
          >
            <svg
              viewBox="0 0 400 360"
              style={{
                width: '200%',
                height: '100%',
                display: 'block',
                transform: 'translateX(0%)',
                overflow: 'visible',
              }}
            >
              <defs>
                {/* Luminous 3D ruby jewel gradient */}
                <linearGradient id="grandHeartLeft" x1="15%" y1="0%" x2="85%" y2="100%">
                  <stop offset="0%" stopColor="#ff5277" />
                  <stop offset="30%" stopColor="#e61f4f" />
                  <stop offset="70%" stopColor="#b30938" />
                  <stop offset="100%" stopColor="#66001d" />
                </linearGradient>

                <linearGradient id="goldEdgeLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffe699" />
                  <stop offset="50%" stopColor="#f5d77f" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>

                {/* Soft 3D volumetric glass sheen */}
                <radialGradient id="rubySheenLeft" cx="45%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                  <stop offset="45%" stopColor="#ff8da1" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Heart Left Half Body with Gold Foil Bevel */}
              <path
                d="M 200,335 C 30,225 5,110 85,45 C 150,-10 190,40 200,70 L 200,335 Z"
                fill="url(#grandHeartLeft)"
                stroke="url(#goldEdgeLeft)"
                strokeWidth={leftPlaced ? '2.4' : '1.8'}
                style={{
                  filter: leftPlaced
                    ? 'drop-shadow(0 0 20px rgba(245, 215, 127, 0.75))'
                    : 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 16px rgba(255, 77, 109, 0.45))',
                }}
              />

              {/* Soft 3D volumetric jewel sheen over dome */}
              <path
                d="M 200,335 C 30,225 5,110 85,45 C 150,-10 190,40 200,70 L 200,335 Z"
                fill="url(#rubySheenLeft)"
                pointerEvents="none"
              />

              {/* Golden magnetic energy seam along the inner fracture */}
              {!leftPlaced && (
                <line
                  x1="200"
                  y1="70"
                  x2="200"
                  y2="335"
                  stroke="url(#goldEdgeLeft)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.9"
                  style={{
                    filter: 'drop-shadow(0 0 8px #f5d77f)',
                  }}
                />
              )}
            </svg>
          </motion.div>

          {/* RIGHT PIECE (Large, Glossy, Floating in Zero-G) */}
          <motion.div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: '50%',
              height: '100%',
              overflow: 'hidden',
              cursor: rightPlaced ? 'default' : 'grab',
              touchAction: 'none',
              zIndex: rightPlaced ? 5 : 6,
            }}
            animate={
              rightPlaced
                ? { x: 0, y: 0, rotate: 0 }
                : isDraggingRight
                ? { x: rightPos.x, y: rightPos.y, rotate: 2 }
                : {
                    x: rightPos.x,
                    y: [rightPos.y + 9, rightPos.y - 9, rightPos.y + 9],
                    rotate: [3.5, -2.5, 3.5],
                  }
            }
            transition={
              rightPlaced
                ? { type: 'spring', stiffness: 450, damping: 28 }
                : isDraggingRight
                ? { duration: 0 }
                : {
                    y: { duration: 3.7, repeat: Infinity, ease: 'easeInOut', delay: 0.35 },
                    rotate: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.25 },
                  }
            }
            onPointerDown={(e) => handlePointerDown('right', e)}
            onClick={() => handlePieceClick('right')}
            title={rightPlaced ? 'Right piece locked' : 'Drag or tap to place right piece'}
          >
            <svg
              viewBox="0 0 400 360"
              style={{
                width: '200%',
                height: '100%',
                display: 'block',
                transform: 'translateX(-50%)',
                overflow: 'visible',
              }}
            >
              <defs>
                <linearGradient id="grandHeartRight" x1="15%" y1="0%" x2="85%" y2="100%">
                  <stop offset="0%" stopColor="#ff4d6d" />
                  <stop offset="30%" stopColor="#d91244" />
                  <stop offset="70%" stopColor="#990029" />
                  <stop offset="100%" stopColor="#520016" />
                </linearGradient>

                <linearGradient id="goldEdgeRight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffe699" />
                  <stop offset="50%" stopColor="#f5d77f" />
                  <stop offset="100%" stopColor="#d4af37" />
                </linearGradient>

                {/* Soft 3D volumetric glass sheen */}
                <radialGradient id="rubySheenRight" cx="55%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
                  <stop offset="45%" stopColor="#ff8da1" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#ff4d6d" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Heart Right Half Body with Gold Foil Bevel */}
              <path
                d="M 200,70 C 210,40 250,-10 315,45 C 395,110 370,225 200,335 L 200,70 Z"
                fill="url(#grandHeartRight)"
                stroke="url(#goldEdgeRight)"
                strokeWidth={rightPlaced ? '2.4' : '1.8'}
                style={{
                  filter: rightPlaced
                    ? 'drop-shadow(0 0 20px rgba(245, 215, 127, 0.75))'
                    : 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.5)) drop-shadow(0 0 16px rgba(255, 77, 109, 0.45))',
                }}
              />

              {/* Soft 3D volumetric jewel sheen over dome */}
              <path
                d="M 200,70 C 210,40 250,-10 315,45 C 395,110 370,225 200,335 L 200,70 Z"
                fill="url(#rubySheenRight)"
                pointerEvents="none"
              />

              {/* Golden magnetic energy seam along the inner fracture */}
              {!rightPlaced && (
                <line
                  x1="200"
                  y1="70"
                  x2="200"
                  y2="335"
                  stroke="url(#goldEdgeRight)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  opacity="0.9"
                  style={{
                    filter: 'drop-shadow(0 0 8px #f5d77f)',
                  }}
                />
              )}
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Status & Letter-by-Letter Reveal */}
      <div
        style={{
          minHeight: '110px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '1.25rem',
          textAlign: 'center',
          padding: '0 1rem',
        }}
      >
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key="game-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="hint-text">
                <span>drag and place</span>
              </p>
            </motion.div>
          ) : (
            titleReady && (
              <motion.div
                key="revealed-title"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
              >
                <h1
                  className="script-title"
                  style={{
                    fontSize: 'clamp(2.6rem, 7.5vw, 4.4rem)',
                    letterSpacing: '0.02em',
                  }}
                >
                  {fullTitle.split('').map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.04,
                        ease: 'easeOut',
                      }}
                      style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </h1>

                {/* Continue Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: fullTitle.length * 0.04 + 0.25, duration: 0.5 }}
                  onClick={onComplete}
                  className="btn-primary"
                  style={{ padding: '0.85rem 1.85rem' }}
                >
                  <span>{config.scene1.continueButton}</span>
                  <ArrowRight size={18} />
                </motion.button>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

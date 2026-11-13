import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { X, ArrowRight, Heart, Calendar } from 'lucide-react';
import { config } from '../config';

/**
 * Interactive Polaroid Photo with:
 * - Natural idle pendulum hanging & moving animation (swaying gently on the string)
 * - Interactive drag & hover impulse physics (swings in the direction of cursor pull)
 * - Damped harmonic return: after releasing or dragging, it continues hanging,
 *   swaying back and forth, and smoothly transitions back into its gentle idle sway!
 * - Click opens the high-res lightbox modal
 */
function PolaroidItem({ photo, index, onSelect }) {
  const [imgError, setImgError] = useState(false);
  const isPointerDownRef = useRef(false);
  const isInteractingRef = useRef(false);
  const interactTimeoutRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartTime = useRef(0);

  // Natural resting angle (alternating subtle tilt)
  const initialRotate = index % 2 === 0 ? -1.8 : 1.8;

  // Physics motion value for rotation
  const rotateValue = useMotionValue(initialRotate);

  // Damped harmonic pendulum spring:
  // - Low stiffness (24) for soft, relaxed hanging return
  // - Low damping (4.0) for natural multi-swing oscillations before resting
  // - High mass (1.4) gives the photo authentic paper weight
  const springRotate = useSpring(rotateValue, {
    stiffness: 24,
    damping: 4.0,
    mass: 1.4,
  });

  // Wooden clothespin tilts on its wire hinge in sync with the card
  const clipRotate = useTransform(springRotate, (val) => val * 0.32);

  // Dynamic 3D shadow shifting with the tilt
  const shadowX = useTransform(springRotate, (val) => -val * 0.5);

  const placeholderGradients = [
    'linear-gradient(135deg, #1d2a4d, #3c2a4d)',
    'linear-gradient(135deg, #2a1b3d, #442b48)',
    'linear-gradient(135deg, #142850, #27496d)',
    'linear-gradient(135deg, #2b2e4a, #e84545)',
    'linear-gradient(135deg, #202040, #543864)',
    'linear-gradient(135deg, #1c1c3c, #3f2b96)',
  ];

  // Continuous idle animation: gentle pendulum swaying while hanging
  useEffect(() => {
    let animId;
    const startTime = Date.now() + index * 950;
    const speed = 1.25 + (index % 3) * 0.22; // subtle variation in frequency
    const amplitude = 2.2; // gentle 2.2 deg idle sway

    const loop = () => {
      if (!isPointerDownRef.current && !isInteractingRef.current) {
        const elapsed = (Date.now() - startTime) / 1000;
        const idleOffset = Math.sin(elapsed * speed) * amplitude;
        rotateValue.set(initialRotate + idleOffset);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
    };
  }, [index, initialRotate, rotateValue]);

  const markInteracting = () => {
    isInteractingRef.current = true;
    if (interactTimeoutRef.current) clearTimeout(interactTimeoutRef.current);
    // Allow 2.5s of free pendulum decay before gentle idle breathing resumes
    interactTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 2500);
  };

  // Hover brush impulse when dragging cursor across the card
  const handlePointerMove = (e) => {
    if (isPointerDownRef.current) return;
    const movement = e.movementX;
    if (Math.abs(movement) > 1.2) {
      markInteracting();
      const impulse = Math.min(18, Math.max(-18, movement * 1.5));
      rotateValue.set(initialRotate + impulse);
    }
  };

  const handlePointerLeave = () => {
    if (!isPointerDownRef.current && isInteractingRef.current) {
      rotateValue.set(initialRotate);
    }
  };

  // Direct touch/mouse grab & drag
  const handlePointerDown = (e) => {
    isPointerDownRef.current = true;
    markInteracting();
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    dragStartTime.current = Date.now();
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerDragMove = (e) => {
    if (!isPointerDownRef.current) return;
    markInteracting();
    const deltaX = e.clientX - dragStartPos.current.x;
    const dragAngle = Math.min(26, Math.max(-26, initialRotate + deltaX * 0.35));
    rotateValue.set(dragAngle);
  };

  const handlePointerUp = (e) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);

    const dist = Math.hypot(
      e.clientX - dragStartPos.current.x,
      e.clientY - dragStartPos.current.y
    );
    const duration = Date.now() - dragStartTime.current;

    // Release: card keeps hanging, oscillates freely, and slowly returns to rest!
    rotateValue.set(initialRotate);
    markInteracting();

    // Tap / Click opens lightbox modal
    if (dist < 6 && duration < 320) {
      onSelect(photo);
    }
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerMoveCapture={handlePointerDragMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        paddingTop: '10px',
        userSelect: 'none',
        touchAction: 'none',
        cursor: 'grab',
      }}
    >
      {/* Wooden Clothespin Peg (Hinged to the wire) */}
      <motion.div
        style={{
          position: 'absolute',
          top: '0px',
          width: '8px',
          height: '18px',
          backgroundColor: '#c49a6c',
          borderRadius: '2px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
          zIndex: 10,
          border: '1px solid #997044',
          transformOrigin: 'top center',
          rotate: clipRotate,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '6px',
            left: '1px',
            right: '1px',
            height: '3px',
            background: 'linear-gradient(to right, #cfaf70, #ffffff, #997044)',
            borderRadius: '1px',
          }}
        />
      </motion.div>

      {/* Hanging Polaroid Card with Idle Sway & Spring Drag Physics */}
      <motion.div
        whileTap={{ scale: 0.98 }}
        style={{
          width: '100%',
          maxWidth: 'clamp(112px, 13vw, 142px)',
          aspectRatio: '3 / 4.1',
          backgroundColor: '#faf8f5',
          borderRadius: '5px',
          padding: '6px 6px 12px 6px',
          boxShadow: '0 8px 22px rgba(0, 0, 0, 0.5), 0 2px 6px rgba(0, 0, 0, 0.25)',
          transformOrigin: 'top center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid rgba(255, 255, 255, 0.85)',
          position: 'relative',
          rotate: springRotate,
          x: shadowX,
        }}
      >
        {/* Photo Container */}
        <div
          style={{
            width: '100%',
            height: '80%',
            borderRadius: '3px',
            overflow: 'hidden',
            backgroundColor: '#162038',
            position: 'relative',
            pointerEvents: 'none',
          }}
        >
          {!imgError ? (
            <img
              src={photo.src}
              alt={photo.caption || `Memory ${index + 1}`}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              loading="lazy"
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                background: placeholderGradients[index % placeholderGradients.length],
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.4rem',
                textAlign: 'center',
              }}
            >
              <Heart size={20} color="#ff8da1" fill="#ff4d6d" style={{ marginBottom: '3px', opacity: 0.85 }} />
              <span
                style={{
                  fontSize: '0.62rem',
                  color: '#f5d77f',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                Memory #{index + 1}
              </span>
            </div>
          )}
        </div>

        {/* Polaroid handwritten caption */}
        <p
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: '0.86rem',
            color: '#2b2d42',
            textAlign: 'center',
            marginTop: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '0 2px',
            lineHeight: 1.1,
            pointerEvents: 'none',
          }}
        >
          {photo.caption || `Memory ${index + 1}`}
        </p>
      </motion.div>
    </div>
  );
}

/**
 * Clean Golden Fairy Light Wire with small glowing dots
 */
function FairyLightWire({ rowIndex = 0 }) {
  const dotColors = [
    '#ff4d6d', // Rose
    '#ffd166', // Warm Gold
    '#4cc9f0', // Cyan Blue
    '#06d6a0', // Mint Green
    '#ff8da1', // Soft Pink
    '#a0c4ff', // Sky Blue
    '#f5d77f', // Champagne Gold
    '#b5179e', // Lilac
    '#ffbe0b', // Amber
    '#72efdd', // Aqua
  ];

  // Dynamic quadratic catenary curve
  // Start: (0, 16), Control: (500, 42), End: (1000, 16)
  const dots = [
    { x: 50, c: 0 },
    { x: 140, c: 1 },
    { x: 230, c: 2 },
    { x: 330, c: 3 },
    { x: 430, c: 4 },
    { x: 570, c: 5 },
    { x: 670, c: 6 },
    { x: 770, c: 7 },
    { x: 860, c: 8 },
    { x: 950, c: 9 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '-10px',
        left: 0,
        right: 0,
        height: '44px',
        pointerEvents: 'none',
        zIndex: 3,
        overflow: 'visible',
      }}
    >
      <svg
        viewBox="0 0 1000 50"
        preserveAspectRatio="none"
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <defs>
          <linearGradient id={`wireGrad_${rowIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffe699" stopOpacity="0.85" />
            <stop offset="15%" stopColor="#f5d77f" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#f5d77f" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#f5d77f" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffe699" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* Catenary Wire */}
        <path
          d="M 0,16 Q 500,42 1000,16"
          stroke={`url(#wireGrad_${rowIndex})`}
          strokeWidth="1.6"
          fill="none"
        />

        {/* Subtle shadow beneath wire */}
        <path
          d="M 0,17.5 Q 500,43.5 1000,17.5"
          stroke="rgba(0, 0, 0, 0.35)"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Small colorful glowing fairy light dots */}
        {dots.map((d, i) => {
          const color = dotColors[d.c];
          const t = d.x / 1000;
          const curveY = (1 - t) * (1 - t) * 16 + 2 * (1 - t) * t * 42 + t * t * 16;

          return (
            <g key={i}>
              <circle
                cx={d.x}
                cy={curveY}
                r={5.5}
                fill={color}
                opacity={0.3}
                style={{ filter: 'blur(3px)' }}
              />
              <circle
                cx={d.x}
                cy={curveY}
                r={3.2}
                fill={color}
                style={{
                  filter: `drop-shadow(0 0 5px ${color})`,
                  animation: `soundPulse ${1.6 + (i % 4) * 0.35}s infinite alternate`,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function Scene4Gallery({ onComplete }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const photos = config.scene4.photos || [];

  const row1 = photos.slice(0, 3);
  const row2 = photos.slice(3, 6);

  return (
    <div
      className="scene-wrapper"
      style={{
        padding: 'clamp(0.8rem, 2vh, 1.8rem) clamp(1rem, 3.5vw, 2.5rem) clamp(0.6rem, 1.8vh, 1.4rem) clamp(1rem, 3.5vw, 2.5rem)',
        maxWidth: '920px',
        width: '100%',
        maxHeight: '100vh',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Single Elegant Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 'clamp(0.6rem, 1.8vh, 1.25rem)' }}
      >
        <h2
          className="script-title"
          style={{
            fontSize: 'clamp(2.3rem, 5vw, 3.4rem)',
            color: '#f5d77f',
            lineHeight: 1.15,
            letterSpacing: '0.01em',
            textShadow: '0 2px 14px rgba(245, 215, 127, 0.35)',
          }}
        >
          {config.scene4.title}
        </h2>
      </motion.div>

      {/* GALLERY ROWS CONTAINER */}
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(1rem, 2.6vh, 2.1rem)',
          position: 'relative',
        }}
      >
        {/* ROW 1 */}
        {row1.length > 0 && (
          <div style={{ position: 'relative', width: '100%' }}>
            <FairyLightWire rowIndex={0} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'clamp(0.5rem, 2.5vw, 2rem)',
                justifyItems: 'center',
                paddingTop: '6px',
                position: 'relative',
                zIndex: 4,
              }}
            >
              {row1.map((photo, i) => (
                <PolaroidItem
                  key={photo.id || i}
                  photo={photo}
                  index={i}
                  onSelect={setSelectedPhoto}
                />
              ))}
            </div>
          </div>
        )}

        {/* ROW 2 */}
        {row2.length > 0 && (
          <div style={{ position: 'relative', width: '100%' }}>
            <FairyLightWire rowIndex={1} />

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 'clamp(0.5rem, 2.5vw, 2rem)',
                justifyItems: 'center',
                paddingTop: '6px',
                position: 'relative',
                zIndex: 4,
              }}
            >
              {row2.map((photo, i) => (
                <PolaroidItem
                  key={photo.id || i + 3}
                  photo={photo}
                  index={i + 3}
                  onSelect={setSelectedPhoto}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Continue Button (Guaranteed to fit in window) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: 'clamp(0.8rem, 2.2vh, 1.5rem)',
          textAlign: 'center',
        }}
      >
        <button onClick={onComplete} className="btn-primary" style={{ padding: '0.7rem 1.6rem' }}>
          <span>{config.scene4.continueButton}</span>
          <ArrowRight size={17} />
        </button>
      </motion.div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              backgroundColor: 'rgba(6, 9, 19, 0.88)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.25rem',
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: '#faf8f5',
                borderRadius: '12px',
                padding: '16px 16px 24px 16px',
                maxWidth: '400px',
                width: '100%',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1b2438',
                  border: '1px solid rgba(245, 215, 127, 0.3)',
                  color: '#fdfbf7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                }}
              >
                <X size={18} />
              </button>

              <div
                style={{
                  width: '100%',
                  aspectRatio: '3 / 4',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  backgroundColor: '#162038',
                }}
              >
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.caption}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    display: 'none',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #1d2a4d, #3c2a4d)',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <Heart size={44} color="#ff8da1" fill="#ff4d6d" style={{ marginBottom: '1rem', opacity: 0.9 }} />
                  <span style={{ fontSize: '1.1rem', color: '#f5d77f', fontWeight: 600 }}>
                    {selectedPhoto.caption || 'Special Memory'}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-script)',
                    fontSize: '1.6rem',
                    color: '#2b2d42',
                    lineHeight: 1.2,
                  }}
                >
                  {selectedPhoto.caption}
                </p>
                {selectedPhoto.date && (
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: '#6b7280',
                      marginTop: '0.35rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    <Calendar size={13} />
                    <span>{selectedPhoto.date}</span>
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

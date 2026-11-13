import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { config } from '../config';

// List of all critical visual and media assets to preload at startup
const PRELOAD_IMAGES = [
  '/wax seal.png',
  '/wax%20seal.png',
  '/wax seal v.png',
  '/wax%20seal%20v.png',
  ...(config.scene4?.photos?.map((p) => p.src) || []),
  '/album/1.jpeg',
  '/album/2.jpeg',
  '/album/3.jpeg',
  '/album/4.jpeg',
  '/album/5.jpeg',
  '/album/6.jpeg',
];

// Deduplicate
const UNIQUE_IMAGES = Array.from(new Set(PRELOAD_IMAGES));

function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    if (img.complete) {
      resolve(url);
    } else {
      img.onload = () => resolve(url);
      img.onerror = () => resolve(url); // Resolve anyway to never stall
    }
  });
}

function preloadAudio(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(null);
    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = url;
      audio.addEventListener('canplaythrough', () => resolve(url), { once: true });
      audio.addEventListener('error', () => resolve(url), { once: true });
      setTimeout(() => resolve(url), 2500); // 2.5s safety cap
    } catch {
      resolve(null);
    }
  });
}

export default function LoadingScreen({ onLoaded }) {
  const [progress, setProgress] = useState(15);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let loadedItems = 0;
    const totalItems = UNIQUE_IMAGES.length + (config.musicSrc ? 1 : 0) + 1; // +1 for fonts

    const updateProgress = () => {
      if (!isMounted) return;
      loadedItems += 1;
      const pct = Math.min(100, Math.max(15, Math.round((loadedItems / totalItems) * 100)));
      setProgress((prev) => Math.max(prev, pct));
    };

    // Preload all images in parallel
    const imagePromises = UNIQUE_IMAGES.map((url) =>
      preloadImage(url).then(updateProgress)
    );

    // Preload audio
    const audioPromise = config.musicSrc
      ? preloadAudio(config.musicSrc).then(updateProgress)
      : Promise.resolve();

    // Wait for fonts
    const fontPromise = (document.fonts ? document.fonts.ready : Promise.resolve())
      .then(updateProgress)
      .catch(updateProgress);

    // Enforce a minimum display time of 1000ms for smooth cinematic feel
    const minTimePromise = new Promise((resolve) => setTimeout(resolve, 1000));

    // Safety timeout: never hang more than 6 seconds
    const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 6000));

    Promise.race([
      Promise.all([...imagePromises, audioPromise, fontPromise, minTimePromise]),
      timeoutPromise,
    ]).then(() => {
      if (!isMounted) return;
      setProgress(100);
      setTimeout(() => {
        if (!isMounted) return;
        setIsDone(true);
        onLoaded?.();
      }, 450);
    });

    return () => {
      isMounted = false;
    };
  }, [onLoaded]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: 'easeInOut' } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#060913',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            userSelect: 'none',
          }}
        >
          {/* Pulsing Heart Emblem */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 4, -4, 0],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'relative',
              width: 72,
              height: 72,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 141, 161, 0.4), transparent 70%)',
                filter: 'blur(12px)',
              }}
            />
            <Heart size={44} color="#ff8da1" fill="#ff4d6d" strokeWidth={1.5} />
          </motion.div>

          {/* Title & Status */}
          <div style={{ textAlign: 'center' }}>
            <motion.p
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: '2rem',
                color: '#f5d77f',
                textShadow: '0 0 15px rgba(245, 215, 127, 0.4)',
                marginBottom: '0.4rem',
              }}
            >
              Preparing something magical...
            </motion.p>
            <p style={{ fontSize: '0.85rem', color: '#8490a7', letterSpacing: '0.05em' }}>
              Loading memories & celestial stars
            </p>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '180px',
              height: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '99px',
              overflow: 'hidden',
              marginTop: '0.5rem',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #f5d77f, #ff8da1)',
                borderRadius: '99px',
                width: `${progress}%`,
                transition: 'width 0.25s ease',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

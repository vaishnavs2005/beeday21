import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowRight, Sparkles, Mic, Wind } from 'lucide-react';
import CinematicShootingStar from './CinematicShootingStar';
import { config } from '../config';

export default function Scene2CakeCandle({ onComplete }) {
  // 'lit' | 'blown' | 'granted'
  const [flameState, setFlameState] = useState('lit');
  const [isPassingStar, setIsPassingStar] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [blowIntensity, setBlowIntensity] = useState(0);

  const audioCtxRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const isReadyToBlowRef = useRef(false);
  const baselineRef = useRef(25);

  // Stop microphone and release audio hardware
  const stopMic = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch (e) {}
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setMicEnabled(false);
    setBlowIntensity(0);
  };

  const handleBlowCandle = () => {
    if (flameState !== 'lit') return;
    setFlameState('blown');
    stopMic();

    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([25, 25]);
      } catch (e) {}
    }

    // Trigger meteor shower swarm of shooting stars in the background night sky
    window.dispatchEvent(
      new CustomEvent('trigger-meteor-shower', { detail: { count: 36 } })
    );

    // After 2.6s, show confetti and wish granted text
    setTimeout(() => {
      setFlameState('granted');
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#f5d77f', '#ffe699', '#ff8da1', '#ffffff', '#a0c4ff'],
      });
    }, 2600);
  };

  // Start listening to microphone for breath blow
  const startMicListener = async () => {
    if (flameState !== 'lit' || streamRef.current) return;
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });
      } catch (constraintErr) {
        // Fallback for Android browsers
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;
      if (audioCtx.state === 'suspended') {
        try {
          await audioCtx.resume();
        } catch (e) {}
      }

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.25;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      setMicEnabled(true);

      let sustainedBlow = 0;

      const processAudio = () => {
        if (flameState !== 'lit') {
          stopMic();
          return;
        }

        analyser.getByteFrequencyData(dataArray);

        // A breath blow directly onto a mic creates turbulent air rumble (low frequencies < 400Hz)
        let lowEnergy = 0;
        const lowBins = 16;
        for (let i = 0; i < lowBins; i++) {
          lowEnergy += dataArray[i];
        }
        const lowAvg = lowEnergy / lowBins;

        // Total volume
        let totalEnergy = 0;
        for (let i = 0; i < dataArray.length; i++) {
          totalEnergy += dataArray[i];
        }
        const totalAvg = totalEnergy / dataArray.length;

        // Adaptive ambient noise baseline calibration & warm-up period
        if (!isReadyToBlowRef.current) {
          baselineRef.current = baselineRef.current * 0.9 + lowAvg * 0.1;
          setBlowIntensity(0);
        } else {
          // Dynamic threshold based on real ambient room level
          const blowThreshold = Math.max(74, baselineRef.current + 26);
          const intensity = Math.min(1, Math.max(0, (lowAvg - baselineRef.current - 10) / 55));
          setBlowIntensity(intensity);

          // Deliberate breath blow detection: requires continuous breath turbulence
          if (lowAvg > blowThreshold || (lowAvg > 68 && totalAvg > 54)) {
            sustainedBlow++;
            if (sustainedBlow >= 9) {
              handleBlowCandle();
              return;
            }
          } else {
            sustainedBlow = Math.max(0, sustainedBlow - 1);
          }
        }

        animFrameRef.current = requestAnimationFrame(processAudio);
      };

      animFrameRef.current = requestAnimationFrame(processAudio);
    } catch (err) {
      // Microphone permission blocked or not available
      setMicEnabled(false);
    }
  };

  useEffect(() => {
    // Attempt to activate microphone on mount
    startMicListener();

    // 1.4s calibration & warm-up period so Android mic initialization transient never blows the candle
    const warmupTimer = setTimeout(() => {
      isReadyToBlowRef.current = true;
    }, 1400);

    return () => {
      clearTimeout(warmupTimer);
      isReadyToBlowRef.current = false;
      stopMic();
    };
  }, []);

  const handleNextClick = () => {
    if (isPassingStar) return;
    setIsPassingStar(true);
  };

  return (
    <div
      className="scene-wrapper"
      style={{
        transition: 'background-color 1.2s ease',
        backgroundColor: flameState !== 'lit' ? 'rgba(4, 7, 16, 0.45)' : 'transparent',
      }}
    >
      {/* Fullscreen Optical Cinematic Shooting Star with Stardust Sparks & Celestial Flash */}
      {isPassingStar && (
        <CinematicShootingStar onComplete={onComplete} />
      )}

      {/* Illustrated Cake & Candle Container */}
      <div
        style={{
          position: 'relative',
          width: 'clamp(310px, 86vw, 360px)',
          height: 'clamp(280px, 78vw, 330px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginTop: '0.5rem',
        }}
      >
        {/* Flame & Smoke Container */}
        <div
          onClick={handleBlowCandle}
          style={{
            position: 'absolute',
            top: '8%',
            left: '50%',
            transform: 'translateX(-50%)',
            cursor: flameState === 'lit' ? 'pointer' : 'default',
            zIndex: 10,
            padding: '24px',
            touchAction: 'manipulation',
          }}
          title={flameState === 'lit' ? 'Blow into your microphone or click' : ''}
        >
          {/* Active Flame - Dynamically responds to real breath */}
          {flameState === 'lit' && (
            <motion.div
              style={{ position: 'relative', width: '38px', height: '54px', transformOrigin: 'bottom center' }}
              animate={{
                scaleY: [
                  (1 - blowIntensity * 0.45),
                  (1.14 - blowIntensity * 0.45),
                  (0.94 - blowIntensity * 0.45),
                  1 - blowIntensity * 0.45,
                ],
                scaleX: [
                  (1 + blowIntensity * 0.6),
                  (0.93 + blowIntensity * 0.6),
                  (1.06 + blowIntensity * 0.6),
                  1 + blowIntensity * 0.6,
                ],
                rotate: [
                  -2 + blowIntensity * 30,
                  3 + blowIntensity * 35,
                  -1 + blowIntensity * 28,
                  -2 + blowIntensity * 30,
                ],
              }}
              transition={{
                duration: blowIntensity > 0 ? 0.35 : 1.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Outer Golden Glow */}
              <div
                style={{
                  position: 'absolute',
                  inset: '-12px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255, 180, 50, 0.65) 0%, rgba(255, 100, 30, 0.25) 50%, transparent 70%)',
                  filter: 'blur(12px)',
                  animation: 'soundPulse 1.8s infinite alternate',
                }}
              />
              {/* Flame Outer Shape */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50% 50% 35% 35% / 70% 70% 30% 30%',
                  background: 'linear-gradient(to top, #ff3d00, #ff9100 60%, #ffea00)',
                  boxShadow: '0 0 25px #ff9100',
                }}
              />
              {/* Flame Inner Core */}
              <div
                style={{
                  position: 'absolute',
                  width: '16px',
                  height: '28px',
                  bottom: '5px',
                  left: '11px',
                  borderRadius: '50% 50% 35% 35% / 70% 70% 30% 30%',
                  background: 'linear-gradient(to top, #ffffff, #fff7c2)',
                  opacity: 0.95,
                }}
              />
            </motion.div>
          )}

          {/* Smoke Puff Animation when blown out */}
          {flameState !== 'lit' && (
            <div style={{ position: 'relative', width: '38px', height: '54px' }}>
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.85, y: 0, x: 0, scale: 0.7 }}
                  animate={{
                    opacity: 0,
                    y: -65 - i * 18,
                    x: (i - 1.5) * 24,
                    scale: 2.5,
                  }}
                  transition={{
                    duration: 1.7 + i * 0.3,
                    ease: 'easeOut',
                    delay: i * 0.1,
                  }}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(210, 220, 240, 0.75) 0%, rgba(160, 175, 200, 0) 70%)',
                    filter: 'blur(3.5px)',
                    pointerEvents: 'none',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* SVG Cake Illustration */}
        <svg
          viewBox="0 0 240 220"
          style={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
            filter: 'drop-shadow(0 18px 35px rgba(0,0,0,0.55))',
          }}
        >
          <defs>
            <linearGradient id="plateGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8d99ae" />
              <stop offset="50%" stopColor="#edf2f4" />
              <stop offset="100%" stopColor="#8d99ae" />
            </linearGradient>

            <linearGradient id="baseLayerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2b1e3a" />
              <stop offset="50%" stopColor="#44325a" />
              <stop offset="100%" stopColor="#2b1e3a" />
            </linearGradient>

            <linearGradient id="frostingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffd1dc" />
              <stop offset="100%" stopColor="#ff9ebb" />
            </linearGradient>

            <linearGradient id="topLayerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3d2b52" />
              <stop offset="50%" stopColor="#583f75" />
              <stop offset="100%" stopColor="#3d2b52" />
            </linearGradient>

            <linearGradient id="candleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f5d77f" />
              <stop offset="50%" stopColor="#fff2be" />
              <stop offset="100%" stopColor="#d4af37" />
            </linearGradient>
          </defs>

          {/* Candle Wick */}
          <line x1="120" y1="56" x2="120" y2="44" stroke="#4a4e69" strokeWidth="2.5" strokeLinecap="round" />

          {/* Candle Body */}
          <rect x="114" y="55" width="12" height="42" rx="3" fill="url(#candleGrad)" />
          {/* Candle spiral stripes */}
          <path d="M 114,64 L 126,69" stroke="#ff8da1" strokeWidth="2.5" />
          <path d="M 114,76 L 126,81" stroke="#ff8da1" strokeWidth="2.5" />
          <path d="M 114,88 L 126,93" stroke="#ff8da1" strokeWidth="2.5" />

          {/* TOP TIER */}
          <g>
            <rect x="68" y="96" width="104" height="46" rx="8" fill="url(#topLayerGrad)" />
            <path
              d="M 68,96 C 75,108 82,108 88,96 C 94,110 102,110 110,96 C 116,112 126,112 132,96 C 140,110 148,110 154,96 C 162,108 168,105 172,96 L 172,96 L 68,96 Z"
              fill="url(#frostingGrad)"
            />
            <circle cx="85" cy="115" r="2" fill="#f5d77f" />
            <circle cx="102" cy="122" r="2.2" fill="#ff758c" />
            <circle cx="120" cy="116" r="2" fill="#ffffff" />
            <circle cx="138" cy="124" r="2.2" fill="#f5d77f" />
            <circle cx="155" cy="117" r="2" fill="#a0c4ff" />
          </g>

          {/* BOTTOM TIER */}
          <g>
            <rect x="40" y="140" width="160" height="52" rx="10" fill="url(#baseLayerGrad)" />
            <path
              d="M 40,140 C 50,154 60,154 70,140 C 80,156 92,156 102,140 C 114,158 126,158 138,140 C 150,156 162,156 172,140 C 182,154 192,154 200,140 L 200,140 L 40,140 Z"
              fill="url(#frostingGrad)"
            />
            <circle cx="56" cy="165" r="2.5" fill="#f5d77f" />
            <circle cx="76" cy="174" r="2.5" fill="#ff8da1" />
            <circle cx="100" cy="166" r="2.5" fill="#f5d77f" />
            <circle cx="120" cy="176" r="3" fill="#ffffff" />
            <circle cx="140" cy="167" r="2.5" fill="#f5d77f" />
            <circle cx="164" cy="175" r="2.5" fill="#ff8da1" />
            <circle cx="184" cy="166" r="2.5" fill="#f5d77f" />
          </g>

          {/* Cake Stand / Plate (Straight) */}
          <rect x="20" y="191" width="200" height="8.5" rx="4" fill="url(#plateGrad)" />
          <rect x="22" y="191.5" width="196" height="1.8" rx="0.9" fill="#ffffff" opacity="0.6" />
          <rect x="36" y="199.5" width="168" height="3" rx="1.5" fill="#6c757d" opacity="0.4" />
        </svg>
      </div>

      {/* Status & Hints Area */}
      <div
        style={{
          minHeight: '120px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '1.5rem',
          textAlign: 'center',
          padding: '0 1rem',
        }}
      >
        <AnimatePresence mode="wait">
          {flameState === 'lit' && (
            <motion.div
              key="hint-lit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}
            >
              <div
                onClick={handleBlowCandle}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <p className="hint-text" style={{ fontSize: '0.95rem' }}>
                  {micEnabled ? '🌬️ Blow into microphone or tap flame' : '🕯️ Blow on mic or tap flame to blow out'}
                </p>
              </div>

              {/* Microphone Status Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2px' }}>
                {micEnabled ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      background: 'rgba(245, 215, 127, 0.1)',
                      border: '1px solid rgba(245, 215, 127, 0.3)',
                      fontSize: '0.75rem',
                      color: '#f5d77f',
                    }}
                  >
                    <Mic size={13} color="#f5d77f" />
                    <span>Mic ready — blow to extinguish</span>
                  </div>
                ) : (
                  <button
                    onClick={startMicListener}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      fontSize: '0.75rem',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                    }}
                  >
                    <Mic size={13} />
                    <span>Tap to enable microphone</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {flameState === 'blown' && (
            <motion.div
              key="hint-blown"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2
                className="script-title"
                style={{
                  fontSize: 'clamp(2rem, 5.5vw, 3.2rem)',
                  color: '#ffe699',
                }}
              >
                {config.scene2.makeAWishText}
              </h2>
            </motion.div>
          )}

          {flameState === 'granted' && (
            <motion.div
              key="hint-granted"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}
            >
              <p
                style={{
                  fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)',
                  color: '#fdfbf7',
                  fontWeight: 500,
                  textShadow: '0 0 15px rgba(245, 215, 127, 0.4)',
                }}
              >
                {config.scene2.wishGrantedText}
              </p>

              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                onClick={handleNextClick}
                className="btn-primary"
              >
                <span>{config.scene2.continueButton}</span>
                <ArrowRight size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

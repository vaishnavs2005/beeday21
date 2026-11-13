import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/**
 * MicPromptScreen
 * Displays solely the interactive illuminated microphone icon in the center.
 * Tapping triggers browser mic permission; as soon as the user responds,
 * it proceeds immediately to Session 1.
 */
export default function MicPromptScreen({ onProceed }) {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleMicClick = async () => {
    if (isRequesting) return;
    setIsRequesting(true);

    try {
      if (navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
          },
        });
        // Stop hardware track until Scene 2 candle blow
        stream.getTracks().forEach((track) => track.stop());
        onProceed(true);
        return;
      }
    } catch (err) {
      console.warn('Microphone permission dismissed or unavailable:', err);
    }

    // If dismissed, denied, or not supported, continue to Session 1
    onProceed(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.5 } }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: '#060913',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Background ambient warm celestial glow */}
      <div
        style={{
          position: 'absolute',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 215, 127, 0.25) 0%, rgba(255, 77, 109, 0.15) 45%, transparent 70%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
        }}
      />

      {/* Outer pulsing ripple ring */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1.8],
          opacity: [0.6, 0.25, 0],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeOut',
        }}
        style={{
          position: 'absolute',
          width: '104px',
          height: '104px',
          borderRadius: '50%',
          border: '2px solid rgba(245, 215, 127, 0.6)',
          pointerEvents: 'none',
        }}
      />

      {/* Secondary concentric aura ring */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          width: '124px',
          height: '124px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 141, 161, 0.35)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Interactive Mic Button */}
      <motion.button
        type="button"
        onClick={handleMicClick}
        disabled={isRequesting}
        aria-label="Enable microphone"
        initial={{ opacity: 1, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: [1, 1.08, 1],
          boxShadow: [
            '0 0 25px rgba(245, 215, 127, 0.5), 0 0 50px rgba(255, 77, 109, 0.3)',
            '0 0 45px rgba(245, 215, 127, 0.8), 0 0 80px rgba(255, 77, 109, 0.6)',
            '0 0 25px rgba(245, 215, 127, 0.5), 0 0 50px rgba(255, 77, 109, 0.3)',
          ],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.92 }}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(245, 215, 127, 0.35) 0%, rgba(255, 77, 109, 0.3) 100%)',
          border: '2.5px solid rgba(245, 215, 127, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isRequesting ? 'wait' : 'pointer',
          position: 'relative',
          zIndex: 10,
          outline: 'none',
          padding: 0,
        }}
      >
        {/* SVG Microphone Icon */}
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f5d77f"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(245, 215, 127, 0.95))',
            pointerEvents: 'none',
          }}
        >
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>

        {/* Orbiting Sparkle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: -8,
            pointerEvents: 'none',
          }}
        >
          <Sparkles
            size={20}
            color="#ffe699"
            style={{
              position: 'absolute',
              top: 0,
              right: 8,
              filter: 'drop-shadow(0 0 8px #ffe699)',
            }}
          />
        </motion.div>
      </motion.button>
    </motion.div>
  );
}

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Play, Pause, Volume2, VolumeX, Maximize, ArrowRight, Sparkles } from 'lucide-react';
import { config } from '../config';

export default function Scene5Video({ onComplete }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showUnmutePill, setShowUnmutePill] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);

  // Play video helper
  const startVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    setIsMuted(false);
    video
      .play()
      .then(() => {
        setIsPlaying(true);
        setHasStarted(true);
        setShowUnmutePill(false);
      })
      .catch(() => {
        // If unmuted autoplay blocked, fallback to muted
        video.muted = true;
        setIsMuted(true);
        video
          .play()
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
            setShowUnmutePill(true);
          })
          .catch(() => {
            // Wait for user click
          });
      });
  };

  useEffect(() => {
    // Show "Theres a suprise for u" for 3 seconds, then automatically trigger video playback
    const autoPlayTimer = setTimeout(() => {
      startVideo();
    }, 3000);

    return () => {
      clearTimeout(autoPlayTimer);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  const handleLoadedMetadata = (e) => {
    const { videoWidth, videoHeight } = e.currentTarget;
    if (videoWidth && videoHeight) {
      setAspectRatio(videoWidth / videoHeight);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setVideoEnded(true);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f5d77f', '#ff8da1', '#ffffff'],
    });

    // Automatically transition to next scene only after the whole video is played
    setTimeout(() => {
      onComplete?.();
    }, 1500);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!hasStarted) {
      startVideo();
      return;
    }
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
      });
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    if (!video.muted) {
      setShowUnmutePill(false);
    }
  };

  const handleUnmuteClick = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setIsMuted(false);
    setShowUnmutePill(false);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <div className="scene-wrapper" style={{ padding: '2rem 1rem', maxWidth: '800px', width: '100%' }}>
      {/* "Theres a suprise for u" shown ONLY right before the video is played */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15, transition: { duration: 0.45 } }}
            style={{ textAlign: 'center', marginBottom: '1.5rem' }}
          >
            <h2
              className="script-title"
              style={{
                fontSize: 'clamp(2.4rem, 6.5vw, 3.8rem)',
                color: '#f5d77f',
                letterSpacing: '0.02em',
              }}
            >
              Theres a suprise for u
            </h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player Box - Border strictly matches video resolution */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: aspectRatio ? undefined : '100%',
          maxWidth: 'min(92vw, 680px)',
          maxHeight: '70vh',
          aspectRatio: aspectRatio ? `${aspectRatio}` : '16 / 9',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#070b19',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(245, 215, 127, 0.25)',
          border: '2px solid rgba(245, 215, 127, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
        }}
      >
        {/* HTML5 Video Element */}
        <video
          ref={videoRef}
          src={config.videoSrc}
          poster={config.scene5.poster || undefined}
          playsInline
          webkit-playsinline="true"
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleVideoEnded}
          onClick={togglePlay}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            cursor: 'pointer',
          }}
        />

        {/* Tap to Unmute Floating Pill */}
        <AnimatePresence>
          {showUnmutePill && (
            <motion.button
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleUnmuteClick}
              style={{
                position: 'absolute',
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 25,
                backgroundColor: 'rgba(11, 19, 43, 0.9)',
                color: '#f5d77f',
                border: '1px solid rgba(245, 215, 127, 0.5)',
                borderRadius: '999px',
                padding: '0.55rem 1.25rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <VolumeX size={16} />
              <span>{config.scene5.unmutePrompt}</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Surprise Prompt & Big Play Button Overlay right before video played */}
        <AnimatePresence>
          {!hasStarted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={startVideo}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(7, 11, 25, 0.72)',
                backdropFilter: 'blur(5px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                cursor: 'pointer',
                zIndex: 20,
                padding: '1.5rem',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f5d77f, #ff8da1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#070b19',
                  boxShadow: '0 10px 35px rgba(245, 215, 127, 0.6)',
                }}
              >
                <Play size={36} fill="#070b19" style={{ marginLeft: '4px' }} />
              </div>

              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-script)',
                    fontSize: '1.8rem',
                    color: '#f5d77f',
                    lineHeight: 1.2,
                  }}
                >
                  Theres a suprise for u
                </p>
                <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
                  Tap anywhere to watch
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal Bottom Controls (NO SLIDER) */}
        {hasStarted && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '10px 14px',
              background: 'linear-gradient(transparent, rgba(6, 9, 19, 0.9))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 15,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <button
                onClick={togglePlay}
                style={{ background: 'none', border: 'none', color: '#fdfbf7', cursor: 'pointer', display: 'flex' }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} fill="#fdfbf7" />}
              </button>
              <button
                onClick={toggleMute}
                style={{ background: 'none', border: 'none', color: '#fdfbf7', cursor: 'pointer', display: 'flex' }}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>

            <button
              onClick={toggleFullscreen}
              style={{ background: 'none', border: 'none', color: '#fdfbf7', cursor: 'pointer', display: 'flex' }}
              aria-label="Fullscreen"
            >
              <Maximize size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Completion Message & Next Button ONLY after whole video is played */}
      <AnimatePresence>
        {videoEnded && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginTop: '2rem', textAlign: 'center' }}
          >
            <p style={{ color: '#f5d77f', fontSize: '1rem', marginBottom: '1rem', fontWeight: 500 }}>
              Moving to your final message... ✨
            </p>
            <button onClick={onComplete} className="btn-primary">
              <span>{config.scene5.continueButton}</span>
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

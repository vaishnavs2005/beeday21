import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * AudioPlayer handles playing background audio from `musicSrc` (/public/music.mp3).
 * It listens for the user's first interaction anywhere on the screen before starting.
 * If the audio file is missing or fails to play, it seamlessly falls back to a gentle
 * synthesized music-box ambient melody using Web Audio API so the experience is never silent.
 */
export default function AudioPlayer({ musicSrc = "/music.mp3" }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const usingSynthRef = useRef(false);

  // Synthesized music box fallback melody (frequencies for a gentle lullaby arpeggio)
  const notes = [
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
    1046.50 // C6
  ];

  const playSynthNote = (freq) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.0);
    } catch (e) {
      // AudioContext not permitted or unsupported
    }
  };

  const startSynthMelody = () => {
    usingSynthRef.current = true;
    let index = 0;
    const melodyPattern = [0, 2, 4, 3, 2, 4, 5, 4, 3, 2, 0, 2];

    if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
    synthIntervalRef.current = setInterval(() => {
      const noteIdx = melodyPattern[index % melodyPattern.length];
      playSynthNote(notes[noteIdx]);
      index++;
    }, 750);
  };

  const stopSynthMelody = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
      audioCtxRef.current.suspend();
    }
  };

  const startAudio = async () => {
    if (isPlaying) return;
    try {
      if (audioRef.current && !usingSynthRef.current) {
        audioRef.current.volume = 0.4;
        await audioRef.current.play();
        setIsPlaying(true);
      } else {
        startSynthMelody();
        setIsPlaying(true);
      }
    } catch (err) {
      // If audio element failed or audio file not found, fall back to soft synth
      startSynthMelody();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && !usingSynthRef.current) {
      audioRef.current.pause();
    }
    stopSynthMelody();
    setIsPlaying(false);
  };

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      pauseAudio();
    } else {
      startAudio();
    }
  };

  // Listen for first interaction
  useEffect(() => {
    const events = ['pointerdown', 'touchstart', 'click', 'keydown'];

    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        startAudio();
      }
      events.forEach((ev) => window.removeEventListener(ev, handleFirstInteraction));
    };

    events.forEach((ev) => window.addEventListener(ev, handleFirstInteraction, { once: true, passive: true }));

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleFirstInteraction));
      stopSynthMelody();
    };
  }, [hasInteracted]);

  return (
    <>
      <audio
        ref={audioRef}
        src={musicSrc}
        loop
        preload="auto"
        onError={() => {
          // If audio file is missing or failed to decode, prepare synth fallback
          usingSynthRef.current = true;
        }}
      />
      <button
        onClick={toggleAudio}
        className="audio-toggle-btn"
        aria-label={isPlaying ? 'Mute background music' : 'Play background music'}
        title={isPlaying ? 'Mute music' : 'Play music'}
      >
        {isPlaying ? (
          <div className="sound-waves">
            <span className="sound-bar" />
            <span className="sound-bar" />
            <span className="sound-bar" />
            <span className="sound-bar" />
          </div>
        ) : (
          <VolumeX size={20} />
        )}
      </button>
    </>
  );
}


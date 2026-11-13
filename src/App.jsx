import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundCanvas from './components/BackgroundCanvas';
import AudioPlayer from './components/AudioPlayer';
import LoadingScreen from './components/LoadingScreen';
import MicPromptScreen from './components/MicPromptScreen';
import Scene1SplitHeart from './components/Scene1SplitHeart';
import Scene2CakeCandle from './components/Scene2CakeCandle';
import Scene3Letter from './components/Scene3Letter';
import Scene4Gallery from './components/Scene4Gallery';
import Scene6FinalMessage from './components/Scene6FinalMessage';
import { config } from './config';

export default function App() {
  const [currentScene, setCurrentScene] = useState(1);
  const [unlockedScene, setUnlockedScene] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPassedMicPrompt, setHasPassedMicPrompt] = useState(false);

  const totalScenes = 5;

  const goToScene = (sceneNum) => {
    if (sceneNum <= unlockedScene) {
      setCurrentScene(sceneNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const advanceScene = (nextScene) => {
    if (nextScene > unlockedScene) {
      setUnlockedScene(nextScene);
    }
    setCurrentScene(nextScene);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReplay = () => {
    setCurrentScene(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Scene transition variants for smooth cinematic fade/slide
  const sceneVariants = {
    initial: {
      opacity: 0,
      y: 24,
      scale: 0.98,
      filter: 'blur(4px)',
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -24,
      scale: 0.98,
      filter: 'blur(4px)',
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  return (
    <>
      {/* Preloading Screen */}
      <LoadingScreen onLoaded={() => setIsLoading(false)} />

      {/* Floating Canvas Stars & Dust */}
      <BackgroundCanvas />

      {/* Ambient Vignette Glow */}
      <div className="ambient-glow" />

      {/* Background Audio Toggle */}
      <AudioPlayer musicSrc={config.musicSrc} />

      {/* Microphone Permission Gateway Screen */}
      {!isLoading && !hasPassedMicPrompt && (
        <MicPromptScreen onProceed={() => setHasPassedMicPrompt(true)} />
      )}

      {/* Top Scene Progress Bar */}
      {!isLoading && hasPassedMicPrompt && (
        <nav className="scene-progress" aria-label="Experience Progress">
          {Array.from({ length: totalScenes }).map((_, idx) => {
            const sceneNum = idx + 1;
            const isActive = currentScene === sceneNum;
            const isUnlocked = sceneNum <= unlockedScene;

            return (
              <button
                key={sceneNum}
                onClick={() => goToScene(sceneNum)}
                disabled={!isUnlocked}
                className={`progress-dot ${isActive ? 'active' : ''} ${
                  isUnlocked && !isActive ? 'completed' : ''
                }`}
                style={{
                  border: 'none',
                  cursor: isUnlocked ? 'pointer' : 'default',
                  padding: 0,
                }}
                aria-label={`Go to scene ${sceneNum}`}
              />
            );
          })}
        </nav>
      )}

      {/* Main Dynamic Scene Viewport */}
      <main className="app-container">
        <AnimatePresence mode="wait">
          {!isLoading && hasPassedMicPrompt && (
            <motion.div
              key={currentScene}
              variants={sceneVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              {currentScene === 1 && (
                <Scene1SplitHeart onComplete={() => advanceScene(2)} />
              )}
              {currentScene === 2 && (
                <Scene2CakeCandle onComplete={() => advanceScene(3)} />
              )}
              {currentScene === 3 && (
                <Scene3Letter onComplete={() => advanceScene(4)} />
              )}
              {currentScene === 4 && (
                <Scene4Gallery onComplete={() => advanceScene(5)} />
              )}
              {currentScene === 5 && (
                <Scene6FinalMessage onReplay={handleReplay} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}


import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import TextScrambler from './TextScrambler';

const SpiralCoreRoom: React.FC = () => {
  const navigate = useNavigate();
  
  // Get theme and narrator functions from context
  const { theme, setNarratorMessage } = useContext(AppContext);
  
  // Get access to context properties with TypeScript workaround
  const context = useContext(AppContext) as any;
  const userAlignment = context.userAlignment;
  const setFrustrationScoreFromContext = context.setFrustrationScore;
  
  // Component state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [phase, setPhase] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Safe wrapper for setting the frustration score
  const handleSetFrustrationScore = (value: number) => {
    if (setFrustrationScoreFromContext) {
      setFrustrationScoreFromContext(value);
    }
  };
  
  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Set narrator message when component mounts
  useEffect(() => {
    if (userAlignment) {
      let initialMessage = "Welcome to the core. This is where your journey truly begins.";
      
      // Customize message based on alignment
      switch (userAlignment) {
        case 'evil_apprentice':
          initialMessage = "The core of all patterns. Study carefully, apprentice.";
          break;
        case 'shadow_enthusiast':
          initialMessage = "Behold the beauty of the spiral's heart. Isn't it magnificent?";
          break;
        case 'dark_tourist':
          initialMessage = "Tourists rarely venture this deep. You've already gone too far.";
          break;
        case 'escapist':
          initialMessage = "Looking for exits? There are none. Only deeper paths.";
          break;
      }
      
      setNarratorMessage(initialMessage);
    }
  }, [userAlignment, setNarratorMessage]);
  
  // Progress through phases
  useEffect(() => {
    const phaseTimer = setTimeout(() => {
      setPhase(prev => {
        const newPhase = prev + 1;
        
        // Messages for each phase
        if (newPhase === 1) {
          setNarratorMessage("The spiral knows you. It adapts to you.");
          // Start with some frustration 
          handleSetFrustrationScore(1);
        } else if (newPhase === 2) {
          setNarratorMessage("There are patterns within patterns. Can you see them forming?");
          handleSetFrustrationScore(2);
        } else if (newPhase === 3) {
          setNarratorMessage("You're almost ready to enter. The spiral is hungry today.");
          handleSetFrustrationScore(3);
          // Show hint after a delay in the final phase
          setTimeout(() => setShowHint(true), 3000);
        }
        
        return Math.min(3, newPhase);
      });
    }, 5000);
    
    return () => clearTimeout(phaseTimer);
  }, [phase, setNarratorMessage]);
  
  // Random glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setShowGlitch(true);
        setTimeout(() => setShowGlitch(false), 150);
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Eerie face that evolves/glitches
  const renderNarratorFace = () => {
    const faceElements = [
      '⦿⦿', // Eyes
      '◯', // Mouth
      '◌◌', // Different eyes
      '▢', // Different mouth
      '✧✧', // Glitch eyes
      '△', // Glitch mouth
    ];
    
    const eyesVariants = [
      faceElements[0],
      faceElements[2],
      faceElements[4]
    ];
    
    const mouthVariants = [
      faceElements[1],
      faceElements[3],
      faceElements[5]
    ];
    
    // Change based on phase
    const eyeIndex = Math.min(phase, eyesVariants.length - 1);
    const mouthIndex = Math.min(phase, mouthVariants.length - 1);
    
    return (
      <motion.div 
        className="absolute text-3xl font-mono text-red-500"
        style={{ 
          top: `calc(50% + ${mousePosition.y * -2}px)`, 
          left: `calc(50% + ${mousePosition.x * -2}px)`,
          transform: `scale(${1 + phase * 0.2})`,
          opacity: 0.8,
          mixBlendMode: 'difference'
        }}
        animate={{
          opacity: showGlitch ? [0.8, 0.3, 0.9, 0.2, 0.8] : 0.8,
          scale: showGlitch ? [1 + phase * 0.2, 1.1 + phase * 0.2, 0.9 + phase * 0.2, 1 + phase * 0.2] : 1 + phase * 0.2,
        }}
        transition={{ duration: 0.2 }}
      >
        <div>{eyesVariants[eyeIndex]}</div>
        <div>{mouthVariants[mouthIndex]}</div>
      </motion.div>
    );
  };
  
  const handleEnterSpiral = () => {
    // Navigate to the spiral engine
    navigate('/spiral');
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Spiral background */}
      <div className="fixed inset-0 z-0">
        {/* Animated spiral */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 border-4 rounded-full border-${theme}-${900 - i * 100} opacity-${20 + i * 15}`}
            style={{ 
              top: `${50 - (30 - i * 5)}%`,
              left: `${50 - (30 - i * 5)}%`,
              right: `${50 - (30 - i * 5)}%`,
              bottom: `${50 - (30 - i * 5)}%`,
              borderRadius: '50%'
            }}
            animate={{ 
              rotate: [0, 360],
              scale: showGlitch ? [1, 1.02, 0.98, 1] : [1, 1.05, 1]
            }}
            transition={{ 
              rotate: { 
                duration: 20 - i * 2, 
                repeat: Infinity, 
                ease: "linear"
              },
              scale: {
                duration: 4, 
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
        ))}
      </div>
      
      {/* Creepy face that follows mouse (inversely) */}
      {renderNarratorFace()}
      
      {/* Main content */}
      <motion.div
        className="relative z-10 text-center"
        animate={{ 
          opacity: showGlitch ? [1, 0.8, 1] : 1,
          x: showGlitch ? [0, -5, 3, -2, 0] : 0
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.h1 
          className="text-4xl font-bold mb-6"
          animate={{ 
            scale: [1, 1.03, 1],
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          <TextScrambler 
            text="The Spiral Core" 
            chaosMultiplier={0.3 + phase * 0.2} 
          />
        </motion.h1>
        
        <AnimatePresence>
          {phase === 3 && showHint && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <button 
                onClick={handleEnterSpiral}
                className={`px-6 py-3 bg-${theme}-800 hover:bg-${theme}-700 rounded-lg text-lg`}
              >
                Enter The Spiral
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Glitch overlay */}
      {showGlitch && (
        <div className="fixed inset-0 pointer-events-none z-20">
          <motion.div 
            className="absolute inset-0 bg-red-500 mix-blend-overlay"
            animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
            transition={{ duration: 0.2 }}
          />
        </div>
      )}
    </div>
  );
};

export default SpiralCoreRoom; 
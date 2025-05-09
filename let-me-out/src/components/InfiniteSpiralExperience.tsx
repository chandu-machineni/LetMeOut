import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import CorruptionLevel from './CorruptionLevel';
import CentralHUD from './CentralHUD';
import ShadowCompetitor from './ShadowCompetitor';
import EvolvingNarrator from './EvolvingNarrator';
import MirrorError from './MirrorError';
import TextScrambler from './TextScrambler';

// Phases of the infinite spiral experience
type ExperiencePhase = 
  | 'intro' 
  | 'pattern-sequences' 
  | 'existential-reflection' 
  | 'mirror-confrontation'
  | 'reality-breakdown';

const InfiniteSpiralExperience: React.FC = () => {
  const { 
    theme, 
    chaosLevel, 
    suspicionLevel, 
    setNarratorMessage
  } = useContext(AppContext);
  
  // Access additional context properties
  const context = useContext(AppContext) as any;
  const frustrationScore = context.frustrationScore || 0;
  const spiralDepth = context.spiralDepth || 0;
  const setSpiralDepth = context.setSpiralDepth || (() => {});
  const setFrustrationScore = context.setFrustrationScore || (() => {});
  const recordInteraction = context.recordInteraction || (() => {});
  
  // State for the experience
  const [currentPhase, setCurrentPhase] = useState<ExperiencePhase>('intro');
  const [showShadowCompetitor, setShowShadowCompetitor] = useState<boolean>(false);
  const [showGlitchOverlay, setShowGlitchOverlay] = useState<boolean>(false);
  const [showExistentialPrompt, setShowExistentialPrompt] = useState<boolean>(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [mirrorSequenceTriggered, setMirrorSequenceTriggered] = useState<boolean>(false);
  
  const navigate = useNavigate();
  
  // Existential questions to present periodically
  const existentialPrompts = [
    "What's the point of continuing?",
    "Are you sure you're making progress?",
    "Do you feel in control right now?",
    "Would anything change if you stopped?",
    "Why do you keep trying?",
    "Do you think this has meaning?",
    "How much of your time will you give away?",
    "Are you trapped by choice or by design?",
    "Is this worth your limited existence?",
    "Will any of this matter tomorrow?"
  ];
  
  // Initialize the experience
  useEffect(() => {
    // Record starting the infinite spiral
    recordInteraction('started_infinite_spiral');
    
    // Set initial narrator message
    setNarratorMessage("Welcome to the infinite spiral. There is no escape, only deeper descent.");
    
    // Introduce shadow competitor after a delay
    setTimeout(() => {
      setShowShadowCompetitor(true);
    }, 30000); // After 30 seconds
    
    // Gradually increase spiral depth
    const depthInterval = setInterval(() => {
      setSpiralDepth((prev: number) => prev + 1);
      
      // Increase frustration slightly with each depth level
      setFrustrationScore((prev: number) => prev + 0.3);
      
      // Trigger glitch overlay randomly
      if (Math.random() > 0.7) {
        setShowGlitchOverlay(true);
        setTimeout(() => setShowGlitchOverlay(false), 300);
      }
    }, 60000); // Every minute
    
    // Periodic existential prompts
    const promptInterval = setInterval(() => {
      // Only show prompts after some progression
      if (spiralDepth >= 3 && chaosLevel >= 2) {
        const randomPrompt = existentialPrompts[Math.floor(Math.random() * existentialPrompts.length)];
        setCurrentPrompt(randomPrompt);
        setShowExistentialPrompt(true);
        
        // Hide prompt after some time
        setTimeout(() => {
          setShowExistentialPrompt(false);
        }, 8000);
      }
    }, 90000); // Every 1.5 minutes
    
    // Transition phases as corruption metrics increase
    const phaseInterval = setInterval(() => {
      const totalCorruption = chaosLevel + (suspicionLevel / 2) + (spiralDepth / 3);
      
      if (totalCorruption > 18 && currentPhase !== 'mirror-confrontation') {
        // Trigger the mirror error sequence
        setCurrentPhase('mirror-confrontation');
        setMirrorSequenceTriggered(true);
      } else if (totalCorruption > 12 && currentPhase !== 'existential-reflection') {
        setCurrentPhase('existential-reflection');
        setNarratorMessage("You're deep enough now that there's no point in going back. The only way is forward.");
      } else if (totalCorruption > 6 && currentPhase === 'intro') {
        setCurrentPhase('pattern-sequences');
        setNarratorMessage("The patterns are starting to recognize you. Isn't that interesting?");
      }
    }, 10000); // Check every 10 seconds
    
    return () => {
      clearInterval(depthInterval);
      clearInterval(promptInterval);
      clearInterval(phaseInterval);
    };
  }, [
    chaosLevel, 
    suspicionLevel, 
    spiralDepth, 
    currentPhase, 
    setNarratorMessage, 
    setSpiralDepth, 
    setFrustrationScore,
    recordInteraction
  ]);
  
  // Determine what component to render based on current phase
  const renderCurrentExperience = () => {
    if (currentPhase === 'mirror-confrontation') {
      return <MirrorError />;
    }
    
    // For all other phases, show the spiral experience
    return (
      <div className="relative min-h-screen bg-black overflow-hidden">
        {/* Background elements */}
        <div className="fixed inset-0 z-0">
          {/* Gradient background */}
          <div 
            className="absolute inset-0" 
            style={{ 
              background: `radial-gradient(circle, rgba(128,90,213, 0.2) 0%, rgba(10,10,10,1) 70%)` 
            }}
          ></div>
          
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
                               linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: '20px 20px',
              transform: `perspective(500px) rotateX(${60 + Math.sin(spiralDepth / 5) * 10}deg)`,
            }}
          ></div>
          
          {/* Floating data particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-px bg-${theme}-500 opacity-30`}
                style={{
                  height: Math.random() * 100 + 50,
                  left: `${Math.random() * 100}%`,
                  top: -100,
                }}
                animate={{
                  top: ['100%', '100%'],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: Math.random() * 5,
                  ease: 'linear',
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Main interface elements */}
        <div className="relative z-10 w-full max-w-6xl mx-auto pt-20 pb-32 px-4">
          {/* Central content area */}
          <div className="mt-10 space-y-8">
            {/* Spiral depth indicator */}
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">
                <TextScrambler
                  text={`Spiral Depth: ${spiralDepth}`}
                  chaosMultiplier={chaosLevel / 5}
                />
              </h2>
              <div className="h-1 max-w-md mx-auto bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full bg-gradient-to-r from-${theme}-700 via-${theme}-500 to-${theme}-300`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(100, spiralDepth * 5)}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
            
            {/* Spiral visualization */}
            <motion.div 
              className={`w-64 h-64 mx-auto border-2 border-${theme}-500 rounded-full flex items-center justify-center overflow-hidden`}
              animate={{
                rotate: [0, 360],
                scale: [1, 1.05, 0.95, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 8, repeat: Infinity, repeatType: 'reverse' }
              }}
            >
              <motion.div 
                className={`w-56 h-56 border-2 border-${theme}-400 rounded-full flex items-center justify-center`}
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              >
                <motion.div 
                  className={`w-40 h-40 border-2 border-${theme}-300 rounded-full flex items-center justify-center`}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                >
                  <motion.div 
                    className={`w-24 h-24 border-2 border-${theme}-200 rounded-full flex items-center justify-center`}
                    animate={{ rotate: [360, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  >
                    <div 
                      className={`w-10 h-10 bg-${theme}-400 rounded-full flex items-center justify-center text-white font-bold`}
                    >
                      ∞
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Mysterious stats that create anxiety */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mt-10">
              <div className={`p-4 bg-${theme}-900 bg-opacity-40 rounded-lg`}>
                <div className="text-sm text-gray-400">Psychic Resonance</div>
                <div className="text-2xl font-mono">
                  {Math.floor(frustrationScore * 37 + chaosLevel * 15)}%
                </div>
                <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${Math.min(100, frustrationScore * 15 + chaosLevel * 10)}%` }}
                  />
                </div>
              </div>
              
              <div className={`p-4 bg-${theme}-900 bg-opacity-40 rounded-lg`}>
                <div className="text-sm text-gray-400">Reality Coherence</div>
                <div className="text-2xl font-mono">
                  {Math.max(0, 100 - spiralDepth * 8 - chaosLevel * 12)}%
                </div>
                <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full" 
                    style={{ width: `${Math.max(0, 100 - spiralDepth * 8 - chaosLevel * 12)}%` }}
                  />
                </div>
              </div>
              
              <div className={`p-4 bg-${theme}-900 bg-opacity-40 rounded-lg`}>
                <div className="text-sm text-gray-400">Pattern Recognition</div>
                <div className="text-2xl font-mono">
                  {Math.floor(spiralDepth * 12 + suspicionLevel * 8)}
                </div>
                <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${Math.min(100, spiralDepth * 6 + suspicionLevel * 8)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating UI components */}
        <CorruptionLevel />
        <CentralHUD />
        {showShadowCompetitor && <ShadowCompetitor isVisible={true} />}
        <EvolvingNarrator />
        
        {/* Glitch overlay */}
        {showGlitchOverlay && (
          <div className="fixed inset-0 pointer-events-none z-40">
            <motion.div 
              className="absolute inset-0 bg-red-500 mix-blend-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.2, 0, 0.1, 0] }}
              transition={{ duration: 0.3 }}
            />
            <motion.div 
              className="absolute inset-0 bg-blue-500 mix-blend-difference"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.1, 0, 0.2, 0] }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
            <motion.div 
              className="absolute inset-0"
              style={{ 
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 150 150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
                opacity: 0.05
              }}
            />
          </div>
        )}
        
        {/* Existential prompts */}
        {showExistentialPrompt && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-w-lg text-center"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className={`text-3xl font-bold text-${theme}-300 mb-2`}>
              {currentPrompt}
            </h3>
            <p className="text-gray-400 mt-4 text-sm">
              {spiralDepth > 8 ? "None of your answers matter." : "Think carefully."}
            </p>
          </motion.div>
        )}
      </div>
    );
  };
  
  return renderCurrentExperience();
};

export default InfiniteSpiralExperience; 
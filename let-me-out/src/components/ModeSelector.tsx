import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import Stage from './Stage';

// Define GameMode type directly
type GameMode = 'linear' | 'infinite_spiral' | null;

// Add the CSS animation as a global style
const modeGlitchAnimation = `
@keyframes modeGlitch {
  0% { transform: translate(0) skew(0deg); }
  20% { transform: translate(-2px, 2px) skew(2deg); filter: hue-rotate(90deg); }
  40% { transform: translate(-2px, -2px) skew(-2deg); filter: hue-rotate(180deg); }
  60% { transform: translate(2px, 2px) skew(0deg); filter: hue-rotate(270deg); }
  80% { transform: translate(2px, -2px) skew(1deg); filter: hue-rotate(180deg); }
  100% { transform: translate(0) skew(0deg); }
}
`;

const ModeSelector: React.FC = () => {
  const { 
    theme, 
    userName, 
    scrambledName, 
    setNarratorMessage,
    chaosLevel
  } = useContext(AppContext);
  
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showGlitch, setShowGlitch] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  
  const navigate = useNavigate();
  
  // Get context and extract the setGameMode function
  const context = useContext(AppContext) as any;
  const setGameModeFromContext = context.setGameMode;
  
  // Show glitch effect at random intervals
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setShowGlitch(true);
        setTimeout(() => setShowGlitch(false), 200);
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Update the narrator message when component mounts
  useEffect(() => {
    setNarratorMessage("Choose your experience. The classic path, or the infinite spiral?");
  }, [setNarratorMessage]);
  
  // Safe wrapper for setting the game mode
  const handleSetGameMode = (mode: 'linear' | 'infinite_spiral') => {
    if (setGameModeFromContext) {
      setGameModeFromContext(mode);
    }
  };
  
  const handleSelectMode = (mode: 'linear' | 'infinite_spiral') => {
    setSelectedMode(mode);
    
    // 10% chance that selection doesn't work
    if (Math.random() > 0.9) {
      // Selection failed - show error briefly
      setShowError(true);
      setTimeout(() => setShowError(false), 1500);
      
      // Only half of selections actually apply
      if (Math.random() > 0.5) {
        setSelectedMode(mode === 'linear' ? 'infinite_spiral' : 'linear');
      } else {
        setSelectedMode(null);
      }
    }
  };
  
  const handleContinue = () => {
    if (!selectedMode) {
      setShowError(true);
      setTimeout(() => setShowError(false), 1500);
      return;
    }
    
    // Set the game mode in context
    handleSetGameMode(selectedMode);
    
    // Navigate to the appropriate next screen
    if (selectedMode === 'linear') {
      navigate('/theme');
    } else {
      navigate('/alignment');
    }
  };

  // Create a style object for the glitch effect
  const glitchStyle = { animation: 'modeGlitch 0.2s forwards' };
  
  return (
    <Stage
      stageNumber={1}
      title="Choose Your Descent"
      description="How far down the rabbit hole would you like to go?"
      onComplete={() => {}}
    >
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
        <motion.div
          className="mb-8 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-2xl font-bold mb-2">
            Welcome, {scrambledName || userName || "User"}
          </h2>
          <p className="text-gray-400">
            Your identity has been processed. Now choose how you'd like to experience our experiment.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mb-12">
          {/* Linear Mode Option */}
          <motion.div
            className={`selection-card relative
            ${selectedMode === 'linear' ? `border-${theme}-500` : `border-${theme}-800`}`}
            style={showGlitch && isHovering === 'linear' ? glitchStyle : undefined}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255,255,255,0.1)' }}
            onClick={() => handleSelectMode('linear')}
            onMouseEnter={() => setIsHovering('linear')}
            onMouseLeave={() => setIsHovering(null)}
          >
            <div className={`p-6 bg-${theme}-900 h-full flex flex-col`}>
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <span className={`w-6 h-6 flex items-center justify-center rounded-full bg-${theme}-700 mr-2 text-sm`}>
                  1
                </span>
                Classic Mode
              </h3>
              
              <p className="text-gray-400 mb-4">
                Experience our 8 carefully crafted stages of deception and manipulation.
                Each stage builds upon the last in a carefully orchestrated descent.
              </p>
              
              <ul className="text-sm text-gray-500 mb-4 ml-4 list-disc">
                <li>Structured path through 8 evil UX patterns</li>
                <li>Predictable progression</li>
                <li>Designed psychological journey</li>
                <li>Guaranteed satisfying conclusion</li>
              </ul>
              
              <div className="mt-auto text-center">
                {selectedMode === 'linear' && (
                  <motion.div 
                    className={`text-${theme}-400 text-sm font-medium`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Selected
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Warning message on hover */}
            <AnimatePresence>
              {isHovering === 'linear' && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="w-6 h-6 rounded-full bg-yellow-400 text-black flex items-center justify-center mr-2 flex-shrink-0">
                    !
                  </div>
                  <p className="text-xs text-yellow-400">
                    Warning: This mode is still highly psychologically manipulative. There is no true escape.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Infinite UX Spiral Option */}
          <motion.div
            className={`selection-card relative
            ${selectedMode === 'infinite_spiral' ? `border-${theme}-500` : `border-${theme}-800`}`}
            style={showGlitch && isHovering === 'spiral' ? glitchStyle : undefined}
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255,255,255,0.1)' }}
            onClick={() => handleSelectMode('infinite_spiral')}
            onMouseEnter={() => setIsHovering('spiral')}
            onMouseLeave={() => setIsHovering(null)}
          >
            <div className={`p-6 bg-${theme}-900 h-full flex flex-col`}>
              <h3 className="text-xl font-bold mb-3 flex items-center">
                <span className={`w-6 h-6 flex items-center justify-center rounded-full bg-${theme}-700 mr-2 text-sm`}>
                  ∞
                </span>
                Infinite UX Spiral
              </h3>
              
              <p className="text-gray-400 mb-4">
                Enter our experimental procedural UX torment engine. Each spiral generates unique 
                experiences based on your behavior, frustration levels, and alignment.
              </p>
              
              <ul className="text-sm text-gray-500 mb-4 ml-4 list-disc">
                <li>Procedurally generated dark patterns</li>
                <li>Personalized psychological manipulation</li>
                <li>Adaptive difficulty based on frustration</li>
                <li>Meta-aware narrative that evolves with you</li>
                <li>No escape. Ever.</li>
              </ul>
              
              <div className="mt-auto text-center">
                {selectedMode === 'infinite_spiral' && (
                  <motion.div 
                    className={`text-${theme}-400 text-sm font-medium`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Selected
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* Warning message on hover */}
            <AnimatePresence>
              {isHovering === 'spiral' && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center mr-2 flex-shrink-0">
                    !
                  </div>
                  <p className="text-xs text-red-400">
                    WARNING: May cause genuine frustration. Not recommended for the easily agitated.
                    Contains advanced psychological manipulation techniques.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
        
        {/* Error message */}
        {showError && (
          <motion.div
            className="p-3 mb-4 bg-red-900 text-red-100 rounded-md text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Selection error: Please choose a valid option.
          </motion.div>
        )}
        
        <motion.button
          className={`px-8 py-3 bg-${theme}-600 hover:bg-${theme}-500 text-white rounded-lg font-medium ${!selectedMode && 'opacity-50 cursor-not-allowed'}`}
          onClick={handleContinue}
          disabled={!selectedMode || isSubmitting}
          whileHover={selectedMode ? { scale: 1.05 } : {}}
          whileTap={selectedMode ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </motion.button>
        
        {/* Add keyframes to the page */}
        <style dangerouslySetInnerHTML={{ __html: modeGlitchAnimation }} />
      </div>
    </Stage>
  );
};

export default ModeSelector; 
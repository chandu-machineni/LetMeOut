import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';

const CorruptionLevel: React.FC = () => {
  const { theme, chaosLevel, suspicionLevel } = useContext(AppContext);
  const [showFullHUD, setShowFullHUD] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  
  // Calculate corruption percentage (combined chaos and suspicion)
  const corruptionPercentage = Math.min(100, ((chaosLevel * 7) + (suspicionLevel * 5)));
  
  // Change HUD state when corruption reaches certain thresholds
  useEffect(() => {
    // Show detailed HUD after some corruption
    if (corruptionPercentage > 20 && !showFullHUD) {
      setShowFullHUD(true);
    }
    
    // Trigger screen flip when corruption maxes out
    if (corruptionPercentage >= 95 && !hasFlipped) {
      setIsGlitching(true);
      
      // Flip the screen
      setTimeout(() => {
        document.documentElement.style.transition = 'transform 1s cubic-bezier(.36,.07,.19,.97)';
        document.documentElement.style.transform = 'rotate(180deg)';
        
        // Flip back after a short delay
        setTimeout(() => {
          document.documentElement.style.transform = 'none';
          setHasFlipped(true);
          
          // Reset the flag after some time to allow it to happen again
          setTimeout(() => {
            setHasFlipped(false);
            setIsGlitching(false);
          }, 60000); // Wait a minute before allowing another flip
        }, 2000);
      }, 1000);
    }
  }, [corruptionPercentage, showFullHUD, hasFlipped]);
  
  // Map corruption to a color gradient
  const getCorruptionColor = () => {
    if (corruptionPercentage < 30) return 'green-500';
    if (corruptionPercentage < 60) return 'yellow-500';
    if (corruptionPercentage < 90) return 'orange-500';
    return 'red-500';
  };
  
  // Map corruption to a status message
  const getCorruptionStatus = () => {
    if (corruptionPercentage < 20) return 'System Normal';
    if (corruptionPercentage < 40) return 'Minor Corruption';
    if (corruptionPercentage < 60) return 'Moderate Corruption';
    if (corruptionPercentage < 80) return 'Severe Corruption';
    if (corruptionPercentage < 95) return 'Critical Corruption';
    return 'SYSTEM FAILURE IMMINENT';
  };
  
  return (
    <motion.div
      className={`fixed flex flex-col items-start gap-2 top-6 left-6 p-3 
      bg-${theme}-800 bg-opacity-70 backdrop-blur-sm 
      border border-${theme}-700 rounded-md z-[85]`}
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 30 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              className="w-3 h-3 rounded-full bg-red-500 mr-2"
              animate={{
                opacity: isGlitching ? [1, 0.2, 1, 0.5, 1] : [1, 0.5, 1],
                scale: isGlitching ? [1, 1.2, 0.8, 1.1, 1] : [1, 1.1, 1]
              }}
              transition={{ 
                duration: isGlitching ? 0.3 : 2, 
                repeat: Infinity, 
                repeatType: 'reverse' 
              }}
            />
            <span className="text-xs font-mono text-gray-400">SYSTEM://CORRUPTION_MONITOR</span>
          </div>
          
          <div className="flex items-center">
            <span className={`text-xs font-mono text-${getCorruptionColor()} mr-2 ${isGlitching ? 'glitch-text' : ''}`}>
              {getCorruptionStatus()}
            </span>
            <span className="text-xs font-mono text-gray-400">
              {Math.floor(corruptionPercentage)}%
            </span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className={`mt-1 h-1 bg-${theme}-800 rounded-full overflow-hidden w-full`}>
          <motion.div 
            className={`h-full bg-${getCorruptionColor()}`}
            initial={{ width: '0%' }}
            animate={{ 
              width: `${corruptionPercentage}%`,
              x: isGlitching ? [0, 10, -5, 20, 0] : 0
            }}
            transition={{ 
              width: { type: 'spring', damping: 30 },
              x: { duration: 0.2, repeat: isGlitching ? 5 : 0 }
            }}
          />
        </div>
        
        {/* Detailed HUD (only visible after some corruption) */}
        {showFullHUD && (
          <motion.div 
            className="grid grid-cols-2 gap-2 mt-1 text-xs text-gray-400"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <span className="w-20">Chaos Level:</span>
              <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${chaosLevel * 20}%` }}
                />
              </div>
              <span className="ml-2">{chaosLevel}/5</span>
            </div>
            
            <div className="flex items-center">
              <span className="w-24">Suspicion Level:</span>
              <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-purple-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${suspicionLevel * 10}%` }}
                />
              </div>
              <span className="ml-2">{suspicionLevel}/10</span>
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Add glitch effects when corruption is critical */}
      {isGlitching && (
        <>
          <motion.div 
            className="fixed inset-0 bg-red-500 mix-blend-overlay pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
          />
          
          <motion.div 
            className="fixed inset-0 bg-blue-500 mix-blend-screen pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.05, 0, 0.1, 0] }}
            transition={{ duration: 0.5, delay: 0.2, repeat: 3 }}
          />
          
          <style>{`
            .glitch-text {
              animation: textGlitch 0.3s infinite;
              position: relative;
            }
            
            @keyframes textGlitch {
              0% { transform: translate(0) }
              20% { transform: translate(-2px, 2px) }
              40% { transform: translate(-2px, -2px) }
              60% { transform: translate(2px, 2px) }
              80% { transform: translate(2px, -2px) }
              100% { transform: translate(0) }
            }
          `}</style>
        </>
      )}
    </motion.div>
  );
};

export default CorruptionLevel; 
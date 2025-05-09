import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import TextScrambler from './TextScrambler';

// Dictionary of possible badges and their descriptions
const BADGES = {
  'UX Victim': 'Survived multiple dark patterns',
  'Button Chaser': 'Clicked on more than 50 moving elements',
  'Digital Masochist': 'Completed a form 3+ times',
  'Error Collector': 'Accumulated 10+ form errors',
  'Persistent Soul': 'Attempted to escape multiple times',
  'Corrupted Entity': 'Identity is now 75%+ scrambled',
  'Consent Surrenderer': 'Accepted all cookies without reading',
  'Pattern Prisoner': 'Trapped in 5+ standard dark patterns',
  'Soul Seller': 'Willingly gave up digital rights',
  'Reality Glitcher': 'Survived a complete UI inversion',
};

// List of narrator expressions from happy to glitched
const EXPRESSIONS = [
  '>:)',      // Normal
  '>:D',      // Happy
  '};)',      // Mischievous
  '!_!',      // Surprised
  '@_@',      // Confused
  '<_<',      // Suspicious
  '`~`',      // Distorted
  'X_X',      // Crashed
  '%_@',      // Glitched
  '?/!',      // Error
];

const CentralHUD: React.FC = () => {
  const { 
    theme, 
    chaosLevel, 
    suspicionLevel, 
    scrambledName, 
    userName,
    earnedBadges,
    setEarnedBadges 
  } = useContext(AppContext);
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentExpression, setCurrentExpression] = useState(EXPRESSIONS[0]);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showBadgeToast, setShowBadgeToast] = useState(false);
  const [newBadge, setNewBadge] = useState('');
  
  // Calculate expression based on chaos and suspicion levels
  useEffect(() => {
    const totalCorruption = chaosLevel + (suspicionLevel / 2);
    const expressionIndex = Math.min(
      Math.floor(totalCorruption / 1.5), 
      EXPRESSIONS.length - 1
    );
    
    // Add random glitching at high chaos levels
    if (chaosLevel >= 4 && Math.random() > 0.7) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 500);
    }
    
    setCurrentExpression(EXPRESSIONS[expressionIndex]);
  }, [chaosLevel, suspicionLevel]);
  
  // Award badges based on criteria
  useEffect(() => {
    // Badge criteria checks - these would normally be more sophisticated
    // and based on real metrics instead of random awards
    if (earnedBadges.length === 0 && Math.random() > 0.7) {
      awardRandomBadge();
    }
  }, [chaosLevel, earnedBadges]);
  
  // Award a random badge that hasn't been earned yet
  const awardRandomBadge = () => {
    const availableBadges = Object.keys(BADGES).filter(
      badge => !earnedBadges.includes(badge)
    );
    
    if (availableBadges.length > 0) {
      const randomBadge = availableBadges[Math.floor(Math.random() * availableBadges.length)];
      setEarnedBadges([...earnedBadges, randomBadge]);
      setNewBadge(randomBadge);
      setShowBadgeToast(true);
      
      setTimeout(() => {
        setShowBadgeToast(false);
      }, 5000);
    }
  };
  
  // Calculate colors based on levels
  const getSuspicionColor = () => {
    if (suspicionLevel < 3) return 'green';
    if (suspicionLevel < 6) return 'yellow';
    if (suspicionLevel < 8) return 'orange';
    return 'red';
  };
  
  const getChaosColor = () => {
    if (chaosLevel <= 1) return 'green';
    if (chaosLevel <= 3) return 'yellow';
    if (chaosLevel <= 4) return 'orange';
    return 'red';
  };
  
  // Calculate corruption percentage (combined chaos and suspicion)
  const corruptionPercentage = Math.min(100, ((chaosLevel * 15) + (suspicionLevel * 5)));
  
  return (
    <>
      <motion.div 
        className={`fixed top-4 left-1/2 -translate-x-1/2 transform 
        py-2 px-3 bg-${theme}-900 bg-opacity-80 backdrop-blur-sm 
        rounded-full border border-${theme}-700 
        flex items-center justify-center gap-3 z-[80]`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        style={{
          boxShadow: `0 5px 25px rgba(0, 0, 0, 0.4), 0 3px 10px rgba(0, 0, 0, 0.2)`,
        }}
      >
        <motion.div 
          className="flex items-center cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.03 }}
        >
          {/* Avatar */}
          <motion.div 
            className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 text-lg font-mono
                      bg-${theme}-800 border border-${theme}-600 ${isGlitching ? 'text-red-500' : 'text-white'}`}
            animate={{
              rotate: isGlitching ? [0, 5, -5, 0] : 0,
              scale: isGlitching ? [1, 1.1, 0.9, 1] : 1,
              textShadow: isGlitching ? '0 0 5px red' : 'none'
            }}
            transition={{ duration: 0.2, repeat: isGlitching ? 3 : 0 }}
          >
            {currentExpression}
          </motion.div>
          
          {/* User info */}
          <div>
            <TextScrambler
              text={scrambledName || userName || "SUBJECT"}
              className={`text-sm font-medium text-${theme}-300`}
              chaosMultiplier={0.5}
            />
            <div className="text-xs text-gray-500">
              {`Corruption: ${Math.floor(corruptionPercentage)}%`}
            </div>
          </div>
          
          {/* Toggle marker */}
          <motion.div 
            className={`ml-3 text-${theme}-500`}
            animate={{ rotate: isExpanded ? 180 : 0 }}
          >
            ▼
          </motion.div>
        </motion.div>
        
        {/* Expanded view */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="mt-3 pt-3 border-t border-gray-700"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Suspicion Level</div>
                  <div className={`h-2 bg-${theme}-800 rounded-full overflow-hidden`}>
                    <motion.div
                      className={`h-full bg-${getSuspicionColor()}-500`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${suspicionLevel * 10}%` }}
                    />
                  </div>
                  <div className="text-xs text-right mt-1">{suspicionLevel}/10</div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-400 mb-1">Chaos Level</div>
                  <div className={`h-2 bg-${theme}-800 rounded-full overflow-hidden`}>
                    <motion.div
                      className={`h-full bg-${getChaosColor()}-500`}
                      initial={{ width: '0%' }}
                      animate={{ width: `${chaosLevel * 20}%` }}
                    />
                  </div>
                  <div className="text-xs text-right mt-1">{chaosLevel}/5</div>
                </div>
              </div>
              
              {/* Badges */}
              <div>
                <div className="text-xs text-gray-400 mb-2">Earned Badges</div>
                <div className="flex flex-wrap gap-2">
                  {earnedBadges.length > 0 ? (
                    earnedBadges.map(badge => (
                      <div 
                        key={badge}
                        className={`px-2 py-1 text-xs bg-${theme}-800 rounded-full border border-${theme}-600`}
                        title={BADGES[badge as keyof typeof BADGES]}
                      >
                        🏆 {badge}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 italic">No badges earned yet...</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Badge award toast notification */}
      <AnimatePresence>
        {showBadgeToast && (
          <motion.div
            className={`fixed bottom-24 right-4 p-3 bg-${theme}-800 border border-${theme}-600 rounded-md shadow-lg z-[91]`}
            initial={{ opacity: 0, y: 50, x: 0 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              x: isGlitching ? [0, -5, 5, 0] : 0
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div className="text-sm font-medium mb-1">🏆 New Badge Earned!</div>
            <div className="text-base font-bold text-yellow-400 mb-1">{newBadge}</div>
            <div className="text-xs text-gray-400">
              {BADGES[newBadge as keyof typeof BADGES]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CentralHUD; 
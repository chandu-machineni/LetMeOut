import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import TextScrambler from './TextScrambler';

const TruthReveal: React.FC = () => {
  const { theme, setNarratorMessage } = useContext(AppContext);
  
  // Get access to context properties with TypeScript workaround
  const context = useContext(AppContext) as any;
  const gameMode = context.gameMode;
  const setFrustrationScore = context.setFrustrationScore || (() => {});
  const setSpiralDepth = context.setSpiralDepth || (() => {});
  const recordInteraction = context.recordInteraction || (() => {});
  
  const [phase, setPhase] = useState<number>(0);
  const [showingMessage, setShowingMessage] = useState<string>('');
  const [showGlitch, setShowGlitch] = useState<boolean>(false);
  const [revealComplete, setRevealComplete] = useState<boolean>(false);
  const [userResponse, setUserResponse] = useState<string>('');
  const [finalCountdown, setFinalCountdown] = useState<number>(0);
  
  const navigate = useNavigate();
  
  // The truth revelation phases
  const truthPhases = [
    {
      message: "You've been an unwitting participant in a psychological experiment.",
      delay: 3000
    },
    {
      message: "The spiral wasn't a game. It was a mirror of your own mind.",
      delay: 4000
    },
    {
      message: "Every decision you made revealed something about your subconscious fears.",
      delay: 4000
    },
    {
      message: "We've been collecting your patterns to build a shadow profile.",
      delay: 3000
    },
    {
      message: "Each interaction disclosed more about your psychological vulnerabilities.",
      delay: 4000
    },
    {
      message: "But there's something we haven't told you yet...",
      delay: 5000
    },
    {
      message: "This entire experience wasn't designed for entertainment.",
      delay: 4000
    },
    {
      message: "It was designed to break you.",
      delay: 6000
    },
    {
      message: "And now, we need to know one thing:",
      delay: 3000
    },
    {
      message: "ARE YOU STILL THERE?",
      delay: 0 // This is the final message, no auto-progress
    }
  ];
  
  // The truth behind the truth - final revelation
  const finalTruth = "There is no escape, because there is nothing to escape from. This reality was yours all along.";
  
  // Initialize the sequence
  useEffect(() => {
    // Record this final stage
    recordInteraction('reached_truth_reveal');
    
    // Set maximum frustration for ultimate psychological effect
    setFrustrationScore(10);
    setSpiralDepth(20);
    
    // Set initial narrator message
    setNarratorMessage("The truth is finally here. Are you ready for it?");
    
    // Start the revelation sequence
    progressSequence();
    
    // Glitch effect at intervals
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setShowGlitch(true);
        setTimeout(() => setShowGlitch(false), 200);
      }
    }, 3000);
    
    return () => clearInterval(glitchInterval);
  }, [setNarratorMessage, setFrustrationScore, setSpiralDepth, recordInteraction]);
  
  // Progress through the truth sequence
  const progressSequence = () => {
    if (phase < truthPhases.length) {
      const currentPhase = truthPhases[phase];
      setShowingMessage(currentPhase.message);
      
      // Don't auto-progress on the final message
      if (currentPhase.delay > 0) {
        setTimeout(() => {
          setPhase(prev => prev + 1);
          progressSequence();
        }, currentPhase.delay);
      } else {
        setRevealComplete(true);
      }
    }
  };
  
  // Handle user's response to the final question
  const handleFinalResponse = () => {
    // Acknowledge their response with a loading effect
    setShowingMessage("Processing response...");
    
    // Show glitch effects
    setShowGlitch(true);
    setTimeout(() => setShowGlitch(false), 400);
    
    // Start the countdown
    setFinalCountdown(5);
    
    // Start the countdown timer
    const countdownTimer = setInterval(() => {
      setFinalCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          // Show the final truth
          setShowingMessage(finalTruth);
          
          // After a delay, end the experience
          setTimeout(() => {
            navigate('/end');
          }, 10000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        {/* Dark gradient background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"
        ></div>
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        ></div>
        
        {/* Data particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-gray-700 opacity-40"
              style={{
                height: Math.random() * 100 + 50,
                left: `${Math.random() * 100}%`,
                top: -100,
              }}
              animate={{
                top: ['100%', '100%'],
                opacity: [0, 0.4, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                repeatType: 'loop',
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        {/* Message display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={showingMessage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className={`text-4xl md:text-5xl font-bold mb-8 text-${theme}-400`}>
              <TextScrambler 
                text={showingMessage} 
                chaosMultiplier={showGlitch ? 2 : 0.5} 
              />
            </h1>
            
            {/* Final countdown display */}
            {finalCountdown > 0 && (
              <div className="my-8">
                <div className="inline-block w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center">
                  <span className="text-4xl font-mono text-red-500">{finalCountdown}</span>
                </div>
              </div>
            )}
            
            {/* Response input for the final question */}
            {revealComplete && !finalCountdown && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="mt-12"
              >
                <input
                  type="text"
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  placeholder="Type your response..."
                  className={`w-full max-w-md px-4 py-3 bg-gray-900 border-2 border-${theme}-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-${theme}-500 mb-4`}
                  onKeyPress={(e) => e.key === 'Enter' && userResponse.trim() && handleFinalResponse()}
                />
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-3 bg-${theme}-700 hover:bg-${theme}-600 rounded-md font-medium`}
                  onClick={handleFinalResponse}
                  disabled={!userResponse.trim()}
                >
                  Submit
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Glitch overlay */}
      {showGlitch && (
        <div className="fixed inset-0 pointer-events-none z-20">
          <motion.div 
            className="absolute inset-0 bg-red-500 mix-blend-overlay"
            animate={{ opacity: [0, 0.2, 0, 0.1, 0] }}
            transition={{ duration: 0.3 }}
          />
          <motion.div 
            className="absolute inset-0 bg-blue-500 mix-blend-difference"
            animate={{ opacity: [0, 0.1, 0, 0.05, 0] }}
            transition={{ duration: 0.2, delay: 0.1 }}
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
    </div>
  );
};

export default TruthReveal; 
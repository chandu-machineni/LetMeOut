import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import TextScrambler from './TextScrambler';

const MirrorError: React.FC = () => {
  const { 
    theme, 
    suspicionLevel,
    chaosLevel,
    setNarratorMessage
  } = useContext(AppContext);
  
  // Get access to context properties with TypeScript workaround
  const context = useContext(AppContext) as any;
  const gameMode = context.gameMode;
  const userAlignment = context.userAlignment;
  const userName = context.name;
  const scrambledName = context.name?.split('').map((char: string) => 
    Math.random() > 0.7 ? char : String.fromCharCode(char.charCodeAt(0) + Math.floor(Math.random() * 5))
  ).join('');
  const setFrustrationScore = (val: number) => context.setFrustrationScore(val);
  
  const [phase, setPhase] = useState<number>(0);
  const [choiceMade, setChoiceMade] = useState<'classic' | 'spiral' | null>(null);
  const [showSelfDestruct, setShowSelfDestruct] = useState<boolean>(false);
  const [showApology, setShowApology] = useState<boolean>(false);
  const [glitchText, setGlitchText] = useState<boolean>(false);
  const [showRealityFracture, setShowRealityFracture] = useState<boolean>(false);
  
  const navigate = useNavigate();
  
  // System integrity is based on game mode + chaos/suspicion levels
  const getSystemIntegrity = () => {
    const baseIntegrity = gameMode === 'linear' ? 70 : 40;
    return Math.max(0, baseIntegrity - (chaosLevel * 10) - (suspicionLevel * 2));
  };
  
  const systemIntegrity = getSystemIntegrity();
  
  // Initialize and sequence the mirror error experience
  useEffect(() => {
    // Set narrator message on entry
    setNarratorMessage("ERROR: Reality fracture detected. System attempting to reconcile contradictory user states.");
    
    // Initialize the self-destruct warning after delay
    const timer1 = setTimeout(() => {
      setShowSelfDestruct(true);
      setNarratorMessage("CRITICAL ERROR: System integrity failing. Data corruption imminent.");
    }, 5000);
    
    // Show apology and retract warning
    const timer2 = setTimeout(() => {
      setShowSelfDestruct(false);
      setShowApology(true);
      setNarratorMessage("Apologies for the confusion. That was an error. Please proceed.");
    }, 12000);
    
    // Transition to choice phase
    const timer3 = setTimeout(() => {
      setPhase(1);
      setShowApology(false);
      setNarratorMessage("Two user instances detected. You must choose which version continues.");
    }, 18000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [setNarratorMessage]);
  
  // Intermittent glitch effects
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.6) {
        setGlitchText(true);
        setTimeout(() => setGlitchText(false), 300);
      }
    }, 2000);
    
    return () => clearInterval(glitchInterval);
  }, []);
  
  // Handle the user choice between versions
  const handleChooseVersion = (version: 'classic' | 'spiral') => {
    setChoiceMade(version);
    
    // Increase frustration if in spiral mode
    if (gameMode === 'infinite_spiral') {
      setFrustrationScore(10);
    }
    
    // Fractured reality effect
    setNarratorMessage("ERROR: User decision rejected. Both instances corrupted.");
    
    setTimeout(() => {
      setShowRealityFracture(true);
      
      // After fracture effect, continue the journey
      setTimeout(() => {
        navigate('/truth');
      }, 5000);
    }, 3000);
  };
  
  // Show initial loading and error screen
  const renderSystemError = () => (
    <div className="space-y-8 max-w-2xl mx-auto text-center">
      <div 
        className={`p-6 bg-black bg-opacity-60 border-2 border-${theme}-500 rounded-lg`}
      >
        <h1 className="text-3xl font-bold mb-4">
          <TextScrambler 
            text="SYSTEM ERROR: MIRROR FAULT" 
            chaosMultiplier={2} 
          />
        </h1>
        
        <div className="mb-6 text-lg text-gray-300">
          <TextScrambler 
            text="Reality convergence failure. Multiple user instances detected." 
            chaosMultiplier={1.5} 
          />
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">System Integrity:</span>
            <span className={systemIntegrity < 30 ? "text-red-500" : "text-yellow-400"}>
              {systemIntegrity}%
            </span>
          </div>
          
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${systemIntegrity < 30 ? "bg-red-600" : "bg-yellow-500"}`}
              initial={{ width: "100%" }}
              animate={{ width: `${systemIntegrity}%` }}
              transition={{ duration: 2 }}
            />
          </div>
          
          <div className="text-left mt-4 font-mono text-sm">
            <div className={glitchText ? "text-red-500" : "text-gray-500"}>
              <TextScrambler 
                text={`> User ID: ${scrambledName || userName || "UNKNOWN"}`} 
                chaosMultiplier={1} 
              />
            </div>
            <div className="text-gray-500">
              <TextScrambler 
                text={`> Session corrupted: CATASTROPHIC FAULT`} 
                chaosMultiplier={1.2} 
              />
            </div>
            <div className="text-gray-500">
              <TextScrambler 
                text={`> Attempting reality reconciliation...`} 
                chaosMultiplier={1.3} 
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Self-destruct warning - appears and then disappears */}
      <AnimatePresence>
        {showSelfDestruct && (
          <motion.div
            className="p-4 bg-red-900 bg-opacity-70 border border-red-600 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="text-xl font-bold text-red-400 mb-2">⚠️ SELF-DESTRUCT SEQUENCE INITIATED</h3>
            <p className="text-white">
              All data will be permanently deleted in 30 seconds. Please exit immediately.
            </p>
            <div className="mt-2 h-1 bg-black bg-opacity-30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-red-500"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 30 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Apology message that follows */}
      <AnimatePresence>
        {showApology && (
          <motion.div
            className={`p-4 bg-${theme}-900 bg-opacity-70 border border-${theme}-600 rounded-lg`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h3 className="text-xl font-bold text-green-400 mb-2">✓ System Notice</h3>
            <p className="text-white">
              Please disregard the previous warning. It was generated in error. 
              System stability has been restored. Please continue.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
  // Show user the two versions to choose from
  const renderUserVersionChoice = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">
        <TextScrambler 
          text="Choose Which Version Continues" 
          chaosMultiplier={1.5} 
        />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Classic Mode Version */}
        <motion.div
          className={`p-6 bg-black bg-opacity-70 border-2 ${choiceMade === 'classic' ? `border-${theme}-500` : 'border-gray-700'} rounded-lg text-center relative overflow-hidden ${glitchText ? 'classic-glitch' : ''}`}
          whileHover={{ scale: 1.02 }}
          onClick={() => handleChooseVersion('classic')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-transparent opacity-20"></div>
          
          <div className="relative z-10">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              <div className="text-7xl transform rotate-90">
                {">:D"}
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-3">Logical Observer</h3>
            
            <p className="text-gray-400 mb-4">
              This version of you methodically explored every path with detached curiosity.
              You survived by being careful and strategic.
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex justify-between mb-2">
                <span>Rationality</span>
                <span>87%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '87%' }}></div>
              </div>
              
              <div className="flex justify-between mt-3 mb-2">
                <span>Corruption</span>
                <span>42%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Infinite Spiral Version */}
        <motion.div
          className={`p-6 bg-black bg-opacity-70 border-2 ${choiceMade === 'spiral' ? `border-${theme}-500` : 'border-gray-700'} rounded-lg text-center relative overflow-hidden ${glitchText ? 'spiral-glitch' : ''}`}
          whileHover={{ scale: 1.02 }}
          onClick={() => handleChooseVersion('spiral')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-900 to-transparent opacity-20"></div>
          
          <div className="relative z-10">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              <div className="text-7xl transform rotate-90">
                {"乂_乂"}
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-3">Chaotic Wanderer</h3>
            
            <p className="text-gray-400 mb-4">
              This version of you embraced the madness, diving ever deeper into the spiral.
              You survived by adapting to chaos itself.
            </p>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex justify-between mb-2">
                <span>Adaptability</span>
                <span>92%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '92%' }}></div>
              </div>
              
              <div className="flex justify-between mt-3 mb-2">
                <span>Corruption</span>
                <span>78%</span>
              </div>
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="text-center text-gray-500 text-sm italic mt-4">
        Choose carefully. Your existence depends on it.
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glitch effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black"></div>
        
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        ></div>
        
        {/* Subtle data streams */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px bg-blue-500"
              style={{
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: -100,
              }}
              animate={{
                top: ['100%', '100%'],
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: 'loop',
                delay: Math.random() * 5,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {phase === 0 ? renderSystemError() : renderUserVersionChoice()}
      </div>
      
      {/* Reality fracture effect overlay */}
      <AnimatePresence>
        {showRealityFracture && (
          <>
            {/* Fracture effect */}
            <motion.div
              className="fixed inset-0 z-50 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black opacity-80"></div>
              
              {/* Glass shatter effect */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <motion.path
                  d="M50,50 L20,20 M50,50 L80,20 M50,50 L20,80 M50,50 L80,80 M50,50 L50,10 M50,50 L50,90 M50,50 L10,50 M50,50 L90,50"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="0.1"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />
              </svg>
              
              {/* Glitch effect */}
              <motion.div 
                className="absolute inset-0 bg-red-500 mix-blend-overlay"
                animate={{ opacity: [0, 0.2, 0, 0.1, 0] }}
                transition={{ duration: 0.3, repeat: 10 }}
              />
            </motion.div>
            
            {/* Error message */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1 }}
            >
              <h1 className="text-4xl sm:text-6xl font-bold text-red-500 mb-4">REALITY ERROR</h1>
              <p className="text-xl text-white">Neither version was real. You never existed.</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Global styles */}
      <style>{`
        .classic-glitch {
          animation: classicGlitch 0.3s forwards;
        }
        
        .spiral-glitch {
          animation: spiralGlitch 0.3s forwards;
        }
        
        @keyframes classicGlitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        @keyframes spiralGlitch {
          0% { transform: translate(0) scale(1); }
          25% { transform: translate(-3px, 3px) scale(1.02); }
          50% { transform: translate(3px, -2px) scale(0.98); }
          75% { transform: translate(-1px, -3px) scale(1.01); }
          100% { transform: translate(0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MirrorError; 
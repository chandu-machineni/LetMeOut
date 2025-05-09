import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import Stage from './Stage';
import TextScrambler from './TextScrambler';

// Fake load steps that sound convincing
const loadingSteps = [
  'Initializing resources...',
  'Connecting to secure server...',
  'Validating user credentials...',
  'Analyzing provided information...',
  'Optimizing user profile...',
  'Personalizing experience settings...',
  'Loading core modules...',
  'Generating interface elements...',
  'Calibrating evil algorithms...',
  'Creating psychological profile...',
  'Calculating manipulation metrics...',
  'Injecting tracking modules...',
  'Bypassing privacy settings...',
  'Collecting browser history...',
  'Scanning for vulnerabilities...',
  'Disabling escape mechanisms...',
  'Preparing final sequence...',
  'Executing completion protocols...',
  'Almost there...',
  'Just one final step...'
];

// Error messages that appear when progress fails
const errorMessages = [
  'ERROR: Unable to complete profile setup',
  'ERROR: Security breach detected',
  'ERROR: System permissions exceeded',
  'ERROR: User integrity check failed',
  'ERROR: Unexpected resistance detected'
];

const FakeProgress: React.FC = () => {
  const { theme, chaosLevel, setSuspicionLevel, userName, setNarratorMessage } = useContext(AppContext);
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isRapidProgress, setIsRapidProgress] = useState<boolean>(false);
  const [isFinalizing, setIsFinalizing] = useState<boolean>(false);
  const [showingError, setShowingError] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [stuckCount, setStuckCount] = useState<number>(0);
  
  const navigate = useNavigate();
  
  // Progress bar animation
  useEffect(() => {
    if (showingError || isPaused) return;
    
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 99) {
          clearInterval(interval);
          handleFailure();
          return 99;
        }
        
        // More chaotic progress at higher chaos levels
        if (chaosLevel >= 3) {
          const random = Math.random();
          // Sometimes go backwards
          if (random < 0.1) {
            return Math.max(prevProgress - Math.random() * 5, 0);
          }
          // Sometimes jump ahead
          if (random > 0.8) {
            return Math.min(prevProgress + Math.random() * 10, 98);
          }
        }
        
        // Normal progression
        const increment = isRapidProgress ? 2 : 0.5;
        return Math.min(prevProgress + increment, 98);
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, [showingError, isPaused, isRapidProgress, chaosLevel]);
  
  // Loading steps text effect
  useEffect(() => {
    if (showingError || isPaused) return;
    
    const interval = setInterval(() => {
      if (progress > 90) {
        setIsFinalizing(true);
        clearInterval(interval);
      } else if (progress > currentStep * (100 / loadingSteps.length)) {
        setCurrentStep(prevStep => {
          const nextStep = prevStep + 1;
          if (nextStep >= loadingSteps.length) {
            clearInterval(interval);
            return loadingSteps.length - 1;
          }
          return nextStep;
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [progress, currentStep, showingError, isPaused]);
  
  // Randomize progress speed
  useEffect(() => {
    if (showingError || isPaused) return;
    
    const speedInterval = setInterval(() => {
      // At higher chaos levels, more erratic behavior
      if (chaosLevel >= 3 && Math.random() > 0.7) {
        // Randomly toggle rapid progress
        setIsRapidProgress(prev => !prev);
        
        // Occasionally pause temporarily
        if (Math.random() > 0.8) {
          setIsPaused(true);
          
          setNarratorMessage("Hmm, seems we've hit a problem with your data...");
          
          setTimeout(() => {
            setIsPaused(false);
            setNarratorMessage("Ah, there we go. Continuing...");
          }, 3000 + Math.random() * 5000);
        }
      } else {
        // Normal behavior
        setIsRapidProgress(Math.random() > 0.7);
      }
    }, 3000);
    
    return () => clearInterval(speedInterval);
  }, [showingError, isPaused, chaosLevel, setNarratorMessage]);
  
  // Add 'stuck at 99%' behavior
  useEffect(() => {
    if (progress >= 99 && !showingError) {
      setNarratorMessage("Almost there...");
      
      // Increase suspicion for making the user wait
      setSuspicionLevel(prev => Math.min(10, prev + 0.5));
      
      // Count how many times we've gotten stuck
      setStuckCount(prev => prev + 1);
      
      if (stuckCount >= 3) {
        handleFailure();
      }
    }
  }, [progress, showingError, setNarratorMessage, setSuspicionLevel, stuckCount]);
  
  // Simulate a failure when reaching 99%
  const handleFailure = () => {
    setShowingError(true);
    setErrorMessage(errorMessages[Math.floor(Math.random() * errorMessages.length)]);
    
    setNarratorMessage("Oops! Something went wrong... or did it?");
    
    // Show error for a bit then continue anyway
    setTimeout(() => {
      setShowingError(false);
      setProgress(100);
      
      // Proceed to the next page
      setTimeout(() => {
        navigate('/victory');
      }, 2000);
    }, 3000);
  };
  
  return (
    <Stage 
      stageNumber={5}
      title="Processing Your Data"
      description="Please wait while we process your information. This may take a moment."
      onComplete={() => navigate('/victory')}
    >
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 bg-${theme}-900 text-white`}>
        <motion.h1 
          className={`text-4xl md:text-5xl font-bold mb-6 text-center text-${theme}-300`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isFinalizing ? (
            <TextScrambler 
              text="Finalizing Your Profile"
              chaosMultiplier={1.5}
              glitchOnHover
            />
          ) : (
            <TextScrambler 
              text="Processing Your Data"
              chaosMultiplier={0.8}
            />
          )}
        </motion.h1>
        
        <motion.div 
          className="w-full max-w-md mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-${theme}-200 bg-${theme}-700`}>
                  {showingError ? "Failed" : "In Progress"}
                </span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold inline-block ${showingError ? 'text-red-400' : 'text-gray-400'}`}>
                  {showingError ? "Error detected" : `${Math.floor(progress)}%`}
                </span>
              </div>
            </div>
            
            <div className={`overflow-hidden h-2 text-xs flex rounded bg-${theme}-800`}>
              <motion.div 
                className={`shadow-none flex flex-col text-center whitespace-nowrap justify-center ${showingError ? 'bg-red-500' : `bg-${theme}-400`}`}
                initial={{ width: '0%' }}
                animate={{ 
                  width: `${progress}%`,
                  transition: {
                    ease: 'easeInOut',
                    duration: 0.5 // smoother animation
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
        
        <div className="relative">
          <motion.div
            className={`bg-${theme}-800 rounded-lg p-4 w-full max-w-md text-sm mb-6 h-24 overflow-hidden`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <AnimatePresence mode="wait">
              {showingError ? (
                <motion.div
                  key="error"
                  className="text-red-400 font-mono h-full flex flex-col justify-center items-center text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-lg mb-2">{errorMessage}</div>
                  <div className="text-xs">Recovery in progress...</div>
                </motion.div>
              ) : (
                <motion.div
                  key="step"
                  className="font-mono opacity-80"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {isPaused ? (
                    <div className="text-yellow-300">System paused: Verifying integrity...</div>
                  ) : (
                    loadingSteps[currentStep]
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Fake log output */}
            <div className="mt-2 text-xs text-gray-500 font-mono h-12 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="truncate"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i }}
                >
                  {`> cmd${Math.floor(Math.random() * 100)}: process${Math.floor(Math.random() * 1000)} [${Math.floor(Math.random() * 100)}%] ${userName ? userName.toLowerCase() : 'user'}_data.${['xml', 'json', 'bin', 'dat'][Math.floor(Math.random() * 4)]}`}
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Fake terminal/command line */}
          <motion.div
            className={`bg-black bg-opacity-70 rounded-lg p-3 w-full max-w-md text-xs text-green-400 font-mono border border-${theme}-700`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center mb-1">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <div className="ml-2 text-gray-400">Terminal</div>
            </div>
            
            <div className="h-16 overflow-hidden">
              {isPaused ? (
                <motion.div
                  animate={{
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  $ System paused... Waiting for response...
                </motion.div>
              ) : (
                <>
                  <div>$ Executing process {Math.floor(Math.random() * 10000)}</div>
                  <div>$ Loading module: user_interface.js</div>
                  <div>$ Transmitting data to central server...</div>
                  <motion.div
                    animate={{
                      opacity: [1, 0, 1]
                    }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    $ {showingError ? 'ERROR: Transmission failed' : 'Connection secure...'}
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Add more visually confusing elements at higher chaos levels */}
        {chaosLevel >= 3 && (
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
          >
            <div className="relative w-full h-full">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute bg-${theme}-500 rounded-full opacity-20`}
                  style={{
                    width: Math.random() * 100 + 50,
                    height: Math.random() * 100 + 50,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, Math.random() * 100 - 50, 0],
                    y: [0, Math.random() * 100 - 50, 0],
                    scale: [1, Math.random() * 0.5 + 0.8, 1],
                    opacity: [0.1, 0.3, 0.1],
                  }}
                  transition={{
                    duration: Math.random() * 20 + 10,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Stage>
  );
};

export default FakeProgress; 
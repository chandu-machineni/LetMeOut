import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FalseProgressProps {
  onComplete: () => void;
  onFail: () => void;
}

const FalseProgress: React.FC<FalseProgressProps> = ({ onComplete, onFail }) => {
  const [progress, setProgress] = useState(0);
  const [secondaryProgress, setSecondaryProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [resets, setResets] = useState(0);
  const [hasAttempted, setHasAttempted] = useState(false);
  const [revealMessage, setRevealMessage] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const loadingMessages = [
    "Loading your experience...",
    "Preparing content...",
    "Almost there...",
    "Just a moment...",
    "Connecting to server...",
    "Optimizing your experience...",
    "Fetching data...",
    "Applying settings...",
    "Loading necessary components...",
    "Initializing process..."
  ];
  
  const errorMessages = [
    "Connection error. Retrying...",
    "Unexpected delay. Restarting...",
    "Data corruption detected. Starting over...",
    "Process interrupted. Rebooting...",
    "Timeout occurred. Trying again..."
  ];
  
  // Primary progress simulation - slow steady increase with resets
  useEffect(() => {
    if (progress >= 100) {
      if (resets < 3) {
        // Reset with error message
        setTimeout(() => {
          setProgress(0);
          setMessageIndex(prevIndex => Math.floor(Math.random() * errorMessages.length));
          setResets(prev => prev + 1);
        }, 1500);
      } else {
        // After 3 resets, allow completion
        setShowCompletion(true);
      }
      return;
    }
    
    const interval = setInterval(() => {
      setProgress(prev => {
        // 5% chance to randomly lose progress
        if (Math.random() < 0.05 && prev > 20 && resets < 3) {
          return Math.max(0, prev - Math.floor(Math.random() * 20));
        }
        
        // Near completion, slow down dramatically
        if (prev > 90) {
          return prev + 0.1;
        }
        
        // Random progress gain
        return Math.min(100, prev + (Math.random() * 1.5));
      });
      
      // Cycle through messages
      if (Math.random() < 0.1) {
        setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
      }
    }, 200);
    
    return () => clearInterval(interval);
  }, [progress, resets, errorMessages.length, loadingMessages.length]);
  
  // Secondary "fake" progress that moves more quickly
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondaryProgress(prev => {
        if (prev >= 100) return 0;
        return prev + (Math.random() * 5);
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle click on the try again button
  const handleTryAgain = () => {
    setHasAttempted(true);
    setProgress(Math.min(100, progress + 20));
    
    if (!revealMessage) {
      setRevealMessage(true);
      setTimeout(() => setRevealMessage(false), 3000);
    }
  };
  
  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">System Update</h2>
      
      {/* Main progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm text-gray-400">
            {progress < 100 
              ? loadingMessages[messageIndex]
              : resets < 3
                ? errorMessages[messageIndex % errorMessages.length]
                : "Update complete!"}
          </div>
          <div className="text-sm font-bold">{Math.floor(progress)}%</div>
        </div>
        
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600"
            style={{ width: `${progress}%` }}
            animate={{
              width: `${progress}%`,
              transition: { duration: 0.3 }
            }}
          />
        </div>
      </div>
      
      {/* Secondary phantom progress indicators */}
      <div className="mb-6">
        <div className="text-xs text-gray-500 mb-1">Status: Processing files...</div>
        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden mb-2">
          <motion.div
            className="h-full bg-gray-600"
            style={{ width: `${secondaryProgress}%` }}
          />
        </div>
        
        <div className="flex justify-start space-x-1">
          {[1, 2, 3, 4, 5].map(step => (
            <div 
              key={step} 
              className={`w-2 h-2 rounded-full ${
                step <= Math.ceil(progress / 20) ? 'bg-green-500' : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
      
      {progress === 100 && resets < 3 && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded text-sm">
          <div className="font-bold text-red-400 mb-1">Error encountered</div>
          <p className="text-gray-300 mb-2">
            The process was interrupted. Please try again.
          </p>
          <button
            className="px-4 py-1.5 bg-red-700 hover:bg-red-600 text-white rounded text-sm"
            onClick={() => setProgress(0)}
          >
            Restart
          </button>
        </div>
      )}
      
      <AnimatePresence>
        {revealMessage && (
          <motion.div
            className="mb-4 p-3 bg-yellow-900/30 border border-yellow-800 rounded text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-yellow-300">
              Clicking more doesn't actually make it faster. This progress bar is designed to frustrate you.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {showCompletion ? (
        <div className="flex justify-between">
          <motion.button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </motion.button>
          
          <motion.button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={onFail}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Give Up
          </motion.button>
        </div>
      ) : (
        <div className="flex justify-between">
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleTryAgain}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={progress === 100 && resets < 3}
          >
            {hasAttempted ? "Speed Up Process" : "Try Again"}
          </motion.button>
          
          <motion.button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={onFail}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Give Up
          </motion.button>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Estimated time remaining: {progress < 95 ? "About 2 minutes" : progress < 98 ? "Less than a minute" : "Just a few seconds"}
      </div>
    </div>
  );
};

export default FalseProgress; 
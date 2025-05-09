import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';

const TruthRoom: React.FC = () => {
  const { theme, setTheme, userName, scrambledName, setNarratorMessage } = useContext(AppContext);
  const navigate = useNavigate();
  const [textIndex, setTextIndex] = useState(0);
  const [showNextButton, setShowNextButton] = useState(false);
  const [revealSecret, setRevealSecret] = useState(false);
  
  // Set theme to glitch for the truth room
  useEffect(() => {
    setTheme('glitch');
    
    // Inform the user they found something special
    setNarratorMessage("You've found the hidden room. How interesting.");
    
    return () => {
      // Reset narrator message when leaving
      setNarratorMessage('');
    };
  }, [setTheme, setNarratorMessage]);
  
  // The sequence of revelations shown to the user
  const truthRevealText = [
    "You're not supposed to be here...",
    "But since you are… welcome to the UX underworld.",
    "This experiment isn't just about frustrating interfaces.",
    "It's about the psychology of how we interact with technology.",
    "Every error, every hesitation, every frustrated click...",
    "They're all by design.",
    "Dark patterns aren't just bad UX. They're manipulation tools.",
    "Companies use them because they work.",
    "They exploit cognitive biases and emotional responses.",
    "Remember that next time you're blocked from unsubscribing...",
    "Or when a countdown timer pressures you to buy.",
    "The real joke isn't on you, though.",
    "It's on the companies who need these tricks to succeed.",
    "Now you know what to look for.",
    "That awareness is your power.",
    "Want to see how deep the rabbit hole goes?",
  ];
  
  // Show next text after delay or on button click
  const showNextText = () => {
    if (textIndex < truthRevealText.length - 1) {
      setTextIndex(textIndex + 1);
      setShowNextButton(false);
      
      // Show next button after a delay
      setTimeout(() => {
        setShowNextButton(true);
      }, 1500);
    } else {
      // If we've shown all texts, reveal the secret
      setRevealSecret(true);
    }
  };
  
  // Automatic timing for the next text to appear
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNextButton(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [textIndex]);
  
  const handleReturnToExperiment = () => {
    navigate('/');
  };
  
  const handleRevealRealExit = () => {
    // Open a blank page that just says "You are free."
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Freedom</title>
            <style>
              body {
                font-family: sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: white;
                color: black;
                text-align: center;
              }
              h1 {
                font-size: 3rem;
                margin-bottom: 2rem;
              }
              p {
                font-size: 1.5rem;
                max-width: 600px;
                line-height: 1.6;
              }
            </style>
          </head>
          <body>
            <div>
              <h1>You are free.</h1>
              <p>Congratulations on finding the only real exit in this experiment.</p>
              <p>Remember what you've learned about dark patterns and take that awareness with you.</p>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };
  
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background circuit patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-circuit-pattern"></div>
      </div>
      
      {/* Matrix-like falling code in background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xs font-mono text-green-400"
            style={{
              top: -100,
              left: `${i * 5}%`,
            }}
            animate={{
              top: ['0%', '100%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div key={j}>
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
      
      {/* Main content */}
      <div className="relative z-10 max-w-2xl">
        <AnimatePresence mode="wait">
          {!revealSecret ? (
            <motion.div
              key="truth-text"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-12 text-green-400"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: "spring" }}
              >
                The Truth Room
              </motion.h1>
              
              <motion.p
                className="text-xl mb-8"
                key={textIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 15 }}
              >
                {truthRevealText[textIndex]}
              </motion.p>
              
              {showNextButton && (
                <motion.button
                  className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={showNextText}
                >
                  {textIndex < truthRevealText.length - 1 ? "Continue" : "Show Me"}
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="secret-revealed"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-green-400">Choose Your Fate</h2>
              
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <motion.button
                  className="px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  onClick={handleReturnToExperiment}
                >
                  Return to the Experiment
                </motion.button>
                
                <motion.button
                  className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  onClick={handleRevealRealExit}
                >
                  The Real Exit
                </motion.button>
              </div>
              
              <motion.p
                className="mt-12 text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {userName || scrambledName 
                  ? `By the way, ${userName || scrambledName}, we've been watching your every move.`
                  : "By the way, we've been watching your every move."}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer */}
      <motion.p
        className="fixed bottom-4 text-xs text-green-500 max-w-md text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 2 }}
      >
        _system: 0xDEADC0DE terminal:// ux_experiment.truth_module.access_granted
      </motion.p>
    </motion.div>
  );
};

export default TruthRoom; 
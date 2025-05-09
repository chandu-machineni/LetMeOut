import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import Stage from './Stage';
import TextScrambler from './TextScrambler';

const FalseVictory: React.FC = () => {
  const { theme, userBehavior, chaosLevel } = useContext(AppContext);
  const navigate = useNavigate();
  const [stage, setStage] = useState<'loading' | 'glitch' | 'analysis' | 'exit'>('loading');
  const [sessionId] = useState(() => 
    Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')
  );
  const [analysisMessages, setAnalysisMessages] = useState<string[]>([]);
  
  // Generate random delays for checkboxes
  const [checkboxData] = useState(() => {
    const delays = [];
    for (let i = 0; i < 100; i++) {
      delays.push({
        number: Math.floor(Math.random() * 100) + 1,
        time: (Math.random() * 15 + 2).toFixed(2)
      });
    }
    return delays.sort((a, b) => Number(b.time) - Number(a.time)).slice(0, 5);
  });
  
  // Sequence of animations
  useEffect(() => {
    // Initial loading stage
    const loadingTimer = setTimeout(() => {
      setStage('glitch');
    }, 3000);
    
    // After glitch, show analysis
    const glitchTimer = setTimeout(() => {
      setStage('analysis');
      
      // Generate analysis messages
      const messages = [
        `Error: You never existed. Session: ${sessionId}`,
        `Checkbox ${checkboxData[0].number} took you ${checkboxData[0].time}s. You hesitated. Why?`,
        `Detected ${userBehavior.clickCount} clicks. Normal humans use ${userBehavior.clickCount + Math.floor(Math.random() * 30) - 15}.`,
        `${userBehavior.errorCount} errors recorded. Your frustration levels are... entertaining.`,
        `Biometric analysis suggests increased heart rate. We feed on stress.`,
        `Your cursor movements indicate ${Math.random() > 0.5 ? 'deception' : 'uncertainty'}. Noted.`,
        `Time spent on forms: excessive. Social life assessment: concerning.`,
      ];
      
      // Show messages sequentially
      let counter = 0;
      const messageInterval = setInterval(() => {
        if (counter < messages.length) {
          setAnalysisMessages(prev => [...prev, messages[counter]]);
          counter++;
        } else {
          clearInterval(messageInterval);
          setTimeout(() => setStage('exit'), 3000);
        }
      }, 1500);
    }, 6000);
    
    // Clean up timers
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(glitchTimer);
    };
  }, [sessionId, checkboxData, userBehavior]);
  
  // Go to museum when exit is shown and clicked
  const handleExit = () => {
    navigate('/museum');
  };
  
  return (
    <Stage 
      stageNumber={6}
      title="Congratulations"
      description="Your profile is now complete. Welcome to the system."
      onComplete={() => navigate('/museum')}
    >
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 bg-${theme}-900 text-white relative overflow-hidden`}>
        {/* Background noise/glitch effects */}
        <div className={`absolute inset-0 opacity-20 ${stage === 'glitch' ? 'animate-noise' : ''}`}></div>
        
        {/* Header - changes based on stage */}
        <AnimatePresence mode="wait">
          <motion.h1 
            key={stage}
            className={`text-3xl md:text-4xl font-bold mb-8 text-center ${stage === 'glitch' ? 'text-glitch' : ''}`}
            data-text={stage === 'loading' ? 'Validation Complete' : stage === 'glitch' ? 'System Error' : stage === 'analysis' ? 'User Analysis' : 'Exit Program'}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring" }}
          >
            {stage === 'loading' ? 'Validation Complete' : 
             stage === 'glitch' ? 'System Error' : 
             stage === 'analysis' ? 'User Analysis' : 
             'Exit Program'}
          </motion.h1>
        </AnimatePresence>
        
        {/* Loading stage */}
        {stage === 'loading' && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={`w-16 h-16 border-4 border-${theme}-500 border-t-transparent rounded-full animate-spin mb-6`}></div>
            <p className="text-lg text-center max-w-md">
              Your data has been successfully validated and processed. Thank you for your compliance.
            </p>
          </motion.div>
        )}
        
        {/* Glitch stage */}
        {stage === 'glitch' && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ 
              opacity: [0, 1, 0.5, 0.8, 0.2, 1], 
              filter: ['blur(10px)', 'blur(0px)', 'blur(5px)', 'blur(1px)', 'blur(8px)', 'blur(0px)'],
              x: [0, -10, 5, -7, 3, 0],
            }}
            transition={{ 
              duration: 3,
              times: [0, 0.2, 0.4, 0.6, 0.8, 1]
            }}
          >
            <motion.div 
              className={`text-2xl font-mono text-error mb-4 tracking-wider`}
              animate={{ 
                x: [-2, 2, -3, 1, 0],
                opacity: [1, 0.8, 0.9, 0.7, 1]
              }}
              transition={{ duration: 0.5, repeat: 5 }}
            >
              Error: You never existed. Session: {sessionId}
            </motion.div>
            
            <div className="flex space-x-2 mb-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div 
                  key={i}
                  className={`w-3 h-3 rounded-full bg-${theme}-500`}
                  animate={{ 
                    opacity: [0.2, 1, 0.5, 0.8, 0.3],
                    scale: [1, 1.2, 0.9, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2 
                  }}
                />
              ))}
            </div>
            
            <motion.div 
              className="text-center text-sm opacity-60 max-w-md font-mono"
              animate={{ 
                opacity: [0.6, 0.4, 0.7, 0.5, 0.6] 
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <p>CRITICAL_PROCESS_ERROR</p>
              <p className="mt-2">Attempting to recover user data fragments...</p>
              <p className="mt-2 text-error">MEMORY_ACCESS_VIOLATION 0x0000001E</p>
            </motion.div>
          </motion.div>
        )}
        
        {/* Analysis stage */}
        {stage === 'analysis' && (
          <motion.div
            className="w-full max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={`font-mono bg-${theme}-800 p-4 rounded-lg border border-${theme}-500 overflow-hidden`}>
              <div className={`flex items-center p-2 bg-${theme}-700 rounded mb-4`}>
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-xs ml-2">user_analysis.log</span>
              </div>
              
              {analysisMessages.map((message, index) => (
                <motion.div
                  key={index}
                  className="mb-3 font-mono text-sm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <span className="text-green-400 mr-2">[SYSTEM]:~$</span>
                  <span className={index === 0 ? 'text-error' : ''}>{message}</span>
                </motion.div>
              ))}
              
              {/* Blinking cursor */}
              {analysisMessages.length < 7 && (
                <motion.span
                  className="inline-block w-2 h-4 bg-white"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </div>
          </motion.div>
        )}
        
        {/* Exit stage */}
        {stage === 'exit' && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.button
              className={`relative bg-${theme}-500 text-${theme}-900 font-bold text-3xl py-6 px-12 rounded-xl shadow-xl overflow-hidden`}
              whileHover={{
                scale: 1.05,
              }}
              animate={{ 
                y: [0, chaosLevel > 3 ? -10 : 0], 
                x: chaosLevel > 3 ? [-5, 5, -5, 5, 0] : [0],
              }}
              transition={{ 
                duration: 0.5, 
                y: { repeat: chaosLevel > 3 ? Infinity : 0, repeatType: 'reverse' } 
              }}
              onClick={handleExit}
              onMouseEnter={(e) => {
                // If chaos level is high, try to avoid cursor unless directly clicked
                if (chaosLevel >= 4 && Math.random() > 0.3) {
                  const button = e.currentTarget;
                  const rect = button.getBoundingClientRect();
                  const randomX = Math.random() * window.innerWidth * 0.8;
                  const randomY = Math.random() * window.innerHeight * 0.8;
                  button.style.position = 'absolute';
                  button.style.left = `${randomX}px`;
                  button.style.top = `${randomY}px`;
                }
              }}
            >
              <span className="relative z-10">EXIT</span>
              <div className={`absolute inset-0 bg-${theme}-400 opacity-50`} style={{ 
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
                animation: 'wave 3s linear infinite',
              }}></div>
            </motion.button>
            
            <motion.p
              className="mt-8 text-sm opacity-60 max-w-md text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 1 }}
            >
              Click to exit. Or stay here forever. Your choice.
            </motion.p>
          </motion.div>
        )}
      </div>
    </Stage>
  );
};

export default FalseVictory; 
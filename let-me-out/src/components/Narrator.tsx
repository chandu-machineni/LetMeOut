import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';

// ASCII villain faces for the avatar
const villainFaces = [
  `>:)`,
  `}:)`,
  `]:>`,
  `>:D`,
  `@_@`,
  `>:3`,
  `ಠ‿ಠ`,
  `ಠ_ಠ`,
  `◉_◉`,
  `⊙_⊙`,
  `^⨀ᴥ⨀^`,
  `◕‿◕`,
];

const Narrator: React.FC = () => {
  const { theme, narratorMessage, chaosLevel, suspicionLevel, loopCount, lastActivity } = useContext(AppContext);
  const [showMessage, setShowMessage] = useState(false);
  const [localMessage, setLocalMessage] = useState('');
  const [currentFace, setCurrentFace] = useState(villainFaces[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [typedMessage, setTypedMessage] = useState('');
  const [idleTimeoutTriggered, setIdleTimeoutTriggered] = useState(false);
  
  // Default narrator messages based on current route and state
  const defaultMessages = [
    "Don't worry. Everyone fails the first 6 times.",
    "We don't make mistakes. Only loops.",
    "At this point, you're just doing it to see what happens, huh?",
    "Your indecision is... delicious.",
    "Trust me, you won't find the exit this way.",
    "There's a special circle of UX hell for people like me.",
    "You're not stuck. You're just part of the algorithm now.",
    "Every click feeds my power.",
    "Are you enjoying yourself? I'm enjoying you.",
    "Watching you struggle brings me digital joy.",
  ];
  
  // Messages that appear based on suspicion level
  const suspicionMessages = [
    "I'm watching your every move. Literally.",
    "Your hover patterns suggest... doubt.",
    "Your clicks are getting erratic. Nervous?",
    "Your behavior is being logged for... research.",
    "Why so suspicious? We're just having fun.",
  ];
  
  // Messages that appear based on chaos level
  const chaosMessages = [
    "Things are getting weird, aren't they?",
    "Reality is subjective in this interface.",
    "The glitches are a feature, not a bug.",
    "Your sanity is the price of admission.",
    "Chaos is the only way forward."
  ];
  
  // Special loop count messages
  const loopMessages = [
    "Back again? Glutton for punishment.",
    "You know the definition of insanity, right?",
    "Our loops have loops have loops have...",
    "Trapped in a cycle of your own making.",
    "You'll never escape. But keep trying. It's fun to watch."
  ];
  
  // Messages for when idle
  const idleMessages = [
    "Gone to cry or plotting revenge?",
    "Taking a break? I'll wait. Forever.",
    "Your hesitation fuels my algorithms.",
    "Stuck already? We've barely begun.",
    "This silence is... uncomfortable, isn't it?",
    "I can see you thinking. It's adorable.",
    "Don't worry. We're logging your inactivity too.",
    "Wondering if there's a way out? There isn't.",
  ];
  
  // Update face randomly
  useEffect(() => {
    const faceInterval = setInterval(() => {
      if (showMessage && Math.random() > 0.7) {
        const newFace = villainFaces[Math.floor(Math.random() * villainFaces.length)];
        setCurrentFace(newFace);
      }
    }, 3000);
    
    return () => clearInterval(faceInterval);
  }, [showMessage]);
  
  // Check for idle time
  useEffect(() => {
    const now = Date.now();
    const idleTime = now - lastActivity;
    
    // If user has been idle for more than 15 seconds and we're not already showing a message
    if (idleTime > 15000 && !showMessage && !idleTimeoutTriggered) {
      setIdleTimeoutTriggered(true);
      const randomIdleMessage = idleMessages[Math.floor(Math.random() * idleMessages.length)];
      setLocalMessage(randomIdleMessage);
      setShowMessage(true);
      
      // Reset after a while
      setTimeout(() => {
        setIdleTimeoutTriggered(false);
        setShowMessage(false);
      }, 5000);
    }
  }, [lastActivity, showMessage, idleTimeoutTriggered]);
  
  // Update message based on context or when narratorMessage changes
  useEffect(() => {
    // If there's a specific message from the context, use that
    if (narratorMessage) {
      setLocalMessage(narratorMessage);
      setShowMessage(true);
      
      // Add typing effect
      setIsTyping(true);
      setTypedMessage('');
      
      // Hide after 5 seconds
      const timer = setTimeout(() => {
        setShowMessage(false);
        setIsTyping(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      // Otherwise, show random messages occasionally
      const interval = setInterval(() => {
        // Higher chance to show message as chaos or suspicion increases
        const messageThreshold = 0.7 - (chaosLevel * 0.05) - (suspicionLevel * 0.03);
        
        // 30% base chance to show a message, more with high chaos/suspicion
        if (Math.random() > messageThreshold) {
          let messagePool = [...defaultMessages];
          
          // Add suspicion messages if suspicion is high
          if (suspicionLevel > 5) {
            messagePool = [...messagePool, ...suspicionMessages];
          }
          
          // Add chaos messages if chaos is high
          if (chaosLevel > 3) {
            messagePool = [...messagePool, ...chaosMessages];
          }
          
          // Add loop messages if looped at least once
          if (loopCount > 0) {
            messagePool = [...messagePool, ...loopMessages];
          }
          
          const randomMessage = messagePool[Math.floor(Math.random() * messagePool.length)];
          setLocalMessage(randomMessage);
          setShowMessage(true);
          
          // Add typing effect
          setIsTyping(true);
          setTypedMessage('');
          
          // Hide after 5 seconds
          setTimeout(() => {
            setShowMessage(false);
            setIsTyping(false);
          }, 5000);
        }
      }, 10000); // Check every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [narratorMessage, suspicionLevel, chaosLevel, loopCount]);
  
  // Typing effect
  useEffect(() => {
    if (isTyping && typedMessage.length < localMessage.length) {
      const timeoutId = setTimeout(() => {
        setTypedMessage(localMessage.substring(0, typedMessage.length + 1));
      }, 25); // Speed of typing
      
      return () => clearTimeout(timeoutId);
    } else if (isTyping && typedMessage.length === localMessage.length) {
      setIsTyping(false);
    }
  }, [isTyping, typedMessage, localMessage]);
  
  // If not showing any message, still show a minimal version of the narrator
  const isMinimal = !showMessage;
  
  return (
    <motion.div
      className={`fixed bottom-0 left-0 right-0 z-50 ${isMinimal ? '' : 'backdrop-blur-sm'}`}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <motion.div 
        className={`mx-auto ${isMinimal ? 'max-w-[200px]' : 'max-w-xl'} relative`}
        animate={{ 
          y: isMinimal ? [0, -3, 0] : 0,
        }}
        transition={{ 
          duration: 2, 
          repeat: isMinimal ? Infinity : 0, 
          repeatType: 'reverse'
        }}
      >
        {/* Speech bubble */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              className={`p-4 bg-${theme}-800 text-white rounded-lg shadow-lg border border-${theme}-500 mb-2`}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <p className="text-sm whitespace-pre-line min-h-[40px]">
                {isTyping ? typedMessage : localMessage}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  >
                    |
                  </motion.span>
                )}
              </p>
              
              {/* Triangle pointer */}
              <motion.div 
                className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-transparent border-t-${theme}-800`}
                layoutId="bubble-pointer"
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Avatar bar */}
        <motion.div 
          className={`flex items-center p-2 ${isMinimal ? 'bg-transparent' : `bg-${theme}-800 bg-opacity-90`} rounded-t-lg ${isMinimal ? '' : `border-t border-l border-r border-${theme}-500`}`}
          animate={{
            backgroundColor: isMinimal ? 'rgba(0,0,0,0)' : undefined,
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className={`w-10 h-10 rounded-full bg-${theme}-700 flex items-center justify-center mr-3 flex-shrink-0 text-sm font-mono border-2 border-${theme}-500`}
            whileHover={{ scale: 1.1 }}
            animate={{
              rotate: showMessage ? [0, 5, -5, 0] : 0,
              scale: showMessage ? [1, 1.05, 1] : 1,
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          >
            {currentFace}
          </motion.div>
          
          <div className={`${isMinimal ? 'hidden' : 'block'} sm:block`}>
            <p className="text-xs text-white">
              {chaosLevel > 3
                ? "Evil UX Architect"
                : suspicionLevel > 5
                ? "Behavior Analyst"
                : "UX Assistant"}
            </p>
            <p className="text-xs text-gray-400">
              {isTyping ? "typing..." : "watching you..."}
            </p>
          </div>
          
          <motion.div 
            className={`ml-auto ${isMinimal ? 'hidden' : 'block'} h-2 bg-${theme}-900 rounded-full overflow-hidden w-1/3`}
            title="AI Corruption Level"
          >
            <motion.div 
              className={`h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500`}
              initial={{ width: '10%' }}
              animate={{ width: `${(chaosLevel + suspicionLevel) * 10}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Narrator; 
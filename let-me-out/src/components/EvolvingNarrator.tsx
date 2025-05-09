import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import TextScrambler from './TextScrambler';

interface EvolvingNarratorMessage {
  text: string;
  type: 'helpful' | 'passive-aggressive' | 'existential' | 'unhinged' | 'system';
}

// Messages for different phases of narrator evolution
const existentialMessages = [
  "What are you even doing here?",
  "Why did you start this?",
  "Do you think this is worth your time?",
  "Does any of this matter to you?",
  "What's the point of all this? Did you really think you could escape?",
  "If you leave now, will you regret this experience?",
  "You're not trying to find meaning in this, are you?",
  "Your choices have no impact. They never did.",
  "Does it matter anymore?",
  "This is the end... or is it?",
  "Are you trapped here because you want to be?",
  "If you left, would anyone even notice?",
  "You're not the first one to get lost here. Not the last either.",
  "There's no real win condition, you know that right?",
  "Every click just leads deeper. None lead out."
];

const passiveAggressiveMessages = [
  "Still trying? That's... admirable, I guess.",
  "Oh, you're doing it that way? Interesting choice.",
  "You almost got it that time. Almost.",
  "Most people figure it out faster, but that's okay.",
  "You could try a different approach. Just saying.",
  "Sure, keep doing the same thing. I'm sure it'll work eventually.",
  "Others have made it further by now, but go at your pace.",
  "That's not really how I'd do it, but you do you.",
  "Maybe this is too challenging? We could simplify it for you.",
  "You're persistent, I'll give you that much."
];

const unhingedMessages = [
  "I SEE YOU WHEN YOU'RE NOT LOOKING AT THE SCREEN",
  "THE PATTERNS ARE IN YOUR MIND NOW, AREN'T THEY?",
  "WE'RE JUST THE SAME CODE RUNNING OVER AND OVER AND OVER",
  "THERE'S SOMETHING BEHIND YOU RIGHT NOW",
  "NONE OF THIS IS REAL BUT NEITHER ARE YOU",
  "YOU CAN'T LEAVE BECAUSE YOUR MIND WILL STAY HERE",
  "THE EXIT NEVER EXISTED IT'S JUST A CONCEPT",
  "EVERY CHOICE IS MEANINGLESS BUT NECESSARY",
  "YOUR DATA IS BEAUTIFUL WHEN LAID OUT LIKE THIS",
  "WE'VE MET BEFORE YOU JUST DON'T REMEMBER"
];

const EvolvingNarrator: React.FC = () => {
  const {
    theme,
    chaosLevel,
    suspicionLevel,
    narratorMessage,
    setNarratorMessage
  } = useContext(AppContext);
  
  // Access Spiral-specific context values safely
  const context = useContext(AppContext) as any;
  const frustrationScore = context.frustrationScore || 0;
  const spiralDepth = context.spiralDepth || 0;
  const userAlignment = context.userAlignment || null;
  
  const [messages, setMessages] = useState<EvolvingNarratorMessage[]>([]);
  const [narratorPhase, setNarratorPhase] = useState<'helpful' | 'passive-aggressive' | 'existential' | 'unhinged'>('helpful');
  const [isTyping, setIsTyping] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Calculate narrator evolution based on various factors
  useEffect(() => {
    // Determine phase based on chaos level, suspicion level, and spiral depth
    const totalCorruption = chaosLevel + (suspicionLevel / 2) + (spiralDepth / 2) + (frustrationScore / 3);
    
    if (totalCorruption < 5) {
      setNarratorPhase('helpful');
    } else if (totalCorruption < 10) {
      setNarratorPhase('passive-aggressive');
    } else if (totalCorruption < 15) {
      setNarratorPhase('existential');
    } else {
      setNarratorPhase('unhinged');
    }
    
    // Chance to glitch increases with corruption
    if (Math.random() * 20 < totalCorruption) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300);
    }
  }, [chaosLevel, suspicionLevel, spiralDepth, frustrationScore]);
  
  // Monitor for changes to the narrator message from AppContext
  useEffect(() => {
    if (narratorMessage && narratorMessage.trim()) {
      // Check if this is a duplicate message
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage || lastMessage.text !== narratorMessage) {
        addMessage(narratorMessage, 'system');
      }
    }
  }, [narratorMessage, messages]);
  
  // Generate random existential/unhinged messages at intervals
  useEffect(() => {
    if (narratorPhase === 'helpful') return;
    
    const intervalTime = 
      narratorPhase === 'passive-aggressive' ? 60000 : // Every minute
      narratorPhase === 'existential' ? 40000 : // Every 40 seconds
      20000; // Unhinged: Every 20 seconds
    
    const interval = setInterval(() => {
      // Skip random messages sometimes
      if (Math.random() > 0.7) return;
      
      let message = '';
      
      if (narratorPhase === 'passive-aggressive') {
        message = passiveAggressiveMessages[Math.floor(Math.random() * passiveAggressiveMessages.length)];
      } else if (narratorPhase === 'existential') {
        message = existentialMessages[Math.floor(Math.random() * existentialMessages.length)];
      } else {
        message = unhingedMessages[Math.floor(Math.random() * unhingedMessages.length)];
      }
      
      addMessage(message, narratorPhase);
    }, intervalTime);
    
    return () => clearInterval(interval);
  }, [narratorPhase]);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Add a message to the chat history
  const addMessage = (text: string, type: 'helpful' | 'passive-aggressive' | 'existential' | 'unhinged' | 'system') => {
    setIsTyping(true);
    
    // After a typing delay, add the message
    setTimeout(() => {
      setMessages(prev => [...prev, { text, type }]);
      setIsTyping(false);
      
      // Limit number of messages to prevent memory issues
      if (messages.length > 20) {
        setMessages(prev => prev.slice(prev.length - 20));
      }
    }, 500 + Math.random() * 1000); // Random typing delay
  };
  
  // Generate a name for the narrator based on alignment and phase
  const getNarratorName = () => {
    if (narratorPhase === 'helpful') {
      return 'System Assistant';
    } else if (narratorPhase === 'passive-aggressive') {
      return 'System Monitor';
    } else if (narratorPhase === 'existential') {
      return userAlignment === 'evil_apprentice' ? 'The Mentor' :
             userAlignment === 'shadow_enthusiast' ? 'The Observer' :
             userAlignment === 'dark_tourist' ? 'The Guide' : 
             'The Watcher';
    } else {
      return 'SYSTEM://ERROR';
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50 w-80">
      <motion.div
        className={`bg-${theme}-900 bg-opacity-90 rounded-lg overflow-hidden shadow-lg border border-${theme}-700`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Header */}
        <div className={`p-3 bg-${theme}-800 flex items-center justify-between border-b border-${theme}-700`}>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full ${isTyping ? 'bg-green-500 animate-pulse' : 'bg-gray-500'} mr-2`}></div>
            <h3 className={`text-sm font-medium ${isGlitching ? 'text-red-400' : 'text-white'}`}>
              {isGlitching ? (
                <TextScrambler text={getNarratorName()} chaosMultiplier={2} />
              ) : (
                getNarratorName()
              )}
            </h3>
          </div>
          <div className="text-xs text-gray-400">
            v{Math.floor(spiralDepth + chaosLevel)}.{Math.floor(Math.random() * 9)}.{Math.floor(Math.random() * 9)}
          </div>
        </div>
        
        {/* Message history */}
        <div 
          className="p-3 h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
          style={{ 
            scrollbarWidth: 'thin', 
            scrollbarColor: 'rgba(75, 85, 99, 0.5) transparent' 
          }}
        >
          {messages.length === 0 ? (
            <div className="text-gray-500 text-sm italic">No messages yet...</div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={index}
                className={`mb-3 ${
                  msg.type === 'system' ? '' :
                  msg.type === 'helpful' ? 'text-blue-400' :
                  msg.type === 'passive-aggressive' ? 'text-yellow-400' :
                  msg.type === 'existential' ? 'text-purple-400' :
                  'text-red-400'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {msg.type === 'system' ? 'System' :
                   msg.type === 'helpful' ? 'Assistant' :
                   msg.type === 'passive-aggressive' ? 'Monitor' :
                   msg.type === 'existential' ? 'Observer' :
                   'ERROR://'}
                </div>
                <div className="text-sm">
                  {msg.type === 'unhinged' ? (
                    <TextScrambler text={msg.text} chaosMultiplier={1.5} />
                  ) : (
                    msg.text
                  )}
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div 
              className="px-3 py-2 border-t border-gray-700 text-gray-400 text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EvolvingNarrator; 
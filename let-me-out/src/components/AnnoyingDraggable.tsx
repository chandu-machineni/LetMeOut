import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { AppContext } from '../context/AppContext';

interface AnnoyingDraggableProps {
  chaosLevel?: number;
}

const AnnoyingDraggable: React.FC<AnnoyingDraggableProps> = ({ chaosLevel = 1 }) => {
  const { theme } = useContext(AppContext);
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const dragRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<string[]>([
    "Drag me away!",
    "You can't get rid of me!",
    "I'll always come back!",
    "Nice try!",
    "Almost got me!",
    "Try harder!",
    "Not even close!"
  ]);
  const [currentMessage, setCurrentMessage] = useState<string>(messages[0]);
  const [hasEscaped, setHasEscaped] = useState(false);
  const [escapeAttempts, setEscapeAttempts] = useState(0);

  // Update window size on resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle drag end - make the draggable return to a random position
  const handleDragEnd = () => {
    setIsDragging(false);
    setEscapeAttempts(prev => prev + 1);
    
    // If the user has escaped a few times, set hasEscaped to true
    if (escapeAttempts >= 3 + chaosLevel) {
      setHasEscaped(true);
      
      // Reset after a timeout
      setTimeout(() => {
        setHasEscaped(false);
        setEscapeAttempts(0);
      }, 10000);
    }
    
    // Don't move back if user has "escaped" temporarily
    if (hasEscaped) return;
    
    // Calculate new random position, biased towards the mouse cursor center
    const randomX = Math.random() * (windowSize.width - 200);
    const randomY = Math.random() * (windowSize.height - 200);
    
    // Update the message
    setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
    
    // Animate to the new position
    controls.start({
      x: randomX,
      y: randomY,
      transition: { 
        type: "spring", 
        damping: 10, 
        stiffness: 100,
        duration: 0.5
      }
    });
  };

  // Move the element occasionally even if not being dragged
  useEffect(() => {
    // Skip if user has "escaped" temporarily
    if (hasEscaped) return;
    
    const interval = setInterval(() => {
      if (!isDragging && Math.random() > 0.7) {
        const randomX = Math.random() * (windowSize.width - 200);
        const randomY = Math.random() * (windowSize.height - 200);
        
        controls.start({
          x: randomX,
          y: randomY,
          transition: { 
            type: "spring", 
            damping: 15, 
            stiffness: 100 
          }
        });
      }
    }, 3000 + (5 - chaosLevel) * 1000); // Move more frequently at higher chaos levels
    
    return () => clearInterval(interval);
  }, [isDragging, windowSize, controls, chaosLevel, hasEscaped]);

  // Make it follow cursor occasionally
  useEffect(() => {
    if (hasEscaped) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Only follow cursor if not being dragged and randomly
      if (!isDragging && Math.random() > 0.9 - (chaosLevel * 0.05)) {
        // Calculate position while keeping element within viewport
        const x = Math.max(0, Math.min(e.clientX - 100, windowSize.width - 200));
        const y = Math.max(0, Math.min(e.clientY - 50, windowSize.height - 200));
        
        controls.start({
          x,
          y,
          transition: { 
            type: "spring", 
            damping: 20,
            stiffness: 400,
            duration: 0.2
          }
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isDragging, windowSize, controls, chaosLevel, hasEscaped]);

  // Only show at higher chaos levels
  if (chaosLevel < 2) return null;

  return (
    <motion.div
      ref={dragRef}
      className={`fixed z-40 flex flex-col items-center justify-center p-4 rounded-lg shadow-lg cursor-grab active:cursor-grabbing
                 bg-${theme}-800 border-2 border-${theme}-600 text-white
                 ${hasEscaped ? 'opacity-30 pointer-events-none' : ''}`}
      drag
      dragMomentum={false}
      animate={controls}
      initial={{ x: windowSize.width / 2 - 100, y: windowSize.height / 2 - 100 }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.1 }}
      style={{ width: '200px' }}
    >
      <div className="text-center">
        <div className={`flex justify-between items-center mb-2 text-${theme}-300`}>
          <div className="text-xs font-mono">DIALOG.sys</div>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
        
        <motion.p
          className="mb-3 font-medium"
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {currentMessage}
        </motion.p>
        
        {chaosLevel >= 3 && (
          <div className="flex justify-center space-x-2 mt-2">
            <button 
              className={`px-2 py-1 bg-${theme}-700 hover:bg-${theme}-600 rounded text-sm`}
              onClick={(e) => {
                e.stopPropagation();
                const randomX = Math.random() * (windowSize.width - 200);
                const randomY = Math.random() * (windowSize.height - 200);
                controls.start({ x: randomX, y: randomY });
              }}
            >
              Close
            </button>
            
            <motion.button 
              className={`px-2 py-1 bg-${theme}-700 hover:bg-${theme}-600 rounded text-sm`}
              whileHover={{ 
                x: Math.random() * 40 - 20,
                y: Math.random() * 40 - 20,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              Dismiss
            </motion.button>
          </div>
        )}
        
        {chaosLevel >= 4 && !hasEscaped && (
          <div className="mt-2 text-xs text-gray-400">
            Escape attempts: {escapeAttempts}/{3 + chaosLevel}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnnoyingDraggable; 
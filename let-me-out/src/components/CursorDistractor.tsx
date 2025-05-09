import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';

interface CursorDistractorProps {
  chaosLevel?: number;
}

const CursorDistractor: React.FC<CursorDistractorProps> = ({ chaosLevel = 1 }) => {
  const { theme } = useContext(AppContext);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [distractionType, setDistractionType] = useState<'follower' | 'popup' | 'trail' | 'avoidance'>('follower');
  const [popupMessage, setPopupMessage] = useState('');
  const [trailPositions, setTrailPositions] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [trailCounter, setTrailCounter] = useState(0);
  const [avoidanceElements, setAvoidanceElements] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [avoidanceCounter, setAvoidanceCounter] = useState(0);
  
  const messageOptions = [
    'Click here for a discount!',
    'Don\'t forget to subscribe!',
    'You won\'t believe this offer!',
    'Last chance to upgrade!',
    'Are you sure you want to leave?',
    'Special offer just for you!',
    'WARNING: Your account needs attention!',
    'Urgent: Action required!'
  ];
  
  // Initialize with random distraction type based on chaos level
  useEffect(() => {
    const types: Array<'follower' | 'popup' | 'trail' | 'avoidance'> = [
      'follower', 
      'popup', 
      'trail', 
      'avoidance'
    ];
    
    // Higher chaos level means more chance of annoying distractions
    const typeIndex = Math.min(Math.floor(Math.random() * (chaosLevel + 1)), types.length - 1);
    setDistractionType(types[typeIndex]);
    
    // Only show after a delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [chaosLevel]);
  
  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Update CSS variables for other components to use
      document.documentElement.style.setProperty('--mouse-x', e.clientX.toString());
      document.documentElement.style.setProperty('--mouse-y', e.clientY.toString());
      
      // For trail type, add positions
      if (distractionType === 'trail' && isVisible) {
        if (trailCounter % 5 === 0) { // Only add every 5 moves to avoid too many elements
          setTrailPositions(prev => {
            const newPositions = [...prev, { x: e.clientX, y: e.clientY, id: trailCounter }];
            // Keep only the last 20 positions
            if (newPositions.length > 20) {
              return newPositions.slice(newPositions.length - 20);
            }
            return newPositions;
          });
        }
        setTrailCounter(prev => prev + 1);
      }
      
      // For avoidance type, add elements that avoid the cursor
      if (distractionType === 'avoidance' && isVisible && avoidanceCounter % 50 === 0) {
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;
        
        setAvoidanceElements(prev => {
          const newElements = [...prev, { x: randomX, y: randomY, id: avoidanceCounter }];
          // Keep only the last 10 elements
          if (newElements.length > 10) {
            return newElements.slice(newElements.length - 10);
          }
          return newElements;
        });
      }
      setAvoidanceCounter(prev => prev + 1);
    };
    
    // Handle click for popup distraction
    const handleClick = () => {
      if (distractionType === 'popup' && isVisible && Math.random() < 0.3) {
        // 30% chance to show popup on click
        setPopupMessage(messageOptions[Math.floor(Math.random() * messageOptions.length)]);
        
        // Hide after delay
        setTimeout(() => {
          setPopupMessage('');
        }, 3000);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [distractionType, isVisible, trailCounter, avoidanceCounter, messageOptions]);
  
  // Calculate distance for avoidance elements
  const calculateNewPosition = (elementX: number, elementY: number) => {
    const dx = mousePosition.x - elementX;
    const dy = mousePosition.y - elementY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Only avoid if cursor is close
    if (distance < 200) {
      // Move away from cursor
      const angle = Math.atan2(dy, dx);
      const newX = elementX - Math.cos(angle) * (200 - distance) * 0.1;
      const newY = elementY - Math.sin(angle) * (200 - distance) * 0.1;
      
      // Ensure elements stay on screen
      return {
        x: Math.max(20, Math.min(window.innerWidth - 20, newX)),
        y: Math.max(20, Math.min(window.innerHeight - 20, newY))
      };
    }
    
    return { x: elementX, y: elementY };
  };
  
  if (!isVisible) return null;
  
  return (
    <>
      {/* Follower distraction */}
      {distractionType === 'follower' && (
        <motion.div
          className={`fixed pointer-events-none z-50 flex items-center justify-center w-12 h-12 rounded-full bg-${theme}-500 text-white font-bold text-xs shadow-lg`}
          animate={{ 
            x: mousePosition.x - 24, 
            y: mousePosition.y - 24,
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            x: { type: 'spring', damping: 10, stiffness: 100 },
            y: { type: 'spring', damping: 10, stiffness: 100 },
            scale: { duration: 2, repeat: Infinity },
            rotate: { duration: 2, repeat: Infinity }
          }}
        >
          <span>Click!</span>
        </motion.div>
      )}
      
      {/* Popup distraction */}
      {distractionType === 'popup' && (
        <AnimatePresence>
          {popupMessage && (
            <motion.div
              className={`fixed pointer-events-none z-50 p-3 rounded-lg bg-${theme}-500 text-white max-w-xs shadow-lg`}
              initial={{ opacity: 0, y: 20, x: mousePosition.x, scale: 0.8 }}
              animate={{ opacity: 1, y: mousePosition.y - 80, x: mousePosition.x - 100, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <div className="font-bold">{popupMessage}</div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {/* Trail distraction */}
      {distractionType === 'trail' && (
        <>
          {trailPositions.map((position, index) => {
            const size = Math.max(5, 20 - index); // Size decreases with age
            const opacity = Math.max(0.1, 1 - (index / 20)); // Opacity decreases with age
            
            return (
              <motion.div
                key={position.id}
                className={`fixed pointer-events-none rounded-full bg-${theme}-${Math.floor(opacity * 500)}`}
                initial={{ width: size, height: size, x: position.x - size / 2, y: position.y - size / 2, opacity }}
                animate={{ 
                  width: size, 
                  height: size, 
                  opacity: [opacity, 0],
                  x: position.x - size / 2, 
                  y: position.y - size / 2
                }}
                transition={{ duration: 1 }}
              />
            );
          })}
        </>
      )}
      
      {/* Avoidance elements */}
      {distractionType === 'avoidance' && (
        <>
          {avoidanceElements.map((element) => {
            const newPos = calculateNewPosition(element.x, element.y);
            
            return (
              <motion.div
                key={element.id}
                className={`fixed z-50 px-3 py-1 rounded-full text-xs bg-${theme}-500 text-white shadow-lg cursor-pointer flex items-center justify-center`}
                animate={{ 
                  x: newPos.x, 
                  y: newPos.y,
                  transition: { 
                    type: 'spring', 
                    damping: 15,
                    stiffness: 150
                  }
                }}
                whileHover={{ scale: 1.1 }}
                onClick={() => alert('You caught me! But there are more...')}
              >
                {Math.random() > 0.5 ? '🎁' : '👋'} Click me!
              </motion.div>
            );
          })}
        </>
      )}
    </>
  );
};

export default CursorDistractor; 
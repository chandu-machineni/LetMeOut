import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { AppContext } from '../context/AppContext';

interface ImpossibleCheckboxProps {
  label: string;
  id?: string;
  required?: boolean;
  chaosMultiplier?: number;
  minChaosToActivate?: number;
  className?: string;
  initialChecked?: boolean;
  onChange?: (checked: boolean) => void;
  allowEventualSuccess?: boolean;
  successAfterAttempts?: number;
}

const ImpossibleCheckbox: React.FC<ImpossibleCheckboxProps> = ({
  label,
  id,
  required = false,
  chaosMultiplier = 1,
  minChaosToActivate = 1,
  className = '',
  initialChecked = false,
  onChange,
  allowEventualSuccess = true,
  successAfterAttempts = 5,
}) => {
  const { chaosLevel, theme } = useContext(AppContext);
  const [isChecked, setIsChecked] = useState<boolean>(initialChecked);
  const [clickAttempts, setClickAttempts] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  const [checkboxSize, setCheckboxSize] = useState<{ width: number, height: number }>({ width: 0, height: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const checkboxRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  
  // Generate a random ID if not provided
  const checkboxId = id || `impossible-checkbox-${Math.random().toString(36).substring(2, 9)}`;
  
  // Calculate effective chaos level (accounting for multiplier and minimum threshold)
  const effectiveChaos = Math.max(0, (chaosLevel * chaosMultiplier) - minChaosToActivate);
  
  // Update container and checkbox size on mount and resize
  useEffect(() => {
    const updateSizes = () => {
      if (containerRef.current && checkboxRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
        
        setCheckboxSize({
          width: checkboxRef.current.offsetWidth,
          height: checkboxRef.current.offsetHeight,
        });
      }
    };
    
    updateSizes();
    window.addEventListener('resize', updateSizes);
    
    return () => {
      window.removeEventListener('resize', updateSizes);
    };
  }, []);
  
  // Determine if the checkbox should move away
  const shouldEvade = () => {
    if (effectiveChaos <= 0) return false;
    if (allowEventualSuccess && clickAttempts >= successAfterAttempts) return false;
    
    // Higher chaos levels = higher chance to evade
    const evadeChance = Math.min(0.5 + (effectiveChaos * 0.1), 0.95);
    return Math.random() < evadeChance;
  };
  
  // Calculate a new random position that's within bounds
  const getNewPosition = () => {
    if (containerSize.width === 0 || containerSize.height === 0) return { x: 0, y: 0 };
    
    // Calculate max distances to move
    const maxX = containerSize.width - checkboxSize.width;
    const maxY = containerSize.height - checkboxSize.height;
    
    // Calculate new position ensuring it's not too close to current position
    let newX, newY;
    const minDistance = Math.min(containerSize.width, containerSize.height) * 0.25;
    
    do {
      newX = Math.random() * maxX - maxX / 2;
      newY = Math.random() * maxY - maxY / 2;
    } while (
      Math.sqrt(Math.pow(newX - position.x, 2) + Math.pow(newY - position.y, 2)) < minDistance
    );
    
    return { x: newX, y: newY };
  };
  
  // Handle click attempt
  const handleClickAttempt = () => {
    setClickAttempts(prev => prev + 1);
    
    if (shouldEvade()) {
      // Move the checkbox to a new position
      const newPosition = getNewPosition();
      
      // Higher chaos levels = quicker movements
      const speed = 0.2 - (Math.min(effectiveChaos, 4) * 0.05);
      
      controls.start({
        x: newPosition.x,
        y: newPosition.y,
        transition: { duration: speed, type: 'spring', damping: 15 }
      });
      
      setPosition(newPosition);
    } else {
      // Allow the click through
      setIsChecked(!isChecked);
      if (onChange) onChange(!isChecked);
      
      // Visual feedback of success
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.3 }
      });
    }
  };
  
  // Handle hover behavior
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // At high chaos levels, sometimes evade on hover
    if (effectiveChaos >= 3 && Math.random() < 0.4) {
      const newPosition = getNewPosition();
      
      controls.start({
        x: newPosition.x,
        y: newPosition.y,
        transition: { duration: 0.1 }
      });
      
      setPosition(newPosition);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center cursor-pointer min-h-[40px] ${className}`}
      style={{ 
        minHeight: '40px',
        display: 'flex'
      }}
    >
      <div className="relative flex-1 pl-8 min-h-[40px]">
        <motion.div
          ref={checkboxRef}
          className={`absolute left-0 top-0 flex items-center justify-center w-6 h-6 border-2 rounded
                     ${isChecked ? `bg-${theme}-500 border-${theme}-600` : `border-${theme}-400`}`}
          animate={controls}
          initial={{ x: 0, y: 0 }}
          whileHover={effectiveChaos < 2 ? { scale: 1.05 } : {}}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClickAttempt}
        >
          {isChecked && (
            <motion.svg 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
            >
              <motion.path
                d="M5 12l5 5L20 7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.svg>
          )}
        </motion.div>
        
        <label 
          htmlFor={checkboxId}
          className="cursor-pointer select-none flex items-center min-h-[40px]"
        >
          {label} {required && <span className="text-red-500 ml-1">*</span>}
          
          {/* Show success hint after enough attempts */}
          {allowEventualSuccess && clickAttempts >= Math.floor(successAfterAttempts * 0.7) && clickAttempts < successAfterAttempts && (
            <span className="ml-2 text-xs text-gray-400 italic">
              (Almost there, keep trying...)
            </span>
          )}
        </label>
      </div>
      
      {/* Add frustration counter at high chaos levels */}
      {effectiveChaos >= 3 && clickAttempts > 0 && (
        <div className="text-xs text-gray-500 ml-2">
          Attempts: {clickAttempts}
        </div>
      )}
      
      {/* Add invisible input for form submission */}
      <input
        type="checkbox"
        id={checkboxId}
        checked={isChecked}
        onChange={() => {}} // Controlled by our custom handler
        className="sr-only"
        required={required}
      />
      
      {/* Cheat hint if the user has tried many times */}
      {clickAttempts > successAfterAttempts * 1.5 && (
        <motion.div 
          className="absolute -bottom-4 left-8 text-xs text-gray-400 opacity-70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.5 }}
        >
          Press Tab to focus, then Space to toggle
        </motion.div>
      )}
    </div>
  );
};

export default ImpossibleCheckbox; 
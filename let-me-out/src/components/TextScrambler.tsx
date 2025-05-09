import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';

interface TextScramblerProps {
  text: string;
  className?: string;
  chaosMultiplier?: number;
  as?: React.ElementType;
  glitchOnHover?: boolean;
  preserveLength?: boolean;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
}

const TextScrambler: React.FC<TextScramblerProps> = ({
  text,
  className = '',
  chaosMultiplier = 1,
  as: Component = 'span',
  glitchOnHover = false,
  preserveLength = true,
  disableAnimations = false,
  style,
}) => {
  const { chaosLevel } = useContext(AppContext);
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  
  // Characters to use for scrambling
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`"\'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  useEffect(() => {
    // Only scramble if chaos level is high enough or if hovering and glitchOnHover is true
    const shouldScramble = chaosLevel * chaosMultiplier > 1 || (glitchOnHover && isHovering);
    
    // Handle text updates gracefully
    if (text !== displayText && !isGlitching) {
      setDisplayText(text);
    }
    
    if (!shouldScramble) {
      setDisplayText(text);
      return;
    }
    
    // Calculate intensity based on chaos level
    const intensity = Math.min((chaosLevel * chaosMultiplier - 1) / 4, 1) * (isHovering && glitchOnHover ? 0.8 : 0.3);
    
    // Scramble function that preserves spaces and some punctuation
    const scrambleText = () => {
      return text.split('').map(char => {
        // Preserve spaces and some punctuation
        if (char === ' ' || char === '.' || char === ',' || char === '!' || char === '?') {
          return char;
        }
        
        // Random chance to glitch based on intensity
        if (Math.random() < intensity) {
          const randomChar = glitchChars.charAt(Math.floor(Math.random() * glitchChars.length));
          return randomChar;
        }
        
        return char;
      }).join('');
    };
    
    // Periodically scramble the text
    const intervalId = setInterval(() => {
      setIsGlitching(true);
      setDisplayText(scrambleText());
      
      // Reset glitching flag
      setTimeout(() => {
        setIsGlitching(false);
      }, 100);
    }, disableAnimations ? 10000 : 2000 - (chaosLevel * chaosMultiplier * 200));
    
    return () => clearInterval(intervalId);
  }, [text, chaosLevel, isHovering, chaosMultiplier, glitchOnHover, disableAnimations]);
  
  // Random chance to add short glitch effect
  useEffect(() => {
    if (disableAnimations || chaosLevel * chaosMultiplier < 3) return;
    
    const randomGlitchInterval = setInterval(() => {
      if (Math.random() < 0.1 * chaosLevel * chaosMultiplier) {
        setIsGlitching(true);
        
        setTimeout(() => {
          setIsGlitching(false);
        }, 50 + Math.random() * 200);
      }
    }, 3000);
    
    return () => clearInterval(randomGlitchInterval);
  }, [chaosLevel, chaosMultiplier, disableAnimations]);
  
  // Handle hover events
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // Add immediate glitch effect on hover if glitchOnHover is true
    if (glitchOnHover) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  return (
    <Component
      className={`${className} ${isGlitching ? 'text-glitch' : ''}`}
      style={{
        ...style,
        textShadow: isGlitching ? '0.05em 0 0 rgba(255,0,0,0.75), -0.025em -0.05em 0 rgba(0,255,0,0.75), 0.025em 0.05em 0 rgba(0,0,255,0.75)' : 'none',
        animation: isGlitching ? 'glitch 0.3s infinite' : 'none',
        position: 'relative',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
      
      {/* Micro-glitch animated layers for more corruption effects */}
      {!disableAnimations && chaosLevel * chaosMultiplier >= 4 && isGlitching && (
        <>
          <style>
            {`
            @keyframes glitch {
              0% { transform: translate(0) }
              20% { transform: translate(-2px, 2px) }
              40% { transform: translate(-2px, -2px) }
              60% { transform: translate(2px, 2px) }
              80% { transform: translate(2px, -2px) }
              100% { transform: translate(0) }
            }
            
            .text-glitch-layer {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              opacity: 0.8;
            }
            `}
          </style>
          
          <motion.span
            className="text-glitch-layer"
            style={{
              color: 'rgba(255,0,0,0.7)',
              left: '2px',
              textShadow: 'none',
            }}
            animate={{
              x: [0, -3, 1, -2, 0],
              opacity: [0.5, 0.7, 0.3, 0.6, 0.5],
            }}
            transition={{
              duration: 0.2,
              repeat: 5,
              repeatType: 'reverse',
            }}
            aria-hidden="true"
          >
            {displayText}
          </motion.span>
          
          <motion.span
            className="text-glitch-layer"
            style={{
              color: 'rgba(0,255,255,0.7)',
              left: '-2px',
              textShadow: 'none',
            }}
            animate={{
              x: [0, 3, -1, 2, 0],
              opacity: [0.5, 0.3, 0.7, 0.4, 0.5],
            }}
            transition={{
              duration: 0.3,
              repeat: 5,
              repeatType: 'reverse',
            }}
            aria-hidden="true"
          >
            {displayText}
          </motion.span>
        </>
      )}
    </Component>
  );
};

export default TextScrambler; 
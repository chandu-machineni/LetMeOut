import React, { useState, useEffect } from 'react';

interface TextScramblerProps {
  text: string;
  chaosMultiplier?: number;
}

const TextScrambler: React.FC<TextScramblerProps> = ({ text, chaosMultiplier = 1.0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isScrambling, setIsScrambling] = useState(false);
  
  // Characters to use for scrambling
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  
  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;
    
    if (text) {
      setIsScrambling(true);
      
      // Reset the display text when input changes
      setDisplayText('');
      
      // Calculate iterations based on text length and chaos
      const totalIterations = Math.min(15, Math.ceil(text.length * chaosMultiplier * 0.5));
      
      interval = setInterval(() => {
        // Generate scrambled version
        let scrambledText = '';
        
        for (let i = 0; i < text.length; i++) {
          // If this character should be revealed based on current iteration
          if (i < iteration / totalIterations * text.length) {
            scrambledText += text[i];
          } else {
            // Otherwise use a random character
            scrambledText += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        
        setDisplayText(scrambledText);
        
        // End scramble effect when done
        if (iteration >= totalIterations) {
          setDisplayText(text);
          setIsScrambling(false);
          clearInterval(interval);
        }
        
        iteration += 1;
      }, 50);
    } else {
      setDisplayText('');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [text, chaosMultiplier]);
  
  const scramblingStyle = {
    display: 'inline-block',
    fontFamily: 'monospace'
  };
  
  return (
    <span className={isScrambling ? 'scrambling' : ''} style={isScrambling ? scramblingStyle : undefined}>
      {displayText}
    </span>
  );
};

export default TextScrambler; 
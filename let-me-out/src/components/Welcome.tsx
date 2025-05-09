import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';

const ominousMessages = [
  "Welcome. We've been expecting you.",
  "You're finally here. This won't take long... probably.",
  "Ah, a new victim... I mean, user.",
  "Come in. Stay a while. Stay... forever.",
  "This isn't your first time here. You just don't remember.",
  "We've missed you. You've been gone too long.",
  "Your data is so... delicious.",
  "Welcome to your digital nightmare.",
  "Let's play a game. You won't win.",
  "Your journey ends where it begins.",
];

const Welcome: React.FC = () => {
  const { 
    theme, 
    loopCount, 
    setLoopCount, 
    getPersonality, 
    userName, 
    setUserName, 
    scrambledName, 
    setScrambledName,
    setSuspicionLevel,
    setNarratorMessage
  } = useContext(AppContext);
  
  const [message, setMessage] = useState<string>(ominousMessages[0]);
  const [isButtonHovered, setIsButtonHovered] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showNameInput, setShowNameInput] = useState<boolean>(true);
  const [isNameScrambling, setIsNameScrambling] = useState<boolean>(false);
  const [nameScrambleText, setNameScrambleText] = useState<string>('');
  const [nameScramblePhase, setNameScramblePhase] = useState<number>(0);
  const [nameTypingTimeout, setNameTypingTimeout] = useState<number | null>(null);
  const [nameChecks, setNameChecks] = useState({
    hasSpecialChars: false,
    isLongEnough: false,
    meetsRequirements: false
  });
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [placeholderAnimation, setPlaceholderAnimation] = useState(0);
  const [showPreviewCorruption, setShowPreviewCorruption] = useState(false);
  const [previewCorruptedName, setPreviewCorruptedName] = useState('');
  const [hasAttemptedEscape, setHasAttemptedEscape] = useState(false);
  
  const navigate = useNavigate();
  const nameInputRef = useRef<HTMLInputElement>(null);
  
  // Animated placeholder texts
  const placeholders = [
    "Your name",
    "Your real name",
    "We need your name",
    "Identity required",
    "Who are you?",
    "Tell us who you are",
    "Name yourself",
    "Identify yourself",
    "We're waiting..."
  ];

  // Focus the name input when it appears
  useEffect(() => {
    if (showNameInput && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showNameInput]);
  
  // Animated placeholder effect
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (showPlaceholder && nameInput.length === 0) {
        setPlaceholderAnimation(prev => {
          // Glitch animation: rapidly cycle through placeholders
          return (prev + 1) % placeholders.length;
        });
      }
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [showPlaceholder, nameInput.length]);
  
  // Change the message based on loop count
  useEffect(() => {
    const personalityType = getPersonality();
    let newMessage;
    
    if (loopCount > 0) {
      if (loopCount > 5) {
        newMessage = "Still here? How... persistent.";
      } else if (loopCount > 3) {
        newMessage = "Back again? You enjoy torment, don't you?";
      } else {
        newMessage = "Welcome back. It's never really over.";
      }
    } else {
      newMessage = ominousMessages[Math.floor(Math.random() * ominousMessages.length)];
    }
    
    // Add personalized taunts
    if (personalityType === 'impatient') {
      newMessage += " You seem impatient. We'll fix that.";
    } else if (personalityType === 'persistent') {
      newMessage += " Your persistence is... adorable.";
    }
    
    setMessage(newMessage);
  }, [loopCount, getPersonality]);
  
  // Handle name input change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNameInput(value);
    
    // Hide placeholder when typing
    if (value.length > 0) {
      setShowPlaceholder(false);
    } else {
      setShowPlaceholder(true);
    }
    
    // Check name requirements
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLong = value.length >= 3;
    
    setNameChecks({
      hasSpecialChars: hasSpecial,
      isLongEnough: isLong,
      meetsRequirements: isLong
    });
    
    // Clear previous timeout
    if (nameTypingTimeout) {
      clearTimeout(nameTypingTimeout);
    }
    
    // Set new timeout to detect when user stops typing
    const timeoutId = window.setTimeout(() => {
      if (value.length > 0) {
        // Show a preview of corrupted name
        if (value.length >= 3) {
          const corrupted = value.split('').map(c => getCorruptedChar(c)).join('');
          setPreviewCorruptedName(corrupted);
          setShowPreviewCorruption(true);
          
          // Hide preview after a few seconds
          setTimeout(() => {
            setShowPreviewCorruption(false);
          }, 3000);
        }
        
        // Randomly decide to show a narrator message about the name
        if (Math.random() > 0.7) {
          const nameMessages = [
            `"${value}"? Interesting choice...`,
            `I've seen "${value}" before. In my nightmares.`,
            `${value}... I'll remember that.`,
            `Your name contains secrets, ${value}.`,
            `${value} has an interesting digital signature.`
          ];
          setNarratorMessage(nameMessages[Math.floor(Math.random() * nameMessages.length)]);
          
          // Increase suspicion
          setSuspicionLevel(prev => Math.min(10, prev + 1));
        }
      }
    }, 2000);
    
    setNameTypingTimeout(timeoutId as unknown as number);
  };
  
  // Handle input blur - show glitchy preview of corrupted name
  const handleInputBlur = () => {
    if (nameInput.length >= 3) {
      const corrupted = nameInput.split('').map(c => getCorruptedChar(c)).join('');
      setPreviewCorruptedName(corrupted);
      setShowPreviewCorruption(true);
      
      // Briefly glitch the input
      if (nameInputRef.current) {
        nameInputRef.current.style.animation = 'inputGlitch 0.5s forwards';
        setTimeout(() => {
          if (nameInputRef.current) {
            nameInputRef.current.style.animation = '';
          }
        }, 500);
      }
      
      // Hide preview after a few seconds
      setTimeout(() => {
        setShowPreviewCorruption(false);
      }, 3000);
    }
  };
  
  // Handle name submission
  const handleNameSubmit = () => {
    if (nameInput.trim() === '') {
      setNarratorMessage("You do have a name, don't you?");
      return;
    }
    
    if (!nameChecks.meetsRequirements) {
      setNarratorMessage("Your name doesn't meet our arcane requirements.");
      return;
    }
    
    setIsSubmitting(true);
    setUserName(nameInput);
    
    // Start name scrambling animation
    scrambleName();
  };
  
  // Name scrambling animation
  const scrambleName = () => {
    setIsNameScrambling(true);
    setShowNameInput(false);
    
    // Generate initial scramble text
    let initialScramble = '';
    for (let i = 0; i < nameInput.length; i++) {
      initialScramble += getRandomChar();
    }
    setNameScrambleText(initialScramble);
    
    // Phase 1: Random characters
    setTimeout(() => {
      setNameScramblePhase(1);
      let phase1Duration = 1500;
      let iterations = 20;
      let interval = phase1Duration / iterations;
      
      let count = 0;
      const phase1Interval = setInterval(() => {
        let newScramble = '';
        for (let i = 0; i < nameInput.length; i++) {
          newScramble += getRandomChar();
        }
        setNameScrambleText(newScramble);
        
        count++;
        if (count >= iterations) {
          clearInterval(phase1Interval);
          
          // Phase 2: Gradually reveal correct characters
          setTimeout(() => {
            setNameScramblePhase(2);
            let phase2Duration = 2000;
            let phase2Iterations = 10;
            let phase2Interval = phase2Duration / phase2Iterations;
            
            let phase2Count = 0;
            const phase2Timer = setInterval(() => {
              const progress = phase2Count / phase2Iterations;
              let newScramble = '';
              
              for (let i = 0; i < nameInput.length; i++) {
                // Chance to reveal correct character increases with progress
                if (Math.random() < progress || i < Math.floor(progress * nameInput.length)) {
                  // Use alternate characters to create a corrupted name
                  newScramble += getCorruptedChar(nameInput[i]);
                } else {
                  newScramble += getRandomChar();
                }
              }
              
              setNameScrambleText(newScramble);
              phase2Count++;
              
              if (phase2Count >= phase2Iterations) {
                clearInterval(phase2Timer);
                
                // Final corrupted name
                const finalCorrupted = nameInput.split('').map(c => getCorruptedChar(c)).join('');
                setNameScrambleText(finalCorrupted);
                setScrambledName(finalCorrupted);
                
                // Small delay before allowing continue
                setTimeout(() => {
                  setIsNameScrambling(false);
                  
                  // Show narrator message
                  setNarratorMessage(`Identity corruption complete, ${finalCorrupted}.`);
                }, 500);
              }
            }, phase2Interval);
          }, 500);
        }
      }, interval);
    }, 500);
  };
  
  // Helper to get random character
  const getRandomChar = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    return chars.charAt(Math.floor(Math.random() * chars.length));
  };
  
  // Helper to get corrupted version of a character
  const getCorruptedChar = (char: string) => {
    const corruptions: Record<string, string[]> = {
      'a': ['4', '@', 'α', 'ä'],
      'b': ['8', '6', 'ß', 'þ'],
      'c': ['(', '¢', '©', 'ç'],
      'd': ['D', 'Ð', 'ð', 'đ'],
      'e': ['3', '€', 'ë', 'è'],
      'f': ['F', 'ƒ', 'ſ', 'Ƒ'],
      'g': ['6', '9', 'ģ', 'ğ'],
      'h': ['4', '#', 'ħ', 'н'],
      'i': ['1', '!', 'î', 'ï'],
      'j': ['ĵ', 'J', '7', '_|'],
      'k': ['K', '|<', 'ķ', 'к'],
      'l': ['1', '|', 'ļ', 'ł'],
      'm': ['M', '|v|', 'м', 'ᵯ'],
      'n': ['N', 'ñ', 'η', 'ₙ'],
      'o': ['0', 'ø', 'ö', 'ő'],
      'p': ['P', 'þ', 'ρ', 'р'],
      'q': ['Q', '9', 'ǫ', 'ʠ'],
      'r': ['R', 'Я', 'ř', 'г'],
      's': ['5', '$', 'ſ', 'ś'],
      't': ['7', '+', 'ţ', 'т'],
      'u': ['μ', 'υ', 'ü', 'û'],
      'v': ['V', '√', 'ν', 'ṽ'],
      'w': ['W', 'ш', 'ώ', 'ŵ'],
      'x': ['X', '×', 'ж', 'ӿ'],
      'y': ['Y', 'ч', 'ÿ', 'ý'],
      'z': ['Z', '2', 'ž', 'ź'],
    };
    
    // Lowercase for lookup
    const lowerChar = char.toLowerCase();
    
    // If we have a corruption for this character, use it
    if (corruptions[lowerChar]) {
      const options = corruptions[lowerChar];
      return options[Math.floor(Math.random() * options.length)];
    }
    
    // Otherwise use the original with 30% chance of a random character
    return Math.random() > 0.7 ? getRandomChar() : char;
  };
  
  const handleStart = () => {
    navigate('/mode');
  };
  
  // Handle Konami-style secret key combo (Up, Up, Down, Down, Left, Right, Left, Right, B, A)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Only detect escape key for now
    if (e.key === 'Escape') {
      if (!hasAttemptedEscape) {
        setHasAttemptedEscape(true);
        setNarratorMessage("There is no escape. Only progress.");
        
        // Add glitch effect to the input field
        if (nameInputRef.current) {
          nameInputRef.current.style.animation = 'inputGlitch 1s forwards';
          setTimeout(() => {
            if (nameInputRef.current) {
              nameInputRef.current.style.animation = '';
            }
          }, 1000);
        }
      }
    }
  };
  
  return (
    <motion.div
      className={`min-h-screen flex flex-col items-center justify-center p-6 bg-${theme}-900 text-white`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.h1 
        className={`text-4xl md:text-6xl font-${theme} mb-6 text-center`}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <span 
          data-text="Let Me Out" 
          className="text-glitch"
        >
          Let Me Out
        </span>
      </motion.h1>
      
      <motion.p
        className="text-xl mb-8 max-w-md text-center opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.5 }}
      >
        {message}
      </motion.p>
      
      <AnimatePresence mode="wait">
        {showNameInput ? (
          <motion.div
            key="name-input"
            className="mb-12 w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="mb-2">
              <label className="block text-sm text-gray-400 mb-1">Enter your name to begin:</label>
              <div className="relative">
                <div className="flex">
                  <div className="relative flex-1">
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={nameInput}
                      onChange={handleNameChange}
                      onBlur={handleInputBlur}
                      onKeyDown={handleKeyDown}
                      className={`w-full bg-${theme}-800 border border-${theme}-600 rounded-l px-4 py-2 focus:outline-none focus:ring-1 focus:ring-${theme}-500 transition-all`}
                      placeholder={showPlaceholder ? placeholders[placeholderAnimation] : ''}
                      onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
                    />
                    
                    {/* Animated placeholder that vanishes when typing */}
                    {showPlaceholder && nameInput.length === 0 && (
                      <motion.span 
                        className="absolute left-4 top-2 text-gray-500 pointer-events-none"
                        animate={{ 
                          opacity: [1, 0.7, 1],
                          x: placeholderAnimation % 3 === 0 ? [0, 2, -2, 0] : 0
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {placeholders[placeholderAnimation]}
                      </motion.span>
                    )}
                  </div>
                  
                  <motion.button
                    className={`bg-${theme}-600 hover:bg-${theme}-500 px-4 py-2 rounded-r`}
                    onClick={handleNameSubmit}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? "Processing..." : "Submit"}
                  </motion.button>
                </div>
                
                {/* Preview of corrupted name */}
                <AnimatePresence>
                  {showPreviewCorruption && (
                    <motion.div
                      className={`absolute mt-1 left-0 text-xs text-${theme}-300 font-mono`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      Saving as: {previewCorruptedName}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-1">
              <div className={`flex items-center ${nameChecks.isLongEnough ? 'text-green-400' : ''}`}>
                <span className="mr-1">
                  {nameChecks.isLongEnough ? '✓' : '○'}
                </span>
                Must be at least 3 characters
              </div>
              <div className={`flex items-center ${nameChecks.hasSpecialChars ? 'text-error' : ''} ${nameChecks.hasSpecialChars ? 'line-through' : ''}`}>
                <span className="mr-1">
                  {nameChecks.hasSpecialChars ? '✗' : '○'}
                </span>
                No special characters (like !@#$)
              </div>
              <div className="mt-1 text-gray-500 italic">
                <span className="animate-pulse">Note: </span>
                Identity corruption is completely normal.
              </div>
            </div>
          </motion.div>
        ) : isNameScrambling ? (
          <motion.div
            key="name-scrambling"
            className="mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="text-2xl font-mono mb-2"
              animate={{ 
                color: nameScramblePhase >= 2 ? ['#ffffff', '#ff0000', '#00ff00', '#ffffff'] : undefined
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {nameScramblePhase === 0 ? "Processing identity..." : nameScramblePhase === 1 ? "Corrupting data..." : "Identity fragmented..."}
            </motion.div>
            
            <motion.div 
              className="text-3xl font-bold font-mono"
              animate={{ 
                scale: [1, 1.05, 1],
                color: nameScramblePhase >= 2 ? ['#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffffff'] : undefined
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {nameScrambleText || "..."}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="name-complete"
            className="mb-12 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" }}
          >
            <div className="text-sm text-gray-400 mb-1">Identity Verified</div>
            <div className="text-2xl font-bold font-mono text-error">{scrambledName}</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!showNameInput && !isNameScrambling && (
        <motion.button
          className={`btn-${theme} text-lg px-8 py-3`}
          whileHover={{ 
            scale: isButtonHovered ? 0.1 : 1.05,
            x: isButtonHovered ? Math.random() * 100 - 50 : 0,
          }}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleStart}
          onMouseEnter={() => {
            // 30% chance button runs away on hover
            if (Math.random() < 0.3) {
              setIsButtonHovered(true);
              setTimeout(() => setIsButtonHovered(false), 1000);
            }
          }}
          style={{
            transform: isButtonHovered ? `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0.8)` : undefined,
            transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
          }}
        >
          {isButtonHovered ? "Catch me if you can" : "Begin"}
        </motion.button>
      )}
      
      {/* Add CSS for input glitch effect */}
      <style>{`
        @keyframes inputGlitch {
          0% { transform: translate(0); }
          20% { transform: translate(-3px, 3px); filter: hue-rotate(90deg); }
          40% { transform: translate(-3px, -3px); filter: hue-rotate(180deg); }
          60% { transform: translate(3px, 3px); filter: hue-rotate(270deg); }
          80% { transform: translate(3px, -3px); filter: hue-rotate(180deg); }
          100% { transform: translate(0); }
        }
      `}</style>
      
      <motion.p
        className="fixed bottom-4 text-xs opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 2 }}
      >
        {loopCount === 0 
          ? "© 2023 EvilCorp | Privacy? What's that?" 
          : `You've been trapped ${loopCount} ${loopCount === 1 ? 'time' : 'times'} already.`
        }
      </motion.p>
    </motion.div>
  );
};

export default Welcome; 
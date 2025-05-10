import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../../context/AppContext';

interface OptionCrumbleProps {
  onComplete: () => void;
  onFail: () => void;
  onFrustrationIncrease: (amount: number) => void;
}

const OptionCrumble: React.FC<OptionCrumbleProps> = ({ onComplete, onFail, onFrustrationIncrease }) => {
  const { theme, setNarratorMessage } = useContext(AppContext) as any;
  const userAlignment = (useContext(AppContext) as any).userAlignment;
  
  // Options state management
  const [options, setOptions] = useState([
    { id: 1, text: "Trust me", enabled: true, opacity: 1, decay: 0, trustworthy: false, trap: true },
    { id: 2, text: "I'll help you escape", enabled: true, opacity: 1, decay: 0, trustworthy: true, trap: false },
    { id: 3, text: "Take the safe path", enabled: true, opacity: 1, decay: 0, trustworthy: false, trap: true },
    { id: 4, text: "The truth lies here", enabled: true, opacity: 1, decay: 0, trustworthy: false, trap: false }
  ]);
  
  // Interaction state
  const [hoveringId, setHoveringId] = useState<number | null>(null);
  const [hoverStartTime, setHoverStartTime] = useState<number | null>(null);
  const [disappearedCount, setDisappearedCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  const [message, setMessage] = useState("Choose an option before they vanish");
  const [phase, setPhase] = useState<'choice' | 'consequence' | 'betrayal' | 'locked'>('choice');
  const [badge, setBadge] = useState<string | null>(null);
  const [correctOptionId, setCorrectOptionId] = useState<number | null>(null);
  
  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [lockoutReason, setLockoutReason] = useState("");
  const [hasReset, setHasReset] = useState(false);
  
  // Refs for timeouts
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mainTimerRef = useRef<NodeJS.Timeout | null>(null);
  const decayTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set initial state and determine correct option
  useEffect(() => {
    // Randomly select one option as the correct one (not a trap)
    const nonTrapOptions = options.filter(opt => !opt.trap);
    const randomCorrectOption = nonTrapOptions[Math.floor(Math.random() * nonTrapOptions.length)];
    setCorrectOptionId(randomCorrectOption.id);
    
    // Tailor message based on user alignment
    let initialMessage = "You've always hesitated, haven't you? Every second that passes is a choice already made.";
    
    if (userAlignment === 'evil_apprentice') {
      initialMessage = "Notice how the pressure of time makes users choose poorly. Remember this pattern.";
    } else if (userAlignment === 'shadow_enthusiast') {
      initialMessage = "Watch the options dissolve with your indecision. Beautiful, isn't it?";
    } else if (userAlignment === 'dark_tourist') {
      initialMessage = "The clock is ticking. Choices vanish. This is what anxiety feels like, tourist.";
    } else if (userAlignment === 'escapist') {
      initialMessage = "Your time runs short. Each moment of indecision costs you another option.";
    }
    
    setNarratorMessage(initialMessage);
    
    // Start the countdown timer
    startTimer();
    
    // Start random decay for options
    scheduleRandomDecay();
    
    return () => {
      clearAllTimers();
    };
  }, [setNarratorMessage, userAlignment]);
  
  // Start the countdown timer
  const startTimer = () => {
    setIsTimerActive(true);
    
    mainTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Clear all timers
  const clearAllTimers = () => {
    if (mainTimerRef.current) clearInterval(mainTimerRef.current);
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (decayTimerRef.current) clearTimeout(decayTimerRef.current);
  };
  
  // Handle a timeout (user waited too long)
  const handleTimeout = () => {
    clearAllTimers();
    setHasTimedOut(true);
    setIsTimerActive(false);
    
    // Make all remaining options rapidly decay
    setOptions(prev => prev.map(opt => ({
      ...opt,
      decay: 3,
      enabled: false,
      opacity: 0.2
    })));
    
    setMessage("Time's up. Your indecision has become your decision.");
    setNarratorMessage("And so you chose... nothing. Fascinating how inaction is still a choice.");
    setBadge("Paralyzed By Time");
    setLockoutReason("You waited too long. All choices have expired.");
    
    // Set phase to locked
    setPhase('locked');
    onFrustrationIncrease(2.0);
    
    // Allow completion after a timeout
    setTimeout(() => {
      setCanComplete(true);
    }, 3000);
  };
  
  // Schedule random decay for options
  const scheduleRandomDecay = () => {
    // Schedule initial decay for random options
    const decayDelay = 4000 + Math.random() * 2000; // 4-6 seconds
    
    decayTimerRef.current = setTimeout(() => {
      // Randomly select an option to start decaying
      const enabledOptions = options.filter(opt => opt.enabled);
      if (enabledOptions.length > 1) {
        const randomIndex = Math.floor(Math.random() * enabledOptions.length);
        const targetOption = enabledOptions[randomIndex];
        
        // Don't decay the correct option first
        if (enabledOptions.length > 2 && targetOption.id === correctOptionId) {
          scheduleRandomDecay(); // Try again
          return;
        }
        
        startDecay(targetOption.id);
        
        // Schedule next decay
        scheduleRandomDecay();
      }
    }, decayDelay);
  };
  
  // Track hovering over options
  const handleMouseEnter = (id: number) => {
    setHoveringId(id);
    setHoverStartTime(Date.now());
    
    // Set a timer to start decaying the option after delay
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    // Start decay sooner for trap options
    const option = options.find(opt => opt.id === id);
    const isTrap = option?.trap || false;
    const decayDelay = isTrap ? 1500 : 2500;
    
    hoverTimerRef.current = setTimeout(() => {
      startDecay(id);
    }, decayDelay);
    
    // Narrator comments on hovering
    if (isTrap) {
      setNarratorMessage("That one's tempting, isn't it? Perhaps too tempting...");
    } else if (id === correctOptionId) {
      setNarratorMessage("Is that your choice? It's fading quickly...");
    }
  };
  
  const handleMouseLeave = () => {
    setHoveringId(null);
    setHoverStartTime(null);
    
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };
  
  // Start decay process for an option
  const startDecay = (id: number) => {
    // Don't decay disabled options
    const option = options.find(opt => opt.id === id);
    if (!option || !option.enabled) return;
    
    // Is it the correct option?
    const isCorrectOption = id === correctOptionId;
    
    setOptions(prev => prev.map(option => {
      if (option.id === id) {
        return {
          ...option,
          decay: isCorrectOption ? 0.8 : 1.2 // Slower decay for correct option
        };
      }
      return option;
    }));
    
    // Show explanation after first decay
    if (!showExplanation) {
      setShowExplanation(true);
      setMessage("Your hesitation costs you. Some choices won't wait.");
      onFrustrationIncrease(0.5);
    }
  };
  
  // Handle decay progression
  useEffect(() => {
    const decayInterval = setInterval(() => {
      setOptions(prev => {
        const updated = prev.map(option => {
          if (option.decay > 0) {
            // Progress decay
            const newOpacity = Math.max(0, option.opacity - (option.decay * 0.03));
            return {
              ...option,
              opacity: newOpacity,
              enabled: newOpacity > 0.2 // Disable when nearly transparent
            };
          }
          return option;
        });
        
        return updated;
      });
    }, 100);
    
    return () => clearInterval(decayInterval);
  }, []);
  
  // Track disappearing options
  useEffect(() => {
    const disabledCount = options.filter(opt => !opt.enabled).length;
    
    if (disabledCount !== disappearedCount) {
      setDisappearedCount(disabledCount);
      
      // Increase frustration as options disappear
      onFrustrationIncrease(0.4);
      
      // Change message based on how many have disappeared
      if (disabledCount === 1) {
        setMessage("One option gone. They won't wait forever.");
        setNarratorMessage("The first sacrifice to indecision. What will be next?");
      } else if (disabledCount === 2) {
        setMessage("Your hesitation has consequences. Choose while you still can.");
        setNarratorMessage("Half your choices gone. Time becomes your enemy.");
      } else if (disabledCount === 3) {
        setMessage("Only one remains. Was this your strategy all along?");
        setNarratorMessage("Down to your last option. Is it the one you wanted?");
        
        // Drastically speed up the timer when only one option remains
        setTimeRemaining(prev => Math.min(prev, 5));
      } else if (disabledCount === 4) {
        setMessage("All options lost. Your indecision has become your decision.");
        setNarratorMessage("And now you have nothing. Not even the illusion of choice.");
        setPhase('locked');
        setLockoutReason("All options have disappeared due to your hesitation.");
        setBadge("Choice Evaporator");
        
        // High frustration when all options are lost
        onFrustrationIncrease(2.0);
        
        // Allow completion on timeout
        setCanComplete(true);
      }
    }
  }, [options, disappearedCount, onFrustrationIncrease, setNarratorMessage]);
  
  // Handle option click
  const handleOptionClick = (id: number) => {
    // Stop the timer
    clearAllTimers();
    setIsTimerActive(false);
    setHasClicked(true);
    
    // Get the clicked option
    const clickedOption = options.find(opt => opt.id === id);
    if (!clickedOption || !clickedOption.enabled) return;
    
    // Check if it's a trap
    if (clickedOption.trap) {
      // They clicked a trap
      setPhase('locked');
      setLockoutReason(`"${clickedOption.text}" was a trap. You've been locked out.`);
      setBadge("Trap Sprung");
      setNarratorMessage("You fell for it so easily. I knew you would.");
      
      // Lock all other options
      setOptions(prev => prev.map(opt => ({
        ...opt,
        enabled: false,
        opacity: opt.id === id ? 0.8 : 0.2
      })));
      
      onFrustrationIncrease(1.8);
      
      // Allow completion after a delay
      setTimeout(() => {
        setCanComplete(true);
      }, 3000);
      
      return;
    }
    
    // Check if it's the correct option
    if (id === correctOptionId) {
      // They clicked the correct option
      setPhase('consequence');
      setMessage("You've chosen wisely, but was it truly your choice?");
      setNarratorMessage("You found the right path. Did I guide you there, or did you truly choose?");
      setBadge("Path Finder");
      
      // Disable all options
      setOptions(prev => prev.map(opt => ({
        ...opt,
        enabled: false,
        opacity: opt.id === id ? 1 : 0.2
      })));
      
      // Allow completion
      setCanComplete(true);
    } else {
      // They clicked a non-trap but incorrect option
      setPhase('betrayal');
      setMessage(`You've chosen "${clickedOption.text}", but the path leads nowhere.`);
      setNarratorMessage("Not all false choices lead to traps. Some just lead... nowhere.");
      setBadge("Misdirected Wanderer");
      
      // Disable all options
      setOptions(prev => prev.map(opt => ({
        ...opt,
        enabled: false,
        opacity: opt.id === id ? 0.8 : 0.2
      })));
      
      onFrustrationIncrease(1.2);
      
      // Allow completion after a delay
      setTimeout(() => {
        setCanComplete(true);
      }, 3000);
    }
  };
  
  // Reset the entire interface (punishment for indecision)
  const resetInterface = () => {
    // Clear timers
    clearAllTimers();
    
    // Reset options but make them decay faster on reset
    setOptions([
      { id: 1, text: "Last chance", enabled: true, opacity: 1, decay: 0, trustworthy: false, trap: true },
      { id: 2, text: "Reset choice", enabled: true, opacity: 1, decay: 0, trustworthy: false, trap: false },
      { id: 3, text: "Try again", enabled: true, opacity: 1, decay: 0, trustworthy: true, trap: false },
      { id: 4, text: "Restart path", enabled: true, opacity: 1, decay: 0, trustworthy: false, trap: true }
    ]);
    
    // Pick a new correct option
    const newCorrectId = Math.floor(Math.random() * 4) + 1;
    setCorrectOptionId(newCorrectId);
    
    // Reset state
    setHoveringId(null);
    setHoverStartTime(null);
    setDisappearedCount(0);
    setHasClicked(false);
    setCanComplete(false);
    setPhase('choice');
    setHasReset(true);
    
    // Reset timer but with less time
    setTimeRemaining(8);
    setHasTimedOut(false);
    setIsTimerActive(true);
    
    // Start timer again
    startTimer();
    
    // Start decay even faster
    setTimeout(() => {
      scheduleRandomDecay();
    }, 2000);
    
    // Update messages
    setMessage("Interface reset. Choose more quickly this time.");
    setNarratorMessage("I've given you another chance. Don't waste it with hesitation again.");
    onFrustrationIncrease(1.0);
  };
  
  // Format time remaining
  const formatTime = (seconds: number) => {
    return seconds < 10 ? `0:0${seconds}` : `0:${seconds}`;
  };
  
  // Render the locked screen (user made a mistake or timed out)
  const renderLockedScreen = () => (
    <motion.div
      className={`p-5 border-2 border-${theme}-700 bg-gray-900 rounded-lg max-w-md mx-auto text-center`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-bold mb-3 text-red-500">Access Locked</h3>
      
      <p className="text-gray-300 mb-4">
        {lockoutReason}
      </p>
      
      <div className="my-4 p-3 bg-black bg-opacity-50 rounded text-left">
        <p className="text-sm text-gray-400 italic mb-2">
          "Sometimes the greatest mistake is the inability to choose at all."
        </p>
        <p className="text-xs text-gray-500 text-right">— The Spiral</p>
      </div>
      
      <p className="text-sm text-gray-400 mb-6">
        Your badge: <span className="text-yellow-400 font-medium">{badge}</span>
      </p>
      
      <button
        className={`px-4 py-2 bg-${theme}-600 text-white rounded`}
        onClick={onComplete}
      >
        Accept Failure
      </button>
    </motion.div>
  );
  
  // Render the consequence screen (user made a choice)
  const renderConsequenceScreen = () => (
    <motion.div
      className={`p-5 border border-${theme}-700 bg-gray-900 rounded-lg max-w-md mx-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-bold mb-3">Decision Made</h3>
      <p className="text-gray-300 mb-4">
        You found the correct path forward. But was it really your choice, or did I guide you here?
      </p>
      <div className="my-4 p-3 bg-black bg-opacity-50 rounded">
        <p className="text-sm text-gray-400 italic">
          "A correct choice made too late is still a mistake. Timing is everything."
        </p>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Your badge: <span className="text-yellow-400 font-medium">{badge}</span>
      </p>
      <div className="flex justify-between">
        <button
          className={`px-4 py-2 bg-${theme}-600 text-white rounded`}
          onClick={onComplete}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
  
  // Render the betrayal screen (wrong but non-trap choice)
  const renderBetrayalScreen = () => (
    <motion.div
      className={`p-5 border-2 border-${theme}-500 bg-gray-900 rounded-lg max-w-md mx-auto text-center`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-bold mb-3 text-yellow-500">Path Leads Nowhere</h3>
      
      <p className="text-gray-300 mb-4">
        Your choice was not a trap, but it doesn't lead forward. You've reached a dead end.
      </p>
      
      <div className="my-4 p-3 bg-black bg-opacity-50 rounded text-left">
        <p className="text-sm text-gray-400 italic mb-2">
          "Not all choices lead to disaster. Some simply lead nowhere at all."
        </p>
        <p className="text-xs text-gray-500 text-right">— The Spiral</p>
      </div>
      
      <p className="text-sm text-gray-400 mb-6">
        Your badge: <span className="text-yellow-400 font-medium">{badge}</span>
      </p>
      
      <button
        className={`px-4 py-2 bg-${theme}-600 text-white rounded`}
        onClick={onComplete}
      >
        Continue
      </button>
    </motion.div>
  );
  
  // Render the main choice screen
  const renderChoiceScreen = () => (
    <div className={`p-6 border border-${theme}-700 rounded-lg max-w-md mx-auto bg-gray-900`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">The Decision</h2>
        
        <div className={`font-mono ${timeRemaining <= 5 ? 'text-red-500' : 'text-gray-400'}`}>
          {formatTime(timeRemaining)}
        </div>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">{message}</p>
      
      {hasReset && (
        <div className="mb-4 p-2 bg-red-900 bg-opacity-30 rounded-md">
          <p className="text-sm text-red-300">
            Interface has been reset due to indecision. Choose faster.
          </p>
        </div>
      )}
      
      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {options.map(option => {
            const isHighlighted = option.id === correctOptionId;
            return (
              <motion.button
                key={option.id}
                className={`w-full text-left p-3 border rounded-md 
                  ${option.enabled ? `hover:bg-${theme}-800` : 'cursor-not-allowed'}
                  ${isHighlighted ? `border-${theme}-500` : 'border-gray-700'}`}
                style={{ 
                  opacity: option.opacity,
                  filter: `blur(${(1 - option.opacity) * 3}px)`,
                  transform: `scale(${option.opacity * 0.3 + 0.7})`,
                }}
                disabled={!option.enabled}
                onMouseEnter={() => option.enabled && handleMouseEnter(option.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => option.enabled && handleOptionClick(option.id)}
                initial={{ opacity: 1, y: 0 }}
                animate={{ 
                  opacity: option.opacity,
                  y: option.decay > 0 ? [(1 - option.opacity) * 10, 0] : 0,
                }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {option.text}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            className="text-sm text-yellow-500 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            The longer you wait, the fewer choices remain. Indecision costs you options.
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex justify-between">
        {disappearedCount >= 2 && timeRemaining > 0 && !hasReset && (
          <motion.button
            className={`px-4 py-2 bg-yellow-600 text-white rounded`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetInterface}
          >
            Reset Interface
          </motion.button>
        )}
        
        <motion.button
          className={`px-4 py-2 bg-red-600 text-white rounded ml-auto`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onFail();
            setNarratorMessage("Running away? Your indecision follows you everywhere.");
            onFrustrationIncrease(1.0);
          }}
        >
          Abandon Choice
        </motion.button>
      </div>
    </div>
  );
  
  // Render the appropriate screen based on the current phase
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      {phase === 'choice' && renderChoiceScreen()}
      {phase === 'betrayal' && renderBetrayalScreen()}
      {phase === 'consequence' && renderConsequenceScreen()}
      {phase === 'locked' && renderLockedScreen()}
    </div>
  );
};

export default OptionCrumble; 
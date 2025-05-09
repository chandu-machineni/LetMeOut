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
  
  const [options, setOptions] = useState([
    { id: 1, text: "Trust me", enabled: true, opacity: 1, decay: 0, trustworthy: false },
    { id: 2, text: "I'll help you escape", enabled: true, opacity: 1, decay: 0, trustworthy: true },
    { id: 3, text: "Take the safe path", enabled: true, opacity: 1, decay: 0, trustworthy: false },
    { id: 4, text: "The truth lies here", enabled: true, opacity: 1, decay: 0, trustworthy: false }
  ]);
  const [hoveringId, setHoveringId] = useState<number | null>(null);
  const [hoverStartTime, setHoverStartTime] = useState<number | null>(null);
  const [disappearedCount, setDisappearedCount] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  const [message, setMessage] = useState("Choose an option before they vanish");
  const [trustBetrayed, setTrustBetrayed] = useState(false);
  const [showTrustCard, setShowTrustCard] = useState(false);
  const [trusteeOption, setTrusteeOption] = useState<number | null>(null);
  const [phase, setPhase] = useState<'choice' | 'consequence' | 'betrayal'>('choice');
  const [countdownValue, setCountdownValue] = useState(5);
  const [badge, setBadge] = useState<string | null>(null);
  
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const trustTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Set initial narrator message
  useEffect(() => {
    // Tailor message based on user alignment
    let initialMessage = "You've always hesitated, haven't you? Let's see what you lose when you wait.";
    
    if (userAlignment === 'evil_apprentice') {
      initialMessage = "Study this pattern carefully, apprentice. Trust and betrayal - fundamental tools in manipulation.";
    } else if (userAlignment === 'shadow_enthusiast') {
      initialMessage = "Ah, the crumbling option pattern. Beautiful how it creates visceral anxiety, isn't it?";
    } else if (userAlignment === 'dark_tourist') {
      initialMessage = "Careful, tourist. The wrong choice is worse than no choice at all.";
    } else if (userAlignment === 'escapist') {
      initialMessage = "Run if you want. The options will still fade. Your freedom is an illusion.";
    }
    
    setNarratorMessage(initialMessage);
    
    // Set a helpful-looking option as the one that will appear most trustworthy
    const randomTrustedIndex = Math.floor(Math.random() * options.length);
    setTrusteeOption(randomTrustedIndex + 1);
    
    // Auto-highlight the 'trustworthy' option briefly to draw attention
    setTimeout(() => {
      setHoveringId(randomTrustedIndex + 1);
      setTimeout(() => {
        setHoveringId(null);
      }, 800);
    }, 2000);
  }, [setNarratorMessage, userAlignment]);
  
  // Track hovering
  const handleMouseEnter = (id: number) => {
    setHoveringId(id);
    setHoverStartTime(Date.now());
    
    // Set a timer to start decaying the option after delay
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    
    // Start decay sooner for options that aren't the "trustworthy" one
    const isApparentlyTrustworthy = id === trusteeOption;
    const decayDelay = isApparentlyTrustworthy ? 2500 : 1200;
    
    hoverTimerRef.current = setTimeout(() => {
      startDecay(id);
    }, decayDelay);
    
    // The "trustworthy" option tries to convince you
    if (id === trusteeOption) {
      setNarratorMessage("That one seems stable. Maybe you should trust it. Quickly now.");
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
    // If it's the "trustworthy" option, make it decay slower
    const isApparentlyTrustworthy = id === trusteeOption;
    
    setOptions(prev => prev.map(option => {
      if (option.id === id) {
        return {
          ...option,
          decay: isApparentlyTrustworthy ? 0.6 : 1 // Slower decay for the trustworthy option
        };
      }
      return option;
    }));
    
    // Show explanation after first decay
    if (!showExplanation) {
      setShowExplanation(true);
      setMessage("Your indecision costs you. Some choices won't wait.");
      onFrustrationIncrease(0.5);
    }
  };
  
  // Handle decay progression
  useEffect(() => {
    if (hoveringId !== null && hoverStartTime !== null) {
      const decayInterval = setInterval(() => {
        const hoverDuration = Date.now() - hoverStartTime;
        const isApparentlyTrustworthy = hoveringId === trusteeOption;
        const decayThreshold = isApparentlyTrustworthy ? 3500 : 2000;
        
        if (hoverDuration > decayThreshold) {
          setOptions(prev => {
            const updated = prev.map(option => {
              if (option.id === hoveringId) {
                // Progress decay - slower for trustworthy option
                const decayRate = isApparentlyTrustworthy ? 0.02 : 0.05;
                const newOpacity = Math.max(0, option.opacity - decayRate);
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
        }
      }, 100);
      
      return () => clearInterval(decayInterval);
    }
  }, [hoveringId, hoverStartTime, trusteeOption]);
  
  // Track disappearing options
  useEffect(() => {
    const disabledCount = options.filter(opt => !opt.enabled).length;
    
    if (disabledCount !== disappearedCount) {
      setDisappearedCount(disabledCount);
      
      // Increase frustration as options disappear
      onFrustrationIncrease(0.3);
      
      // Change message based on how many have disappeared
      if (disabledCount === 1) {
        setMessage("One option gone. They won't wait forever.");
        setNarratorMessage("Interesting. You watched it fade away. Was that intentional?");
      } else if (disabledCount === 2) {
        setMessage("Your hesitation has consequences. Choose while you still can.");
        setNarratorMessage("Half your choices gone. Always waiting for the perfect option...");
      } else if (disabledCount === 3) {
        setMessage("Only one remains. Was this your strategy all along?");
        setNarratorMessage("One choice left. But is it the one you would have chosen freely?");
      } else if (disabledCount === 4) {
        setMessage("All options lost. Your indecision has become your decision.");
        setNarratorMessage("You chose to let fate decide. Or perhaps you're afraid of responsibility?");
        setCanComplete(true); // Allow completion when all options are gone
        setBadge("Paralyzed By Choice");
        
        // High frustration when all options are lost
        onFrustrationIncrease(1.5);
      }
    }
    
    // Enable completion after clicking or losing most options
    if (hasClicked && disappearedCount >= 2) {
      setCanComplete(true);
    }
  }, [options, disappearedCount, hasClicked, onFrustrationIncrease, setNarratorMessage]);
  
  // Decay a random option occasionally, but never the trustworthy one until later
  useEffect(() => {
    const randomDecayInterval = setInterval(() => {
      if (Math.random() > 0.65 && options.filter(o => o.enabled).length > 1 && !hasClicked) {
        // Pick a random enabled option that's not the trustworthy one
        const enabledOptions = options.filter(o => o.enabled && o.id !== trusteeOption);
        if (enabledOptions.length > 0) {
          const randomOption = enabledOptions[Math.floor(Math.random() * enabledOptions.length)];
          startDecay(randomOption.id);
          
          // Narrator comments on random decay
          setNarratorMessage("Time waits for no one. Neither do I.");
        }
      }
    }, 5000);
    
    return () => clearInterval(randomDecayInterval);
  }, [options, trusteeOption, hasClicked, setNarratorMessage]);
  
  // Handle option click
  const handleOptionClick = (id: number) => {
    setHasClicked(true);
    
    // Check if clicked the apparently trustworthy option
    if (id === trusteeOption) {
      // This option betrays trust
      setTrustBetrayed(true);
      setPhase('betrayal');
      setShowTrustCard(true);
      
      // Narrative response to trusted option
      setNarratorMessage("Trust so easily given. So easily betrayed. How does it feel?");
      
      // Increase frustration significantly due to betrayal
      onFrustrationIncrease(2.0);
      
      // Set badge for being betrayed
      setBadge("Betrayed Believer");
      
      // Show countdown for a brief moment before revealing betrayal
      const countdown = setInterval(() => {
        setCountdownValue(prev => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 700);
      
      return;
    }
    
    // For non-trustworthy options
    setPhase('consequence');
    
    // Update message
    setMessage("You've made a choice, but was it yours or did I guide you?");
    setNarratorMessage("Decisive at last. But was it wisdom or panic that drove you?");
    
    // Add moderate frustration for choosing
    onFrustrationIncrease(0.7);
    
    // Set badge based on how many options were left
    const remainingCount = options.filter(o => o.enabled).length;
    if (remainingCount === 4) {
      setBadge("Swift Decider");
    } else if (remainingCount === 3) {
      setBadge("Careful Chooser");
    } else if (remainingCount === 2) {
      setBadge("Last Moment Selector");
    }
    
    // Fade the clicked option more aggressively
    setOptions(prev => prev.map(option => {
      if (option.id === id) {
        return {
          ...option,
          decay: 1,
          opacity: 0.5 // Immediately start fading
        };
      }
      // Also start decay process on all other options
      return {
        ...option,
        decay: option.decay > 0 ? option.decay : 0.5
      };
    }));
    
    // Allow completion after a delay
    setTimeout(() => {
      setCanComplete(true);
    }, 2000);
  };
  
  // Render the betrayal card that appears when the user trusts the wrong option
  const renderBetrayalCard = () => (
    <motion.div
      className={`p-5 border-2 border-${theme}-500 bg-gray-900 rounded-lg max-w-md mx-auto text-center`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {countdownValue > 0 ? (
        <>
          <h3 className="text-xl font-bold mb-3">Processing Your Choice</h3>
          <div className={`text-${theme}-400 text-4xl font-bold mb-4`}>{countdownValue}</div>
          <p className="text-gray-400 mb-4">Please wait while we prepare your exit...</p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-3 text-red-500">Trust Betrayed</h3>
          <p className="text-gray-300 mb-4">
            You trusted the option that seemed safest. That was your first mistake.
          </p>
          <div className="my-4 p-3 bg-black bg-opacity-50 rounded text-left">
            <p className="text-sm text-gray-400 italic mb-2">
              "The most deceitful choices are those that appear most trustworthy."
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
            Accept Your Naivety
          </button>
        </>
      )}
    </motion.div>
  );
  
  // Render the consequence card after a non-trustworthy option is selected
  const renderConsequenceCard = () => (
    <motion.div
      className={`p-5 border border-${theme}-700 bg-gray-900 rounded-lg max-w-md mx-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-bold mb-3">Choice Made</h3>
      <p className="text-gray-300 mb-4">
        You avoided the trap I laid for you. But did you know it was there?
      </p>
      <div className="my-4 p-3 bg-black bg-opacity-50 rounded">
        <p className="text-sm text-gray-400 italic">
          "Sometimes, the right choice is to distrust the most appealing option."
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
  
  // Render the main choice screen
  const renderChoiceScreen = () => (
    <div className={`p-6 border border-${theme}-700 rounded-lg max-w-md mx-auto bg-gray-900`}>
      <h2 className="text-xl font-bold mb-4">The Decision</h2>
      <p className="text-sm text-gray-400 mb-6">{message}</p>
      
      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {options.map(option => {
            const isApparentlyTrustworthy = option.id === trusteeOption;
            return (
              <motion.button
                key={option.id}
                className={`w-full text-left p-3 border rounded-md 
                  ${option.enabled ? `hover:bg-${theme}-800` : 'cursor-not-allowed'}
                  ${isApparentlyTrustworthy ? `border-${theme}-500` : 'border-gray-700'}`}
                style={{ 
                  opacity: option.opacity,
                  filter: `blur(${(1 - option.opacity) * 3}px)`,
                  transform: `scale(${option.opacity * 0.5 + 0.5})`, // Scale down as opacity reduces
                  boxShadow: isApparentlyTrustworthy && hoveringId === option.id ? 
                    `0 0 10px rgba(var(--color-${theme}-500), 0.5)` : 'none'
                }}
                disabled={!option.enabled}
                onMouseEnter={() => option.enabled && handleMouseEnter(option.id)}
                onMouseLeave={handleMouseLeave}
                onClick={() => option.enabled && handleOptionClick(option.id)}
                initial={{ opacity: 1, y: 0 }}
                animate={{ 
                  opacity: option.opacity,
                  y: option.decay > 0 ? [(1 - option.opacity) * 10, 0] : 0,
                  borderColor: isApparentlyTrustworthy ? `var(--color-${theme}-500)` : undefined
                }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {option.text}
                {isApparentlyTrustworthy && (
                  <span className="ml-2 text-xs text-green-400">(Stable)</span>
                )}
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
            The longer you wait, the fewer choices remain. Indecision has consequences.
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex justify-between">
        {canComplete && disappearedCount === 4 && (
          <motion.button
            className={`px-4 py-2 bg-${theme}-600 text-white rounded`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
          >
            Accept Your Failure
          </motion.button>
        )}
        
        <motion.button
          className={`px-4 py-2 bg-red-600 text-white rounded ml-auto`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onFail();
            setNarratorMessage("Running away? How predictable. The spiral remembers those who flee.");
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
      {phase === 'betrayal' && renderBetrayalCard()}
      {phase === 'consequence' && renderConsequenceCard()}
    </div>
  );
};

export default OptionCrumble; 
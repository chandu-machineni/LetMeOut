import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import Stage from './Stage';
import TextScrambler from './TextScrambler';
import { 
  spiralPatterns, 
  badges, 
  getOpeningLineForAlignment, 
  getNarratorLineForDepth,
  getRandomUXLaw,
  getErrorOverride,
  getHiddenSceneForFrustration,
  SpiralPattern,
  Badge,
  HiddenScene
} from '../data/spiralData';

// Import components for patterns
import GlitchedInputs from './spiral-patterns/GlitchedInputs';
import RecursiveMenus from './spiral-patterns/RecursiveMenus';
import FakeCompetitionUI from './spiral-patterns/FakeCompetitionUI';
import BreedingModals from './spiral-patterns/BreedingModals';
import FalseProgress from './spiral-patterns/FalseProgress';
import IdentityMirrorLoop from './spiral-patterns/IdentityMirrorLoop';
import OptionCrumble from './spiral-patterns/OptionCrumble';
import GhostCursorDuel from './spiral-patterns/GhostCursorDuel';
import LoopingUndoGhost from './spiral-patterns/LoopingUndoGhost';
import ImpossibleMoralChoice from './spiral-patterns/ImpossibleMoralChoice';

// Define interface for pattern component props
interface PatternComponentProps {
  pattern?: SpiralPattern;
  onComplete: () => void;
  onFail: () => void;
  onFrustrationIncrease: (amount: number) => void;
}

// Pattern component mapping
const patternComponents: Record<string, React.FC<PatternComponentProps>> = {
  "glitched_inputs": GlitchedInputs as unknown as React.FC<PatternComponentProps>,
  "recursive_menus": RecursiveMenus as unknown as React.FC<PatternComponentProps>,
  "fake_competition_ui": FakeCompetitionUI as unknown as React.FC<PatternComponentProps>,
  "breeding_modals": BreedingModals as unknown as React.FC<PatternComponentProps>,
  "false_progress": FalseProgress as unknown as React.FC<PatternComponentProps>,
  "identity_mirror_loop": IdentityMirrorLoop as unknown as React.FC<PatternComponentProps>,
  "option_crumble": OptionCrumble as unknown as React.FC<PatternComponentProps>,
  "ghost_cursor_duel": GhostCursorDuel as unknown as React.FC<PatternComponentProps>,
  "looping_undo_ghost": LoopingUndoGhost as unknown as React.FC<PatternComponentProps>,
  "impossible_moral_choice": ImpossibleMoralChoice as unknown as React.FC<PatternComponentProps>
};

// Placeholder components for pattern implementations until we build them
const PatternPlaceholder: React.FC<PatternComponentProps> = ({ 
  pattern, 
  onComplete, 
  onFail
}) => {
  if (!pattern) return null;
  
  return (
    <div className="p-8 border-2 border-dashed rounded-lg">
      <h3 className="text-xl font-bold mb-4">{pattern.title}</h3>
      <p className="mb-4">{pattern.description}</p>
      <div className="text-gray-500 mb-4">
        <div>Triggers: {pattern.triggers.join(', ')}</div>
        <div>Effects: {pattern.effects.join(', ')}</div>
      </div>
      <div className="flex space-x-4">
        <button 
          className="px-4 py-2 bg-green-600 text-white rounded" 
          onClick={onComplete}
        >
          Complete Pattern
        </button>
        <button 
          className="px-4 py-2 bg-red-600 text-white rounded" 
          onClick={onFail}
        >
          Give Up
        </button>
      </div>
    </div>
  );
};

// Narrator Override Component - for taking over the screen
const NarratorOverride: React.FC<{
  message: string;
  onDismiss: () => void;
}> = ({ message, onDismiss }) => {
  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="max-w-lg p-8 bg-gray-900 border-2 border-red-500 rounded-lg relative"
        initial={{ scale: 0.8, rotate: -5 }}
        animate={{ 
          scale: 1,
          rotate: 0,
          transition: { type: "spring", damping: 10 }
        }}
      >
        <div className="absolute top-2 right-2">
          <button 
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-700 text-gray-400 hover:text-white"
            onClick={onDismiss}
          >
            ×
          </button>
        </div>
        <div className="mb-4 font-glitch text-xl text-red-500">SYSTEM OVERRIDE</div>
        <div className="mb-6 text-lg">
          <TextScrambler text={message} chaosMultiplier={2} />
        </div>
      </motion.div>
    </motion.div>
  );
};

// UX Law Display Component
const UXLawDisplay: React.FC<{
  law: string;
}> = ({ law }) => {
  return (
    <motion.div
      className="fixed bottom-20 left-0 right-0 flex justify-center z-40 pointer-events-none"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ type: "spring", damping: 15 }}
    >
      <div className="bg-black bg-opacity-70 text-red-400 py-3 px-6 rounded-lg border border-red-900 font-mono max-w-md">
        <TextScrambler text={law} chaosMultiplier={1.2} />
      </div>
    </motion.div>
  );
};

// Glitch Overlay for intense moments
const GlitchOverlay: React.FC<{
  intensity: number; // 1-10
}> = ({ intensity }) => {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-30 mix-blend-difference"
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, intensity/10, 0.05],
        transition: { 
          repeat: Infinity, 
          duration: 0.2,
          repeatType: "reverse" 
        }
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-purple-500/20" />
      <div className="absolute inset-0 glitch-lines" />
      <style>{`
        .glitch-lines {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0) 0px,
            rgba(0, 0, 0, 0) 1px,
            rgba(255, 255, 255, 0.1) 1px,
            rgba(255, 255, 255, 0.1) 2px
          );
          background-size: 100% ${2 + intensity}px;
          animation: moveLines 0.2s infinite linear;
        }
        
        @keyframes moveLines {
          0% { background-position: 0 0; }
          100% { background-position: 0 ${5 + intensity}px; }
        }
      `}</style>
    </motion.div>
  );
};

const SpiralEngine: React.FC = () => {
  const { 
    theme, 
    userAlignment, 
    chaosLevel, 
    suspicionLevel,
    frustrationScore,
    spiralDepth,
    setSpiralDepth,
    learnedPatterns,
    setLearnedPatterns,
    setFrustrationScore,
    setEarnedBadges,
    setNarratorMessage
  } = useContext(AppContext);
  
  const [currentPattern, setCurrentPattern] = useState<SpiralPattern | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [escapable, setEscapable] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showGlitchText, setShowGlitchText] = useState(false);
  const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);
  
  // New state for advanced narrator behaviors
  const [showUXLaw, setShowUXLaw] = useState(false);
  const [currentUXLaw, setCurrentUXLaw] = useState("");
  const [showNarratorOverride, setShowNarratorOverride] = useState(false);
  const [overrideMessage, setOverrideMessage] = useState("");
  const [glitchIntensity, setGlitchIntensity] = useState(0);
  const [currentHiddenScene, setCurrentHiddenScene] = useState<HiddenScene | null>(null);
  const [narratorMemory, setNarratorMemory] = useState<Record<string, any>>({});
  const [showOverrideError, setShowOverrideError] = useState(false);
  const [overrideError, setOverrideError] = useState("");
  
  const navigate = useNavigate();
  
  // Set initial narrator message based on alignment when component mounts
  useEffect(() => {
    if (userAlignment) {
      const openingLine = getOpeningLineForAlignment(userAlignment);
      setNarratorMessage(openingLine);
      
      // Add occasional glitch effects
      const glitchInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          setShowGlitchText(true);
          setTimeout(() => setShowGlitchText(false), 500);
        }
      }, 10000);
      
      return () => clearInterval(glitchInterval);
    }
  }, [userAlignment, setNarratorMessage]);
  
  // Check for hidden scenes based on frustration score
  useEffect(() => {
    const hiddenScene = getHiddenSceneForFrustration(frustrationScore);
    
    if (hiddenScene && (!currentHiddenScene || hiddenScene.id !== currentHiddenScene.id)) {
      setCurrentHiddenScene(hiddenScene);
      
      // Trigger special effects based on the scene
      switch(hiddenScene.id) {
        case "narrator_mockery":
          // Show a UX law
          triggerUXLaw();
          break;
        case "interface_rebellion":
          // Increase glitch intensity
          setGlitchIntensity(5);
          setTimeout(() => setGlitchIntensity(2), 5000);
          break;
        case "meta_breakdown":
          // Show narrator override with 4th wall break
          triggerNarratorOverride(hiddenScene.narratorLine);
          break;
        case "narrator_override":
          // Full takeover
          triggerNarratorOverride(hiddenScene.narratorLine);
          setGlitchIntensity(8);
          // Override an error message
          setOverrideError(getErrorOverride("404"));
          setShowOverrideError(true);
          setTimeout(() => setShowOverrideError(false), 4000);
          break;
      }
      
      // Set narrator message from the scene
      setNarratorMessage(hiddenScene.narratorLine);
    }
  }, [frustrationScore, currentHiddenScene]);
  
  // Advanced narrator behaviors based on spiral depth
  useEffect(() => {
    // At higher spiral depths, narrator becomes more invasive
    if (spiralDepth >= 10) {
      // Random chance to show UX law
      if (Math.random() > 0.8) {
        triggerUXLaw();
      }
      
      // Random chance for narrator override
      if (Math.random() > 0.9) {
        const messages = [
          "I don't think you understand how this works. Let me show you.",
          "This interface belongs to me now.",
          "Your choices are merely suggestions I may or may not consider.",
          "Let's redefine the relationship here. I decide what happens next."
        ];
        triggerNarratorOverride(messages[Math.floor(Math.random() * messages.length)]);
      }
      
      // Set a baseline glitch intensity that increases with depth
      setGlitchIntensity(Math.min(5, Math.floor((spiralDepth - 10) / 2)));
    }
  }, [spiralDepth]);
  
  // Generate a new pattern based on user state
  useEffect(() => {
    if (isLoading) {
      // Generate depth-appropriate narrator message occasionally
      if (Math.random() > 0.7) {
        const depthMessage = getNarratorLineForDepth(spiralDepth);
        setNarratorMessage(depthMessage);
      }
      
      // Select a pattern not already learned, weighted by difficulty and current spiral depth
      const eligiblePatterns = spiralPatterns.filter(pattern => 
        !learnedPatterns.includes(pattern.id) || 
        // Allow repeats at higher spiral depths but with less probability
        (spiralDepth > 5 && Math.random() > 0.7)
      );
      
      if (eligiblePatterns.length === 0) {
        // If all patterns learned, restart with higher difficulty variations
        setSpiralDepth(prev => prev + 5);
        setNarratorMessage("You've seen it all? Let's make it harder.");
        setCurrentPattern(spiralPatterns[Math.floor(Math.random() * spiralPatterns.length)]);
      } else {
        // Weight selection by frustration score and spiral depth
        const weightedPatterns = eligiblePatterns.map(pattern => {
          // Higher frustration = higher chance of less frustrating patterns
          const frustrationWeight = frustrationScore > 7 ? 
            (6 - pattern.frustrationFactor) : pattern.frustrationFactor;
          
          // Higher spiral depth = higher chance of more difficult patterns
          const difficultyWeight = spiralDepth > 5 ? 
            pattern.difficulty : (6 - pattern.difficulty);
          
          return {
            pattern,
            weight: frustrationWeight + difficultyWeight
          };
        });
        
        // Select weighted random pattern
        const totalWeight = weightedPatterns.reduce((sum, p) => sum + p.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const weighted of weightedPatterns) {
          random -= weighted.weight;
          if (random <= 0) {
            setCurrentPattern(weighted.pattern);
            break;
          }
        }
        
        // Fallback if weighting fails
        if (!currentPattern && eligiblePatterns.length > 0) {
          setCurrentPattern(eligiblePatterns[0]);
        }
      }
      
      // Determine if this pattern should be escapable
      setEscapable(Math.random() > 0.7 || frustrationScore > 8);
      
      // Loading effect
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  }, [isLoading, learnedPatterns, spiralDepth, frustrationScore, currentPattern, setSpiralDepth, setNarratorMessage]);
  
  // Narrative response based on pattern selection
  useEffect(() => {
    if (currentPattern && !isLoading) {
      // Use the narrator reaction from the pattern definition
      setNarratorMessage(currentPattern.narratorReaction);
      
      // Store in narrator memory
      if (narratorMemory[currentPattern.id]) {
        // Seen this before - mention it
        setTimeout(() => {
          const memoryMessages = [
            `You've seen this one before. ${narratorMemory[currentPattern.id].attempts} times, in fact.`,
            `Back to this again? You failed here ${narratorMemory[currentPattern.id].attempts} times.`,
            `I remember you struggling with this last time. Let's see if you've improved.`
          ];
          setNarratorMessage(memoryMessages[Math.floor(Math.random() * memoryMessages.length)]);
        }, 5000);
        
        // Update memory
        setNarratorMemory(prev => ({
          ...prev,
          [currentPattern.id]: {
            ...prev[currentPattern.id],
            attempts: prev[currentPattern.id].attempts + 1,
            lastSeen: Date.now()
          }
        }));
      } else {
        // First time seeing this
        setNarratorMemory(prev => ({
          ...prev,
          [currentPattern.id]: {
            attempts: 1,
            lastSeen: Date.now(),
            completed: false
          }
        }));
      }
    }
  }, [currentPattern, isLoading, setNarratorMessage, narratorMemory]);
  
  // Helper function to trigger a UX Law display
  const triggerUXLaw = () => {
    const law = getRandomUXLaw();
    setCurrentUXLaw(law);
    setShowUXLaw(true);
    
    // Hide after a few seconds
    setTimeout(() => {
      setShowUXLaw(false);
    }, 6000);
  };
  
  // Helper function to trigger narrator override
  const triggerNarratorOverride = (message: string) => {
    setOverrideMessage(message);
    setShowNarratorOverride(true);
    
    // Increase glitch effect
    setGlitchIntensity(prev => Math.min(10, prev + 3));
  };
  
  // Select a badge to award based on pattern
  const selectBadgeForPattern = (patternId: string): Badge | null => {
    // Map certain patterns to specific badges (could be expanded)
    const badgeMap: {[key: string]: string} = {
      "breeding_modals": "confirmshamer",
      "recursive_menus": "roach_motel",
      "glitched_inputs": "forced_funnel",
      "false_progress": "ghost_exit",
      "identity_mirror_loop": "gaslight_victim",
      "ghost_cursor_duel": "phantom_clicker",
      "option_crumble": "option_evaporator"
    };
    
    const badgeId = badgeMap[patternId];
    if (badgeId) {
      return badges.find(badge => badge.id === badgeId) || null;
    }
    
    // Fallback to random badge
    return badges[Math.floor(Math.random() * badges.length)];
  };
  
  const handleComplete = () => {
    // Simulate completion of the pattern
    setIsCompleted(true);
    
    // Add pattern to learned list if not already there
    if (currentPattern && !learnedPatterns.includes(currentPattern.id)) {
      setLearnedPatterns(prev => [...prev, currentPattern.id]);
      
      // Select and award badge
      const badge = selectBadgeForPattern(currentPattern.id);
      if (badge) {
        setCurrentBadge(badge);
        setEarnedBadges(prev => [...prev, badge.name]);
        setNarratorMessage(`${badge.microcopy} ${badge.lesson}`);
      }
      
      // Update memory
      setNarratorMemory(prev => ({
        ...prev,
        [currentPattern.id]: {
          ...prev[currentPattern.id],
          completed: true
        }
      }));
    }
    
    // Increase spiral depth
    setSpiralDepth(prev => prev + 1);
    
    // Adjust frustration (reduce after completion)
    setFrustrationScore(prev => Math.max(0, prev - 1));
    
    // Reset for next pattern
    setTimeout(() => {
      setIsLoading(true);
      setIsCompleted(false);
      setCurrentBadge(null);
      
      // Either continue or return to a different screen
      if (spiralDepth > 15 || Math.random() > 0.9) {
        navigate('/theme'); // Exit spiral occasionally
      }
    }, 3000);
  };
  
  const handleFail = () => {
    // Increase frustration based on pattern-specific increment factor
    const incrementFactor = currentPattern?.frustrationIncrement || 2;
    setFrustrationScore(prev => Math.min(15, prev + incrementFactor));
    
    // Tailored messages based on user alignment
    const failureMessages = {
      evil_apprentice: "A true evil UX designer never gives up. Try again, apprentice.",
      shadow_enthusiast: "Giving up? I thought you enjoyed these dark patterns.",
      dark_tourist: "Tourist season ends early for you. But the exit is still miles away.",
      escapist: "Giving up so soon? Your frustration is... delicious."
    };
    
    const message = userAlignment && userAlignment in failureMessages 
      ? failureMessages[userAlignment as keyof typeof failureMessages]
      : "Giving up so soon? Your frustration is... delicious.";
    
    setNarratorMessage(message);
    
    // Update memory
    if (currentPattern) {
      setNarratorMemory(prev => ({
        ...prev,
        [currentPattern.id]: {
          ...prev[currentPattern.id],
          failures: (prev[currentPattern.id]?.failures || 0) + 1
        }
      }));
    }
    
    // At high frustration, trigger UX law or narrator override
    if (frustrationScore > 8 && Math.random() > 0.6) {
      triggerUXLaw();
    }
    
    if (frustrationScore > 12 && Math.random() > 0.7) {
      triggerNarratorOverride("Your failure feeds the system. Each time you give up, I grow stronger.");
    }
    
    // Reset for next pattern
    setTimeout(() => {
      setIsLoading(true);
      setIsCompleted(false);
    }, 2000);
  };
  
  // Render pattern component
  const renderPatternComponent = () => {
    if (!currentPattern) return null;
    
    // Get the component for this pattern
    const PatternComponent = patternComponents[currentPattern.id] || PatternPlaceholder;
    
    return (
      <div className="mt-8 mb-12">
        <PatternComponent 
          pattern={currentPattern}
          onComplete={handleComplete}
          onFail={handleFail}
          onFrustrationIncrease={(amount: number) => {
            // Increase frustration score based on pattern interactions
            setFrustrationScore((prev: number) => Math.min(10, prev + amount));
          }}
        />
      </div>
    );
  };
  
  const stageTitle = currentPattern ? currentPattern.title : "Loading Pattern...";
  const stageDescription = currentPattern ? currentPattern.description : "Preparing your personalized UX nightmare...";
  
  return (
    <Stage
      stageNumber={spiralDepth + 3} // Start numbering after alignment selection
      title={stageTitle}
      description={stageDescription}
      onComplete={() => {}}
    >
      {/* Glitch overlay with variable intensity */}
      {glitchIntensity > 0 && <GlitchOverlay intensity={glitchIntensity} />}
      
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
        {isLoading ? (
          <motion.div className="text-center">
            <motion.div
              className="text-4xl mb-6"
              animate={{ 
                opacity: [0.2, 1, 0.2],
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ∞
            </motion.div>
            <p className="text-gray-400">
              <TextScrambler 
                text={showGlitchText ? "Calibrating psychological manipulation..." : "Generating personalized dark pattern..."} 
                chaosMultiplier={1.5} 
              />
            </p>
          </motion.div>
        ) : (
          <div className="w-full max-w-4xl mb-8">
            {currentPattern && (
              <div className="mb-8">
                {/* Actual pattern component */}
                {renderPatternComponent()}
                
                {/* Badge alert on completion */}
                <AnimatePresence>
                  {isCompleted && currentBadge && (
                    <motion.div
                      className={`mt-6 p-4 bg-${theme}-800 border border-${theme}-600 rounded-md`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex items-center">
                        <div className={`text-2xl mr-3 ${showGlitchText ? 'animate-pulse' : ''}`}>🏆</div>
                        <div>
                          <div className="font-bold text-yellow-400">{currentBadge.name}</div>
                          <div className="text-sm text-gray-400">{currentBadge.microcopy}</div>
                          <div className="text-sm text-gray-200 mt-1 italic">{currentBadge.lesson}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* UX Law Display */}
      <AnimatePresence>
        {showUXLaw && (
          <UXLawDisplay law={currentUXLaw} />
        )}
      </AnimatePresence>
      
      {/* Error Message Override */}
      <AnimatePresence>
        {showOverrideError && (
          <motion.div
            className="fixed top-5 left-0 right-0 flex justify-center z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-red-900/80 text-white py-2 px-4 rounded font-mono text-lg">
              {overrideError}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Narrator Override Takeover */}
      <AnimatePresence>
        {showNarratorOverride && (
          <NarratorOverride 
            message={overrideMessage}
            onDismiss={() => {
              setShowNarratorOverride(false);
              setGlitchIntensity(prev => Math.max(0, prev - 3));
            }} 
          />
        )}
      </AnimatePresence>
      
      {/* Add glitch text animation */}
      <style>{`
        @keyframes textGlitch {
          0% { transform: translate(0); text-shadow: none; }
          25% { transform: translate(-2px, 1px); text-shadow: -2px 0 red, 2px 2px blue; }
          50% { transform: translate(2px, -1px); text-shadow: 2px 0 green, -2px -2px purple; }
          75% { transform: translate(-1px, -2px); text-shadow: -2px 0 yellow, 2px 2px cyan; }
          100% { transform: translate(0); text-shadow: none; }
        }
        .text-glitch {
          animation: textGlitch 0.2s linear infinite;
        }
      `}</style>
    </Stage>
  );
};

export default SpiralEngine; 
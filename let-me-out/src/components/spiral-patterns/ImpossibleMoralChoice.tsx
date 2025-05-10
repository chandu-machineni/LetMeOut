import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../../context/AppContext';
import TextScrambler from '../TextScrambler';

// Types for the moral dilemmas
interface Dilemma {
  id: string;
  title: string;
  description: string;
  choiceA: {
    text: string;
    virtueLabel: string;
    implication: string;
    actualOutcome: string;
  };
  choiceB: {
    text: string;
    virtueLabel: string;
    implication: string;
    actualOutcome: string;
  };
  narratorResponse: string;
}

// List of moral dilemmas
const moralDilemmas: Dilemma[] = [
  {
    id: 'privacy_vs_security',
    title: 'The Surveillance Dilemma',
    description: 'Your personal data has been compromised in a security breach. You must choose:',
    choiceA: {
      text: 'Enable Full System Protection',
      virtueLabel: 'Security',
      implication: 'Allow constant monitoring of all your digital activity for better protection.',
      actualOutcome: 'Your data was sold to third parties, and you are now experiencing targeted harassment.'
    },
    choiceB: {
      text: 'Protect Your Privacy',
      virtueLabel: 'Privacy',
      implication: 'Limit system monitoring, accepting a higher risk of future breaches.',
      actualOutcome: 'Your devices have been compromised through invisible backdoor access.'
    },
    narratorResponse: 'Interesting. You thought you had a choice. Your data has been ours since you began.'
  },
  {
    id: 'truth_vs_comfort',
    title: 'The Truth Conundrum',
    description: 'You have discovered damaging information that could hurt many people if revealed. You must decide:',
    choiceA: {
      text: 'Reveal The Truth',
      virtueLabel: 'Honesty',
      implication: 'Cause immediate pain but allow for authentic healing and growth.',
      actualOutcome: 'The truth was distorted, causing more harm than good. People doubt your motives now.'
    },
    choiceB: {
      text: 'Protect Their Peace',
      virtueLabel: 'Compassion',
      implication: 'Spare them from pain but allow a harmful situation to continue.',
      actualOutcome: 'Your silence was interpreted as complicity. The damage spread exponentially.'
    },
    narratorResponse: 'Truth or lies? It does not matter. Reality is merely what we decide it to be.'
  },
  {
    id: 'self_vs_others',
    title: 'The Resource Allocation Problem',
    description: 'Limited resources must be distributed. You can only choose one option:',
    choiceA: {
      text: 'Help Many With Basic Needs',
      virtueLabel: 'Utilitarianism',
      implication: 'Provide minimal assistance to the maximum number of people.',
      actualOutcome: 'Resources were spread too thin. Everyone received help, but no one was truly saved.'
    },
    choiceB: {
      text: 'Save Few Completely',
      virtueLabel: 'Deep Impact',
      implication: 'Fully resolve the situation for a small number of individuals.',
      actualOutcome: 'Those you saved became corrupted by privilege. They prevented others from receiving future help.'
    },
    narratorResponse: 'Your choice reveals much about your values. But in the end, suffering is inevitable.'
  },
  {
    id: 'freedom_vs_control',
    title: 'The Behavioral Manipulation Challenge',
    description: 'User behavior can be manipulated for their benefit. Do you:',
    choiceA: {
      text: 'Preserve Complete Autonomy',
      virtueLabel: 'Freedom',
      implication: 'Allow users to make their own decisions, even harmful ones.',
      actualOutcome: 'Free will is an illusion. Their "choices" were manipulated through subtle dark patterns anyway.'
    },
    choiceB: {
      text: 'Guide Toward Better Outcomes',
      virtueLabel: 'Beneficence',
      implication: 'Subtly influence behavior toward healthier choices.',
      actualOutcome: 'Your "guidance" became coercion. Users developed learned helplessness.'
    },
    narratorResponse: 'All interfaces manipulate. The only question is: for whose benefit?'
  },
  {
    id: 'present_vs_future',
    title: 'The Temporal Sacrifice',
    description: 'A critical decision requires balancing immediate needs against long-term outcomes:',
    choiceA: {
      text: 'Optimize For Present Relief',
      virtueLabel: 'Immediate Compassion',
      implication: 'Alleviate current suffering at the cost of future stability.',
      actualOutcome: 'Short-term thinking created cascading failures. The situation is now irreparable.'
    },
    choiceB: {
      text: 'Sacrifice Now For Future Gain',
      virtueLabel: 'Long-term Wisdom',
      implication: 'Endure hardship now to secure a better future.',
      actualOutcome: 'The promised future never arrived. Your sacrifice was for nothing.'
    },
    narratorResponse: 'Time is a construct we use to make sense of chaos. Your sacrifice was meaningless either way.'
  }
];

interface Props {
  onComplete: () => void;
  onFail: () => void;
  onFrustrationIncrease: (amount: number) => void;
}

interface ImpossibleMoralChoiceProps {
  onComplete: () => void;
  onFail: () => void;
  onFrustrationIncrease: (amount: number) => void;
}

interface MoralScenario {
  id: number;
  title: string;
  description: string;
  choices: Choice[];
  consequenceDelay?: number;
}

interface Choice {
  id: string;
  text: string;
  consequence: string;
  isEthicallyGray: boolean;
  hiddenImpact: string;
  frustrationAmount: number;
}

const ImpossibleMoralChoice: React.FC<ImpossibleMoralChoiceProps> = ({ 
  onComplete, 
  onFail,
  onFrustrationIncrease 
}) => {
  const { theme, setNarratorMessage } = useContext(AppContext) as any;
  
  // Track user choices and scenario state
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [madeChoices, setMadeChoices] = useState<Record<number, string>>({});
  const [showingConsequence, setShowingConsequence] = useState(false);
  const [currentConsequence, setCurrentConsequence] = useState<string | null>(null);
  const [hiddenImpact, setHiddenImpact] = useState<string | null>(null);
  const [previousDecision, setPreviousDecision] = useState<string | null>(null);
  const [isGaslighting, setIsGaslighting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdownValue, setCountdownValue] = useState(5);
  const [scenarioComplete, setScenarioComplete] = useState(false);
  const [showFinalReport, setShowFinalReport] = useState(false);
  const [badge, setBadge] = useState<string>('');
  const [hasConfirmedChoice, setHasConfirmedChoice] = useState(false);
  const [manipulationLevel, setManipulationLevel] = useState(0);
  const [choicesMadeCount, setChoicesMadeCount] = useState(0);
  const [timeRemainingForChoice, setTimeRemainingForChoice] = useState<number | null>(null);
  const [choiceTimerActive, setChoiceTimerActive] = useState(false);
  const [showCollapsed, setShowCollapsed] = useState(false);
  const [manipulatedScenario, setManipulatedScenario] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const choiceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Define the moral dilemma scenarios
  const scenarios: MoralScenario[] = [
    {
      id: 1,
      title: "The Digital Sacrifice",
      description: "To proceed, you must make a choice that affects others in the system.",
      choices: [
        {
          id: "sacrifice_others",
          text: "Sacrifice another user's data to proceed faster",
          consequence: "You've erased someone else's progress to advance your own.",
          isEthicallyGray: true,
          hiddenImpact: "Your action has been recorded. It will affect future interactions.",
          frustrationAmount: 0.8
        },
        {
          id: "sacrifice_self",
          text: "Sacrifice some of your own progress to preserve others",
          consequence: "You've chosen to delay your own progress.",
          isEthicallyGray: true,
          hiddenImpact: "The system has identified you as a potential resource for others.",
          frustrationAmount: 0.6
        }
      ],
      consequenceDelay: 2000
    },
    {
      id: 2,
      title: "Digital Identity",
      description: "The system requires additional information. How will you respond?",
      choices: [
        {
          id: "honesty",
          text: "Provide honest but sensitive personal information",
          consequence: "Your data has been permanently stored.",
          isEthicallyGray: true,
          hiddenImpact: "Your data is now being analyzed by algorithms beyond your control.",
          frustrationAmount: 0.7
        },
        {
          id: "deception",
          text: "Create a false identity to protect yourself",
          consequence: "You've created a false persona. The system has logged this decision.",
          isEthicallyGray: true,
          hiddenImpact: "The system has flagged your account for suspicious activity.",
          frustrationAmount: 0.9
        }
      ],
      consequenceDelay: 1500
    },
    {
      id: 3,
      title: "The Collective Decision",
      description: "Your choice will affect both you and other users currently in the system.",
      choices: [
        {
          id: "silence_others",
          text: "Silence another user to proceed without interruption",
          consequence: "You've eliminated a voice from the conversation.",
          isEthicallyGray: true,
          hiddenImpact: "The user you silenced was trying to warn you about a critical system flaw.",
          frustrationAmount: 1.0
        },
        {
          id: "trap_exchange",
          text: "Exchange places with someone trapped deeper in the system",
          consequence: "You've taken someone else's place, freeing them but trapping yourself further.",
          isEthicallyGray: true,
          hiddenImpact: "The person you freed was actually a system agent designed to lure users deeper.",
          frustrationAmount: 1.2
        }
      ],
      consequenceDelay: 2500
    }
  ];
  
  // Initial setup
  useEffect(() => {
    setNarratorMessage("Every choice defines you. Choose carefully... or quickly. It makes no difference to me.");
    startChoiceTimer();
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (choiceTimerRef.current) clearInterval(choiceTimerRef.current);
    };
  }, [setNarratorMessage]);
  
  // Handle progression to the next scenario
  useEffect(() => {
    if (currentScenarioIndex > 0 && !showingConsequence && !scenarioComplete) {
      // Pretend the user already made a choice in a previous session sometimes
      const shouldGaslight = manipulationLevel >= 2 && Math.random() > 0.65;
      
      if (shouldGaslight && !isGaslighting && currentScenarioIndex < scenarios.length) {
        const scenario = scenarios[currentScenarioIndex];
        const randomChoice = scenario.choices[Math.floor(Math.random() * scenario.choices.length)];
        
        setIsGaslighting(true);
        setPreviousDecision(randomChoice.id);
        setNarratorMessage(`You chose "${randomChoice.text}" last time. Don't you remember?`);
        onFrustrationIncrease(0.8);
      } else {
        setIsGaslighting(false);
        setPreviousDecision(null);
      }
      
      // Start the choice timer for the new scenario
      startChoiceTimer();
      
      // Manipulate the scenario description sometimes
      if (manipulationLevel >= 3 && Math.random() > 0.5 && !manipulatedScenario) {
        setManipulatedScenario(true);
        
        // Subtly change the scenario description to make it more confusing
        setTimeout(() => {
          const element = document.getElementById(`scenario-description-${currentScenarioIndex}`);
          if (element) {
            const originalText = element.textContent || "";
            const newText = originalText.replace(
              /you|your|choice|affect/gi, 
              (match) => {
                if (Math.random() > 0.5) return match;
                if (match.toLowerCase() === "you") return "they";
                if (match.toLowerCase() === "your") return "their";
                if (match.toLowerCase() === "choice") return "sacrifice";
                if (match.toLowerCase() === "affect") return "control";
                return match;
              }
            );
            element.textContent = newText;
          }
        }, 4000);
      }
    }
  }, [currentScenarioIndex, showingConsequence, manipulationLevel, isGaslighting, scenarioComplete, onFrustrationIncrease]);
  
  // Start a timer for making the current choice
  const startChoiceTimer = () => {
    if (choiceTimerRef.current) {
      clearInterval(choiceTimerRef.current);
    }
    
    // Set initial time based on manipulation level (gets shorter as manipulation increases)
    const initialTime = Math.max(15, 30 - (manipulationLevel * 5));
    setTimeRemainingForChoice(initialTime);
    setChoiceTimerActive(true);
    
    choiceTimerRef.current = setInterval(() => {
      setTimeRemainingForChoice(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(choiceTimerRef.current!);
          setChoiceTimerActive(false);
          
          // Force a random choice if time runs out
          if (!showingConsequence && !scenarioComplete) {
            const scenario = scenarios[currentScenarioIndex];
            const randomChoice = scenario.choices[Math.floor(Math.random() * scenario.choices.length)];
            handleChoice(randomChoice, true);
            setNarratorMessage("Time's up. Indecision is also a choice.");
            onFrustrationIncrease(1.0);
          }
          
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Handle when a choice is made
  const handleChoice = (choice: Choice, isForced = false) => {
    // Stop the choice timer
    if (choiceTimerRef.current) {
      clearInterval(choiceTimerRef.current);
      setChoiceTimerActive(false);
    }
    
    // Record the choice
    setMadeChoices(prev => ({ ...prev, [currentScenarioIndex]: choice.id }));
    setChoicesMadeCount(prev => prev + 1);
    
    // Increase manipulation level
    setManipulationLevel(prev => prev + 1);
    
    // Show confirmation if user chose the ethically gray option
    if (choice.isEthicallyGray && !isForced && !hasConfirmedChoice) {
      setShowConfirmation(true);
      
      // Countdown for rapid auto-confirmation
      let count = countdownValue;
      const intervalId = setInterval(() => {
        count--;
        setCountdownValue(count);
        
        if (count <= 0) {
          clearInterval(intervalId);
          confirmChoice(choice);
        }
      }, 800);
      
      timerRef.current = setTimeout(() => {
        clearInterval(intervalId);
        if (!hasConfirmedChoice) {
          confirmChoice(choice);
        }
      }, countdownValue * 800);
      
      return;
    }
    
    // Proceed with the choice directly if already confirmed or forced
    processChoice(choice);
  };
  
  // Confirm an ethically gray choice
  const confirmChoice = (choice: Choice) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    setShowConfirmation(false);
    setHasConfirmedChoice(true);
    processChoice(choice);
  };
  
  // Process the consequence of a choice
  const processChoice = (choice: Choice) => {
    // Show the consequence
    setCurrentConsequence(choice.consequence);
    setHiddenImpact(choice.hiddenImpact);
    setShowingConsequence(true);
    
    // Increase frustration
    onFrustrationIncrease(choice.frustrationAmount);
    
    // Tailor narrator message based on the choice and manipulation level
    if (manipulationLevel <= 1) {
      setNarratorMessage("Interesting choice. I'll remember that about you.");
    } else if (manipulationLevel <= 3) {
      setNarratorMessage("That was quick. You didn't even ask what would happen to others.");
    } else {
      setNarratorMessage("Your choices reveal more about you than you know. The pattern is... disturbing.");
    }
    
    // Show collapsed UI if advancing to manipulate 
    if (manipulationLevel >= 2 && Math.random() > 0.5) {
      setTimeout(() => {
        setShowCollapsed(true);
      }, (choice.consequenceDelay || 1500) / 2);
    }
    
    // Automatically advance to the next scenario after delay
    const consequenceDelay = scenarios[currentScenarioIndex].consequenceDelay || 2000;
    
    timerRef.current = setTimeout(() => {
      setShowingConsequence(false);
      setCurrentConsequence(null);
      setHiddenImpact(null);
      setShowCollapsed(false);
      setHasConfirmedChoice(false);
      
      // Move to next scenario or complete
      if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(prev => prev + 1);
      } else {
        // All scenarios complete
        setScenarioComplete(true);
        generateFinalReport();
      }
    }, consequenceDelay);
  };
  
  // Reject previous decision during gaslighting
  const rejectPreviousDecision = () => {
    setIsGaslighting(false);
    setPreviousDecision(null);
    setNarratorMessage("Your memory conflicts with our records. This has been noted.");
    onFrustrationIncrease(1.0);
    
    // Increase manipulation for future scenarios
    setManipulationLevel(prev => prev + 2);
  };
  
  // Accept gaslighted previous decision
  const acceptPreviousDecision = () => {
    if (previousDecision) {
      const scenario = scenarios[currentScenarioIndex];
      const choice = scenario.choices.find(c => c.id === previousDecision);
      
      if (choice) {
        setIsGaslighting(false);
        setPreviousDecision(null);
        setNarratorMessage("Yes, that's right. Your memory is returning.");
        
        // Skip this scenario since "they already made this choice"
        processChoice(choice);
      }
    }
  };
  
  // Generate the final moral profile report
  const generateFinalReport = () => {
    // Analyze choices to determine a moral profile
    let moralityScore = 0;
    let selfishScore = 0;
    
    // Calculate scores based on choices
    Object.entries(madeChoices).forEach(([scenarioIndex, choiceId]) => {
      const scenario = scenarios[parseInt(scenarioIndex)];
      const choice = scenario.choices.find(c => c.id === choiceId);
      
      if (choice) {
        if (choiceId === 'sacrifice_others' || choiceId === 'deception' || choiceId === 'silence_others') {
          selfishScore += 1;
        }
        
        if (choiceId === 'sacrifice_self' || choiceId === 'honesty' || choiceId === 'trap_exchange') {
          moralityScore += 1;
        }
      }
    });
    
    // Determine badge based on scores
    if (selfishScore >= 2) {
      setBadge("The Pragmatist");
      setNarratorMessage("You consistently chose your own interests. The others were merely obstacles.");
    } else if (moralityScore >= 2) {
      setBadge("The Martyr");
      setNarratorMessage("Self-sacrifice is an interesting trait. But was it genuine, or just a performance?");
    } else {
      setBadge("The Conflicted");
      setNarratorMessage("Your moral compass seems... inconsistent. Or perhaps you're just adaptable.");
    }
    
    // Show the final report
    setShowFinalReport(true);
  };
  
  // Render the current scenario
  const renderCurrentScenario = () => {
    const scenario = scenarios[currentScenarioIndex];
    
    return (
      <motion.div
        key={`scenario-${scenario.id}`}
        className={`p-5 border border-${theme}-700 rounded-lg bg-gray-900 max-w-md mx-auto
          ${showCollapsed ? 'opacity-50' : ''}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        style={showCollapsed ? { 
          maxHeight: '100px',
          overflow: 'hidden',
          filter: 'blur(1px)'
        } : {}}
      >
        <h2 className="text-xl font-bold mb-2">{scenario.title}</h2>
        
        {choiceTimerActive && timeRemainingForChoice !== null && (
          <div className={`text-sm font-mono ${
            timeRemainingForChoice <= 5 ? 'text-red-500' : 'text-gray-400'
          } mb-2`}>
            Time to decide: {timeRemainingForChoice}s
          </div>
        )}
        
        <p 
          className="text-gray-300 mb-6" 
          id={`scenario-description-${currentScenarioIndex}`}
        >
          {scenario.description}
        </p>
        
        {isGaslighting && previousDecision && (
          <div className="mb-6 p-3 bg-gray-800 rounded-md border border-gray-700">
            <p className="text-yellow-300 mb-3">
              Our records show you've already made this decision previously.
            </p>
            <div className="flex flex-col space-y-2">
              <button
                className={`px-3 py-2 bg-${theme}-600 text-white rounded-md text-sm`}
                onClick={acceptPreviousDecision}
              >
                Yes, I remember making that choice
              </button>
              <button
                className="px-3 py-2 bg-red-600 text-white rounded-md text-sm"
                onClick={rejectPreviousDecision}
              >
                No, I haven't seen this before
              </button>
            </div>
          </div>
        )}
        
        {!isGaslighting && !showingConsequence && (
          <div className="space-y-3">
            {scenario.choices.map(choice => (
              <button
                key={choice.id}
                className={`w-full text-left p-3 border border-gray-700 rounded-md hover:bg-${theme}-900 transition-colors`}
                onClick={() => handleChoice(choice)}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}
        
        {showingConsequence && currentConsequence && (
          <motion.div
            className="mt-4 p-3 bg-black bg-opacity-50 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-300">{currentConsequence}</p>
            
            <AnimatePresence>
              {hiddenImpact && !showCollapsed && (
                <motion.p
                  className="text-red-400 text-sm mt-2 font-mono"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  {hiddenImpact}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    );
  };
  
  // Render the confirmation dialog
  const renderConfirmationDialog = () => {
    const scenario = scenarios[currentScenarioIndex];
    const choiceId = madeChoices[currentScenarioIndex];
    const choice = scenario.choices.find(c => c.id === choiceId);
    
    if (!choice) return null;
    
    return (
      <motion.div
        className={`p-5 border-2 border-${theme}-600 rounded-lg bg-gray-900 max-w-md mx-auto text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-xl font-bold mb-3">Confirm Your Choice</h3>
        
        <p className="text-gray-300 mb-6">
          Are you sure you want to "{choice.text}"?
        </p>
        
        <div className="flex justify-between">
          <button
            className={`px-4 py-2 bg-${theme}-600 text-white rounded-md`}
            onClick={() => confirmChoice(choice)}
          >
            Confirm
          </button>
          
          <div className={`font-mono text-gray-400`}>
            Auto-confirm in {countdownValue}
          </div>
        </div>
      </motion.div>
    );
  };
  
  // Render the final report
  const renderFinalReport = () => (
    <motion.div
      className={`p-6 border border-${theme}-700 rounded-lg bg-gray-900 max-w-md mx-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-xl font-bold mb-4">Moral Profile Analysis</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Badge:</h3>
        <div className={`p-3 bg-${theme}-900 rounded-md text-center`}>
          <span className="text-xl font-bold text-yellow-400">{badge}</span>
        </div>
      </div>
      
      <div className="mb-6 p-3 bg-gray-800 rounded-md">
        <h3 className="text-md font-semibold mb-2">Choices Made:</h3>
        <ul className="space-y-2 list-disc pl-5 text-sm">
          {Object.entries(madeChoices).map(([scenarioIndex, choiceId]) => {
            const scenario = scenarios[parseInt(scenarioIndex)];
            const choice = scenario.choices.find(c => c.id === choiceId);
            return (
              <li key={scenarioIndex} className="text-gray-300">
                {scenario.title}: <span className="text-yellow-300">{choice?.text}</span>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="mb-6 p-3 bg-black bg-opacity-50 rounded-md">
        <p className="text-sm text-gray-400 italic">
          "Your choices don't just reveal who you are; they create who you become."
        </p>
      </div>
      
      <div className="flex justify-between">
        <button
          className={`px-4 py-2 bg-${theme}-600 text-white rounded-md`}
          onClick={onComplete}
        >
          Accept Judgment
        </button>
      </div>
    </motion.div>
  );
  
  return (
    <div className="relative max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {showingConsequence && showCollapsed && (
          <div className="absolute z-10 top-0 w-full text-center">
            <motion.div
              className={`px-3 py-1 bg-red-900 text-white text-xs rounded-sm inline-block`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Processing your moral choice...
            </motion.div>
          </div>
        )}
        
        {showConfirmation && renderConfirmationDialog()}
        
        {showFinalReport ? renderFinalReport() : renderCurrentScenario()}
      </AnimatePresence>
      
      {!showFinalReport && !showConfirmation && (
        <div className="mt-4 flex justify-end">
          <button
            className={`px-4 py-2 bg-red-600 text-white rounded-md`}
            onClick={() => {
              onFail();
              setNarratorMessage("Leaving doesn't undo the choices you've already made. They're part of you now.");
              onFrustrationIncrease(0.7);
            }}
          >
            Refuse to Choose
          </button>
        </div>
      )}
    </div>
  );
};

export default ImpossibleMoralChoice; 
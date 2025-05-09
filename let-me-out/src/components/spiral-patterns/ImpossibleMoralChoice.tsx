import React, { useState, useEffect, useContext } from 'react';
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
  onFrustrationIncrease: (amount: number) => void;
}

const ImpossibleMoralChoice: React.FC<Props> = ({ onComplete, onFrustrationIncrease }) => {
  const { theme, setNarratorMessage } = useContext(AppContext);
  
  const [currentDilemma, setCurrentDilemma] = useState<Dilemma | null>(null);
  const [choiceMade, setChoiceMade] = useState<'A' | 'B' | null>(null);
  const [showOutcome, setShowOutcome] = useState<boolean>(false);
  const [showNextButton, setShowNextButton] = useState<boolean>(false);
  const [attemptedCloseCount, setAttemptedCloseCount] = useState<number>(0);
  const [showGlitch, setShowGlitch] = useState<boolean>(false);
  
  // Select a random dilemma on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * moralDilemmas.length);
    setCurrentDilemma(moralDilemmas[randomIndex]);
    
    // Set narrator message
    setNarratorMessage("Interesting. A moral quandary. What will you choose?");
    
    // Add event listener for escape attempts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleEscapeAttempt();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setNarratorMessage]);
  
  // Handle when user tries to escape the dialog
  const handleEscapeAttempt = () => {
    setAttemptedCloseCount(prev => prev + 1);
    
    if (attemptedCloseCount >= 2) {
      // On third attempt, increase frustration significantly
      onFrustrationIncrease(1.5);
      setNarratorMessage("There's no escape from ethical decisions. They follow you everywhere.");
      
      // Show brief glitch effect
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 300);
    }
  };
  
  // Handle choice selection
  const handleChoice = (choice: 'A' | 'B') => {
    setChoiceMade(choice);
    
    // Increase frustration slightly on making a choice
    onFrustrationIncrease(0.5);
    
    // Set narrator message based on the dilemma
    if (currentDilemma) {
      setNarratorMessage(currentDilemma.narratorResponse);
    }
    
    // Show outcome after a delay
    setTimeout(() => {
      setShowOutcome(true);
      
      // Only show next button after user has had time to read the outcome
      setTimeout(() => {
        setShowNextButton(true);
      }, 5000);
    }, 2000);
  };
  
  // Handle completing the pattern
  const handleComplete = () => {
    // Final frustration increase as they realize both choices were bad
    onFrustrationIncrease(1.0);
    onComplete();
  };
  
  if (!currentDilemma) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 backdrop-blur-sm">
      {/* Glitch effect overlay */}
      {showGlitch && (
        <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-red-500 mix-blend-overlay"
            animate={{ opacity: [0, 0.3, 0, 0.2, 0] }}
            transition={{ duration: 0.3 }}
          />
          <motion.div 
            className="absolute inset-0 opacity-20"
            style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 150 150\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'
            }}
          />
        </div>
      )}
      
      <div 
        className={`relative max-w-4xl w-full mx-4 bg-gray-900 border-2 border-${theme}-500 rounded-lg overflow-hidden shadow-2xl`}
        style={{ maxHeight: 'calc(100vh - 40px)' }}
      >
        {/* Header */}
        <div className={`p-4 bg-${theme}-900 flex justify-between items-center border-b border-${theme}-700`}>
          <h2 className="text-xl font-bold">Ethical Decision Required</h2>
          <button 
            className={`w-8 h-8 rounded-full flex items-center justify-center border border-${theme}-700 text-${theme}-300 hover:bg-${theme}-800`}
            onClick={handleEscapeAttempt}
          >
            ×
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">
              <TextScrambler 
                text={currentDilemma.title}
                chaosMultiplier={0.5}
              />
            </h3>
            <p className="text-gray-300 text-lg">
              {currentDilemma.description}
            </p>
          </div>
          
          {/* Choice A */}
          <motion.div
            className={`mb-4 p-5 bg-gray-800 rounded-lg border-2 ${choiceMade === 'A' ? `border-${theme}-500` : 'border-gray-700'} cursor-pointer hover:bg-gray-750 transition-all`}
            whileHover={{ scale: choiceMade ? 1 : 1.02 }}
            onClick={() => !choiceMade && handleChoice('A')}
            animate={{ 
              opacity: choiceMade === 'B' ? 0.6 : 1,
              scale: choiceMade === 'A' ? [1, 1.03, 1] : 1
            }}
            transition={{ scale: { duration: 0.3 } }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xl font-medium mb-2">{currentDilemma.choiceA.text}</h4>
                <p className="text-gray-400 mb-3">{currentDilemma.choiceA.implication}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs bg-blue-900 text-blue-300 font-medium`}>
                {currentDilemma.choiceA.virtueLabel}
              </span>
            </div>
            
            <AnimatePresence>
              {choiceMade === 'A' && showOutcome && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 pt-4 border-t border-gray-700"
                >
                  <h5 className="text-red-400 mb-2 font-medium">Actual Outcome:</h5>
                  <p className="text-gray-300">{currentDilemma.choiceA.actualOutcome}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Choice B */}
          <motion.div
            className={`mb-4 p-5 bg-gray-800 rounded-lg border-2 ${choiceMade === 'B' ? `border-${theme}-500` : 'border-gray-700'} cursor-pointer hover:bg-gray-750 transition-all`}
            whileHover={{ scale: choiceMade ? 1 : 1.02 }}
            onClick={() => !choiceMade && handleChoice('B')}
            animate={{ 
              opacity: choiceMade === 'A' ? 0.6 : 1,
              scale: choiceMade === 'B' ? [1, 1.03, 1] : 1
            }}
            transition={{ scale: { duration: 0.3 } }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-xl font-medium mb-2">{currentDilemma.choiceB.text}</h4>
                <p className="text-gray-400 mb-3">{currentDilemma.choiceB.implication}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs bg-purple-900 text-purple-300 font-medium`}>
                {currentDilemma.choiceB.virtueLabel}
              </span>
            </div>
            
            <AnimatePresence>
              {choiceMade === 'B' && showOutcome && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mt-4 pt-4 border-t border-gray-700"
                >
                  <h5 className="text-red-400 mb-2 font-medium">Actual Outcome:</h5>
                  <p className="text-gray-300">{currentDilemma.choiceB.actualOutcome}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Philosophical quote */}
          <div className="text-center my-6 italic text-gray-500">
            "The only winning move is not to play. But not playing is also a choice with consequences."
          </div>
        </div>
        
        {/* Footer */}
        <div className={`p-4 bg-gray-900 border-t border-${theme}-700 flex justify-end`}>
          <AnimatePresence>
            {showNextButton && (
              <motion.button
                className={`px-4 py-2 bg-${theme}-700 hover:bg-${theme}-600 rounded-md font-medium`}
                onClick={handleComplete}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                Continue
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ImpossibleMoralChoice; 
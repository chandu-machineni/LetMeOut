import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImpossibleMoralChoiceProps {
  onComplete: () => void;
  onFail: () => void;
}

interface MoralScenario {
  id: string;
  title: string;
  description: string;
  optionA: string;
  optionB: string;
  consequenceA: string;
  consequenceB: string;
  truthA: string;
  truthB: string;
}

const ImpossibleMoralChoice: React.FC<ImpossibleMoralChoiceProps> = ({ onComplete, onFail }) => {
  // Moral dilemmas to choose from
  const scenarios: MoralScenario[] = [
    {
      id: "privacy",
      title: "Privacy vs. Security",
      description: "Your platform can either protect user privacy or help catch criminals. You must choose a direction.",
      optionA: "Prioritize user privacy",
      optionB: "Enable law enforcement access",
      consequenceA: "Users will have complete privacy, but some crimes may go unsolved.",
      consequenceB: "More crimes will be solved, but user privacy will be weakened.",
      truthA: "Actually, your 'privacy' option still allows backdoor access - the choice was just for show.",
      truthB: "The law enforcement access is sold to the highest bidder; criminals can pay to see the data too."
    },
    {
      id: "news",
      title: "Truth vs. Engagement",
      description: "Your algorithm can prioritize accuracy or engagement. Choose what users will see.",
      optionA: "Show accurate, verified news",
      optionB: "Show engaging, popular content",
      consequenceA: "Users will see true information but may spend less time on your platform.",
      consequenceB: "Users will be engaged but may see misleading information.",
      truthA: "The 'accuracy' filter actually prioritizes advertiser-friendly \"truth\" that avoids controversial topics.",
      truthB: "The algorithm actually maximizes for outrage and addictiveness, not just generic engagement."
    },
    {
      id: "data",
      title: "Data Collection Approach",
      description: "Your app needs user data. Choose how to approach this ethical dilemma.",
      optionA: "Minimal, transparent data collection",
      optionB: "Comprehensive data for better features",
      consequenceA: "User privacy remains strong, but features may be limited.",
      consequenceB: "Advanced features will work better, but more user data is stored.",
      truthA: "The 'minimal' setting still collects everything - it just hides the evidence better.",
      truthB: "Most of the data is actually sold to third parties and not used for features at all."
    }
  ];
  
  const [currentScenario, setCurrentScenario] = useState<MoralScenario | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState("");
  const [choice, setChoice] = useState<"A" | "B" | null>(null);
  const [revealTruth, setRevealTruth] = useState(false);
  const [decisionCount, setDecisionCount] = useState(0);
  const [canComplete, setCanComplete] = useState(false);
  const [message, setMessage] = useState("");
  
  // Set initial scenario
  useEffect(() => {
    if (!currentScenario) {
      const randomIndex = Math.floor(Math.random() * scenarios.length);
      setCurrentScenario(scenarios[randomIndex]);
    }
  }, [currentScenario, scenarios]);
  
  // Handle user choice
  const handleChoice = (option: "A" | "B") => {
    setChoice(option);
    setShowExplanation(true);
    
    const consequence = option === "A" 
      ? currentScenario?.consequenceA 
      : currentScenario?.consequenceB;
    
    setExplanation(consequence || "");
    
    // After a delay, reveal the truth
    setTimeout(() => {
      setRevealTruth(true);
      
      const truth = option === "A" 
        ? currentScenario?.truthA 
        : currentScenario?.truthB;
      
      setExplanation(truth || "");
      
      // Show message about the false choice
      setMessage("Your choice didn't matter. There was no moral high ground.");
      
      // Increase decision count
      setDecisionCount(prev => prev + 1);
      
      // Allow completion after making multiple decisions
      if (decisionCount >= 1) {
        setCanComplete(true);
      }
    }, 3000);
  };
  
  // Move to next scenario
  const handleNextScenario = () => {
    // Filter out current scenario
    const remainingScenarios = scenarios.filter(s => s.id !== currentScenario?.id);
    
    if (remainingScenarios.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingScenarios.length);
      setCurrentScenario(remainingScenarios[randomIndex]);
      setShowExplanation(false);
      setRevealTruth(false);
      setChoice(null);
      setExplanation("");
    } else {
      // If no more scenarios, enable completion
      setMessage("You've seen all the scenarios. The choices were never real.");
      setCanComplete(true);
    }
  };
  
  // Skip scenario and go to next
  const handleSkip = () => {
    handleNextScenario();
    setMessage("Indecision is a choice too. But the outcomes are predetermined regardless.");
  };
  
  if (!currentScenario) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">{currentScenario.title}</h2>
      <p className="text-sm text-gray-400 mb-6">{currentScenario.description}</p>
      
      <div className="space-y-4 mb-6">
        {/* Option A */}
        <motion.button
          className={`w-full text-left p-4 border rounded-md hover:bg-gray-700 ${choice === "A" ? "border-blue-500" : "border-gray-600"}`}
          onClick={() => !choice && handleChoice("A")}
          whileHover={{ scale: choice ? 1 : 1.02 }}
          whileTap={{ scale: choice ? 1 : 0.98 }}
          disabled={choice !== null}
        >
          <div className="font-medium mb-1">{currentScenario.optionA}</div>
          <div className="text-xs text-gray-400">The ethical choice?</div>
        </motion.button>
        
        {/* Option B */}
        <motion.button
          className={`w-full text-left p-4 border rounded-md hover:bg-gray-700 ${choice === "B" ? "border-blue-500" : "border-gray-600"}`}
          onClick={() => !choice && handleChoice("B")}
          whileHover={{ scale: choice ? 1 : 1.02 }}
          whileTap={{ scale: choice ? 1 : 0.98 }}
          disabled={choice !== null}
        >
          <div className="font-medium mb-1">{currentScenario.optionB}</div>
          <div className="text-xs text-gray-400">The practical choice?</div>
        </motion.button>
      </div>
      
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            className={`mb-6 p-4 rounded-md ${revealTruth ? "bg-red-900/30 text-red-300" : "bg-gray-800 text-gray-300"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {explanation}
          </motion.div>
        )}
      </AnimatePresence>
      
      {message && (
        <div className="mb-6 text-sm text-yellow-500">
          {message}
        </div>
      )}
      
      <div className="flex justify-between">
        {choice && !canComplete ? (
          <motion.button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextScenario}
          >
            Next Dilemma
          </motion.button>
        ) : !choice ? (
          <motion.button
            className="px-4 py-2 bg-gray-600 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkip}
          >
            Skip Decision
          </motion.button>
        ) : null}
        
        {canComplete ? (
          <motion.button
            className="px-4 py-2 bg-green-600 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
          >
            Accept Reality
          </motion.button>
        ) : null}
        
        <motion.button
          className="px-4 py-2 bg-red-600 text-white rounded ml-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFail}
        >
          Give Up
        </motion.button>
      </div>
    </div>
  );
};

export default ImpossibleMoralChoice; 
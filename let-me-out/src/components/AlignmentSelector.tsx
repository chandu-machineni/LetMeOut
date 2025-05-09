import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import Stage from './Stage';
import TextScrambler from './TextScrambler';

// Define alignment types for clarity
type Alignment = 'evil_apprentice' | 'shadow_enthusiast' | 'dark_tourist' | 'escapist';

interface AlignmentOption {
  id: Alignment;
  emoji: string;
  title: string;
  description: string;
  narratorTone: string;
  badges: string[];
  warning: string;
}

const alignmentOptions: AlignmentOption[] = [
  {
    id: 'evil_apprentice',
    emoji: '🔥',
    title: 'Evil UX Apprentice',
    description: 'You want to learn the dark arts of UX manipulation. You\'re here to study the techniques.',
    narratorTone: 'Instructive, like a mentor teaching forbidden knowledge',
    badges: ['Pattern Master', 'Dark Designer', 'Manipulation Engineer'],
    warning: 'You will be taught techniques that shouldn\'t be used in real products.'
  },
  {
    id: 'shadow_enthusiast',
    emoji: '🕷️',
    title: 'Shadow Pattern Enthusiast',
    description: 'You appreciate the artistry of deceptive interfaces. The more clever the trap, the better.',
    narratorTone: 'Admiring, sharing secrets between connoisseurs',
    badges: ['Pattern Collector', 'Deception Aesthete', 'Trap Navigator'],
    warning: 'Your appreciation of dark patterns may change how you see real websites.'
  },
  {
    id: 'dark_tourist',
    emoji: '🌑',
    title: 'Dark Side Tourist',
    description: 'You\'re just curious what evil UX looks like. You want to experience it safely.',
    narratorTone: 'Tour guide showing the horrors, slightly condescending',
    badges: ['Pattern Witness', 'UX Survivor', 'Ethical Observer'],
    warning: 'Even as a tourist, you may find yourself influenced by what you see.'
  },
  {
    id: 'escapist',
    emoji: '🤖',
    title: 'I Just Want to Escape',
    description: 'You\'re trapped here and just want to find the way out. This is torture, not education.',
    narratorTone: 'Taunting, sadistic, enjoying your frustration',
    badges: ['Escape Artist', 'Pattern Fighter', 'Resilient User'],
    warning: 'There is no true escape. But your resistance will be... entertaining.'
  }
];

const AlignmentSelector: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setNarratorMessage } = useContext(AppContext);
  
  // Get context and extract the setUserAlignment function
  const context = useContext(AppContext) as any;
  const setUserAlignmentFromContext = context.setUserAlignment;
  
  const [selectedAlignment, setSelectedAlignment] = useState<Alignment | null>(null);
  const [isHovering, setIsHovering] = useState<Alignment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [glitchText, setGlitchText] = useState(false);
  
  // Update the narrator message when component mounts
  useEffect(() => {
    setNarratorMessage("What brings you to the spiral? Your purpose says much about your fate.");
  }, [setNarratorMessage]);
  
  // Safe wrapper for setting the user alignment
  const handleSetUserAlignment = (alignment: Alignment) => {
    if (setUserAlignmentFromContext) {
      setUserAlignmentFromContext(alignment);
    }
  };
  
  const handleAlignmentSelect = (alignment: Alignment) => {
    setSelectedAlignment(alignment);
    
    // Narrator reactions based on selection
    switch (alignment) {
      case 'evil_apprentice':
        setNarratorMessage("So you want to learn our ways? Everyone starts somewhere.");
        break;
      case 'shadow_enthusiast':
        setNarratorMessage("A connoisseur of darkness. You'll find plenty to enjoy here.");
        break;
      case 'dark_tourist':
        setNarratorMessage("Just visiting? We'll see about that.");
        break;
      case 'escapist':
        setNarratorMessage("Oh, you think you'll find a way out? How endearing.");
        break;
    }
  };
  
  const handleContinue = () => {
    if (!selectedAlignment) return;
    
    setIsSubmitting(true);
    
    // Set the user alignment in context
    handleSetUserAlignment(selectedAlignment);
    
    // Continue to the core spiral experience
    setTimeout(() => {
      navigate('/spiral-core');
    }, 1000);
  };
  
  // Glitch text periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 300);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Stage
      stageNumber={2}
      title="Your Role in the Spiral"
      description="Choose your alignment to customize your journey"
      onComplete={() => {}}
    >
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
        <motion.div
          className="mb-8 text-center max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className={`text-2xl font-bold mb-2 ${glitchText ? 'text-glitch' : ''}`}>
            {glitchText ? (
              <TextScrambler 
                text="Which side are you on?" 
                chaosMultiplier={2} 
              />
            ) : (
              "Which side are you on?"
            )}
          </h2>
          <p className="text-gray-400">
            Your alignment will affect narrator tone, badge types, and available escape routes.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-12">
          {alignmentOptions.map((option) => (
            <motion.div
              key={option.id}
              className={`selection-card 
              ${selectedAlignment === option.id ? `border-${theme}-500` : `border-${theme}-800`}`}
              onClick={() => handleAlignmentSelect(option.id)}
              onMouseEnter={() => setIsHovering(option.id)}
              onMouseLeave={() => setIsHovering(null)}
            >
              <div className={`p-5 bg-${theme}-900 h-full flex flex-col`}>
                <div className="text-2xl mb-2">{option.emoji}</div>
                <h3 className="text-lg font-bold mb-2">{option.title}</h3>
                
                <p className="text-gray-400 mb-3 text-sm">
                  {option.description}
                </p>
                
                <div className="mt-auto">
                  {selectedAlignment === option.id && (
                    <motion.div 
                      className={`text-${theme}-400 text-sm font-medium mt-2`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Selected
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Additional info on hover */}
              <AnimatePresence>
                {isHovering === option.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                  >
                    <div className="text-xs text-gray-400 mb-1">
                      <span className="text-yellow-400">Narrator tone:</span> {option.narratorTone}
                    </div>
                    <div className="text-xs text-gray-400 mb-1">
                      <span className="text-yellow-400">Example badges:</span> {option.badges.join(', ')}
                    </div>
                    <div className="text-xs text-red-400 mt-2">
                      {option.warning}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <motion.button
          className={`px-8 py-3 bg-${theme}-600 hover:bg-${theme}-500 text-white rounded-lg font-medium ${!selectedAlignment && 'opacity-50 cursor-not-allowed'}`}
          onClick={handleContinue}
          disabled={!selectedAlignment || isSubmitting}
          whileHover={selectedAlignment ? { scale: 1.05 } : {}}
          whileTap={selectedAlignment ? { scale: 0.98 } : {}}
        >
          {isSubmitting ? "Processing Alignment..." : "Continue"}
        </motion.button>
        
        {/* Add glitch text style */}
        <style>{`
          .text-glitch {
            position: relative;
            animation: textGlitch 0.3s infinite;
          }
          
          @keyframes textGlitch {
            0% { transform: translate(0); text-shadow: none; }
            25% { transform: translate(-2px, 1px); text-shadow: -2px 0 red, 2px 2px blue; }
            50% { transform: translate(2px, -1px); text-shadow: 2px 0 green, -2px -2px purple; }
            75% { transform: translate(-1px, -2px); text-shadow: -2px 0 yellow, 2px 2px cyan; }
            100% { transform: translate(0); text-shadow: none; }
          }
        `}</style>
      </div>
    </Stage>
  );
};

export default AlignmentSelector; 
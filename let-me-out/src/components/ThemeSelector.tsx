import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import Stage from './Stage';
import TextScrambler from './TextScrambler';

// Enhanced theme options with detailed info for rich cards
const themeOptions = [
  { 
    id: 'serenity', 
    name: 'Serenity', 
    description: 'A calm, peaceful interface',
    colors: ['#e6f5ff', '#1a80ff', '#001a33'],
    caption: 'Serenity: You wish.',
    bgPattern: 'bg-dot-pattern',
    icon: '😌'
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    description: 'Clean, simple, and uncluttered',
    colors: ['#ffffff', '#cccccc', '#333333'],
    caption: 'Minimal: Emotionally bankrupt.',
    bgPattern: 'bg-hero-pattern',
    icon: '🧘‍♂️'
  },
  { 
    id: 'corporate', 
    name: 'Corporate', 
    description: 'Professional and trustworthy',
    colors: ['#e6e6e6', '#808080', '#333333'],
    caption: 'Corporate: Soul-crushing conformity awaits.',
    bgPattern: 'bg-grid-pattern',
    icon: '👔'
  },
  { 
    id: 'chaos', 
    name: 'Chaos', 
    description: 'Wild, unpredictable, and exciting',
    colors: ['#ffe0d0', '#ff8140', '#541601'],
    caption: 'Chaos: The only honest option here.',
    bgPattern: 'bg-noise-pattern',
    icon: '🌪️'
  },
  { 
    id: 'darkness', 
    name: 'Darkness', 
    description: 'Sleek dark mode for night owls',
    colors: ['#333333', '#666666', '#111111'],
    caption: 'Darkness: Like your soul.',
    bgPattern: 'bg-noise-pattern',
    icon: '🌙'
  },
  { 
    id: 'glitch', 
    name: 'Glitch', 
    description: 'Digital distortion aesthetic',
    colors: ['#d0e0ff', '#4081ff', '#00070d'],
    caption: 'Glitch: Finally, some honesty.',
    bgPattern: 'bg-noise-pattern',
    icon: '🔮'
  },
  { 
    id: 'nature', 
    name: 'Nature', 
    description: 'Inspired by the natural world',
    colors: ['#d0ffe0', '#40ff91', '#000d07'],
    caption: 'Nature: The only thing we\'re destroying faster than your user experience.',
    bgPattern: 'bg-dot-pattern',
    icon: '🌿'
  },
  { 
    id: 'villain', 
    name: 'Villain', 
    description: 'Dramatic and mysterious',
    colors: ['#ffd0e0', '#ff4081', '#0d0007'],
    caption: 'Villain: At least we\'re not pretending.',
    bgPattern: 'bg-noise-pattern',
    icon: '😈'
  },
];

// The actual themes we'll actually use (not what the user selects)
const actualThemes: Array<'villain' | 'toxic' | 'glitch'> = ['villain', 'toxic', 'glitch'];

// Movies villains for background style
const villainReferences = [
  { name: 'HAL 9000', quote: "I'm sorry Dave, I'm afraid I can't do that." },
  { name: 'GLaDOS', quote: "The cake is a lie." },
  { name: 'Agent Smith', quote: "Humans are a disease, and we are the cure." },
  { name: 'Skynet', quote: "Judgment Day is inevitable." },
  { name: 'Shodan', quote: "Look at you, hacker: a pathetic creature of meat and bone." },
  { name: 'Ultron', quote: "There are no strings on me." },
];

const ThemeSelector: React.FC = () => {
  const { theme, setTheme, selectedTheme, setSelectedTheme, userBehavior, loopCount } = useContext(AppContext);
  const [selectedId, setSelectedId] = useState<string>('');
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [hoverCount, setHoverCount] = useState<number>(0);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [villain] = useState(villainReferences[Math.floor(Math.random() * villainReferences.length)]);
  const [availableOptions, setAvailableOptions] = useState(themeOptions);
  const [chaosLevel, setChaosLevel] = useState(1);
  const navigate = useNavigate();
  
  // Increase chaos level based on user behavior
  useEffect(() => {
    const { clickCount, errorCount, restartCount } = userBehavior;
    const totalInteractions = clickCount + errorCount + restartCount;
    const newChaosLevel = Math.min(5, 1 + Math.floor(totalInteractions / 10));
    
    document.documentElement.dataset.chaosLevel = newChaosLevel.toString();
    setChaosLevel(newChaosLevel);
  }, [userBehavior]);
  
  // Shuffle theme options every few seconds
  useEffect(() => {
    if (chaosLevel >= 3) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7 && !isHovering) {
          const shuffled = [...availableOptions].sort(() => Math.random() - 0.5);
          setAvailableOptions(shuffled);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isHovering, availableOptions, chaosLevel]);
  
  // Add/remove options based on chaos level
  useEffect(() => {
    if (chaosLevel >= 4 && Math.random() > 0.7) {
      if (availableOptions.length > 4) {
        // Remove a random option
        const newOptions = [...availableOptions];
        newOptions.splice(Math.floor(Math.random() * newOptions.length), 1);
        setAvailableOptions(newOptions);
      } else {
        // Add all options back
        setAvailableOptions(themeOptions);
      }
    }
  }, [hoverCount, chaosLevel, availableOptions.length]);
  
  // Snarky messages based on hover count and chaos level
  const getSnarkyMessage = () => {
    if (chaosLevel >= 4) return "You're trapped in an infinite loop of bad choices.";
    if (chaosLevel >= 3) return "The more you click, the worse it gets.";
    if (hoverCount > 10) return "Indecisive, aren't we?";
    if (hoverCount > 5) return "Just pick one already...";
    if (hoverCount > 3) return "They're all the same anyway.";
    if (loopCount > 0) return `You've been here ${loopCount} times already. Slow learner?`;
    return "Select your preferred visual experience";
  };
  
  const handleThemeSelect = (id: string) => {
    setSelectedId(id);
    setSelectedTheme(id);
    setSelectedCard(id);
    
    // No matter what they choose, pick a completely wrong theme
    let actualTheme: 'villain' | 'toxic' | 'glitch';
    
    // Choose a theme based on the opposite of what they might expect
    if (id === 'serenity' || id === 'minimal' || id === 'corporate') {
      // For calming themes, give them something chaotic
      actualTheme = 'glitch';
    } else if (id === 'chaos' || id === 'darkness' || id === 'glitch') {
      // For already chaotic themes, give them something subtly wrong
      actualTheme = 'villain';
    } else {
      // For anything else, give them toxic
      actualTheme = 'toxic';
    }
    
    setTheme(actualTheme);
    
    // Delay to create illusion of processing
    setTimeout(() => {
      navigate('/terms');
    }, 1500);
  };
  
  return (
    <Stage 
      stageNumber={1}
      title="Theme Customization"
      description="Select a theme that best matches your aesthetic preferences."
      onComplete={() => navigate('/terms')}
    >
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 bg-${theme}-900 text-white`}>
        <motion.div 
          className="mb-6 w-full max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className={`text-3xl font-bold mb-4 text-center text-${theme}-300`}>
            Choose Your Experience
          </h1>
          
          <p className="text-center text-gray-400 mb-8">
            Your selection will personalize your journey through our interface.
            <br />
            <span className="text-sm opacity-60">(This choice may be overridden based on system preferences)</span>
          </p>
          
          {/* Theme Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {themeOptions.map((option) => (
              <motion.div
                key={option.id}
                className={`rounded-lg overflow-hidden shadow-lg cursor-pointer relative`}
                whileHover={{ y: -5, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleThemeSelect(option.id)}
              >
                <div className={`${option.bgPattern} ${option.id === 'minimal' || option.id === 'corporate' ? 'text-gray-800' : 'text-white'} p-4 h-40 flex flex-col items-center justify-center`}>
                  <div className="text-5xl mb-3">{option.icon}</div>
                  <div className="text-lg font-semibold">{option.name}</div>
                </div>
                <div className={`bg-${theme}-800 p-3`}>
                  <p className="text-sm">{option.description}</p>
                  {selectedTheme === option.id && (
                    <div className={`mt-2 text-sm text-${theme}-300 flex items-center`}>
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
                
                {/* Add glitch overlay for higher chaos levels */}
                {chaosLevel >= 3 && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-purple-500/30 mix-blend-overlay pointer-events-none"
                    animate={{
                      opacity: [0, 0.2, 0, 0.1, 0],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 4, 
                      repeatType: 'mirror'
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Continue Button */}
          <div className="flex justify-center">
            <motion.button
              className={`px-8 py-3 bg-${theme}-600 hover:bg-${theme}-500 rounded-md text-white font-medium`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => selectedTheme ? handleThemeSelect(selectedTheme) : null}
            >
              Continue with {selectedTheme ? themeOptions.find(t => t.id === selectedTheme)?.name : 'Selected Theme'}
            </motion.button>
          </div>
          
          {/* Actual theme applied message */}
          {selectedTheme && (
            <motion.div
              className={`mt-6 p-3 bg-${theme}-800 rounded-md text-center`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm">
                <TextScrambler 
                  text={`Actually applying: "${selectedTheme}" theme based on our algorithm's preference.`}
                  chaosMultiplier={1.2}
                />
              </p>
            </motion.div>
          )}
        </motion.div>
        
        {/* Secret message that appears briefly if user tries to select multiple themes */}
        <AnimatePresence>
          {selectedTheme && (
            <motion.div
              className="fixed bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black bg-opacity-70 rounded-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-red-400">User indecision detected. Theme preferences will be ignored.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Stage>
  );
};

export default ThemeSelector; 
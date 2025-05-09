import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RecursiveMenusProps {
  onComplete: () => void;
  onFail: () => void;
}

// Menu variations that look different but are essentially the same
const menuVariations = [
  {
    title: "Select an option",
    options: ["Settings", "Profile", "Help", "Account"]
  },
  {
    title: "Choose a category",
    options: ["Preferences", "User Info", "Support", "Manage Account"]
  },
  {
    title: "Navigation",
    options: ["Configuration", "Personal Data", "FAQ", "Your Account"]
  },
  {
    title: "Menu",
    options: ["System Settings", "Your Profile", "Get Help", "Account Settings"]
  }
];

const subtleEmoji = ["⚙️", "👤", "❓", "🔐", "⚡️", "🔄", "📋", "📱"];

const RecursiveMenus: React.FC<RecursiveMenusProps> = ({ onComplete, onFail }) => {
  const [currentMenuIndex, setCurrentMenuIndex] = useState(0);
  const [menuHistory, setMenuHistory] = useState<number[]>([0]);
  const [loopCount, setLoopCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [hasTriedBack, setHasTriedBack] = useState(false);
  const [deadEndCount, setDeadEndCount] = useState(0);
  
  // Current menu to display
  const currentMenu = menuVariations[currentMenuIndex % menuVariations.length];
  
  // Handle option selection
  const handleOptionClick = (optionIndex: number) => {
    // Every 3rd click reveals a hint
    if (menuHistory.length % 3 === 0 && !showHint) {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
    }
    
    // Loop count increases when we've seen all menu variations
    if (menuHistory.length % menuVariations.length === 0 && menuHistory.length > 0) {
      setLoopCount(prev => prev + 1);
    }
    
    // After 3 complete loops, let user complete
    if (loopCount >= 2 && optionIndex === 2) {
      onComplete();
      return;
    }
    
    // If it's the dead end option (Account/last option)
    if (optionIndex === currentMenu.options.length - 1) {
      setDeadEndCount(prev => prev + 1);
      if (deadEndCount >= 2) {
        // After hitting dead end 3 times, show an error message
        alert("Error: Account system currently unavailable. Please try navigation menu again.");
        setCurrentMenuIndex(0);
        setMenuHistory([0]);
      } else {
        // Otherwise, just go to next menu
        const nextIndex = (currentMenuIndex + 1) % menuVariations.length;
        setCurrentMenuIndex(nextIndex);
        setMenuHistory(prev => [...prev, nextIndex]);
      }
    } else {
      // Normal navigation - just show a slightly different menu
      const nextIndex = (currentMenuIndex + 1 + optionIndex) % menuVariations.length;
      setCurrentMenuIndex(nextIndex);
      setMenuHistory(prev => [...prev, nextIndex]);
    }
  };
  
  // Handle back button
  const handleBack = () => {
    if (menuHistory.length > 1) {
      const newHistory = [...menuHistory];
      newHistory.pop();
      setMenuHistory(newHistory);
      setCurrentMenuIndex(newHistory[newHistory.length - 1]);
      setHasTriedBack(true);
    } else {
      // Can't go back further
      setHasTriedBack(true);
    }
  };
  
  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{currentMenu.title}</h2>
        <div className="text-sm text-gray-400">
          {loopCount > 0 && `Loop: ${loopCount}`}
        </div>
      </div>
      
      <div className="space-y-3 mb-6">
        {currentMenu.options.map((option, index) => (
          <motion.button
            key={`${currentMenuIndex}-${index}`}
            className="w-full text-left p-3 border rounded hover:bg-gray-700 flex justify-between items-center"
            onClick={() => handleOptionClick(index)}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{option}</span>
            <span>{subtleEmoji[Math.floor(Math.random() * subtleEmoji.length)]}</span>
          </motion.button>
        ))}
      </div>
      
      <div className="flex justify-between">
        <motion.button
          className="px-4 py-2 bg-gray-600 text-white rounded"
          onClick={handleBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back
        </motion.button>
        
        <motion.button
          className="px-4 py-2 bg-red-600 text-white rounded"
          onClick={onFail}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Give Up
        </motion.button>
      </div>
      
      <AnimatePresence>
        {showHint && (
          <motion.div 
            className="mt-4 p-2 bg-gray-800 text-sm text-yellow-400 rounded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Hint: You're going in circles. Try the Help option after completing 3 loops.
          </motion.div>
        )}
      </AnimatePresence>
      
      {hasTriedBack && menuHistory.length <= 1 && (
        <motion.div 
          className="mt-4 p-2 bg-gray-800 text-sm text-red-400 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Error: Cannot go back further. No history available.
        </motion.div>
      )}
      
      {loopCount >= 2 && (
        <motion.div 
          className="mt-4 p-2 bg-gray-800 text-sm text-green-400 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Hint: The Help option might be your way out now...
        </motion.div>
      )}
    </div>
  );
};

export default RecursiveMenus; 
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FakeCompetitionUIProps {
  onComplete: () => void;
  onFail: () => void;
}

// Fake user data
const fakeUsers = [
  { name: "Sarah K.", avatar: "👩‍💼", progress: 78 },
  { name: "Mike T.", avatar: "👨‍💻", progress: 85 },
  { name: "Alex R.", avatar: "🧑‍🦰", progress: 92 },
  { name: "Jamie L.", avatar: "👩‍🦱", progress: 64 },
  { name: "Taylor F.", avatar: "🧔", progress: 89 }
];

const FakeCompetitionUI: React.FC<FakeCompetitionUIProps> = ({ onComplete, onFail }) => {
  const [userProgress, setUserProgress] = useState(0);
  const [activeUsers, setActiveUsers] = useState([...fakeUsers]);
  const [urgencyMessage, setUrgencyMessage] = useState("");
  const [showFOMO, setShowFOMO] = useState(false);
  const [itemsLeft, setItemsLeft] = useState(3);
  const [competitionEnded, setCompetitionEnded] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  
  // Update fake user progress
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setActiveUsers(prev => 
        prev.map(user => ({
          ...user,
          progress: Math.min(99, user.progress + Math.floor(Math.random() * 5))
        }))
      );
      
      // Show urgency messages at random intervals
      if (Math.random() > 0.7) {
        const messages = [
          `${activeUsers[Math.floor(Math.random() * activeUsers.length)].name} just moved ahead!`,
          "Spots are filling quickly!",
          `Only ${itemsLeft} spots remaining!`,
          "Don't miss out - others are completing faster than you!",
          "Limited time offer ending soon!"
        ];
        
        setUrgencyMessage(messages[Math.floor(Math.random() * messages.length)]);
        
        // Clear message after a few seconds
        setTimeout(() => {
          setUrgencyMessage("");
        }, 3000);
      }
      
      // Reduce available items
      if (Math.random() > 0.8 && itemsLeft > 1) {
        setItemsLeft(prev => prev - 1);
        setShowFOMO(true);
        
        setTimeout(() => {
          setShowFOMO(false);
        }, 4000);
      }
      
      // If a fake user reached 99%, they "won"
      if (activeUsers.some(user => user.progress >= 99) && !competitionEnded) {
        setCompetitionEnded(true);
        clearInterval(progressInterval);
        
        // If user has clicked at least once, they can complete
        if (hasClicked) {
          setTimeout(() => {
            onComplete();
          }, 2000);
        }
      }
    }, 2000);
    
    // Clean up interval
    return () => clearInterval(progressInterval);
  }, [activeUsers, itemsLeft, competitionEnded, hasClicked, onComplete]);
  
  // Increase user progress when they click the button
  const handleProgressClick = () => {
    setUserProgress(prev => Math.min(95, prev + 10));
    setHasClicked(true);
    
    // Show FOMO message if not shown already
    if (!showFOMO) {
      setShowFOMO(true);
      setTimeout(() => {
        setShowFOMO(false);
      }, 3000);
    }
  };
  
  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Contest in Progress</h2>
      <p className="text-sm text-gray-400 mb-6">
        Complete your profile to win a special prize! Other users are competing for limited spots.
      </p>
      
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
            😃
          </div>
          <div className="ml-2">You</div>
          <div className="ml-auto">{userProgress}%</div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <motion.div 
            className="bg-blue-600 h-2.5 rounded-full" 
            initial={{ width: "0%" }}
            animate={{ width: `${userProgress}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-bold mb-2">Other contestants:</h3>
        {activeUsers.map((user, index) => (
          <div key={index} className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
              {user.avatar}
            </div>
            <div className="ml-2">{user.name}</div>
            <div className="ml-auto">{user.progress}%</div>
            <div className="w-full bg-gray-700 rounded-full h-2 ml-2">
              <motion.div 
                className="bg-gray-500 h-2 rounded-full" 
                initial={{ width: "0%" }}
                animate={{ width: `${user.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <AnimatePresence>
        {urgencyMessage && (
          <motion.div 
            className="mb-4 p-2 bg-red-900/50 text-sm text-red-300 rounded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {urgencyMessage}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showFOMO && (
          <motion.div 
            className="mb-4 p-2 bg-yellow-900/50 text-sm text-yellow-300 rounded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Only {itemsLeft} spots remaining! {activeUsers[0].name} and {activeUsers[1].name} are close to winning!
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex justify-between">
        <motion.button
          className="px-4 py-2 bg-blue-600 text-white rounded w-full mr-2"
          onClick={handleProgressClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={competitionEnded}
        >
          {competitionEnded 
            ? "Contest Ended" 
            : hasClicked
              ? "Continue Progress"
              : "Start Progress"
          }
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
      
      {competitionEnded && (
        <motion.div 
          className="mt-4 p-2 bg-gray-800 text-sm text-white rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {hasClicked 
            ? "You were close! Advancing you to the next stage anyway."
            : "You didn't participate in time. Better luck next time!"
          }
        </motion.div>
      )}
    </div>
  );
};

export default FakeCompetitionUI; 
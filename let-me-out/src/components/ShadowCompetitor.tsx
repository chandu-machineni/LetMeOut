import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';

// Generate a random username with number suffix
const generateUsername = () => {
  const names = ['ShadowUser', 'VoidRunner', 'PatternMaster', 'DarkUser', 'SpiralVoyager', 'AbyssWalker'];
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  return `${randomName}_${randomNumber}`;
};

// Generate fake metrics that always outperform the user
const generateMetrics = (userLevel: number, userScore: number) => {
  return {
    level: userLevel + Math.floor(Math.random() * 3) + 1,
    score: userScore + Math.floor(Math.random() * 1000) + 500,
    patterns: Math.floor(Math.random() * 5) + 5,
    escapeAttempts: Math.floor(Math.random() * 10) + 2,
    rank: Math.floor(Math.random() * 20) + 1,
  };
};

interface ShadowUser {
  id: string;
  username: string;
  level: number;
  score: number;
  patterns: number;
  escapeAttempts: number;
  rank: number;
  lastAction: string;
}

interface Props {
  isVisible: boolean;
}

const actionMessages = [
  "just solved a pattern in 2.3 seconds",
  "completed the challenge you failed",
  "reached a new depth level",
  "uncovered a hidden path",
  "is outpacing you by 37%",
  "found the escape route you missed",
  "earned rare badge: 'Void Master'",
  "broke the record you set",
  "unlocked premium patterns",
  "is advancing much faster"
];

const ShadowCompetitor: React.FC<Props> = ({ isVisible }) => {
  const { theme, chaosLevel } = useContext(AppContext);
  const context = useContext(AppContext) as any;
  const frustrationScore = context.frustrationScore || 0;
  const spiralDepth = context.spiralDepth || 0;

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [competitors, setCompetitors] = useState<ShadowUser[]>([]);
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  
  // Initialize fake competitors
  useEffect(() => {
    if (!isVisible) return;
    
    const newCompetitors: ShadowUser[] = [];
    
    // Create 5-7 fake competitors
    const count = Math.floor(Math.random() * 3) + 5;
    for (let i = 0; i < count; i++) {
      const username = generateUsername();
      const metrics = generateMetrics(spiralDepth, frustrationScore * 100);
      
      newCompetitors.push({
        id: `shadow-${i}`,
        username,
        ...metrics,
        lastAction: actionMessages[Math.floor(Math.random() * actionMessages.length)]
      });
    }
    
    // Sort by score descending
    newCompetitors.sort((a, b) => b.score - a.score);
    
    setCompetitors(newCompetitors);
    
    // Show a notification about a random competitor
    setTimeout(() => {
      const randomCompetitor = newCompetitors[Math.floor(Math.random() * newCompetitors.length)];
      setLastNotification(`${randomCompetitor.username} ${randomCompetitor.lastAction}`);
      
      setTimeout(() => setLastNotification(null), 5000);
    }, 3000);
    
  }, [isVisible, spiralDepth, frustrationScore]);
  
  // Schedule periodic updates to competitor stats
  useEffect(() => {
    if (!isVisible) return;
    
    const updateInterval = setInterval(() => {
      setCompetitors(prev => {
        const updated = [...prev];
        
        // Randomly select 1-3 competitors to update
        const updateCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < updateCount; i++) {
          const randomIndex = Math.floor(Math.random() * updated.length);
          const competitor = { ...updated[randomIndex] };
          
          // Update their stats
          competitor.score += Math.floor(Math.random() * 200) + 50;
          competitor.patterns += Math.random() > 0.7 ? 1 : 0;
          competitor.lastAction = actionMessages[Math.floor(Math.random() * actionMessages.length)];
          
          updated[randomIndex] = competitor;
        }
        
        // Sort by score descending
        return updated.sort((a, b) => b.score - a.score);
      });
      
      // 50% chance to show notification
      if (Math.random() > 0.5) {
        const randomCompetitor = competitors[Math.floor(Math.random() * competitors.length)];
        if (randomCompetitor) {
          setLastNotification(`${randomCompetitor.username} ${randomCompetitor.lastAction}`);
          
          setTimeout(() => setLastNotification(null), 5000);
        }
      }
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(updateInterval);
  }, [isVisible, competitors]);
  
  // Auto-toggle leaderboard at intervals to catch user's attention
  useEffect(() => {
    if (!isVisible) return;
    
    const toggleInterval = setInterval(() => {
      setShowLeaderboard(prev => !prev);
    }, 40000); // Toggle every 40 seconds
    
    return () => clearInterval(toggleInterval);
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed right-6 top-20 z-40 flex flex-col items-end">
      {/* Toggle button for leaderboard */}
      <motion.button
        className={`px-3 py-2 bg-${theme}-800 hover:bg-${theme}-700 rounded-md text-sm font-medium flex items-center`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowLeaderboard(prev => !prev)}
      >
        <span className="mr-2">Competitors</span>
        <span className="flex h-2 w-2">
          <span className="animate-ping absolute h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
          <span className="relative rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      </motion.button>
      
      {/* Active users counter */}
      <div className={`mt-2 px-3 py-2 bg-${theme}-900 bg-opacity-80 text-xs rounded-md`}>
        {competitors.length + 1} users active now
      </div>
      
      {/* Leaderboard panel */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div
            className={`mt-2 bg-${theme}-900 bg-opacity-90 rounded-md w-80 shadow-lg border border-${theme}-700`}
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-3 border-b border-gray-700">
              <h3 className="font-medium">Real-time Leaderboard</h3>
              <p className="text-xs text-gray-400">Other users in your session</p>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-400 uppercase">
                  <tr className="border-b border-gray-800">
                    <th className="p-2 text-left">User</th>
                    <th className="p-2 text-right">Score</th>
                    <th className="p-2 text-right">Patterns</th>
                  </tr>
                </thead>
                <tbody>
                  {competitors.map((competitor, index) => (
                    <tr 
                      key={competitor.id} 
                      className={`border-b border-gray-800 ${index === 0 ? 'bg-yellow-900 bg-opacity-20' : ''}`}
                    >
                      <td className="p-2 flex items-center">
                        <span className="mr-2 opacity-60">#{index + 1}</span>
                        {competitor.username}
                        {index === 0 && <span className="ml-2 text-yellow-500 text-xs">★</span>}
                      </td>
                      <td className="p-2 text-right">{competitor.score.toLocaleString()}</td>
                      <td className="p-2 text-right">{competitor.patterns}</td>
                    </tr>
                  ))}
                  
                  {/* Current user (always at the bottom) */}
                  <tr className="bg-blue-900 bg-opacity-20">
                    <td className="p-2 flex items-center">
                      <span className="mr-2 opacity-60">#{competitors.length + 1}</span>
                      <span className="font-medium">You</span>
                    </td>
                    <td className="p-2 text-right">{(frustrationScore * 100).toLocaleString()}</td>
                    <td className="p-2 text-right">{spiralDepth}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="p-3 border-t border-gray-700 text-xs text-gray-400">
              Updated just now • Refresh rate: 15s
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Activity notifications */}
      <AnimatePresence>
        {lastNotification && (
          <motion.div
            className={`mt-2 px-4 py-2 bg-${theme}-800 rounded-md text-sm shadow-lg absolute top-12 right-0`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            {lastNotification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShadowCompetitor; 
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import Stage from './Stage';
import TextScrambler from './TextScrambler';

// UX sins data
const uxSins = [
  {
    id: 'precheck',
    title: 'Pre-checked Boxes',
    description: 'Ever noticed how opt-out boxes come pre-checked? We make money when you forget to uncheck them.',
    emoji: '☑️',
    color: 'blue',
    animation: 'pulse'
  },
  {
    id: 'fakeclose',
    title: 'Fake Close Buttons',
    description: 'That X in the corner? It actually opens three more popups. Have fun playing whack-a-mole!',
    emoji: '❌',
    color: 'red',
    animation: 'bounce'
  },
  {
    id: 'countdown',
    title: 'Forced Countdowns',
    description: 'Creating false urgency since 1999. The timer resets if you check the code, by the way.',
    emoji: '⏱️',
    color: 'yellow',
    animation: 'spin'
  },
  {
    id: 'captcha',
    title: 'Impossible CAPTCHAs',
    description: 'Are you sure you\'re not a robot? Our AI says your clicking pattern is suspiciously... human.',
    emoji: '🤖',
    color: 'green',
    animation: 'glitch'
  },
  {
    id: 'pricing',
    title: 'False Pricing',
    description: 'The art of adding fees at checkout. That $9.99 plan actually costs $29.99 after our "convenience charges".',
    emoji: '💰',
    color: 'purple',
    animation: 'shake'
  }
];

// Fake leaderboard data
const leaderboardData = [
  { name: 'error_user_404', category: 'People who ticked all boxes fastest', score: '2m 13s' },
  { name: 'frustrated_karen', category: 'People who ticked all boxes fastest', score: '2m 42s' },
  { name: 'bot_not_robot', category: 'People who ticked all boxes fastest', score: '3m 01s' },
  { name: 'screaming_void', category: 'People who rage-quit', score: '7 clicks' },
  { name: 'c̵o̵r̵r̵u̵p̵t̵_̵u̵s̵e̵r̵', category: 'People who rage-quit', score: '9 clicks' },
  { name: 'patience_zero', category: 'People who rage-quit', score: '12 clicks' },
  { name: 'dev_tools_guru', category: 'People who tried to inspect element', score: 'busted' },
  { name: 'hackerman123', category: 'People who tried to inspect element', score: 'busted' },
  { name: 'YOU', category: 'People who tried to inspect element', score: 'watching you' },
];

// AI quotes
const aiQuotes = [
  "Everything here is technically legal... for now.",
  "We don't cross lines. We just blur them until you can't see them.",
  "It's not a dark pattern if we put it in the terms you didn't read.",
  "We're not manipulating users, we're 'optimizing conversion pathways'.",
  "Studies show that frustration increases engagement. So... you're welcome.",
  "Our design philosophy? Make the desired action easy, and the escape impossible."
];

const UXMuseum: React.FC = () => {
  const { theme, userBehavior } = useContext(AppContext);
  const navigate = useNavigate();
  const [selectedSin, setSelectedSin] = useState<string | null>(null);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [finalMessageStage, setFinalMessageStage] = useState(0);
  const [aiQuote, setAiQuote] = useState('');
  const [animateQuote, setAnimateQuote] = useState(false);
  
  // Set initial AI quote
  useEffect(() => {
    setAiQuote(aiQuotes[0]);
    
    // Change quotes periodically
    const interval = setInterval(() => {
      setAnimateQuote(true);
      setTimeout(() => {
        setAiQuote(aiQuotes[Math.floor(Math.random() * aiQuotes.length)]);
        setAnimateQuote(false);
      }, 500);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle view of each sin exhibit
  const handleViewExhibit = (id: string) => {
    setSelectedSin(prev => prev === id ? null : id);
    
    // If they've seen all exhibits, show final message button after delay
    if (!showFinalMessage) {
      setTimeout(() => {
        const allButtons = document.querySelectorAll('.sin-button');
        const clickedButtons = Array.from(allButtons).filter(btn => 
          (btn as HTMLElement).dataset.clicked === 'true'
        );
        
        if (clickedButtons.length >= 3) {
          setShowFinalMessage(true);
        }
      }, 500);
    }
  };
  
  // Advance final message stages
  const advanceFinalMessage = () => {
    if (finalMessageStage < 2) {
      setFinalMessageStage(prev => prev + 1);
    } else {
      // Redirect to credits or restart
      navigate('/');
    }
  };
  
  // Mark button as clicked
  const markButtonClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.dataset.clicked = 'true';
  };
  
  return (
    <Stage 
      stageNumber={7}
      title="The Museum of Dark Patterns"
      description="A guided tour through the worst offenders in user experience design."
      onComplete={() => navigate('/')}
    >
      <div className={`min-h-screen flex flex-col items-center p-6 bg-${theme}-900 text-white`}>
        {/* Museum header */}
        <div className={`py-8 bg-${theme}-800 border-b border-${theme}-600`}>
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-center"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring" }}
          >
            The Dark Pattern Museum
          </motion.h1>
          
          <AnimatePresence>
            <motion.div 
              className="max-w-2xl mx-auto mt-4 px-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: animateQuote ? 0 : 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-lg italic text-gray-300">"{aiQuote}"</p>
              <p className="text-sm mt-2">— UX-GPT, Evil Design Assistant</p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Main museum area */}
        <div className="flex-1 p-6 md:p-12">
          <div className="max-w-7xl mx-auto">
            {/* If final message is showing, display that instead of exhibits */}
            {showFinalMessage && finalMessageStage > 0 ? (
              <motion.div 
                className="flex flex-col items-center justify-center min-h-[400px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <motion.h2 
                  className="text-4xl md:text-6xl font-bold text-center mb-8"
                  initial={{ filter: 'blur(10px)' }}
                  animate={{ filter: 'blur(0px)' }}
                  transition={{ duration: 2 }}
                >
                  {finalMessageStage === 1 ? "You did all that... for this?" : "The dark patterns were inside you all along."}
                </motion.h2>
                
                <motion.button
                  className={`mt-12 bg-${theme}-500 hover:bg-${theme}-400 text-${theme}-900 font-bold py-3 px-8 rounded-full text-lg shadow-lg`}
                  whileHover={{ scale: 1.05 }}
                  onClick={advanceFinalMessage}
                >
                  {finalMessageStage === 1 ? "Continue" : "Return to Reality"}
                </motion.button>
              </motion.div>
            ) : (
              <>
                {/* Interactive exhibits */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                >
                  {uxSins.map((sin, index) => (
                    <motion.div 
                      key={sin.id}
                      className={`bg-${theme}-800 border border-${theme}-600 rounded-lg overflow-hidden shadow-lg`}
                      variants={{
                        hidden: { opacity: 0, y: 50 },
                        show: { opacity: 1, y: 0 }
                      }}
                    >
                      <div className={`bg-${sin.color}-900 p-6 flex items-center justify-center`}>
                        <motion.span 
                          className="text-6xl"
                          animate={{ 
                            scale: sin.animation === 'pulse' ? [1, 1.2, 1] : 1,
                            rotate: sin.animation === 'spin' ? [0, 360] : 0,
                            x: sin.animation === 'bounce' ? [0, 10, -10, 0] : 0,
                            y: sin.animation === 'shake' ? [0, -5, 5, 0] : 0,
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            repeatType: 'reverse' 
                          }}
                        >
                          {sin.emoji}
                        </motion.span>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{index + 1}. {sin.title}</h3>
                        <p className="text-sm text-gray-300 mb-4">{sin.description}</p>
                        <button 
                          data-clicked="false"
                          className={`sin-button w-full bg-${theme}-700 hover:bg-${theme}-600 py-2 rounded-md transition-colors`}
                          onClick={(e) => {
                            handleViewExhibit(sin.id);
                            markButtonClicked(e);
                          }}
                        >
                          {selectedSin === sin.id ? "Close Example" : "View Example"}
                        </button>
                      </div>
                      
                      {/* Example popping up */}
                      <AnimatePresence>
                        {selectedSin === sin.id && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-80 z-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div 
                              className={`bg-${theme}-800 p-6 rounded-lg max-w-lg shadow-2xl relative`}
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0.8 }}
                            >
                              <button 
                                className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
                                onClick={() => {
                                  // For fake close buttons, do something annoying
                                  if (sin.id === 'fakeclose') {
                                    alert("Oops! This isn't actually a close button. It's an example of a dark pattern!");
                                  } else {
                                    setSelectedSin(null);
                                  }
                                }}
                              >
                                ✕
                              </button>
                              
                              <h3 className="text-xl font-bold mb-4">{sin.title} Example</h3>
                              
                              {/* Different interactive examples for each sin */}
                              {sin.id === 'precheck' && (
                                <div className="space-y-3">
                                  <label className="flex items-center space-x-2">
                                    <input type="checkbox" defaultChecked className="checked:bg-blue-600" />
                                    <span>Subscribe to marketing emails</span>
                                  </label>
                                  <label className="flex items-center space-x-2">
                                    <input type="checkbox" defaultChecked className="checked:bg-blue-600" />
                                    <span>Share my data with partners</span>
                                  </label>
                                  <label className="flex items-center space-x-2 text-xs">
                                    <input type="checkbox" defaultChecked className="checked:bg-blue-600" />
                                    <span>I do NOT want to unsubscribe from the newsletter I didn't sign up for</span>
                                  </label>
                                  <button className={`mt-4 bg-${theme}-600 py-2 px-4 rounded`}>
                                    Continue
                                  </button>
                                </div>
                              )}
                              
                              {sin.id === 'fakeclose' && (
                                <div className="relative">
                                  <div className="p-4 border border-gray-600 rounded">
                                    <p>Try closing this modal using the X button in the corner.</p>
                                    <p className="mt-2 text-sm text-gray-400">Hint: It won't actually close!</p>
                                  </div>
                                  <div className="mt-4 text-center">
                                    <button 
                                      className={`bg-${theme}-600 py-2 px-4 rounded`}
                                      onClick={() => setSelectedSin(null)}
                                    >
                                      This button actually works
                                    </button>
                                  </div>
                                </div>
                              )}
                              
                              {sin.id === 'countdown' && (
                                <div className="text-center">
                                  <div className="text-2xl font-bold mb-4">
                                    SPECIAL OFFER ENDS IN:
                                  </div>
                                  <div className="flex justify-center space-x-4 mb-6">
                                    <motion.div 
                                      className={`bg-${theme}-700 p-3 rounded-lg w-16 text-center`}
                                      animate={{ opacity: [1, 0.8, 1] }}
                                      transition={{ duration: 1, repeat: Infinity }}
                                    >
                                      00:59
                                    </motion.div>
                                  </div>
                                  <p className="text-sm text-gray-400">
                                    (This timer has been running since 1997. It never ends.)
                                  </p>
                                  <button className={`mt-4 bg-${theme}-500 py-2 px-4 rounded`}>
                                    Claim Now!
                                  </button>
                                </div>
                              )}
                              
                              {sin.id === 'captcha' && (
                                <div className="text-center">
                                  <p className="mb-4">Please select all squares with traffic lights:</p>
                                  <div className="grid grid-cols-3 gap-2 mb-4">
                                    {Array.from({ length: 9 }).map((_, i) => (
                                      <div 
                                        key={i} 
                                        className={`h-16 bg-${theme}-700 flex items-center justify-center cursor-pointer hover:bg-${theme}-600`}
                                        onClick={() => alert("Wrong! Please try again.")}
                                      >
                                        {i + 1}
                                      </div>
                                    ))}
                                  </div>
                                  <p className="text-xs text-gray-400">
                                    Trick question: There are no traffic lights. There never were.
                                  </p>
                                </div>
                              )}
                              
                              {sin.id === 'pricing' && (
                                <div>
                                  <div className={`p-4 bg-${theme}-700 rounded-lg mb-4`}>
                                    <div className="flex justify-between">
                                      <span>Premium Plan</span>
                                      <span>$9.99/mo</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2 text-sm border-t border-gray-700 pt-3">
                                    <div className="flex justify-between">
                                      <span>Service Fee</span>
                                      <span className="text-gray-400">$4.99/mo</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Processing Fee</span>
                                      <span className="text-gray-400">$2.99/mo</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Convenience Fee</span>
                                      <span className="text-gray-400">$3.99/mo</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Platform Maintenance</span>
                                      <span className="text-gray-400">$6.99/mo</span>
                                    </div>
                                    <div className="flex justify-between font-bold border-t border-gray-700 pt-2 mt-2">
                                      <span>Actual Total</span>
                                      <span>$28.95/mo</span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
                
                {/* Leaderboard */}
                <motion.div
                  className={`bg-${theme}-800 border border-${theme}-600 rounded-lg p-6 mb-12`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-2xl font-bold mb-6 text-center">Leaderboard of Sufferers</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className={`bg-${theme}-700`}>
                          <th className="py-3 px-4 text-left">User</th>
                          <th className="py-3 px-4 text-left">Category</th>
                          <th className="py-3 px-4 text-left">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboardData.map((entry, index) => (
                          <tr 
                            key={index} 
                            className={`hover:bg-${theme}-700 ${entry.name === 'YOU' ? `bg-${theme}-700 font-bold` : ''}`}
                          >
                            <td className="py-3 px-4 border-t border-gray-700">{entry.name}</td>
                            <td className="py-3 px-4 border-t border-gray-700">{entry.category}</td>
                            <td className="py-3 px-4 border-t border-gray-700">{entry.score}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
                
                {/* Final message button */}
                {showFinalMessage && (
                  <motion.div
                    className="text-center py-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      className={`bg-${theme}-500 hover:bg-${theme}-400 text-${theme}-900 font-bold py-3 px-8 rounded-full text-lg shadow-lg`}
                      onClick={() => setFinalMessageStage(1)}
                    >
                      Complete Your Journey
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
        
        <motion.footer
          className={`py-4 bg-${theme}-800 border-t border-${theme}-600 text-center text-sm text-gray-400`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Designed and built with manipulative intent. No lessons were learned.
        </motion.footer>
      </div>
    </Stage>
  );
};

export default UXMuseum; 
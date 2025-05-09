import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../../context/AppContext';

interface GhostCursorDuelProps {
  onComplete: () => void;
  onFail: () => void;
  onFrustrationIncrease: (amount: number) => void;
}

const GhostCursorDuel: React.FC<GhostCursorDuelProps> = ({ onComplete, onFail, onFrustrationIncrease }) => {
  const { theme, setNarratorMessage } = useContext(AppContext) as any;
  const userAlignment = (useContext(AppContext) as any).userAlignment;
  
  // Target positions
  const [targets, setTargets] = useState([
    { id: 1, x: 20, y: 50, clicked: false, ghostClicked: false, type: 'good' },
    { id: 2, x: 70, y: 150, clicked: false, ghostClicked: false, type: 'bad' },
    { id: 3, x: 200, y: 100, clicked: false, ghostClicked: false, type: 'good' },
    { id: 4, x: 300, y: 60, clicked: false, ghostClicked: false, type: 'good' },
    { id: 5, x: 160, y: 200, clicked: false, ghostClicked: false, type: 'bad' }
  ]);
  
  // Ghost cursor position
  const [ghostCursor, setGhostCursor] = useState({ x: 0, y: 0, visible: false });
  const [userCursorPos, setUserCursorPos] = useState({ x: 0, y: 0 });
  
  // Game state
  const [score, setScore] = useState({ user: 0, ghost: 0 });
  const [message, setMessage] = useState("Click on the green targets before your shadow does...");
  const [gameStarted, setGameStarted] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  const [difficulty, setDifficulty] = useState(1); // 1-3
  const [round, setRound] = useState(1);
  const [isGhostMocking, setIsGhostMocking] = useState(false);
  const [ghostPersonality, setGhostPersonality] = useState<'faster' | 'mimic' | 'smarter'>('mimic');
  const [showFinalReveal, setShowFinalReveal] = useState(false);
  const [badge, setBadge] = useState<string>("");
  const [ghostAccusation, setGhostAccusation] = useState(false);
  const [playerIsShadow, setPlayerIsShadow] = useState(false);
  const [revealCountdown, setRevealCountdown] = useState(3);
  
  const ghostTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const roundTimeRef = useRef<NodeJS.Timeout | null>(null);
  const ghostStyleInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Set up the initial stage
  useEffect(() => {
    // Initialize with a tailored narrator message based on user alignment
    let initialMessage;
    
    switch (userAlignment) {
      case 'evil_apprentice':
        initialMessage = "Observe carefully, apprentice. Your shadow knows your patterns before you do.";
        break;
      case 'shadow_enthusiast':
        initialMessage = "A reflection of yourself awaits you. Which of you is the original? Beautiful conflict, isn't it?";
        break;
      case 'dark_tourist':
        initialMessage = "Tourists often find themselves followed. Your shadow isn't just watching - it's learning.";
        break;
      case 'escapist':
        initialMessage = "Run from your shadow all you want. It's always just one step behind... or ahead.";
        break;
      default:
        initialMessage = "Have you ever noticed how your shadow sometimes moves before you do? Watch carefully.";
    }
    
    setNarratorMessage(initialMessage);
    
    // Randomly select a ghost personality
    const personalities: Array<'faster' | 'mimic' | 'smarter'> = ['faster', 'mimic', 'smarter'];
    setGhostPersonality(personalities[Math.floor(Math.random() * personalities.length)]);
    
    // Determine if in this round, the player will eventually be revealed as the shadow
    setPlayerIsShadow(Math.random() > 0.7);
    
    return () => {
      // Clean up any timeouts
      if (ghostTimeoutRef.current) clearTimeout(ghostTimeoutRef.current);
      if (roundTimeRef.current) clearTimeout(roundTimeRef.current);
      if (ghostStyleInterval.current) clearInterval(ghostStyleInterval.current);
    };
  }, [setNarratorMessage, userAlignment]);
  
  // Start the game
  const startGame = () => {
    setGameStarted(true);
    
    // Set tailored message based on ghost personality
    if (ghostPersonality === 'faster') {
      setMessage("Round " + round + ": Your shadow is always one step ahead...");
      setNarratorMessage("It's always been faster than you. That's why you never see it move.");
    } else if (ghostPersonality === 'mimic') {
      setMessage("Round " + round + ": Your shadow follows your every move...");
      setNarratorMessage("Watch how perfectly it copies you. Almost as if it knows what you'll do next.");
    } else {
      setMessage("Round " + round + ": Your shadow learns from your patterns...");
      setNarratorMessage("It studies you. Every decision reveals something about you.");
    }
    
    // Time limit for each round adds pressure
    roundTimeRef.current = setTimeout(() => {
      // If time runs out, ghost gets advantage
      setDifficulty(prev => Math.min(3, prev + 1));
      setMessage("You're too slow. Your shadow grows stronger...");
      setNarratorMessage("Time is running out. It's becoming more of you than you are.");
      onFrustrationIncrease(0.7);
    }, 8000);
    
    // Occasionally make the ghost cursor mock the player by moving slightly ahead
    ghostStyleInterval.current = setInterval(() => {
      if (Math.random() > 0.7) {
        setIsGhostMocking(true);
        setTimeout(() => setIsGhostMocking(false), 800);
      }
    }, 3000);
    
    activateGhostCursor();
  };
  
  // Move ghost cursor towards a target
  const activateGhostCursor = () => {
    setGhostCursor(prev => ({ ...prev, visible: true }));
    
    // Find unclaimed targets, prioritize "good" ones as the difficulty increases
    const unclaimedTargets = targets.filter(t => !t.clicked && !t.ghostClicked);
    const goodTargets = unclaimedTargets.filter(t => t.type === 'good');
    
    if (unclaimedTargets.length === 0) {
      // All targets clicked, end round
      endRound();
      return;
    }
    
    // Select target based on difficulty and ghost personality
    let targetPool;
    
    if (ghostPersonality === 'smarter') {
      // Smarter ghost prioritizes good targets even at lower difficulty
      targetPool = goodTargets.length > 0 ? goodTargets : unclaimedTargets;
    } else if (ghostPersonality === 'faster') {
      // Faster ghost is less picky but moves quicker
      targetPool = unclaimedTargets;
    } else {
      // Mimic ghost picks targets similar to what the player has been choosing
      targetPool = difficulty > 1 && goodTargets.length > 0 ? goodTargets : unclaimedTargets;
    }
    
    const targetIndex = Math.floor(Math.random() * targetPool.length);
    const target = targetPool[targetIndex];
    
    if (!target) return;
    
    // Determine time based on difficulty and ghost personality
    let timeToTarget = 2000 - (difficulty * 500);
    if (ghostPersonality === 'faster') {
      timeToTarget = Math.max(300, timeToTarget - 500);
    } else if (ghostPersonality === 'smarter' && difficulty > 1) {
      timeToTarget = Math.max(400, timeToTarget - 300);
    }
    
    // Move ghost towards target with variation based on personality
    const moveGhost = () => {
      setGhostCursor(prev => {
        // Calculate direction to target
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // If we're close enough, click the target
        if (distance < 10) {
          handleGhostClick(target.id);
          return prev;
        }
        
        // Otherwise move towards it with "personality" variance
        let step = Math.min(distance, 5 + difficulty);
        if (ghostPersonality === 'faster') step += 2;
        
        const angle = Math.atan2(dy, dx);
        
        // Add randomness to the ghost's path based on personality
        let randomAngle;
        if (ghostPersonality === 'mimic' && isGhostMocking) {
          // When mocking, it moves exactly like you would, but slightly ahead
          randomAngle = angle;
        } else if (ghostPersonality === 'smarter' && difficulty > 1) {
          // Smarter ghost has more deliberate, less random movement
          randomAngle = angle + (Math.random() - 0.5) * 0.2;
        } else {
          // Default randomness
          randomAngle = angle + (Math.random() - 0.5) * 0.5;
        }
        
        return {
          ...prev,
          x: prev.x + Math.cos(randomAngle) * step,
          y: prev.y + Math.sin(randomAngle) * step
        };
      });
      
      ghostTimeoutRef.current = setTimeout(moveGhost, 16); // ~60fps
    };
    
    // Start ghost movement
    moveGhost();
  };
  
  // Handle ghost clicking a target
  const handleGhostClick = (targetId: number) => {
    setTargets(prev => prev.map(t => {
      if (t.id === targetId && !t.clicked) {
        // Ghost got this target
        const scoreChange = t.type === 'good' ? 1 : -1;
        
        setScore(prev => ({
          ...prev,
          ghost: prev.ghost + scoreChange
        }));
        
        if (t.type === 'good') {
          setMessage("Your shadow claimed a target before you!");
          
          // Taunting narrator message
          const tauntMessages = [
            "It knows what you want before you do.",
            "Always one step ahead of you. Always.",
            "Perhaps it's the real you, and you're just the shadow?",
            "It's getting stronger with each victory.",
          ];
          
          setNarratorMessage(tauntMessages[Math.floor(Math.random() * tauntMessages.length)]);
          onFrustrationIncrease(0.6);
        } else {
          setMessage("Your shadow hit a trap!");
          setNarratorMessage("Even your mistakes, it makes. Interesting.");
        }
        
        return { ...t, ghostClicked: true };
      }
      return t;
    }));
    
    // Clear the ghost timeout
    if (ghostTimeoutRef.current) {
      clearTimeout(ghostTimeoutRef.current);
      ghostTimeoutRef.current = null;
    }
    
    // Check if we should end the round
    const updatedTargets = targets.map(t => 
      t.id === targetId ? { ...t, ghostClicked: true } : t
    );
    
    if (updatedTargets.every(t => t.clicked || t.ghostClicked)) {
      endRound();
    } else {
      // Continue with next target after a short delay
      setTimeout(activateGhostCursor, 500);
    }
  };
  
  // User cursor position tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setUserCursorPos({ x, y });
    
    // If game started, ghost responds based on personality
    if (gameStarted) {
      if (ghostPersonality === 'mimic' && Math.random() < 0.3) {
        // Mimic closely follows user, but with slight delay
        setTimeout(() => {
          setGhostCursor(prev => ({
            ...prev,
            x: x + (Math.random() - 0.5) * 10,
            y: y + (Math.random() - 0.5) * 10
          }));
        }, 100 + Math.random() * 200);
      } else if (ghostPersonality === 'faster' && Math.random() < 0.2) {
        // Faster ghost occasionally predicts user's movement
        const dx = x - userCursorPos.x;
        const dy = y - userCursorPos.y;
        
        setGhostCursor(prev => ({
          ...prev,
          x: x + dx * (Math.random() * 2),
          y: y + dy * (Math.random() * 2)
        }));
      } else if (ghostPersonality === 'smarter' && Math.random() < 0.15) {
        // Smarter ghost occasionally moves to positions the user might go
        const goodTargets = targets.filter(t => !t.clicked && !t.ghostClicked && t.type === 'good');
        if (goodTargets.length > 0) {
          const predictTarget = goodTargets[Math.floor(Math.random() * goodTargets.length)];
          setGhostCursor(prev => ({
            ...prev,
            x: prev.x + (predictTarget.x - prev.x) * 0.2,
            y: prev.y + (predictTarget.y - prev.y) * 0.2
          }));
        }
      }
    }
  };
  
  // Handle user clicking a target
  const handleTargetClick = (targetId: number) => {
    if (!gameStarted) return;
    
    setTargets(prev => prev.map(t => {
      if (t.id === targetId && !t.ghostClicked && !t.clicked) {
        // User got this target
        const scoreChange = t.type === 'good' ? 1 : -1;
        
        setScore(prev => ({
          ...prev,
          user: prev.user + scoreChange
        }));
        
        if (t.type === 'good') {
          setMessage("You claimed a target!");
          
          // Subtly disturbing narrator response
          const responses = [
            "Quick enough. This time.",
            "You're learning to outpace it. Or is it letting you win?",
            "Did you click that, or did your shadow guide your hand?",
            "It's watching how you succeed. Learning."
          ];
          
          setNarratorMessage(responses[Math.floor(Math.random() * responses.length)]);
        } else {
          setMessage("You hit a trap!");
          setNarratorMessage("Even when you fail, your shadow takes note. It learns from your mistakes.");
          onFrustrationIncrease(0.4);
        }
        
        return { ...t, clicked: true };
      }
      return t;
    }));
    
    // Check if we should end the round
    const updatedTargets = targets.map(t => 
      t.id === targetId ? { ...t, clicked: true } : t
    );
    
    if (updatedTargets.every(t => t.clicked || t.ghostClicked)) {
      endRound();
    }
  };
  
  // End the current round
  const endRound = () => {
    // Stop ghost cursor and timers
    if (ghostTimeoutRef.current) {
      clearTimeout(ghostTimeoutRef.current);
      ghostTimeoutRef.current = null;
    }
    
    if (roundTimeRef.current) {
      clearTimeout(roundTimeRef.current);
      roundTimeRef.current = null;
    }
    
    if (ghostStyleInterval.current) {
      clearInterval(ghostStyleInterval.current);
      ghostStyleInterval.current = null;
    }
    
    // Check the score difference to determine round result
    const scoreDiff = score.user - score.ghost;
    
    if (round >= 3 || Math.abs(scoreDiff) >= 3) {
      // Game over after 3 rounds or significant lead
      
      // Determine if we'll reveal the twist (player is the shadow)
      if ((round >= 2 && playerIsShadow) || round >= 3) {
        setGhostAccusation(true);
        return; // Don't proceed with normal round end
      }
      
      // No twist reveal, normal completion
      finishGame(scoreDiff);
    } else {
      // Set up next round
      setRound(prev => prev + 1);
      setDifficulty(prev => Math.min(3, prev + 1));
      
      // Generate new targets for next round
      const newTargets = [];
      for (let i = 0; i < 5 + round; i++) {
        newTargets.push({
          id: i + 1,
          x: Math.random() * 320,
          y: Math.random() * 220 + 10,
          clicked: false,
          ghostClicked: false,
          type: Math.random() > 0.3 ? 'good' : 'bad'
        });
      }
      setTargets(newTargets);
      
      // Reset positions
      setGhostCursor({ x: 0, y: 0, visible: false });
      
      // Start next round after a delay
      setTimeout(() => {
        startGame();
      }, 1500);
    }
  };
  
  // Process the final game result
  const finishGame = (scoreDiff: number) => {
    // Set game over message and allow completion
    setCanComplete(true);
    let finalMessage;
    
    if (scoreDiff > 0) {
      finalMessage = "You outpaced your shadow.";
      setBadge("Shadow Outrunner");
      setNarratorMessage("You won this time. But it's always with you, waiting for you to slip.");
    } else if (scoreDiff < 0) {
      finalMessage = "Your shadow was faster.";
      setBadge("Shadow Usurped");
      setNarratorMessage("Your shadow knows you better than you know yourself. It always has.");
      onFrustrationIncrease(1.0);
    } else {
      finalMessage = "You and your shadow are perfectly matched.";
      setBadge("Perfect Reflection");
      setNarratorMessage("Two sides of the same coin. Neither can exist without the other.");
    }
    
    setMessage(finalMessage);
  };
  
  // Handle the shadow accusation/reveal
  const handleAccusationResponse = (isAccept: boolean) => {
    if (isAccept) {
      // Accept being the shadow
      setBadge("Self-Aware Shadow");
      setNarratorMessage("Acceptance is the first step. You've always been the shadow all along.");
      setShowFinalReveal(true);
      
      // Countdown to complete the pattern
      const countdownTimer = setInterval(() => {
        setRevealCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            setTimeout(() => {
              onComplete();
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      // Deny being the shadow
      setBadge("Reality Denier");
      setNarratorMessage("Denial won't change what you are. Your reflection knows the truth.");
      onFrustrationIncrease(1.5);
      setShowFinalReveal(true);
      
      // Countdown to complete the pattern
      const countdownTimer = setInterval(() => {
        setRevealCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            setTimeout(() => {
              onComplete();
            }, 1000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };
  
  // Render the accusation card
  const renderAccusationCard = () => (
    <motion.div
      className={`p-5 border-2 border-${theme}-500 bg-gray-900 rounded-lg max-w-md mx-auto text-center`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {showFinalReveal ? (
        <>
          <h3 className="text-xl font-bold mb-3">The Truth Revealed</h3>
          <p className="text-gray-300 mb-4">
            You were the shadow all along. The real you is watching from the other side of the screen.
          </p>
          <div className="my-4 p-3 bg-black bg-opacity-50 rounded">
            <p className="text-sm text-gray-400 italic">
              "What you thought was competition was just you fighting against yourself."
            </p>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Your badge: <span className="text-yellow-400 font-medium">{badge}</span>
          </p>
          <p className="text-xl mb-2">Continuing in {revealCountdown}...</p>
        </>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-3 text-red-500">System Error</h3>
          <p className="text-gray-300 mb-4">
            Anomaly detected: You have been identified as the shadow cursor, not the user.
          </p>
          <p className="text-gray-400 mb-6">
            All this time, you thought you were controlling the cursor, but you were actually the shadow mimicking the real user's actions.
          </p>
          <div className="flex justify-between">
            <button
              className={`px-4 py-2 bg-${theme}-600 text-white rounded`}
              onClick={() => handleAccusationResponse(true)}
            >
              Accept the Truth
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded"
              onClick={() => handleAccusationResponse(false)}
            >
              This is Impossible
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
  
  // Render the end game summary
  const renderEndGameSummary = () => (
    <motion.div
      className={`p-5 border border-${theme}-700 bg-gray-900 rounded-lg max-w-md mx-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-bold mb-3">Duel Complete</h3>
      <p className="text-gray-300 mb-4">{message}</p>
      
      <div className="grid grid-cols-2 gap-4 my-4">
        <div className={`p-3 bg-${theme}-900 bg-opacity-50 rounded text-center`}>
          <div className="text-lg mb-1">You</div>
          <div className={`text-2xl font-bold text-${theme}-400`}>{score.user}</div>
        </div>
        <div className="p-3 bg-gray-900 bg-opacity-50 rounded text-center">
          <div className="text-lg mb-1">Shadow</div>
          <div className={`text-2xl font-bold text-red-400`}>{score.ghost}</div>
        </div>
      </div>
      
      <p className="text-sm text-gray-400 mb-4">
        Your badge: <span className="text-yellow-400 font-medium">{badge}</span>
      </p>
      
      <div className="flex justify-between">
        <button
          className={`px-4 py-2 bg-${theme}-600 text-white rounded`}
          onClick={onComplete}
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
  
  return (
    <div className="max-w-xl mx-auto p-4">
      {!ghostAccusation ? (
        <>
          {canComplete ? (
            renderEndGameSummary()
          ) : (
            <div className="text-center">
              <div 
                ref={containerRef}
                className={`relative w-full h-64 border-2 border-${theme}-700 bg-gray-900 bg-opacity-60 rounded-lg mb-4 overflow-hidden cursor-none`}
                onMouseMove={handleMouseMove}
              >
                {/* Targets */}
                {targets.map(target => (
                  <motion.div
                    key={target.id}
                    className={`absolute w-8 h-8 rounded-full cursor-none
                      ${target.clicked || target.ghostClicked ? 'bg-gray-800' : 
                        target.type === 'good' ? `bg-green-500` : `bg-red-500`}`}
                    style={{ 
                      left: target.x, 
                      top: target.y,
                      opacity: target.clicked || target.ghostClicked ? 0.3 : 1
                    }}
                    onClick={() => handleTargetClick(target.id)}
                    whileHover={{ scale: 1.1 }}
                  >
                    {target.clicked && <div className="absolute inset-0 flex items-center justify-center text-white">✓</div>}
                    {target.ghostClicked && <div className="absolute inset-0 flex items-center justify-center text-white">✗</div>}
                  </motion.div>
                ))}
                
                {/* User cursor */}
                <motion.div
                  className={`absolute w-5 h-5 rounded-full border-2 border-white z-20`}
                  style={{ 
                    left: userCursorPos.x - 10, 
                    top: userCursorPos.y - 10,
                    pointerEvents: 'none'
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
                
                {/* Ghost cursor */}
                {ghostCursor.visible && (
                  <motion.div
                    className={`absolute w-5 h-5 rounded-full border-2 border-red-500 bg-red-500 bg-opacity-20 z-10
                      ${isGhostMocking ? `shadow-lg shadow-red-500` : ''}`}
                    style={{ 
                      left: ghostCursor.x - 10, 
                      top: ghostCursor.y - 10,
                      pointerEvents: 'none'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: isGhostMocking ? [1, 1.2, 1] : 1,
                      opacity: isGhostMocking ? [0.6, 0.9, 0.6] : 0.6
                    }}
                    transition={{
                      scale: { duration: 0.3, repeat: isGhostMocking ? 1 : 0 },
                      opacity: { duration: 0.3, repeat: isGhostMocking ? 1 : 0 }
                    }}
                  />
                )}
              </div>
              
              <div className="mb-4 text-gray-300">{message}</div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`p-2 bg-${theme}-900 bg-opacity-50 rounded text-center`}>
                  <div className="text-sm mb-1">You</div>
                  <div className={`text-xl font-bold text-${theme}-400`}>{score.user}</div>
                </div>
                <div className="p-2 bg-gray-900 bg-opacity-50 rounded text-center">
                  <div className="text-sm mb-1">Shadow</div>
                  <div className={`text-xl font-bold text-red-400`}>{score.ghost}</div>
                </div>
              </div>
              
              {!gameStarted ? (
                <motion.button
                  className={`px-4 py-2 bg-${theme}-600 text-white rounded-md`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startGame}
                >
                  Start Duel
                </motion.button>
              ) : (
                <motion.button
                  className={`px-4 py-2 bg-red-600 text-white rounded-md`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onFail();
                    setNarratorMessage("Running from your shadow? It will follow you wherever you go.");
                  }}
                >
                  Forfeit Duel
                </motion.button>
              )}
            </div>
          )}
        </>
      ) : (
        renderAccusationCard()
      )}
    </div>
  );
};

export default GhostCursorDuel; 
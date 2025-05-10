import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { AppContext } from '../../context/AppContext';

interface GhostCursorDuelProps {
  onComplete: () => void;
  onFail: () => void;
  onFrustrationIncrease: (amount: number) => void;
}

// Mock buttons to interact with
interface ButtonState {
  id: number;
  text: string;
  blocked: boolean;
  claimed: boolean;
  canBeClicked: boolean;
  isTarget: boolean;
}

const GhostCursorDuel: React.FC<GhostCursorDuelProps> = ({ onComplete, onFail, onFrustrationIncrease }) => {
  const { theme, setNarratorMessage, chaosLevel } = useContext(AppContext) as any;
  
  // User and ghost cursor positions
  const [userPosition, setUserPosition] = useState({ x: 0, y: 0 });
  const [ghostAhead, setGhostAhead] = useState(false);
  
  // Ghost cursor motion values for smooth animation
  const ghostX = useMotionValue(0);
  const ghostY = useMotionValue(0);
  const springX = useSpring(ghostX, { damping: 20, stiffness: 300 });
  const springY = useSpring(ghostY, { damping: 20, stiffness: 300 });
  
  // Game state
  const [round, setRound] = useState(1);
  const [gameActive, setGameActive] = useState(true);
  const [userScore, setUserScore] = useState(0);
  const [ghostScore, setGhostScore] = useState(0);
  const [message, setMessage] = useState('Race against the ghost cursor to claim the targets');
  const [targetIndex, setTargetIndex] = useState<number | null>(null);
  const [isPlayerTrapped, setIsPlayerTrapped] = useState(false);
  const [failMessage, setFailMessage] = useState('');
  const [isFinalRound, setIsFinalRound] = useState(false);
  const [ghostPersonality, setGhostPersonality] = useState<'aggressive' | 'taunting' | 'mimicking'>('mimicking');
  const [lockoutCounter, setLockoutCounter] = useState(0);
  const [badges, setBadges] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Reference to the container element for relative positioning
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Buttons to interact with
  const [buttons, setButtons] = useState<ButtonState[]>([
    { id: 1, text: 'Claim Me', blocked: false, claimed: false, canBeClicked: true, isTarget: false },
    { id: 2, text: 'Click Me', blocked: false, claimed: false, canBeClicked: true, isTarget: false },
    { id: 3, text: 'Safe Click', blocked: false, claimed: false, canBeClicked: true, isTarget: false },
    { id: 4, text: 'Target Button', blocked: false, claimed: false, canBeClicked: true, isTarget: false },
    { id: 5, text: 'Priority Button', blocked: false, claimed: false, canBeClicked: true, isTarget: false },
  ]);
  
  // Difficulty factors based on rounds
  const getSpeedFactor = () => Math.min(1 + (round * 0.15), 2.2); // Speed increases with rounds
  const getPredictionFactor = () => Math.min(0.2 + (round * 0.1), 0.7); // Prediction accuracy increases
  
  // Set initial state
  useEffect(() => {
    // Introduction narrator message
    setNarratorMessage("Meet your competitor, ShadowUser_92. They're faster. They're better. Always one step ahead.");
    
    // Set initial ghost personality based on chaos level
    if (chaosLevel > 7) {
      setGhostPersonality('aggressive');
    } else if (chaosLevel > 4) {
      setGhostPersonality('taunting');
    } else {
      setGhostPersonality('mimicking');
    }
    
    // Set the first target
    setNewTarget();
    
    // Cleanup
    return () => {
      // Reset any timers or listeners
    };
  }, [setNarratorMessage, chaosLevel]);
  
  // Track mouse movement for the user cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update user position
        setUserPosition({ x, y });
        
        // Update ghost position based on personality and game state
        updateGhostPosition(x, y);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [ghostPersonality, round, targetIndex, buttons]);
  
  // Ghost AI behavior to update position based on current game state and settings
  const updateGhostPosition = (userX: number, userY: number) => {
    if (!gameActive) return;
    
    const speedFactor = getSpeedFactor();
    const predictionFactor = getPredictionFactor();
    
    // Base position on user's cursor with some randomness
    let targetX = userX;
    let targetY = userY;
    
    // Find current target button if exists
    const targetButton = buttons.find(b => b.isTarget);
    
    if (targetButton && containerRef.current) {
      // Get button element
      const buttonElements = containerRef.current.querySelectorAll('button');
      const buttonElement = Array.from(buttonElements).find(
        el => el.dataset.id === targetButton.id.toString()
      );
      
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Calculate button center relative to container
        const buttonCenterX = (rect.left + rect.right) / 2 - containerRect.left;
        const buttonCenterY = (rect.top + rect.bottom) / 2 - containerRect.top;
        
        // Different behavior based on personality
        switch (ghostPersonality) {
          case 'aggressive':
            // Aggressively target the button
            targetX = buttonCenterX;
            targetY = buttonCenterY;
            
            // Add slight prediction of user movement
            const distX = userX - ghostX.get();
            const distY = userY - ghostY.get();
            if (Math.abs(distX) > 5 || Math.abs(distY) > 5) {
              targetX += distX * predictionFactor;
              targetY += distY * predictionFactor;
            }
            break;
          
          case 'taunting':
            // Move between user and target to block
            targetX = userX * 0.3 + buttonCenterX * 0.7;
            targetY = userY * 0.3 + buttonCenterY * 0.7;
            
            // Occasionally move directly to block user
            if (Math.random() < 0.2) {
              targetX = userX;
              targetY = userY;
            }
            break;
          
          case 'mimicking':
            // Start by mimicking the user
            targetX = userX;
            targetY = userY;
            
            // Occasionally dart toward the target
            if (Math.random() < 0.1 + (round * 0.05)) {
              targetX = buttonCenterX;
              targetY = buttonCenterY;
            }
            break;
        }
        
        // Check if ghost is ahead of user in reaching the target
        const userDist = Math.sqrt(
          Math.pow(userX - buttonCenterX, 2) + 
          Math.pow(userY - buttonCenterY, 2)
        );
        
        const ghostDist = Math.sqrt(
          Math.pow(ghostX.get() - buttonCenterX, 2) + 
          Math.pow(ghostY.get() - buttonCenterY, 2)
        );
        
        setGhostAhead(ghostDist < userDist);
      }
    }
    
    // Apply speed factor
    ghostX.set(ghostX.get() + (targetX - ghostX.get()) * 0.1 * speedFactor);
    ghostY.set(ghostY.get() + (targetY - ghostY.get()) * 0.1 * speedFactor);
  };
  
  // Select a new target button
  const setNewTarget = () => {
    // Reset all buttons
    const updatedButtons = buttons.map(button => ({
      ...button,
      isTarget: false,
      blocked: false,
      claimed: false,
      canBeClicked: true
    }));
    
    // Select a random button as the target
    const randomIndex = Math.floor(Math.random() * updatedButtons.length);
    updatedButtons[randomIndex] = {
      ...updatedButtons[randomIndex],
      isTarget: true,
      text: `Target ${round}`
    };
    
    setButtons(updatedButtons);
    setTargetIndex(randomIndex);
    
    // Set appropriate messages
    if (round === 1) {
      setMessage(`Race to click the target button before the ghost cursor claims it!`);
    } else if (ghostScore > userScore) {
      setMessage(`ShadowUser_92 is winning ${ghostScore}-${userScore}. Can you catch up?`);
    } else if (ghostScore < userScore) {
      setMessage(`You're ahead ${userScore}-${ghostScore}. Can you keep your lead?`);
    } else {
      setMessage(`It's tied ${userScore}-${ghostScore}. The next target is critical!`);
    }
    
    // Update narrator based on the current state
    if (ghostScore > userScore && ghostScore >= 2) {
      setNarratorMessage("ShadowUser_92 is consistently faster. How does it feel to be second-best?");
      onFrustrationIncrease(0.8);
    } else if (userScore > ghostScore && userScore >= 2) {
      setNarratorMessage("You're doing well, but ShadowUser_92 learns your patterns with every click.");
      // Increase ghost difficulty when player is winning
      setGhostPersonality('aggressive');
    }
  };
  
  // Handle user clicking a button
  const handleButtonClick = (id: number) => {
    if (!gameActive) return;
    
    // Find the clicked button
    const clickedButton = buttons.find(button => button.id === id);
    if (!clickedButton || !clickedButton.canBeClicked) return;
    
    // Check if the button is already claimed
    if (clickedButton.claimed) {
      setMessage("This button has already been claimed by ShadowUser_92.");
      onFrustrationIncrease(0.5);
      return;
    }
    
    // Check if the button is blocked
    if (clickedButton.blocked) {
      setLockoutCounter(prev => prev + 1);
      setMessage(`ShadowUser_92 blocked your access to this button.`);
      onFrustrationIncrease(0.7);
      
      // If locked out multiple times, give a frustration badge
      if (lockoutCounter >= 2 && !badges.includes("Perpetually Blocked")) {
        setBadges(prev => [...prev, "Perpetually Blocked"]);
        setNarratorMessage("You keep trying the same approach. Predictability is your weakness.");
      }
      return;
    }
    
    // Handle clicking the target button
    if (clickedButton.isTarget) {
      // Player wins this round
      setUserScore(prev => prev + 1);
      
      // Update ghost personality as player succeeds
      if (round >= 3 && ghostPersonality !== 'aggressive') {
        setGhostPersonality('aggressive');
        setNarratorMessage("ShadowUser_92 is getting frustrated with you. It's adapting its strategy.");
      }
      
      // Visual feedback for success
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
      
      // Advance to next round
      advanceToNextRound("You claimed the target!", 0.3, "Target Claimer");
    } else {
      // Player clicked the wrong button, ghost gets advantage
      const updatedButtons = buttons.map(button => {
        if (button.id === id) {
          return { ...button, claimed: true, canBeClicked: false };
        }
        return button;
      });
      
      setButtons(updatedButtons);
      setMessage("Wrong button! ShadowUser_92 is now closer to the target.");
      
      // Ghost gets a speed boost for next move
      setTimeout(() => {
        if (targetIndex !== null) {
          const targetButton = buttons[targetIndex];
          handleGhostClaim(targetButton.id);
        }
      }, 1000);
      
      onFrustrationIncrease(0.6);
    }
  };
  
  // Handle ghost claiming a button
  const handleGhostClaim = (id: number) => {
    if (!gameActive) return;
    
    // Update the button state
    const updatedButtons = buttons.map(button => {
      if (button.id === id) {
        return { ...button, claimed: true, canBeClicked: false };
      }
      return button;
    });
    
    setButtons(updatedButtons);
    
    // If ghost claimed the target, it wins the round
    const claimedButton = updatedButtons.find(button => button.id === id);
    if (claimedButton?.isTarget) {
      setGhostScore(prev => prev + 1);
      advanceToNextRound("ShadowUser_92 claimed the target before you!", 0.8, "Too Slow");
    } else {
      // Ghost claimed a non-target button, possibly blocking user
      setMessage("ShadowUser_92 claimed a button, blocking your path.");
      
      // Randomly block another button
      if (Math.random() < 0.3 + (round * 0.1)) {
        setTimeout(() => {
          blockRandomButton();
        }, 800);
      }
    }
  };
  
  // Block a random button to frustrate the user
  const blockRandomButton = () => {
    const availableButtons = buttons.filter(button => 
      !button.claimed && !button.blocked && !button.isTarget
    );
    
    if (availableButtons.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableButtons.length);
      const buttonToBlock = availableButtons[randomIndex];
      
      setButtons(prev => prev.map(button => {
        if (button.id === buttonToBlock.id) {
          return { ...button, blocked: true, canBeClicked: false };
        }
        return button;
      }));
      
      setMessage("ShadowUser_92 blocked another button. Your options are shrinking.");
      setNarratorMessage("Watch as your choices disappear, one by one.");
      onFrustrationIncrease(0.4);
    }
  };
  
  // Advance to the next round or end the game
  const advanceToNextRound = (msg: string, frustrationAmount: number, badgeName?: string) => {
    setMessage(msg);
    
    if (badgeName && !badges.includes(badgeName)) {
      setBadges(prev => [...prev, badgeName]);
    }
    
    // Check if we should end the game
    const newRound = round + 1;
    if (newRound > 5 || userScore >= 3 || ghostScore >= 3) {
      endGame();
      return;
    }
    
    // Prepare for next round
    setRound(newRound);
    onFrustrationIncrease(frustrationAmount);
    
    // Notify player that final round is coming
    if (newRound === 5 || userScore === 2 || ghostScore === 2) {
      setIsFinalRound(true);
      setNarratorMessage("The final target approaches. Who will claim the victory?");
    }
    
    // Set new target after a short delay
    setTimeout(() => {
      setNewTarget();
    }, 1500);
  };
  
  // Handle the end of the game
  const endGame = () => {
    setGameActive(false);
    
    if (userScore > ghostScore) {
      setMessage(`You won ${userScore}-${ghostScore}! But ShadowUser_92 will remember this.`);
      setNarratorMessage("You defeated the ghost cursor this time. It will adapt for your next encounter.");
      setBadges(prev => [...prev, "Ghost Buster"]);
    } else {
      setMessage(`ShadowUser_92 won ${ghostScore}-${userScore}. Your reflexes weren't fast enough.`);
      setNarratorMessage("Always one step behind. Some users never win against their shadows.");
      setBadges(prev => [...prev, "Shadow's Victim"]);
      setIsPlayerTrapped(true);
      setFailMessage("Your cursor proved inferior to ShadowUser_92.");
      onFrustrationIncrease(1.2);
    }
  };
  
  // Auto-click by ghost on target when it gets close enough
  useEffect(() => {
    if (!gameActive || targetIndex === null) return;
    
    const targetButton = buttons[targetIndex];
    
    // Skip if button already claimed
    if (targetButton.claimed) return;
    
    // Check if ghost is close to target button
    if (containerRef.current && ghostAhead) {
      const buttonElements = containerRef.current.querySelectorAll('button');
      const targetElement = Array.from(buttonElements).find(
        el => el.dataset.id === targetButton.id.toString()
      );
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Button center relative to container
        const buttonCenterX = (rect.left + rect.right) / 2 - containerRect.left;
        const buttonCenterY = (rect.top + rect.bottom) / 2 - containerRect.top;
        
        // Distance from ghost to button center
        const distance = Math.sqrt(
          Math.pow(springX.get() - buttonCenterX, 2) + 
          Math.pow(springY.get() - buttonCenterY, 2)
        );
        
        // If ghost is close enough, it claims the button
        if (distance < 30) {
          // Random chance for ghost to miss based on round (gets more accurate in later rounds)
          const missChance = Math.max(0.5 - (round * 0.1), 0.1);
          if (Math.random() > missChance) {
            handleGhostClaim(targetButton.id);
          }
        }
      }
    }
  }, [gameActive, targetIndex, buttons, ghostAhead, round, springX, springY]);
  
  // Fake clicks by ghost cursor to taunt user
  useEffect(() => {
    if (!gameActive) return;
    
    const interval = setInterval(() => {
      // Only do fake clicks in taunting or aggressive modes
      if (ghostPersonality !== 'mimicking' && Math.random() < 0.3) {
        // Visual indication of ghost click
        const ghostClickElement = document.createElement('div');
        ghostClickElement.className = `absolute rounded-full bg-${theme}-400 opacity-50`;
        ghostClickElement.style.width = '20px';
        ghostClickElement.style.height = '20px';
        ghostClickElement.style.left = `${springX.get() - 10}px`;
        ghostClickElement.style.top = `${springY.get() - 10}px`;
        ghostClickElement.style.transform = 'scale(0)';
        ghostClickElement.style.transition = 'transform 0.3s, opacity 0.3s';
        
        if (containerRef.current) {
          containerRef.current.appendChild(ghostClickElement);
          
          // Animate the click effect
          setTimeout(() => {
            ghostClickElement.style.transform = 'scale(1)';
          }, 10);
          
          setTimeout(() => {
            ghostClickElement.style.opacity = '0';
          }, 200);
          
          setTimeout(() => {
            if (containerRef.current?.contains(ghostClickElement)) {
              containerRef.current.removeChild(ghostClickElement);
            }
          }, 500);
          
          // Ghost may randomly block a button with this click
          if (ghostPersonality === 'aggressive' && Math.random() < 0.4) {
            blockRandomButton();
          }
        }
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [gameActive, ghostPersonality, theme, springX, springY]);
  
  // Render completion or fail screens
  const renderCompletionScreen = () => (
    <div className={`p-6 border rounded-lg bg-gray-900 border-${theme}-600 max-w-md mx-auto text-center`}>
      <h2 className="text-xl font-bold mb-4">Duel Completed</h2>
      
      <p className="mb-4 text-gray-300">{message}</p>
      
      <div className="mb-6">
        <p className="text-lg mb-2">Final Score:</p>
        <div className="flex justify-center items-center space-x-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">You</p>
            <p className="text-2xl font-bold">{userScore}</p>
          </div>
          <div className="text-xl">-</div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Shadow</p>
            <p className="text-2xl font-bold">{ghostScore}</p>
          </div>
        </div>
      </div>
      
      {badges.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Badges Earned:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {badges.map((badge, index) => (
              <div key={index} className="px-3 py-1 bg-yellow-900 bg-opacity-30 rounded text-yellow-400 text-sm">
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button
        className={`px-4 py-2 bg-${theme}-600 text-white rounded-md`}
        onClick={onComplete}
      >
        Continue
      </button>
    </div>
  );
  
  const renderFailScreen = () => (
    <div className={`p-6 border-2 border-${theme}-700 rounded-lg bg-gray-900 max-w-md mx-auto text-center`}>
      <h2 className="text-xl font-bold mb-4 text-red-500">Ghost Cursor Victory</h2>
      
      <p className="mb-4 text-gray-300">{failMessage}</p>
      
      <div className="my-4 p-3 bg-black bg-opacity-40 rounded">
        <p className="text-sm text-gray-400 italic">
          "Always one step behind. You operate on human time. I don't."
        </p>
        <p className="text-xs text-right text-gray-500">— ShadowUser_92</p>
      </div>
      
      {badges.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 mb-2">Badges Earned:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {badges.map((badge, index) => (
              <div key={index} className="px-3 py-1 bg-yellow-900 bg-opacity-30 rounded text-yellow-400 text-sm">
                {badge}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button
        className={`px-4 py-2 bg-${theme}-600 text-white rounded-md`}
        onClick={onComplete}
      >
        Accept Defeat
      </button>
    </div>
  );
  
  // Main render function
  return (
    <div className="max-w-2xl mx-auto">
      {!gameActive ? (
        isPlayerTrapped ? renderFailScreen() : renderCompletionScreen()
      ) : (
        <div
          ref={containerRef}
          className={`relative p-6 border border-${theme}-700 rounded-lg bg-gray-900 min-h-[300px]`}
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold">Ghost Cursor Duel</h2>
            
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-400">Round {round}{isFinalRound ? ' (Final)' : ''}</div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400">You</p>
                  <p className="text-lg font-bold">{userScore}</p>
                </div>
                <div>-</div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Shadow</p>
                  <p className="text-lg font-bold">{ghostScore}</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-400 mt-2">{message}</p>
          </div>
          
          <div className="mt-10 mb-6 grid grid-cols-3 gap-4">
            {buttons.map(button => (
              <button
                key={button.id}
                data-id={button.id}
                className={`p-3 border rounded-md transition-all duration-300
                  ${button.isTarget ? `bg-${theme}-900 border-${theme}-400` : 'bg-gray-800 border-gray-700'}
                  ${button.blocked ? 'opacity-50 cursor-not-allowed' : ''}
                  ${button.claimed ? 'bg-red-900 bg-opacity-30' : ''}
                  ${button.canBeClicked ? 'hover:bg-gray-700' : 'cursor-not-allowed'}`}
                onClick={() => handleButtonClick(button.id)}
                disabled={!button.canBeClicked || !gameActive}
              >
                <div className="flex items-center justify-center">
                  <span>{button.text}</span>
                  {button.claimed && (
                    <span className="ml-2 text-xs text-red-400">(Claimed)</span>
                  )}
                  {button.blocked && (
                    <span className="ml-2 text-xs text-yellow-400">(Blocked)</span>
                  )}
                </div>
              </button>
            ))}
          </div>
          
          {/* User's real cursor is hidden in the container, we show our own */}
          <div className="absolute w-10 h-10 pointer-events-none"
            style={{
              left: `${userPosition.x - 5}px`,
              top: `${userPosition.y - 5}px`,
              zIndex: 50
            }}
          >
            <div className="absolute w-5 h-5 border-t-2 border-l-2 border-white rotate-45 opacity-70" />
          </div>
          
          {/* Ghost cursor */}
          <motion.div
            className={`absolute w-10 h-10 pointer-events-none z-40`}
            style={{
              left: springX, 
              top: springY,
              x: -5,
              y: -5
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <div className={`absolute w-5 h-5 border-t-2 border-l-2 border-${theme}-400 rotate-45 opacity-70`} />
            <div className={`absolute w-6 h-6 rounded-full border border-${theme}-400 opacity-30`} />
          </motion.div>
          
          {/* Success celebration effect */}
          {showCelebration && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
            >
              <div className={`absolute inset-0 bg-${theme}-500 opacity-20`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="text-2xl font-bold text-white"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.7 }}
                >
                  Target Claimed!
                </motion.div>
              </div>
            </motion.div>
          )}
          
          {/* Abandon button */}
          <div className="mt-6 flex justify-end">
            <button
              className={`px-4 py-2 bg-red-600 text-white rounded-md`}
              onClick={() => {
                onFail();
                setNarratorMessage("You can't outrun your shadow. It follows you everywhere.");
                onFrustrationIncrease(1.0);
              }}
            >
              Forfeit Duel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GhostCursorDuel; 
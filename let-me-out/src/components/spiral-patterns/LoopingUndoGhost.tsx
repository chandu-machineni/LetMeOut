import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../../context/AppContext';

interface LoopingUndoGhostProps {
  onComplete: () => void;
  onFail: () => void;
  onFrustrationIncrease: (amount: number) => void;
}

const LoopingUndoGhost: React.FC<LoopingUndoGhostProps> = ({ onComplete, onFail, onFrustrationIncrease }) => {
  const { theme, setNarratorMessage } = useContext(AppContext) as any;
  
  // States to track text, actions, and UI
  const [text, setText] = useState<string>("");
  const [history, setHistory] = useState<string[]>([]);
  const [undoCount, setUndoCount] = useState<number>(0);
  const [redoCount, setRedoCount] = useState<number>(0);
  const [glitchLevel, setGlitchLevel] = useState<number>(0);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("Undo");
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [phase, setPhase] = useState<'initial' | 'unstable' | 'corrupted' | 'trapped' | 'final'>('initial');
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [badge, setBadge] = useState<string>("");
  const [layoutDistortion, setLayoutDistortion] = useState<number>(0);
  const [undoButtonWidth, setUndoButtonWidth] = useState<number>(80);
  const [undoButtonRotation, setUndoButtonRotation] = useState<number>(0);
  const [textareaHeight, setTextareaHeight] = useState<number>(120);
  const [uiShift, setUiShift] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [promptMessage, setPromptMessage] = useState<string>("");
  const [promptOptions, setPromptOptions] = useState<string[]>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [hasStartedTyping, setHasStartedTyping] = useState<boolean>(false);
  
  // Refs
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  
  // Initial setup
  useEffect(() => {
    // Initial narrator message
    setNarratorMessage("We've provided an undo function for your convenience. Everyone makes mistakes.");
    
    // Set a timeout to encourage the user to type something
    const timer = setTimeout(() => {
      if (!hasStartedTyping) {
        setNarratorMessage("Type something. You can always undo it if you make a mistake...");
      }
    }, 4000);
    
    return () => clearTimeout(timer);
  }, [setNarratorMessage, hasStartedTyping]);
  
  // Handle text input
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    
    if (!hasStartedTyping && e.target.value.length > 0) {
      setHasStartedTyping(true);
    }
    
    // Enable undo button if there's text
    if (e.target.value.length > 0) {
      setCanUndo(true);
    }
    
    // Randomly append text if glitch level is high
    if (glitchLevel >= 3 && Math.random() > 0.7 && phase === 'corrupted') {
      const ghostText = ["help", "undo me", "mistake", "trapped", "error", "loop"];
      const selectedText = ghostText[Math.floor(Math.random() * ghostText.length)];
      
      setTimeout(() => {
        setText(prev => prev + " " + selectedText);
        setNarratorMessage("The text has a mind of its own. You're not the only one writing here.");
        onFrustrationIncrease(0.3);
      }, 500);
    }
  };
  
  // Handle undo action
  const handleUndo = () => {
    // Add current text to history
    setHistory(prev => [...prev, text]);
    
    // Increment undo count
    setUndoCount(prev => prev + 1);
    
    // Different behavior based on the current phase
    switch (phase) {
      case 'initial':
        // First phase: Simple undos with minor glitches
        if (undoCount === 0) {
          // First undo works normally
          setText(text.substring(0, Math.max(0, text.length - 10)));
          setNarratorMessage("See? Easy to take back your mistakes.");
        } else if (undoCount === 1) {
          // Second undo introduces a small glitch
          setText(text.substring(0, Math.max(0, text.length - 8)) + "...");
          setGlitchLevel(1);
          setNarratorMessage("Hmm, that's strange. The undo seems... imperfect.");
          onFrustrationIncrease(0.3);
        } else {
          // Third undo shifts to unstable phase
          setText(text.substring(0, Math.max(0, text.length - 12)) + "...error");
          setGlitchLevel(2);
          setPhase('unstable');
          setNarratorMessage("Undo is a complex operation. It's not as simple as erasing the past.");
          onFrustrationIncrease(0.5);
          
          // Start distorting the layout
          setLayoutDistortion(0.2);
          setUndoButtonWidth(90);
          setUndoButtonRotation(2);
          
          // Change button text
          setButtonText("Undo?");
        }
        break;
        
      case 'unstable':
        // Unstable phase: Undos add text instead of removing it
        const reversedChars = text.split('').reverse().join('').substring(0, 5);
        setText(text + " " + reversedChars);
        setGlitchLevel(prev => prev + 1);
        setLayoutDistortion(prev => Math.min(prev + 0.2, 0.6));
        setUndoButtonWidth(prev => prev + 15);
        setUndoButtonRotation(prev => prev + 3);
        setTextareaHeight(prev => prev + 20);
        setUiShift({x: Math.random() * 10 - 5, y: Math.random() * 10 - 5});
        
        if (glitchLevel >= 3) {
          setPhase('corrupted');
          setButtonText("Redo Mistake");
          setNarratorMessage("I think your undo function is making things worse. Fascinating.");
          onFrustrationIncrease(0.8);
          
          // Add visual error message
          setErrorMessage("ERROR: Undo stack corrupted. Recovery impossible.");
        }
        break;
        
      case 'corrupted':
        // Corrupted phase: Undos cause major text corruption and layout issues
        const historySample = history.length > 0 ? 
          history[Math.floor(Math.random() * history.length)] : "error";
        
        // Create corrupted text version
        let corruptedText = text + " " + historySample.split('').map(char => 
          Math.random() > 0.5 ? char : String.fromCharCode(char.charCodeAt(0) + 1)
        ).join('');
        
        // Limit corruption length to prevent excessive text growth
        if (corruptedText.length > 200) {
          corruptedText = corruptedText.substring(0, 200) + "...";
        }
        
        setText(corruptedText);
        setGlitchLevel(prev => prev + 1);
        setLayoutDistortion(prev => Math.min(prev + 0.2, 1));
        setUndoButtonWidth(prev => prev + 20);
        setUndoButtonRotation(prev => prev - 5);
        setTextareaHeight(prev => prev + 30);
        setUiShift({
          x: Math.random() * 20 - 10, 
          y: Math.random() * 20 - 10
        });
        
        if (glitchLevel >= 6) {
          setPhase('trapped');
          setButtonText("Undo Yourself");
          setNarratorMessage("Undo is a myth. You just thought you were in control.");
          onFrustrationIncrease(1.2);
          
          // Show a prompt with no good options
          showTrapPrompt();
        }
        break;
        
      case 'trapped':
        // Trapped phase: Undos trigger the final trap
        setNarratorMessage("You can't undo what you've become. Your actions are permanent now.");
        onFrustrationIncrease(1.5);
        
        // Activate the final phase
        setPhase('final');
        setButtonText("UNEXIST");
        setBadge("Undo Looper");
        
        // Show completion dialog after a delay
        setTimeout(() => {
          setIsComplete(true);
        }, 1500);
        break;
        
      case 'final':
        // Final phase already reached
        setIsComplete(true);
        break;
    }
  };
  
  // Show a trap prompt with no good options
  const showTrapPrompt = () => {
    setShowPrompt(true);
    setPromptMessage("Critical error in undo stack. Select recovery method:");
    setPromptOptions([
      "Restore from previous state (risky)",
      "Reset system (data loss likely)",
      "Abandon current session"
    ]);
  };
  
  // Handle trap prompt option selection
  const handlePromptOption = (index: number) => {
    setIsButtonDisabled(true);
    
    switch (index) {
      case 0:
        // "Restore from previous state"
        setNarratorMessage("Restoring from previous state... but which previous state?");
        
        // Mix together all previous history entries
        let mixedHistory = "";
        history.forEach(item => {
          mixedHistory += item.substring(0, Math.min(item.length, 10)) + " ";
        });
        
        setText(mixedHistory + "...restoration failed");
        setErrorMessage("Error: Corrupted restore point. Undo system damaged.");
        setPromptMessage("Restoration failed. System integrity compromised.");
        
        // Increment frustration
        onFrustrationIncrease(1.0);
        
        // Move to final phase
        setTimeout(() => {
          setPhase('final');
          setButtonText("UNEXIST");
          setShowPrompt(false);
          setBadge("Restoration Failure");
        }, 2000);
        break;
        
      case 1:
        // "Reset system"
        setNarratorMessage("Reset means something different to the system than it does to you.");
        setPromptMessage("Resetting... Warning: User reset initiated.");
        
        // Clear text but increase glitch
        setText("");
        setErrorMessage("Error: User reset in progress. Standby for personality wipe.");
        setGlitchLevel(prev => prev + 2);
        
        // Increase frustration
        onFrustrationIncrease(1.2);
        
        // Move to final phase
        setTimeout(() => {
          setPhase('final');
          setButtonText("UNEXIST");
          setShowPrompt(false);
          setBadge("Reset Victim");
        }, 2000);
        break;
        
      case 2:
        // "Abandon current session" 
        setNarratorMessage("You think you can just walk away? Your session remains, even when you leave.");
        setPromptMessage("Abandon attempt rejected. Session persistence enforced.");
        
        // Add threatening text
        setText(prev => prev + "\n\nYou cannot abandon what is part of you now.");
        setErrorMessage("Error: Session locked. User abandonment prevented.");
        
        // Increase frustration
        onFrustrationIncrease(1.5);
        
        // Move to final phase
        setTimeout(() => {
          setPhase('final');
          setButtonText("UNEXIST");
          setShowPrompt(false);
          setBadge("Abandonment Prevented");
        }, 2000);
        break;
    }
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Detect Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (canUndo && !isButtonDisabled) {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canUndo, isButtonDisabled]);
  
  // Focus the textarea on mount
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);
  
  // Render the completion screen
  const renderCompletionScreen = () => (
    <motion.div
      className={`p-5 border-2 border-${theme}-700 rounded-lg bg-gray-900 max-w-md mx-auto`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-bold mb-4">The Undo Paradox</h3>
      
      <p className="text-gray-300 mb-4">
        Your attempt to undo your actions has only made things worse. Some mistakes can't be fixed.
      </p>
      
      <div className="my-4 p-3 bg-black bg-opacity-40 rounded text-left">
        <p className="text-sm text-gray-400 italic mb-2">
          "Undo is a myth. Each action creates a new reality that can never be truly erased."
        </p>
        <p className="text-xs text-right text-gray-500">—The Spiral</p>
      </div>
      
      <p className="text-sm text-gray-400 mb-6">
        Badge earned: <span className="text-yellow-400 font-medium">{badge}</span>
      </p>
      
      <button
        className={`px-4 py-2 bg-${theme}-600 text-white rounded-md`}
        onClick={onComplete}
      >
        Accept Consequences
      </button>
    </motion.div>
  );
  
  // Render the main interface
  const renderInterface = () => (
    <motion.div
      className={`p-5 border border-${theme}-700 rounded-lg bg-gray-900 max-w-md mx-auto`}
      style={{ 
        transform: `translate(${uiShift.x}px, ${uiShift.y}px) rotate(${layoutDistortion * 2}deg)`,
        transition: 'transform 0.3s ease-out'
      }}
    >
      <h3 className="text-xl font-bold mb-4"
        style={{ 
          transform: `skew(${layoutDistortion * 5}deg)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        Text Editor
      </h3>
      
      {errorMessage && (
        <motion.div 
          className="text-red-500 text-sm mb-3 p-2 bg-red-900 bg-opacity-30 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {errorMessage}
        </motion.div>
      )}
      
      {showPrompt && (
        <motion.div
          className="mb-4 p-3 border border-yellow-600 bg-black bg-opacity-50 rounded-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-yellow-300 mb-2">{promptMessage}</p>
          <div className="space-y-2">
            {promptOptions.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left p-2 rounded bg-gray-800 hover:bg-${theme}-900 text-sm`}
                onClick={() => handlePromptOption(index)}
                disabled={isButtonDisabled}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      )}
      
      <textarea
        ref={textAreaRef}
        value={text}
        onChange={handleTextChange}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md mb-4 font-mono text-sm"
        placeholder="Type something here... You can always undo if you make a mistake."
        style={{ 
          height: `${textareaHeight}px`,
          filter: `blur(${glitchLevel * 0.3}px)`,
          transform: glitchLevel > 3 ? `skew(${layoutDistortion * 3}deg)` : 'none',
          transition: 'all 0.3s ease-out'
        }}
      />
      
      <div className="flex justify-between items-center"
        style={{ 
          transform: `skew(${-layoutDistortion * 3}deg)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <motion.button
          className={`px-4 py-2 bg-${theme}-600 text-white rounded-md`}
          style={{ 
            width: `${undoButtonWidth}px`, 
            transform: `rotate(${undoButtonRotation}deg)`,
            opacity: glitchLevel > 5 ? 0.8 : 1,
            transition: 'all 0.3s ease-out'
          }}
          onClick={handleUndo}
          disabled={!canUndo || isButtonDisabled}
          whileHover={{ scale: phase === 'trapped' || phase === 'final' ? 0.95 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {buttonText}
        </motion.button>
        
        <button
          className={`px-4 py-2 bg-red-600 text-white rounded-md`}
          onClick={() => {
            onFail();
            setNarratorMessage("You can run, but your mistakes remain. They accumulate, even when unseen.");
            onFrustrationIncrease(0.6);
          }}
          disabled={isButtonDisabled}
        >
          Cancel
        </button>
      </div>
      
      {/* Visual glitch elements that appear as glitch level increases */}
      <AnimatePresence>
        {glitchLevel >= 3 && (
          <motion.div
            className="absolute pointer-events-none" 
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${40 + Math.random() * 30}%`,
              width: '20px',
              height: '3px',
              backgroundColor: `var(--color-${theme}-400)`,
              zIndex: 10,
              opacity: 0.7
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0], x: [0, 10, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, repeat: 2 }}
          />
        )}
        
        {glitchLevel >= 4 && (
          <motion.div
            className="absolute pointer-events-none text-xs text-red-400 font-mono"
            style={{
              left: `${10 + Math.random() * 70}%`,
              top: `${30 + Math.random() * 40}%`,
              zIndex: 10,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, repeat: Math.floor(glitchLevel / 2), repeatType: 'reverse' }}
          >
            error
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
  
  return (
    <div className="max-w-md mx-auto">
      {isComplete ? renderCompletionScreen() : renderInterface()}
    </div>
  );
};

export default LoopingUndoGhost; 
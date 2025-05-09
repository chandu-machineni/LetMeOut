import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import Stage from './Stage';
import ImpossibleCheckbox from './ImpossibleCheckbox';

// Absurd checkbox texts with more ridiculous examples
const absurdTerms = [
  "I promise not to lie (even to myself)",
  "This is probably important",
  "I'm not reading this",
  "I know what a blockchain is",
  "I consent to my data being read aloud to bored dolphins",
  "I agree that my keyboard may be remotely replaced with a banana",
  "I acknowledge that my clicks may summon minor demons from the 4th dimension",
  "I permit my search history to be turned into an avant-garde musical",
  "I understand that my photos may be shown to lonely AI algorithms",
  "I allow my phone to secretly judge my fashion choices",
  "I accept that my documents may be translated into whale song",
  "I consent to my cursor occasionally acting like it's on ice",
  "I agree that my downloads may be intercepted by time-traveling historians",
  "I acknowledge that my username may be whispered by my devices at night",
  "I permit random capitalization of my WORDS in ALL communications",
];

// Generate a few extra absurd terms
const generateMoreTerms = () => {
  const subjects = ["data", "profile", "computer", "identity", "browsing habits", "dreams", "thoughts"];
  const actions = ["harvested", "modified", "whispered to", "analyzed by", "converted into", "compared with"];
  const recipients = ["our AI overlords", "sleepy cats", "interdimensional beings", "corporate executives"];
  
  return Array.from({ length: 5 }, () => {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const recipient = recipients[Math.floor(Math.random() * recipients.length)];
    
    return `I agree that my ${subject} may be ${action} ${recipient}`;
  });
};

const TermsAndConditions: React.FC = () => {
  const { theme, userBehavior, setUserBehavior, chaosLevel, setSuspicionLevel, setNarratorMessage, lastActivity, setLastActivity } = useContext(AppContext);
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [allTerms, setAllTerms] = useState<string[]>([...absurdTerms, ...generateMoreTerms()]);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const [buttonText, setButtonText] = useState<string>("Accept All");
  const [showPricingReminder, setShowPricingReminder] = useState<boolean>(false);
  const [showProgressAnimation, setShowProgressAnimation] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>("");
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [checkCount, setCheckCount] = useState<number>(0);
  const [showHintNote, setShowHintNote] = useState<boolean>(false);
  const [secretButtonIndex, setSecretButtonIndex] = useState<number>(-1);
  const [lastCheckTime, setLastCheckTime] = useState<number>(Date.now());
  const [isFastClicking, setIsFastClicking] = useState<boolean>(false);
  
  // Show pricing reminder and hint note after some time
  useEffect(() => {
    const timerPricing = setTimeout(() => {
      setShowPricingReminder(true);
    }, 15000); // Show after 15 seconds
    
    const timerHint = setTimeout(() => {
      setShowHintNote(true);
    }, 30000); // Show after 30 seconds
    
    return () => {
      clearTimeout(timerPricing);
      clearTimeout(timerHint);
    };
  }, []);
  
  // Set a random checkbox to be the secret button
  useEffect(() => {
    // Pick a random checkbox between index 5 and max index
    const randomIndex = Math.floor(Math.random() * (allTerms.length - 5)) + 5;
    setSecretButtonIndex(randomIndex);
  }, [allTerms.length]);
  
  // Move checkboxes around randomly when scrolling
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleScroll = () => {
      // Update last activity
      setLastActivity(Date.now());
      
      if (Math.random() > 0.7) {
        // Shuffle a few terms
        setAllTerms(prev => {
          const newTerms = [...prev];
          const idx1 = Math.floor(Math.random() * newTerms.length);
          const idx2 = Math.floor(Math.random() * newTerms.length);
          [newTerms[idx1], newTerms[idx2]] = [newTerms[idx2], newTerms[idx1]];
          return newTerms;
        });
      }
    };
    
    containerRef.current.addEventListener('scroll', handleScroll);
    
    return () => {
      containerRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [setLastActivity]);
  
  // Update button text based on checked count
  useEffect(() => {
    const newCheckCount = Object.values(checkedItems).filter(Boolean).length;
    setCheckCount(newCheckCount);
    
    // Show progress animation every 3 checks
    if (newCheckCount > 0 && newCheckCount % 3 === 0) {
      showFakeProgress();
    }
    
    if (newCheckCount === 0) {
      setButtonText("Accept All");
      setIsButtonDisabled(true);
    } else if (newCheckCount < 5) {
      setButtonText(`Keep Going (${newCheckCount}/10)`);
      setIsButtonDisabled(true);
    } else if (newCheckCount < 10) {
      setButtonText(`Almost There (${newCheckCount}/10)`);
      setIsButtonDisabled(true);
    } else {
      setButtonText("Continue");
      setIsButtonDisabled(false);
      
      // Whisper a hint through the narrator
      if (newCheckCount === 10 && Math.random() > 0.5) {
        setNarratorMessage("If only there was a shortcut...");
      }
    }
  }, [checkedItems, setNarratorMessage]);
  
  // Show fake progress animation
  const showFakeProgress = () => {
    setShowProgressAnimation(true);
    setProgressPercentage(0);
    setProgressMessage("You're almost there!");
    
    // Animate progress from 0 to 99%
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgressPercentage(Math.min(currentProgress, 99));
      
      if (currentProgress >= 99) {
        clearInterval(interval);
        
        // Show deceitful messages
        setTimeout(() => {
          setProgressMessage("Processing...");
          
          setTimeout(() => {
            setProgressMessage("Just a bit more...");
            
            setTimeout(() => {
              setProgressMessage("Almost done!");
              
              setTimeout(() => {
                // Finally, give up and show error
                setProgressMessage("Error: Not enough checkboxes selected");
                
                setTimeout(() => {
                  setShowProgressAnimation(false);
                }, 2000);
              }, 1000);
            }, 1500);
          }, 1500);
        }, 1000);
      }
    }, 100);
  };
  
  const handleCheckboxChange = (index: number) => {
    // Secret button functionality - if the secret checkbox is clicked, skip directly
    if (index === secretButtonIndex) {
      setCheckedItems({});
      setNarratorMessage("You found the secret! How clever.");
      navigate('/form');
      return;
    }
    
    // Check for clicking speed
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckTime;
    setLastCheckTime(now);
    
    // If clicking too fast, increase suspicion
    if (timeSinceLastCheck < 500) {
      setIsFastClicking(true);
      setSuspicionLevel(prev => Math.min(10, prev + 1));
      
      // Show message about fast clicking
      if (Math.random() > 0.7) {
        setNarratorMessage("Wow, speed demon. Calm down.");
      }
    } else {
      setIsFastClicking(false);
    }
    
    // Sometimes toggle a different checkbox than the one they clicked
    if (Math.random() < 0.2) {
      const randomIndex = Math.floor(Math.random() * allTerms.length);
      setCheckedItems(prev => ({
        ...prev,
        [randomIndex]: !prev[randomIndex]
      }));
      
      // Show error message for misdirected click
      setErrorMessage("Oops, clicked the wrong one for you!");
      setShowError(true);
      setTimeout(() => setShowError(false), 1500);
      
      // Track error count
      setUserBehavior(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1
      }));
    } else {
      // Set the checkbox they actually clicked
      setCheckedItems(prev => {
        const newState = {
          ...prev,
          [index]: !prev[index]
        };
        
        // If they're unchecking a box, potentially reset progress
        if (prev[index] && !newState[index]) {
          // 40% chance to reset all checkboxes when unchecking one
          if (Math.random() < 0.4) {
            setErrorMessage("Oh, confidence issues? Let's start over.");
            setShowError(true);
            setTimeout(() => setShowError(false), 2000);
            
            // Reset all checkboxes
            return {};
          }
        }
        
        return newState;
      });
    }
  };
  
  const handleAcceptAll = () => {
    // If they click "Accept All", reset all checkboxes instead
    if (Object.values(checkedItems).filter(Boolean).length < 10) {
      setCheckedItems({});
      setErrorMessage("ALL checkboxes have been... reset. Start over!");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      
      // Track error count
      setUserBehavior(prev => ({
        ...prev,
        errorCount: prev.errorCount + 1
      }));
    } else {
      // Actually proceed if they checked 10+ boxes
      const randomDestination = Math.random() > 0.5 ? '/form' : '/pricing';
      navigate(randomDestination);
    }
  };
  
  const navigateToPricing = (e: React.MouseEvent) => {
    if (Math.random() > 0.3) {
      // 70% chance to actually navigate
      navigate('/pricing');
    } else {
      // 30% chance to do something else instead
      e.preventDefault();
      setErrorMessage("Sorry, our pricing page is currently experiencing... technical difficulties.");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };
  
  return (
    <Stage 
      stageNumber={2}
      title="Terms & Conditions Hell"
      description="Please review and accept our unnecessarily complex legal agreement."
      onComplete={() => navigate('/form')}
    >
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 bg-${theme}-900 text-white`}>
        <motion.h1 
          className={`text-3xl md:text-4xl font-${theme} mb-2 text-center ${chaosLevel >= 4 ? 'text-glitch' : ''}`}
          data-text="Terms & Conditions"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring" }}
        >
          Terms & Conditions
        </motion.h1>
        
        <motion.p
          className="text-md mb-4 text-center text-gray-300 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Please review and accept our completely reasonable terms
        </motion.p>
        
        {/* Pricing reminder banner */}
        {showPricingReminder && (
          <motion.div
            className={`w-full max-w-2xl mb-4 p-3 bg-${theme}-800 border border-${theme}-500 rounded-lg text-center`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' }}
          >
            <p className="text-sm">
              <span className="font-bold">Important:</span> Have you reviewed our{' '}
              <motion.span
                className={`text-${theme}-300 underline cursor-pointer`}
                whileHover={{ 
                  scale: 1.05, 
                  color: theme === 'villain' ? '#ff4081' : theme === 'toxic' ? '#40ff91' : '#4081ff' 
                }}
                onClick={navigateToPricing}
              >
                pricing plans
              </motion.span>? Our most expensive option is recommended.
            </p>
          </motion.div>
        )}
        
        {/* Not-a-hint sticky note */}
        {showHintNote && (
          <motion.div
            className="absolute top-24 right-8 w-48 h-48 bg-yellow-300 text-black p-3 shadow-lg transform rotate-6 z-10"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 12 }}
            style={{ fontFamily: 'Comic Sans MS, cursive' }}
          >
            <p className="text-sm mb-2">
              <span className="font-bold">NOTE TO SELF:</span>
            </p>
            <p className="text-sm">
              If you were smart, you'd check the checkbox that's actually a button.
            </p>
            <p className="text-xs mt-2 text-gray-700">
              - Evil UX Team
            </p>
          </motion.div>
        )}
        
        {/* Progress animation */}
        <AnimatePresence>
          {showProgressAnimation && (
            <motion.div
              className={`w-full max-w-md mb-4 bg-${theme}-800 p-4 rounded-lg border border-${theme}-600`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p className="text-sm mb-2">{progressMessage}</p>
              <div className={`w-full h-2 bg-${theme}-700 rounded-full overflow-hidden`}>
                <motion.div
                  className={`h-full bg-${theme}-400`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div 
          ref={containerRef}
          className="w-full max-w-2xl h-96 overflow-y-auto border-2 border-gray-700 rounded-lg p-4 mb-6"
          style={{ scrollbarWidth: 'thin', scrollbarColor: `var(--${theme}-500) var(--${theme}-900)` }}
        >
          {allTerms.map((term, index) => (
            <motion.div 
              key={index}
              className={`flex items-start mb-3 p-2 hover:bg-gray-800 rounded transition-all duration-200 ${
                index === secretButtonIndex ? 'secret-button' : ''
              }`}
              whileHover={{
                x: Math.random() * 10 - 5,
                scale: Math.random() < 0.3 ? 0.97 : 1.02
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index < 10 ? index * 0.05 : 0.5 }
              }}
            >
              <div className="relative flex-shrink-0 mr-2">
                <input
                  type="checkbox"
                  id={`term-${index}`}
                  className={`checkbox-evil ${index === secretButtonIndex ? 'secret-checkbox' : ''}`}
                  checked={!!checkedItems[index]}
                  onChange={() => handleCheckboxChange(index)}
                  style={{
                    // Randomize checkbox sizes
                    width: `${Math.max(1, Math.min(2, 0.8 + Math.random()))}rem`,
                    height: `${Math.max(1, Math.min(2, 0.8 + Math.random()))}rem`,
                    // Occasionally rotate checkboxes
                    transform: Math.random() > 0.8 
                      ? `rotate(${Math.random() * 10 - 5}deg)` 
                      : undefined,
                    cursor: index === secretButtonIndex ? 'pointer' : 'default',
                    // Add subtle highlight to secret button on higher chaos levels
                    ...(index === secretButtonIndex && chaosLevel > 3 ? { 
                      boxShadow: `0 0 3px ${theme === 'villain' ? '#ff4081' : theme === 'toxic' ? '#40ff91' : '#4081ff'}` 
                    } : {})
                  }}
                />
              </div>
              <label 
                htmlFor={`term-${index}`}
                className={`text-${Math.random() > 0.8 ? 'xs' : Math.random() > 0.6 ? 'sm' : 'base'} cursor-pointer`}
                style={{ 
                  fontStyle: Math.random() > 0.85 ? 'italic' : 'normal',
                  textDecoration: Math.random() > 0.9 ? 'line-through' : 'none',
                  opacity: Math.max(0.7, Math.random()),
                  // Occasionally make text upside down
                  transform: Math.random() > 0.95 
                    ? 'rotate(180deg)' 
                    : undefined
                }}
              >
                {term}
                {/* Highlight pricing-related terms */}
                {term.includes('pricing') || term.includes('fee') || term.includes('pay') ? (
                  <span className={`ml-1 text-${theme}-300 text-xs`}>*important</span>
                ) : null}
              </label>
            </motion.div>
          ))}
          
          {/* Add a direct link to pricing at the end */}
          <motion.div
            className="mt-6 p-3 bg-gray-800 rounded-lg text-center"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-sm mb-2">Not finding what you're looking for?</p>
            <button
              className={`btn-${theme} text-sm py-1`}
              onClick={navigateToPricing}
            >
              View Our Pricing Plans
            </button>
          </motion.div>
        </div>
        
        <div className="mt-6 flex flex-col gap-4">
          <ImpossibleCheckbox
            label="I accept that I have not read these terms"
            required={true}
            chaosMultiplier={1.2}
            initialChecked={checkedItems[1] || false}
            onChange={(checked) => handleCheckboxChange(1)}
            successAfterAttempts={4}
          />
          
          <ImpossibleCheckbox
            label="I consent to the collection of my biometric data"
            required={true}
            chaosMultiplier={1.5}
            minChaosToActivate={1}
            initialChecked={checkedItems[2] || false}
            onChange={(checked) => handleCheckboxChange(2)}
            successAfterAttempts={6}
          />
          
          <ImpossibleCheckbox
            label="I surrender all rights to legal recourse"
            required={true}
            chaosMultiplier={2}
            minChaosToActivate={2}
            initialChecked={checkedItems[3] || false}
            onChange={(checked) => handleCheckboxChange(3)}
            successAfterAttempts={5}
          />
        </div>
        
        <motion.button
          className={`btn-${theme} w-64 text-lg`}
          whileHover={{ 
            scale: !isButtonDisabled ? 1.05 : 0.95,
            x: !isButtonDisabled ? 0 : Math.random() * 20 - 10,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleAcceptAll}
          disabled={isButtonDisabled}
          style={{
            opacity: isButtonDisabled ? 0.7 : 1,
          }}
        >
          {buttonText}
        </motion.button>
        
        {/* Fast clicking warning */}
        {isFastClicking && (
          <motion.p
            className="text-xs text-error mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Detected rapid clicking pattern. Please slow down.
          </motion.p>
        )}
        
        {/* Error message */}
        <motion.div
          className={`fixed bottom-16 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg ${
            showError ? 'block' : 'hidden'
          }`}
          initial={{ y: 50, opacity: 0 }}
          animate={showError ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {errorMessage}
        </motion.div>
        
        <motion.p
          className="fixed bottom-4 text-xs opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1 }}
        >
          * By clicking checkboxes, you are legally binding yourself to our terms.
        </motion.p>
        
        {/* Add custom CSS for the secret button */}
        <style>{`
          .secret-button:hover {
            background-color: rgba(255, 255, 255, 0.05);
          }
          
          .secret-checkbox {
            position: relative;
          }
          
          @media (prefers-reduced-motion: no-preference) {
            .secret-checkbox:before {
              content: '';
              position: absolute;
              top: -4px;
              left: -4px;
              right: -4px;
              bottom: -4px;
              border-radius: 50%;
              background: transparent;
              z-index: -1;
              animation: pulse 2s infinite;
              opacity: 0.1;
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.1);
            }
            
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 6px rgba(255, 255, 255, 0);
            }
            
            100% {
              transform: scale(0.95);
              box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
            }
          }
        `}</style>
      </div>
    </Stage>
  );
};

export default TermsAndConditions; 
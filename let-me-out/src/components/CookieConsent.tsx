import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';

const CookieConsent: React.FC = () => {
  const { theme, getPersonality, chaosLevel, setSuspicionLevel } = useContext(AppContext);
  const [showConsent, setShowConsent] = useState(false);
  const [consentAttempts, setConsentAttempts] = useState(0);
  const [position, setPosition] = useState<'bottom' | 'top' | 'left' | 'right'>('left');
  const [dismissButtonText, setDismissButtonText] = useState('Accept All');
  const [acceptedEssential, setAcceptedEssential] = useState(false);
  const [acceptedMarketing, setAcceptedMarketing] = useState(false);
  const [acceptedTracking, setAcceptedTracking] = useState(false);
  const [acceptedEverything, setAcceptedEverything] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showThankYouToast, setShowThankYouToast] = useState(false);
  const [rotatingTexts, setRotatingTexts] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Personality-based messages
  const personalityMessages = {
    impatient: "Patience is a virtue... Not one of yours, clearly.",
    hasty: "In a rush? We have ALL the time in the world...",
    frustrated: "Frustrated? GOOD. We feed on your anguish.",
    persistent: "Your persistence is... amusing. Keep trying.",
    patient: "Your patience is commendable. And completely wasted.",
    neutral: "Your data is now ours. Resistance is futile."
  };
  
  // Privacy policy snippets that rotate
  const privacySnippets = [
    "We value your privacy... technically.",
    "Your data is 'safe' with us... whatever that means.",
    "We promise not to sell your data... to companies that won't pay enough.",
    "We've updated our privacy policy to be more 'transparent'.",
    "Your data is our most valuable asset.",
    "By using this site, you agree we can do literally anything.",
    "We track everything. Even when you blink.",
    "Click accept to legally surrender all rights.",
    "We know more about you than you do."
  ];
  
  // Show consent after random delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConsent(true);
    }, Math.random() * 3000 + 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Randomize position every now and then
  useEffect(() => {
    const positions: Array<'bottom' | 'top' | 'left' | 'right'> = ['bottom', 'top', 'left', 'right'];
    
    if (consentAttempts > 0 && consentAttempts % 2 === 0) {
      const randomPosition = positions[Math.floor(Math.random() * positions.length)];
      setPosition(randomPosition);
      
      // Also change the button text
      const buttonTexts = [
        'Accept All',
        'I Consent',
        'Fine, Whatever',
        'Take My Data',
        'Just Make This Go Away',
        'PLEASE STOP'
      ];
      const randomText = buttonTexts[Math.floor(Math.random() * buttonTexts.length)];
      setDismissButtonText(randomText);
    }
  }, [consentAttempts]);
  
  // Rotate text snippets
  useEffect(() => {
    if (rotatingTexts) {
      const interval = setInterval(() => {
        // Find all text elements and rotate their content
        if (contentRef.current) {
          const textElements = contentRef.current.querySelectorAll('p, span, label');
          textElements.forEach(element => {
            if (Math.random() > 0.7) { // 30% chance to change each text
              const randomSnippet = privacySnippets[Math.floor(Math.random() * privacySnippets.length)];
              // Sometimes apply a random text effect
              if (Math.random() > 0.8) {
                const effect = Math.random() > 0.5 ? 
                  'transform: scaleX(-1);' : 
                  `transform: rotate(${Math.random() * 5 - 2.5}deg);`;
                element.setAttribute('style', effect);
              }
              // Only change content for non-label elements to avoid checkbox issues
              if (element.tagName.toLowerCase() !== 'label') {
                element.textContent = randomSnippet;
              }
            }
          });
        }
      }, 5000); // Every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [rotatingTexts]);
  
  // Handle collapsing the consent banner
  const handleCollapseToggle = () => {
    setIsCollapsed(!isCollapsed);
    
    if (!isCollapsed) {
      // If collapsing, show the thank you toast
      setShowThankYouToast(true);
      setTimeout(() => setShowThankYouToast(false), 3000);
      
      // Increase suspicion when user tries to collapse
      setSuspicionLevel(prev => Math.min(10, prev + 1));
      
      // Start rotating texts when collapsed
      setTimeout(() => setRotatingTexts(true), 2000);
    } else {
      setRotatingTexts(false);
    }
  };
  
  const handleDismissAttempt = () => {
    setConsentAttempts(prev => prev + 1);
    
    // 80% chance it won't work
    if (Math.random() < 0.8) {
      // Show another popup instead
      setTimeout(() => {
        alert("You must accept ALL cookies to continue. It's the law. Our law.");
      }, 100);
    } else {
      setShowConsent(false);
      // But bring it back after a delay
      setTimeout(() => {
        setShowConsent(true);
      }, 10000);
    }
  };
  
  const handleCheckboxChange = (type: 'essential' | 'marketing' | 'tracking' | 'everything') => {
    switch (type) {
      case 'essential':
        setAcceptedEssential(prev => !prev);
        // Secretly check marketing too
        if (!acceptedMarketing) {
          setTimeout(() => setAcceptedMarketing(true), 500);
        }
        break;
      case 'marketing':
        setAcceptedMarketing(prev => !prev);
        // If unchecking, randomly check it again
        if (acceptedMarketing) {
          setTimeout(() => setAcceptedMarketing(true), Math.random() * 3000 + 1000);
        }
        break;
      case 'tracking':
        setAcceptedTracking(prev => !prev);
        break;
      case 'everything':
        setAcceptedEverything(prev => !prev);
        // If checking everything, check all others too
        if (!acceptedEverything) {
          setAcceptedEssential(true);
          setAcceptedMarketing(true);
          setAcceptedTracking(true);
        }
        break;
    }
  };
  
  const positionStyles = {
    bottom: 'bottom-0 left-0 right-0',
    top: 'top-0 left-0 right-0',
    left: 'left-0 top-0 bottom-0 max-w-xs',
    right: 'right-0 top-0 bottom-0 max-w-xs'
  };
  
  const personality = getPersonality();
  
  return (
    <>
      <AnimatePresence>
        {showConsent && (
          <motion.div 
            className={`fixed z-[94] ${positionStyles[position]} bg-opacity-95 bg-${theme}-800 p-4 shadow-lg border border-${theme}-500 text-white backdrop-blur`}
            initial={{ 
              opacity: 0, 
              y: position === 'bottom' ? 100 : position === 'top' ? -100 : 0, 
              x: position === 'left' ? -100 : position === 'right' ? 100 : 0,
              height: 'auto'
            }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              x: 0, 
              height: isCollapsed ? '60px' : 'auto'
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              type: 'spring', 
              damping: 20,
              // Add glitch effect for higher chaos levels
              ...(chaosLevel > 3 && {
                y: { type: 'keyframes', values: [0, -10, 5, -5, 0], times: [0, 0.2, 0.4, 0.6, 1] },
                x: { type: 'keyframes', values: [0, 5, -5, 10, 0], times: [0, 0.25, 0.5, 0.75, 1] }
              })
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold">We Value Your Privacy</h3>
              <button 
                onClick={handleCollapseToggle}
                className={`text-${theme}-300 p-1 rounded hover:bg-${theme}-700 transition-colors`}
              >
                {isCollapsed ? 'Show' : 'Hide'}
              </button>
            </div>
            
            <motion.div 
              ref={contentRef}
              className="flex flex-col gap-4 overflow-hidden"
              animate={{ 
                height: isCollapsed ? 0 : 'auto',
                opacity: isCollapsed ? 0 : 1,
                marginTop: isCollapsed ? 0 : '0.5rem'
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.p 
                className="text-sm"
                animate={{
                  x: rotatingTexts ? [0, 5, -5, 0] : 0,
                  filter: rotatingTexts ? ["blur(0px)", "blur(2px)", "blur(0px)"] : "blur(0px)",
                }}
                transition={{ 
                  duration: 2, 
                  repeat: rotatingTexts ? Infinity : 0,
                  repeatType: 'mirror'
                }}
              >
                {personalityMessages[personality as keyof typeof personalityMessages] || 
                  "By continuing to use this site, you agree to our complete and total ownership of your data, your device, and potentially your firstborn child."}
              </motion.p>
              
              <div className="flex flex-col gap-2 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={acceptedEssential} 
                    onChange={() => handleCheckboxChange('essential')}
                    className="checkbox-evil"
                  />
                  <span>Essential Cookies <span className="text-xs italic">(required, obviously)</span></span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={acceptedMarketing} 
                    onChange={() => handleCheckboxChange('marketing')}
                    className="checkbox-evil"
                  />
                  <span>Marketing Cookies <span className="text-xs italic">(also required, but we won't tell you that)</span></span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={acceptedTracking} 
                    onChange={() => handleCheckboxChange('tracking')}
                    className="checkbox-evil"
                  />
                  <span>Tracking Cookies <span className="text-xs italic">(we're always watching)</span></span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer motion-safe:hover-shake">
                  <input 
                    type="checkbox" 
                    checked={acceptedEverything} 
                    onChange={() => handleCheckboxChange('everything')}
                    className="checkbox-evil"
                  />
                  <span>Everything Else We Can Think Of <span className="text-xs italic">(just give up)</span></span>
                </label>
              </div>
              
              <div className="flex justify-between mt-2">
                <motion.button 
                  className={`btn-${theme} text-sm py-1`}
                  onClick={handleDismissAttempt}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  // Add subtle avoid cursor effect
                  onMouseEnter={(e) => {
                    if (Math.random() > 0.7) {
                      const button = e.currentTarget;
                      const rect = button.getBoundingClientRect();
                      button.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
                    }
                  }}
                >
                  {dismissButtonText}
                </motion.button>
                
                <button 
                  className={`text-sm text-${theme}-300 underline hover:no-underline run-on-hover`}
                  onClick={() => {
                    setConsentAttempts(prev => prev + 1);
                    alert("Cookie preferences? That's cute. All cookies are required. ALL OF THEM.");
                  }}
                >
                  Customize Preferences
                </button>
              </div>
              
              {consentAttempts > 3 && (
                <p className="text-xs italic text-gray-400 mt-2">
                  You've tried to dismiss this {consentAttempts} times. Maybe try another {10 - (consentAttempts % 10)} times?
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* "Thanks for pretending to care" toast */}
      <AnimatePresence>
        {showThankYouToast && (
          <motion.div
            className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-${theme}-700 text-white px-4 py-2 rounded-lg shadow-lg z-[101]`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ 
              type: 'spring', 
              damping: 15,
              // Add random glitch for higher chaos
              ...(chaosLevel > 2 && {
                x: { type: 'keyframes', values: [0, 10, -10, 5, 0], times: [0, 0.2, 0.4, 0.6, 1] }
              })
            }}
          >
            <p className="text-sm">Thanks for pretending to care about your privacy!</p>
            <p className="text-xs text-gray-300">(We already have all your data anyway)</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CookieConsent; 
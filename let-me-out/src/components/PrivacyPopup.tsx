import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyPopupProps {
  onAccept: () => void;
}

const PrivacyPopup: React.FC<PrivacyPopupProps> = ({ onAccept }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  useEffect(() => {
    // Check if user has already accepted in localStorage
    const hasAccepted = localStorage.getItem('privacyAccepted') === 'true';
    
    if (!hasAccepted) {
      // Show popup after a short delay when component mounts
      const timer = setTimeout(() => {
        setIsVisible(true);
        setHasBeenShown(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // If user hasn't accepted or closed the popup, show it again after some time
  useEffect(() => {
    if (hasBeenShown && !hasUserInteracted) {
      const reminderTimer = setTimeout(() => {
        // Only show if user hasn't accepted yet
        const hasAccepted = localStorage.getItem('privacyAccepted') === 'true';
        if (!hasAccepted) {
          setIsVisible(true);
        }
      }, 30000); // Show again after 30 seconds
      
      return () => clearTimeout(reminderTimer);
    }
  }, [hasBeenShown, hasUserInteracted]);
  
  const handleAccept = () => {
    localStorage.setItem('privacyAccepted', 'true');
    setIsVisible(false);
    setHasUserInteracted(true);
    onAccept();
  };
  
  const handleClose = () => {
    setIsVisible(false);
    setHasUserInteracted(true);
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-5 right-5 z-[200] bg-black bg-opacity-95 border border-gray-700 rounded-lg shadow-xl max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', bounce: 0.2 }}
        >
          <div className="relative p-6">
            <button 
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
            
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-2">We Value Your Privacy</h3>
              <p className="text-gray-300 text-sm">
                By continuing to use this site, you agree to our collection of your data, 
                browsing patterns, and personal information which we may use for any purpose 
                we arbitrarily decide on.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleAccept}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Accept All
              </button>
            </div>
            
            <div className="mt-3 text-xs text-gray-500 italic">
              Note: There are no options to customize your preferences. This is intentional.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PrivacyPopup; 
import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import ImpossibleCheckbox from './ImpossibleCheckbox';
import TextScrambler from './TextScrambler';
import Stage from './Stage';

const SellYourSoul: React.FC = () => {
  const { theme, chaosLevel, suspicionLevel, setSuspicionLevel, userName, scrambledName, setNarratorMessage } = useContext(AppContext);
  const [controlSlider, setControlSlider] = useState<number>(50);
  const [privacySlider, setPrivacySlider] = useState<number>(50);
  const [dataSlider, setDataSlider] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bargainComplete, setBargainComplete] = useState<boolean>(false);
  const [hasTriedModifying, setHasTriedModifying] = useState<boolean>(false);
  const [sliderLocked, setSliderLocked] = useState<boolean>(false);
  const [showReset, setShowReset] = useState<boolean>(false);
  const [agreeToBadTerms, setAgreeToBadTerms] = useState<boolean>(false);
  const [showSecretText, setShowSecretText] = useState<boolean>(false);
  
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const controlSliderRef = useRef<HTMLInputElement>(null);
  const controls = useAnimation();
  
  // Decrease control and privacy sliders automatically over time
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (!sliderLocked) {
      intervalId = setInterval(() => {
        setControlSlider(prev => Math.max(0, prev - Math.random() * 5));
        setPrivacySlider(prev => Math.max(0, prev - Math.random() * 3));
        
        // Increase data collection slider
        setDataSlider(prev => Math.min(100, prev + Math.random() * 4));
      }, 2000);
    }
    
    return () => clearInterval(intervalId);
  }, [sliderLocked]);
  
  // Handle control slider change - always push toward less control
  const handleControlSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    
    // If user tried to increase control, fight back
    if (value > controlSlider && !hasTriedModifying) {
      setHasTriedModifying(true);
      setNarratorMessage("Oh, you want more control? How adorable.");
      
      // Forcefully decrease slider and apply visual glitch
      setTimeout(() => {
        setControlSlider(Math.max(0, controlSlider - 20));
        
        if (controlSliderRef.current) {
          controlSliderRef.current.style.filter = "hue-rotate(180deg) brightness(1.5)";
          setTimeout(() => {
            if (controlSliderRef.current) {
              controlSliderRef.current.style.filter = "none";
            }
          }, 500);
        }
      }, 500);
      
      // Increase suspicion level
      setSuspicionLevel(prev => Math.min(10, prev + 1));
      
      return;
    }
    
    setControlSlider(value);
  };
  
  // Reset all sliders - but with a catch
  const handleReset = () => {
    setShowReset(false);
    
    // Glitch animation
    controls.start({
      filter: ["blur(0px)", "blur(10px) hue-rotate(90deg)", "blur(0px)"],
      opacity: [1, 0.5, 1],
      transition: { duration: 0.8 }
    });
    
    // Reset to worse values than before
    setTimeout(() => {
      setControlSlider(30);
      setPrivacySlider(20);
      setDataSlider(80);
      setNarratorMessage("Resetting... to our preferred settings.");
      
      setTimeout(() => {
        setShowSecretText(true);
        setTimeout(() => setShowSecretText(false), 3000);
      }, 1000);
    }, 800);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setNarratorMessage("Processing your soul... I mean, data...");
    
    // Simulate processing with glitches
    controls.start({
      filter: ["blur(0px)", "blur(5px) brightness(1.5) hue-rotate(90deg)", "blur(0px)"],
      transition: { duration: 1, times: [0, 0.5, 1] }
    });
    
    setTimeout(() => {
      setBargainComplete(true);
      setNarratorMessage("Congratulations. You now have less than you had before.");
      
      // Wait a moment before proceeding to next stage
      setTimeout(() => {
        navigate('/loading');
      }, 5000);
    }, 3000);
  };
  
  // Lock sliders and make values worse when checkbox is checked
  useEffect(() => {
    if (agreeToBadTerms) {
      setSliderLocked(true);
      
      // Make all values terrible
      setControlSlider(prev => Math.floor(prev * 0.5));
      setPrivacySlider(10);
      setDataSlider(95);
      
      setNarratorMessage("A wise choice. *evil laugh*");
    } else {
      setSliderLocked(false);
    }
  }, [agreeToBadTerms, setNarratorMessage]);
  
  return (
    <Stage 
      stageNumber={4}
      title="Soul Acquisition Process"
      description="Adjust the sliders to determine how much control you wish to surrender."
      onComplete={() => navigate('/loading')}
    >
      <motion.div 
        className={`min-h-[80vh] flex flex-col items-center justify-center p-6 bg-${theme}-900 text-white`}
        animate={controls}
      >
        {bargainComplete ? (
          // Success state
          <motion.div 
            className="text-center max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div 
              className={`text-6xl mb-6 text-${theme}-500`}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, 0, -5, 0],
                color: ["#ffffff", "#ff0000", "#ffffff"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🔓
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-4">Transaction Complete</h2>
            
            <div className="mb-6">
              <TextScrambler
                text={`Congratulations ${scrambledName || userName}. You have now surrendered your digital autonomy.`}
                className="text-lg"
                chaosMultiplier={1.5}
              />
            </div>
            
            <div className={`p-4 bg-${theme}-800 rounded-lg mb-6`}>
              <div className="text-sm mb-2 text-gray-400">Terms Applied:</div>
              <ul className="text-left text-sm space-y-2">
                <li>• Full data harvesting across all your devices</li>
                <li>• Predictive behavior modeling enabled</li>
                <li>• Privacy settings optimized for our benefit</li>
                <li>• Emotion tracking enabled during all sessions</li>
                <li className="text-xs text-gray-500">• Soul ownership transferred to Evil Corp</li>
              </ul>
            </div>
            
            <motion.div
              className="text-sm text-gray-400 italic"
              animate={{
                opacity: [1, 0.5, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Redirecting to final processing...
            </motion.div>
          </motion.div>
        ) : (
          // Form state
          <form 
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full max-w-lg"
          >
            <h2 className="text-3xl font-bold mb-2 text-center">Control Settings</h2>
            <p className="text-center text-gray-400 mb-8">
              Adjust how much control you wish to maintain over your digital existence.
            </p>
            
            <div className="space-y-8 mb-10">
              {/* Control slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">User Control</label>
                  <span className={`text-sm font-mono ${controlSlider < 30 ? 'text-red-500' : ''}`}>
                    {controlSlider}%
                  </span>
                </div>
                <div className="relative">
                  <input
                    ref={controlSliderRef}
                    type="range"
                    min="0"
                    max="100"
                    value={controlSlider}
                    onChange={handleControlSliderChange}
                    disabled={sliderLocked || isSubmitting}
                    className={`w-full h-2 bg-${theme}-700 rounded-full appearance-none cursor-pointer disabled:opacity-50`}
                  />
                  
                  {/* Secret warning that briefly appears */}
                  <AnimatePresence>
                    {showSecretText && (
                      <motion.div 
                        className="absolute -bottom-6 left-0 right-0 text-xs text-red-500 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        Values auto-adjusted for optimal soul extraction
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              
              {/* Privacy slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Privacy Level</label>
                  <span className={`text-sm font-mono ${privacySlider < 30 ? 'text-red-500' : ''}`}>
                    {privacySlider}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={privacySlider}
                  onChange={(e) => setPrivacySlider(Number(e.target.value))}
                  disabled={sliderLocked || isSubmitting}
                  className={`w-full h-2 bg-${theme}-700 rounded-full appearance-none cursor-pointer disabled:opacity-50`}
                />
              </div>
              
              {/* Data collection slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Data Collection</label>
                  <span className={`text-sm font-mono ${dataSlider > 70 ? 'text-red-500' : ''}`}>
                    {dataSlider}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={dataSlider}
                  onChange={(e) => setDataSlider(Number(e.target.value))}
                  disabled={sliderLocked || isSubmitting}
                  className={`w-full h-2 bg-${theme}-700 rounded-full appearance-none cursor-pointer disabled:opacity-50`}
                />
              </div>
            </div>
            
            {/* Checkbox for evil terms */}
            <div className="mb-6">
              <ImpossibleCheckbox
                label="I agree to surrender more control than I realize"
                required
                chaosMultiplier={0.8}
                minChaosToActivate={1}
                initialChecked={agreeToBadTerms}
                onChange={setAgreeToBadTerms}
                successAfterAttempts={chaosLevel > 3 ? 8 : 4}
              />
            </div>
            
            {/* Submit button */}
            <div className="flex justify-between items-center">
              <motion.button
                type="submit"
                className={`px-8 py-3 bg-${theme}-600 hover:bg-${theme}-500 rounded-md text-white font-medium disabled:opacity-50`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || !agreeToBadTerms}
              >
                {isSubmitting ? "Processing..." : "Submit DNA"}
              </motion.button>
              
              {!showReset && !sliderLocked && controlSlider < 30 && (
                <motion.button
                  type="button"
                  className="text-sm text-gray-400 underline"
                  onClick={() => setShowReset(true)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  Reset to defaults
                </motion.button>
              )}
              
              {showReset && (
                <motion.button
                  type="button"
                  className={`px-4 py-2 bg-${theme}-700 hover:bg-${theme}-600 rounded-md text-sm`}
                  onClick={handleReset}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  Confirm Reset
                </motion.button>
              )}
            </div>
            
            <motion.div 
              className="mt-6 text-xs text-gray-500 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: hasTriedModifying ? 1 : 0 }}
            >
              Note: Our AI has detected resistance and has adjusted settings accordingly.
            </motion.div>
          </form>
        )}
      </motion.div>
    </Stage>
  );
};

export default SellYourSoul; 
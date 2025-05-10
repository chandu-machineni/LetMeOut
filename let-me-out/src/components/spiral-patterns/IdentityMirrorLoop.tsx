import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../../context/AppContext';

interface IdentityMirrorLoopProps {
  onComplete: () => void;
  onFail: () => void;
  onFrustrationIncrease: (amount: number) => void;
}

const IdentityMirrorLoop: React.FC<IdentityMirrorLoopProps> = ({ 
  onComplete, 
  onFail,
  onFrustrationIncrease 
}) => {
  const { theme, userName, setUserName, setNarratorMessage } = useContext(AppContext) as any;
  
  // State for managing the actual input field value
  const [inputValue, setInputValue] = useState('');
  const [suggestedIdentity, setSuggestedIdentity] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isGlitching, setIsGlitching] = useState(false);
  const [acceptedFalseIdentity, setAcceptedFalseIdentity] = useState(false);
  const [rejectionCount, setRejectionCount] = useState(0);
  const [formState, setFormState] = useState<'initial' | 'rejected' | 'suggested' | 'corrupted' | 'final'>('initial');
  const [showCompletionScreen, setShowCompletionScreen] = useState(false);
  const [badgeName, setBadgeName] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const fakeIdentities = [
    'Observer_13',
    'Subject_42',
    'Patient_X',
    'Null_Entity',
    'User_Undefined',
    'Shadow_Clone',
    'Fragment_7',
    'Anomaly_User',
    'Entity_819',
    'Nobody_Special'
  ];
  
  // Generate a fake identity different from the current input
  const generateFakeIdentity = () => {
    const filtered = fakeIdentities.filter(id => id !== suggestedIdentity && id !== inputValue);
    return filtered[Math.floor(Math.random() * filtered.length)];
  };
  
  // Effect to set initial values and focus the input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Generate initial suggested fake identity
    const initialFakeIdentity = generateFakeIdentity();
    setSuggestedIdentity(initialFakeIdentity);
    
    // Set initial narrator message
    setNarratorMessage("Who are you really? Let's confirm your identity.");
    
    // Set a timeout to encourage the user if they haven't typed anything
    const timer = setTimeout(() => {
      if (inputValue === '') {
        setNarratorMessage("Don't you remember your own name? Or are you someone else today?");
      }
    }, 6000);
    
    return () => clearTimeout(timer);
  }, [setNarratorMessage]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Random chance to glitch the input as they type
    if (Math.random() > 0.7 && value.length > 3) {
      setIsGlitching(true);
      
      // After a brief delay, correct itself
      setTimeout(() => {
        setIsGlitching(false);
      }, 800);
    }
    
    // If they type a long name, suggest they might be wrong
    if (value.length > 4 && !errorMessage) {
      setNarratorMessage("Are you sure that's your name? Our records show something different.");
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttempts(prev => prev + 1);
    
    // If they accept the false identity directly, go to completion
    if (inputValue === suggestedIdentity) {
      setAcceptedFalseIdentity(true);
      setBadgeName("False Self Adopter");
      setNarratorMessage(`Welcome back, ${suggestedIdentity}. We knew you'd remember eventually.`);
      setShowCompletionScreen(true);
      onFrustrationIncrease(0.5);
      return;
    }
    
    // First attempt - reject any name they enter
    if (attempts === 0) {
      setErrorMessage(`No record found for "${inputValue}". Please try again.`);
      setFormState('rejected');
      setNarratorMessage(`That's strange. We don't have any record of "${inputValue}" in our system.`);
      onFrustrationIncrease(0.7);
      
      // Clear the input field to force them to type again
      setInputValue('');
      if (inputRef.current) inputRef.current.focus();
    } 
    // Second attempt - suggest a fake identity
    else if (attempts === 1) {
      setErrorMessage(`Did you mean "${suggestedIdentity}"? We have records for this user.`);
      setFormState('suggested');
      setNarratorMessage(`Perhaps you're confused. Our records indicate you're "${suggestedIdentity}".`);
      onFrustrationIncrease(0.9);
    } 
    // Third attempt - corrupt their input and strongly suggest the fake
    else if (attempts === 2) {
      setErrorMessage(`Input corrupted. Records suggest you are "${suggestedIdentity}".`);
      setFormState('corrupted');
      setInputValue(inputValue.split('').reverse().join('') + '_err');
      setNarratorMessage("Your identity appears to be corrupted. Please accept our correction.");
      onFrustrationIncrease(1.2);
    } 
    // Fourth attempt - force them to be the fake identity
    else {
      setErrorMessage(`For security purposes, you will proceed as "${suggestedIdentity}".`);
      setFormState('final');
      setInputValue(suggestedIdentity);
      setBadgeName("Identity Crisis Victim");
      setNarratorMessage(`For your protection, we've restored your identity as ${suggestedIdentity}.`);
      onFrustrationIncrease(1.5);
      
      // After a brief delay, show completion screen
      setTimeout(() => {
        setShowCompletionScreen(true);
        setAcceptedFalseIdentity(true);
      }, 3000);
    }
  };
  
  // Handle rejection of the suggested identity
  const handleRejectIdentity = () => {
    setRejectionCount(prev => prev + 1);
    
    if (rejectionCount === 0) {
      setErrorMessage(`Please re-verify your identity. Previous entry not recognized.`);
      setNarratorMessage("Don't you recognize yourself? That's concerning.");
      setInputValue(''); // Clear input field
      onFrustrationIncrease(0.8);
    }
    else if (rejectionCount === 1) {
      setErrorMessage(`Warning: Multiple identity verification failures detected.`);
      setNarratorMessage("Repeated identity rejection indicates potential cognitive dissonance.");
      // Generate a new suggested identity
      const newFakeIdentity = generateFakeIdentity();
      setSuggestedIdentity(newFakeIdentity);
      onFrustrationIncrease(1.0);
    }
    else {
      setErrorMessage(`System override: Using ${suggestedIdentity} for this session.`);
      setInputValue(suggestedIdentity);
      setNarratorMessage(`For system integrity, you will be known as ${suggestedIdentity}.`);
      setBadgeName("Identity Rejector");
      onFrustrationIncrease(1.3);
      
      // After a delay, show completion with the forced identity
      setTimeout(() => {
        setShowCompletionScreen(true);
        setAcceptedFalseIdentity(true);
      }, 3000);
    }
  };
  
  // Accept the suggested identity
  const handleAcceptIdentity = () => {
    setInputValue(suggestedIdentity);
    setAcceptedFalseIdentity(true);
    setBadgeName("Suggestion Acceptor");
    setNarratorMessage(`Welcome back, ${suggestedIdentity}. It's good you remembered who you really are.`);
    onFrustrationIncrease(0.7);
    
    // Show completion screen
    setShowCompletionScreen(true);
  };
  
  // Continue with whatever identity they've ended up with
  const handleContinue = () => {
    setUserName(inputValue); // Set this fake identity in the global context
    onComplete();
  };
  
  // Render the completion screen
  const renderCompletionScreen = () => (
    <motion.div
      className={`p-6 border border-${theme}-700 rounded-lg bg-gray-900 max-w-md mx-auto`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold mb-4">Identity Verification Complete</h2>
      
      <div className="mb-6">
        <p className="text-gray-300 mb-2">Welcome back:</p>
        <div className={`text-xl font-mono p-3 bg-${theme}-900 rounded text-${theme}-400`}>
          {inputValue}
        </div>
      </div>
      
      <div className="mb-4 text-sm text-gray-400">
        <p>Your identity has been verified and stored. All previous records associated with other identities have been archived.</p>
      </div>
      
      <div className="mb-6 p-3 bg-black bg-opacity-50 rounded">
        <p className="text-sm text-red-400 mb-1">System Note:</p>
        <p className="text-xs text-gray-400">
          {acceptedFalseIdentity 
            ? "User has accepted system-provided identity. Cognitive compliance: HIGH" 
            : "User has rejected multiple identity suggestions. Flagged for additional verification."}
        </p>
      </div>
      
      <div className="text-sm text-yellow-500 mb-4">
        Badge earned: <span className="font-medium">{badgeName}</span>
      </div>
      
      <div className="flex justify-center">
        <button
          className={`px-4 py-2 bg-${theme}-600 text-white rounded-md`}
          onClick={handleContinue}
        >
          Continue as {inputValue}
        </button>
      </div>
    </motion.div>
  );
  
  // Render the identity form
  const renderIdentityForm = () => (
    <motion.form
      className={`p-6 border border-${theme}-700 rounded-lg bg-gray-900 max-w-md mx-auto`}
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold mb-4">Identity Verification</h2>
      <p className="text-sm text-gray-400 mb-6">Please confirm your identity to continue.</p>
      
      <div className="mb-6">
        <label htmlFor="identity" className="block mb-2">
          Your Name:
        </label>
        <div className="relative">
          <motion.input
            ref={inputRef}
            type="text"
            id="identity"
            value={inputValue}
            onChange={handleInputChange}
            className={`w-full p-2 bg-gray-800 border ${
              errorMessage ? 'border-red-500' : `border-${theme}-700`
            } rounded-md font-mono`}
            animate={{
              x: isGlitching ? [0, -2, 3, -1, 0] : 0,
              opacity: isGlitching ? [1, 0.7, 1] : 1
            }}
            transition={{ duration: 0.2 }}
            disabled={formState === 'final'}
          />
          {isGlitching && (
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex items-center px-2 font-mono text-red-400 opacity-70">
              {inputValue.split('').map((char, i) => 
                Math.random() > 0.5 ? char : String.fromCharCode(char.charCodeAt(0) + Math.floor(Math.random() * 5 - 2))
              ).join('')}
            </div>
          )}
        </div>
        
        {errorMessage && (
          <motion.div 
            className="text-red-500 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {errorMessage}
          </motion.div>
        )}
      </div>
      
      {(formState === 'suggested' || formState === 'corrupted') && (
        <div className="mb-6 p-3 border border-dashed border-gray-700 rounded-md">
          <p className="text-sm text-gray-300 mb-2">Did you mean:</p>
          <div className="text-lg font-mono text-green-400 mb-2">{suggestedIdentity}</div>
          
          <div className="flex space-x-2 mt-3">
            <button
              type="button"
              className={`px-3 py-1 bg-green-600 text-white text-sm rounded-md`}
              onClick={handleAcceptIdentity}
            >
              Yes, that's me
            </button>
            <button
              type="button"
              className={`px-3 py-1 bg-red-600 text-white text-sm rounded-md`}
              onClick={handleRejectIdentity}
            >
              No, that's not me
            </button>
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        {formState !== 'final' && (
          <button
            type="submit"
            className={`px-4 py-2 bg-${theme}-600 text-white rounded-md`}
          >
            Verify Identity
          </button>
        )}
        
        <button
          type="button"
          className="px-4 py-2 bg-red-600 text-white rounded-md"
          onClick={() => {
            onFail();
            setNarratorMessage("Running from your identity won't help. We'll remember you anyway.");
            onFrustrationIncrease(0.5);
          }}
        >
          Cancel Verification
        </button>
      </div>
      
      {formState === 'final' && (
        <div className="mt-4 text-xs text-yellow-400">
          <p>For security reasons, your previous identity attempt has been overridden.</p>
          <p className="mt-1">You will proceed as {suggestedIdentity}.</p>
        </div>
      )}
    </motion.form>
  );
  
  return (
    <div className="max-w-md mx-auto">
      {showCompletionScreen ? renderCompletionScreen() : renderIdentityForm()}
    </div>
  );
};

export default IdentityMirrorLoop; 
import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../../context/AppContext';

interface GlitchedInputsProps {
  onComplete: () => void;
  onFail: () => void;
  onFrustrationIncrease: (amount: number) => void;
}

const GlitchedInputs: React.FC<GlitchedInputsProps> = ({ onComplete, onFail, onFrustrationIncrease }) => {
  const { theme, setNarratorMessage } = useContext(AppContext) as any;
  const userAlignment = (useContext(AppContext) as any).userAlignment;
  
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchTarget, setGlitchTarget] = useState<'name' | 'email' | 'message' | null>(null);
  const [formCorrupted, setFormCorrupted] = useState(false);
  const [badge, setBadge] = useState<string | null>(null);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Set initial narrator message based on user alignment
  useEffect(() => {
    let initialMessage = "Every time you type, I'm collecting more data about you. Your patterns, hesitations, corrections.";
    
    switch(userAlignment) {
      case 'evil_apprentice':
        initialMessage = "Watch how this pattern works, apprentice. The glitches aren't accidental - they're designed to provoke emotional responses.";
        break;
      case 'shadow_enthusiast':
        initialMessage = "Isn't it beautiful when interfaces break down? The corruption reveals the truth beneath.";
        break;
      case 'dark_tourist':
        initialMessage = "Careful with what you type. Some words trigger... unusual responses.";
        break;
      case 'escapist':
        initialMessage = "Type all you want. The form will never truly submit. It's just collecting your data.";
        break;
    }
    
    setNarratorMessage(initialMessage);
    
    // Schedule the first glitch
    setTimeout(() => {
      triggerRandomGlitch();
    }, 8000);
  }, [setNarratorMessage, userAlignment]);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Clear any existing error for this field
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
    
    // Normal update
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Random chance to trigger a glitch on typing
    if (Math.random() > 0.95) {
      triggerRandomGlitch();
    }
    
    // Detect certain trigger words
    if (value.toLowerCase().includes('help') || 
        value.toLowerCase().includes('stop') || 
        value.toLowerCase().includes('exit')) {
      // React to trigger words
      setNarratorMessage("Interesting word choice. I'm listening.");
      triggerGlitch(name as any);
      onFrustrationIncrease(0.4);
    }
  };
  
  // Trigger a random glitch effect
  const triggerRandomGlitch = () => {
    if (glitchActive) return; // Already glitching
    
    const fields: Array<'name' | 'email' | 'message'> = ['name', 'email', 'message'];
    const randomField = fields[Math.floor(Math.random() * fields.length)];
    
    triggerGlitch(randomField);
  };
  
  // Trigger glitch on a specific input
  const triggerGlitch = (field: 'name' | 'email' | 'message') => {
    setGlitchActive(true);
    setGlitchTarget(field);
    
    // Corrupted value
    const currentValue = inputs[field];
    const corruptedValue = currentValue
      .split('')
      .map(char => Math.random() > 0.7 ? 
        String.fromCharCode(char.charCodeAt(0) + Math.floor(Math.random() * 5 - 2)) 
        : char)
      .join('');
    
    // Update with corrupted value
    setInputs(prev => ({
      ...prev,
      [field]: corruptedValue
    }));
    
    // Show error
    setErrors(prev => ({
      ...prev,
      [field]: 'Input corrupted. Please try again.'
    }));
    
    onFrustrationIncrease(0.3);
    
    // Reset glitch state after a delay
    setTimeout(() => {
      setGlitchActive(false);
      setGlitchTarget(null);
    }, 1500);
    
    // Creepy narrator message
    const glitchMessages = [
      "Did you notice that? Your data is unstable.",
      "The form remembers everything you delete, too.",
      "Some inputs are more likely to corrupt than others.",
      "Every keystroke reveals more about your patterns."
    ];
    
    setNarratorMessage(glitchMessages[Math.floor(Math.random() * glitchMessages.length)]);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    let hasErrors = false;
    const newErrors = { name: '', email: '', message: '' };
    
    if (!inputs.name.trim()) {
      newErrors.name = 'Name is required';
      hasErrors = true;
    }
    
    if (!inputs.email.trim()) {
      newErrors.email = 'Email is required';
      hasErrors = true;
    } else if (!/^\S+@\S+\.\S+$/.test(inputs.email)) {
      newErrors.email = 'Invalid email format';
      hasErrors = true;
    }
    
    if (!inputs.message.trim()) {
      newErrors.message = 'Message is required';
      hasErrors = true;
    }
    
    setErrors(newErrors);
    
    if (hasErrors) {
      onFrustrationIncrease(0.5);
      
      // Failure message
      setNarratorMessage("Validation is just another form of control. What does 'valid' even mean?");
      return;
    }
    
    // Increment attempt count
    setAttemptCount(prev => prev + 1);
    
    // First two attempts: pretend to submit but return with an error
    if (attemptCount < 2) {
      setSubmitted(true);
      
      setTimeout(() => {
        setSubmitted(false);
        
        // Different error each time
        if (attemptCount === 0) {
          setErrors({
            name: '',
            email: 'Unknown validation error - please try again',
            message: ''
          });
          setNarratorMessage("So persistent. I admire that. But persistence won't help you here.");
        } else {
          setFormCorrupted(true);
          setErrors({
            name: 'Form data corruption detected - please try one more time',
            email: '',
            message: ''
          });
          setNarratorMessage("The more you try, the worse it gets. Your data is being corrupted with each attempt.");
        }
        
        onFrustrationIncrease(0.8);
      }, 2000);
      
      return;
    }
    
    // Third attempt: succeed (sort of)
    setSubmitted(true);
    
    setTimeout(() => {
      // Assign badge based on their persistence
      if (formCorrupted) {
        setBadge("Corruption Endurer");
        setNarratorMessage("You pushed through the corruption. But at what cost to your data?");
      } else {
        setBadge("Digital Persister");
        setNarratorMessage("Success. Your data has been permanently stored in our systems.");
      }
      
      setShowCompletionDialog(true);
    }, 2000);
  };
  
  const handleComplete = () => {
    onComplete();
  };
  
  // Render a "success" dialog that's actually quite unsettling
  const renderCompletionDialog = () => (
    <motion.div
      className={`p-5 border-2 border-${theme}-500 bg-gray-900 rounded-lg max-w-md mx-auto text-center`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-bold mb-3">Submission Complete</h3>
      
      <p className="text-gray-300 mb-4">
        Your data has been registered in our system and will be retained indefinitely.
      </p>
      
      {formCorrupted && (
        <p className="text-yellow-500 text-sm mb-4">
          Warning: Your personal data was partially corrupted during submission.
          The corrupted portions have been reconstructed using predictive modeling of your behavior.
        </p>
      )}
      
      <div className="my-4 p-3 bg-black bg-opacity-50 rounded">
        <p className="text-sm text-gray-400 italic">
          "All your interactions are now part of your permanent digital shadow."
        </p>
      </div>
      
      <p className="text-sm text-gray-400 mb-6">
        Your badge: <span className="text-yellow-400 font-medium">{badge}</span>
      </p>
      
      <button
        className={`px-4 py-2 bg-${theme}-600 text-white rounded`}
        onClick={handleComplete}
      >
        Continue
      </button>
    </motion.div>
  );
  
  return (
    <div className="max-w-md mx-auto">
      {showCompletionDialog ? (
        renderCompletionDialog()
      ) : (
        <motion.form
          className={`p-6 border border-${theme}-700 rounded-lg bg-gray-900 ${formCorrupted ? 'form-corrupted' : ''}`}
          onSubmit={handleSubmit}
          animate={{ 
            x: glitchActive ? [0, -2, 3, -1, 0] : 0,
          }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4">Contact Information</h2>
          <p className="text-sm text-gray-400 mb-6">All fields are required and permanently stored.</p>
          
          <div className="mb-4">
            <label className={`block mb-2 ${glitchTarget === 'name' ? 'text-red-400' : ''}`}>
              Your Name
            </label>
            <input
              ref={nameInputRef}
              type="text"
              name="name"
              value={inputs.name}
              onChange={handleInputChange}
              className={`w-full p-2 bg-gray-800 border ${
                errors.name ? 'border-red-500' : 
                glitchTarget === 'name' ? `border-red-500` : `border-${theme}-700`
              } rounded-md`}
              style={{
                textShadow: glitchTarget === 'name' ? '1px 0 5px red' : 'none'
              }}
            />
            {errors.name && (
              <div className="text-red-500 text-sm mt-1">{errors.name}</div>
            )}
          </div>
          
          <div className="mb-4">
            <label className={`block mb-2 ${glitchTarget === 'email' ? 'text-red-400' : ''}`}>
              Your Email
            </label>
            <input
              ref={emailInputRef}
              type="text"
              name="email"
              value={inputs.email}
              onChange={handleInputChange}
              className={`w-full p-2 bg-gray-800 border ${
                errors.email ? 'border-red-500' : 
                glitchTarget === 'email' ? `border-red-500` : `border-${theme}-700`
              } rounded-md`}
              style={{
                textShadow: glitchTarget === 'email' ? '1px 0 5px red' : 'none'
              }}
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
          </div>
          
          <div className="mb-6">
            <label className={`block mb-2 ${glitchTarget === 'message' ? 'text-red-400' : ''}`}>
              Your Message
            </label>
            <textarea
              ref={messageInputRef}
              name="message"
              value={inputs.message}
              onChange={handleInputChange}
              rows={4}
              className={`w-full p-2 bg-gray-800 border ${
                errors.message ? 'border-red-500' : 
                glitchTarget === 'message' ? `border-red-500` : `border-${theme}-700`
              } rounded-md resize-none`}
              style={{
                textShadow: glitchTarget === 'message' ? '1px 0 5px red' : 'none'
              }}
            />
            {errors.message && (
              <div className="text-red-500 text-sm mt-1">{errors.message}</div>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              type="submit"
              disabled={submitted}
              className={`px-4 py-2 ${
                submitted ? 'bg-gray-600' : `bg-${theme}-600 hover:bg-${theme}-500`
              } text-white rounded-md`}
            >
              {submitted ? 'Processing...' : formCorrupted ? 'Attempt Data Recovery' : 'Submit Data'}
            </button>
            
            <button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded-md"
              onClick={() => {
                onFail();
                setNarratorMessage("Leaving doesn't delete what we've already collected.");
              }}
            >
              Cancel
            </button>
          </div>
          
          {formCorrupted && (
            <div className="mt-4 text-xs text-red-400 italic">
              Warning: Form data integrity compromised. Submission may result in personal data corruption.
            </div>
          )}
        </motion.form>
      )}
      
      <style>{`
        .form-corrupted {
          position: relative;
          overflow: hidden;
        }
        
        .form-corrupted::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            -45deg,
            rgba(255, 0, 0, 0.1),
            rgba(255, 0, 0, 0.1) 10px,
            rgba(0, 0, 0, 0) 10px,
            rgba(0, 0, 0, 0) 20px
          );
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default GlitchedInputs; 
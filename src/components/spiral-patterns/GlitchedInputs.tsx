import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface GlitchedInputsProps {
  onComplete: () => void;
  onFail: () => void;
}

const GlitchedInputs: React.FC<GlitchedInputsProps> = ({ onComplete, onFail }) => {
  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    comment: ''
  });
  const [glitching, setGlitching] = useState(false);
  const [glitchCount, setGlitchCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  
  // Simulate input glitches
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.5 && (inputs.name.length > 0 || inputs.email.length > 0 || inputs.comment.length > 0)) {
        setGlitching(true);
        
        // Scramble inputs randomly
        setInputs(prev => {
          const scrambleText = (text: string) => {
            if (!text) return text;
            const rand = Math.random();
            if (rand < 0.3) {
              // Swap characters
              return text.split('').sort(() => 0.5 - Math.random()).join('');
            } else if (rand < 0.6) {
              // Add random characters
              return text + "!@#*&^%"[Math.floor(Math.random() * 7)];
            } else {
              // Remove character
              return text.substring(0, Math.max(0, text.length - 1));
            }
          };
          
          return {
            name: Math.random() > 0.5 ? scrambleText(prev.name) : prev.name,
            email: Math.random() > 0.5 ? scrambleText(prev.email) : prev.email,
            comment: Math.random() > 0.5 ? scrambleText(prev.comment) : prev.comment
          };
        });
        
        setGlitchCount(prev => prev + 1);
        
        setTimeout(() => {
          setGlitching(false);
        }, 200);
      }
    }, 2000);
    
    return () => clearInterval(glitchInterval);
  }, [inputs]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // 20% chance of immediately glitching the input
    if (Math.random() < 0.2) {
      setGlitching(true);
      setTimeout(() => {
        setGlitching(false);
        setInputs(prev => ({
          ...prev,
          [name]: value.split('').reverse().join('')
        }));
      }, 100);
    } else {
      setInputs(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptCount(prev => prev + 1);
    
    // After 3 attempts, let them complete
    if (attemptCount >= 2) {
      onComplete();
    }
  };
  
  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Please complete this form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-1">Name:</label>
          <motion.div
            animate={glitching ? {
              x: [0, -2, 3, -1, 0],
              y: [0, 1, -2, 1, 0],
            } : {}}
            transition={{ duration: 0.2 }}
          >
            <input
              type="text"
              name="name"
              value={inputs.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-800"
              placeholder="Enter your name"
            />
          </motion.div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm mb-1">Email:</label>
          <motion.div
            animate={glitching ? {
              x: [0, 2, -3, 1, 0],
              y: [0, -1, 2, -1, 0],
            } : {}}
            transition={{ duration: 0.2 }}
          >
            <input
              type="email"
              name="email"
              value={inputs.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-800"
              placeholder="Enter your email"
            />
          </motion.div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm mb-1">Comment:</label>
          <motion.div
            animate={glitching ? {
              x: [0, -3, 2, -1, 0],
              y: [0, 2, -2, 1, 0],
            } : {}}
            transition={{ duration: 0.2 }}
          >
            <textarea
              name="comment"
              value={inputs.comment}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-gray-800"
              placeholder="Enter your comment"
              rows={3}
            />
          </motion.div>
        </div>
        
        <div className="flex justify-between">
          <motion.button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit
          </motion.button>
          
          <motion.button
            type="button"
            className="px-4 py-2 bg-red-600 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFail}
          >
            Give Up
          </motion.button>
        </div>
      </form>
      
      {glitchCount > 3 && (
        <div className="mt-4 text-sm text-red-400">
          Something seems to be wrong with this form...
        </div>
      )}
    </div>
  );
};

export default GlitchedInputs; 
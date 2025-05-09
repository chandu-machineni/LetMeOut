import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IdentityMirrorLoopProps {
  onComplete: () => void;
  onFail: () => void;
}

const IdentityMirrorLoop: React.FC<IdentityMirrorLoopProps> = ({ onComplete, onFail }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    preferences: ''
  });
  const [displayProfile, setDisplayProfile] = useState({
    name: '',
    email: '',
    bio: '',
    preferences: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [correctionAttempts, setCorrectionAttempts] = useState(0);
  const [showGaslighting, setShowGaslighting] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  
  // Initialize with some values if none exist
  useEffect(() => {
    if (!profile.name && !profile.email) {
      // Maybe they "already" entered this before...
      const fakePreviousEntries = {
        name: 'Pat Smith',
        email: 'pat.smith@email.com',
        bio: 'I enjoy long walks and good books.',
        preferences: 'Dark mode, no notifications'
      };
      
      setProfile(fakePreviousEntries);
      
      // Create a distorted version for display
      setDisplayProfile({
        name: 'Pat Smythe',
        email: 'pat.smithe@email.com',
        bio: 'I enjoy short walks and good films.',
        preferences: 'Light mode, frequent notifications'
      });
    }
  }, [profile]);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If they've already submitted once, count correction attempts
    if (submitted) {
      setCorrectionAttempts(prev => prev + 1);
      
      // After 3 correction attempts, show gaslighting message
      if (correctionAttempts >= 2 && !showGaslighting) {
        setShowGaslighting(true);
        setTimeout(() => setShowGaslighting(false), 4000);
      }
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptCount(prev => prev + 1);
    setSubmitted(true);
    
    if (attemptCount >= 2 || correctionAttempts >= 5) {
      setCanComplete(true);
    } else {
      // Each time they submit, distort their input in the display profile
      const distortText = (text: string): string => {
        if (!text) return text;
        
        // Different distortion methods
        const methods = [
          // Swap similar characters
          (t: string) => t.replace(/a/g, 'e').replace(/i/g, 'y').replace(/s/g, 'th'),
          // Change capitalization
          (t: string) => t.charAt(0).toLowerCase() + t.slice(1),
          // Small content changes
          (t: string) => {
            if (t.includes('like')) return t.replace('like', 'love');
            if (t.includes('love')) return t.replace('love', 'hate');
            if (t.includes('dark')) return t.replace('dark', 'light');
            if (t.includes('light')) return t.replace('light', 'dark');
            if (t.includes('no')) return t.replace('no', 'yes');
            if (t.includes('yes')) return t.replace('yes', 'no');
            return t;
          }
        ];
        
        // Apply a random distortion
        const method = methods[Math.floor(Math.random() * methods.length)];
        return method(text);
      };
      
      // Distort their profile data for display
      setDisplayProfile({
        name: distortText(profile.name),
        email: distortText(profile.email),
        bio: distortText(profile.bio),
        preferences: distortText(profile.preferences)
      });
    }
  };
  
  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Your Profile</h2>
      {!submitted ? (
        <p className="text-sm text-gray-400 mb-4">
          Please complete or update your profile information.
        </p>
      ) : (
        <p className="text-sm text-gray-400 mb-4">
          Please verify that your profile information is correct.
        </p>
      )}
      
      {/* Profile form */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-gray-800"
          />
          {submitted && profile.name !== displayProfile.name && (
            <div className="text-xs text-gray-500 mt-1">
              Currently shown as: {displayProfile.name}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-gray-800"
          />
          {submitted && profile.email !== displayProfile.email && (
            <div className="text-xs text-gray-500 mt-1">
              Currently shown as: {displayProfile.email}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm mb-1">Bio:</label>
          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-gray-800"
            rows={3}
          />
          {submitted && profile.bio !== displayProfile.bio && (
            <div className="text-xs text-gray-500 mt-1">
              Currently shown as: {displayProfile.bio}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm mb-1">Preferences:</label>
          <input
            type="text"
            name="preferences"
            value={profile.preferences}
            onChange={handleInputChange}
            className="w-full p-2 border rounded bg-gray-800"
          />
          {submitted && profile.preferences !== displayProfile.preferences && (
            <div className="text-xs text-gray-500 mt-1">
              Currently shown as: {displayProfile.preferences}
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <motion.button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {submitted ? "Update Profile" : "Save Profile"}
          </motion.button>
          
          {canComplete ? (
            <motion.button
              type="button"
              className="px-4 py-2 bg-green-600 text-white rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onComplete}
            >
              Accept Differences
            </motion.button>
          ) : (
            <motion.button
              type="button"
              className="px-4 py-2 bg-red-600 text-white rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onFail}
            >
              Give Up
            </motion.button>
          )}
        </div>
      </form>
      
      <AnimatePresence>
        {showGaslighting && (
          <motion.div
            className="mt-4 p-3 bg-purple-900/50 text-sm text-purple-300 rounded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            We don't see any discrepancies in your profile. Are you sure you're remembering correctly?
          </motion.div>
        )}
      </AnimatePresence>
      
      {submitted && correctionAttempts > 0 && (
        <div className="mt-4 text-sm text-gray-400">
          {correctionAttempts === 1 ? (
            "We've detected some changes to your profile."
          ) : correctionAttempts >= 3 ? (
            "We're having trouble understanding why you keep changing your profile. This information was provided by you originally."
          ) : (
            "Please note that our system maintains accurate records of what you provided."
          )}
        </div>
      )}
    </div>
  );
};

export default IdentityMirrorLoop; 
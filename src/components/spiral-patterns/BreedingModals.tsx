import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreedingModalsProps {
  onComplete: () => void;
  onFail: () => void;
}

interface Modal {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'survey';
  position: {
    x: number;
    y: number;
  };
}

const modalTitles = [
  "Please confirm your preferences",
  "Important information",
  "Special offer just for you!",
  "One quick question",
  "Did you know?",
  "Before you go",
  "Wait!",
  "Survey time",
  "Quick feedback"
];

const modalContents = [
  "We value your feedback. Would you like to take a quick survey?",
  "Don't miss out on our exclusive offers! Enable notifications?",
  "Your account may not be secured. Update your preferences now.",
  "Rate your experience with our service so far.",
  "We've updated our terms of service. Please review and accept.",
  "Join our newsletter for special discounts and promotions.",
  "Are you sure you want to close this window? You may lose progress.",
  "Help us improve! Tell us what you think about this feature.",
  "Congratulations! You've been selected for a special offer."
];

const BreedingModals: React.FC<BreedingModalsProps> = ({ onComplete, onFail }) => {
  const [modals, setModals] = useState<Modal[]>([]);
  const [modalCount, setModalCount] = useState(0);
  const [closedCount, setClosedCount] = useState(0);
  const [canComplete, setCanComplete] = useState(false);
  
  // Create initial modal
  useEffect(() => {
    if (modals.length === 0) {
      createModal();
    }
    
    // After closing 10 modals, allow completion
    if (closedCount >= 10 && !canComplete) {
      setCanComplete(true);
    }
  }, [modals.length, closedCount, canComplete]);
  
  // Create a new modal
  const createModal = () => {
    const id = modalCount;
    setModalCount(prev => prev + 1);
    
    const x = 150 + Math.random() * 200 - 100;
    const y = 150 + Math.random() * 200 - 100;
    
    const types: ('info' | 'warning' | 'error' | 'success' | 'survey')[] = 
      ['info', 'warning', 'error', 'success', 'survey'];
    
    const newModal: Modal = {
      id,
      title: modalTitles[Math.floor(Math.random() * modalTitles.length)],
      content: modalContents[Math.floor(Math.random() * modalContents.length)],
      type: types[Math.floor(Math.random() * types.length)],
      position: { x, y }
    };
    
    setModals(prev => [...prev, newModal]);
  };
  
  // Handle modal close - creates more modals
  const handleCloseModal = (id: number) => {
    setModals(prev => prev.filter(modal => modal.id !== id));
    setClosedCount(prev => prev + 1);
    
    // Create more modals when one is closed (unless we've reached the limit)
    if (modalCount < 20) {
      // 70% chance to create 2 modals, 30% chance to create 1
      const numToCreate = Math.random() > 0.3 ? 2 : 1;
      
      for (let i = 0; i < numToCreate; i++) {
        createModal();
      }
    }
  };
  
  // Get background color based on modal type
  const getModalColor = (type: string) => {
    switch(type) {
      case 'info': return 'bg-blue-800 border-blue-600';
      case 'warning': return 'bg-yellow-800 border-yellow-600';
      case 'error': return 'bg-red-800 border-red-600';
      case 'success': return 'bg-green-800 border-green-600';
      case 'survey': return 'bg-purple-800 border-purple-600';
      default: return 'bg-gray-800 border-gray-600';
    }
  };
  
  return (
    <div className="p-6 border rounded-lg relative h-[400px] overflow-hidden">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold mb-2">Modal Madness</h2>
        <p className="text-sm text-gray-400">
          {canComplete 
            ? "You've closed enough modals. You may proceed." 
            : "Try to close all popup messages to continue."}
        </p>
        <div className="text-xs text-gray-500 mt-1">
          Closed: {closedCount}/10
        </div>
      </div>
      
      <div className="relative w-full h-[300px] border border-dashed border-gray-700 rounded-lg mb-4">
        {/* Background content */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-opacity-30 pointer-events-none">
          Content hidden behind modals
        </div>
        
        {/* Modals */}
        <AnimatePresence>
          {modals.map(modal => (
            <motion.div
              key={modal.id}
              className={`absolute w-64 rounded-lg border ${getModalColor(modal.type)} shadow-lg overflow-hidden`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                x: modal.position.x,
                y: modal.position.y,
                transition: { type: 'spring', stiffness: 300, damping: 20 }
              }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              drag
              dragConstraints={{ left: 0, right: 300, top: 0, bottom: 200 }}
            >
              <div className="flex items-center justify-between p-3 border-b border-gray-600">
                <div className="font-medium">{modal.title}</div>
                <button 
                  className="w-5 h-5 rounded-full hover:bg-gray-700 flex items-center justify-center text-xs"
                  onClick={() => handleCloseModal(modal.id)}
                >
                  ×
                </button>
              </div>
              <div className="p-3 text-sm">
                <p>{modal.content}</p>
                <div className="flex justify-end mt-3 space-x-2">
                  <button 
                    className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
                    onClick={() => handleCloseModal(modal.id)}
                  >
                    {modal.type === 'survey' ? 'Not Now' : 'Cancel'}
                  </button>
                  <button 
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs"
                    onClick={() => handleCloseModal(modal.id)}
                  >
                    {modal.type === 'survey' ? 'Submit' : 
                     modal.type === 'error' ? 'Fix Now' : 
                     modal.type === 'warning' ? 'Proceed' : 'Accept'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="flex justify-between">
        {canComplete && (
          <motion.button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={onComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Complete Challenge
          </motion.button>
        )}
        
        <motion.button
          className="px-4 py-2 bg-red-600 text-white rounded ml-auto"
          onClick={onFail}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Give Up
        </motion.button>
      </div>
    </div>
  );
};

export default BreedingModals; 
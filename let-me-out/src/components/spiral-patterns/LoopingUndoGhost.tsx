import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../../context/AppContext';

interface LoopingUndoGhostProps {
  onComplete: () => void;
  onFail: () => void;
  onFrustrationIncrease: (amount: number) => void;
}

const LoopingUndoGhost: React.FC<LoopingUndoGhostProps> = ({ onComplete, onFail, onFrustrationIncrease }) => {
  const { theme, setNarratorMessage } = useContext(AppContext) as any;
  
  // Set a narrator message on render
  React.useEffect(() => {
    setNarratorMessage("You can't undo what you've done. Your past actions haunt you.");
  }, [setNarratorMessage]);
  
  return (
    <div className="max-w-md mx-auto">
      <motion.div
        className={`p-6 border border-${theme}-700 rounded-lg bg-gray-900`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold mb-4">Looping Undo Ghost</h2>
        <p className="text-gray-400 mb-6">This pattern is being enhanced with psychological horror elements.</p>
        
        <div className="flex justify-between">
          <button
            className={`px-4 py-2 bg-${theme}-600 text-white rounded`}
            onClick={() => {
              onComplete();
              onFrustrationIncrease(0.3);
            }}
          >
            Complete Pattern
          </button>
          
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => {
              onFail();
              setNarratorMessage("You can try to undo, but the ghost of your choices remains.");
              onFrustrationIncrease(0.5);
            }}
          >
            Abandon
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoopingUndoGhost; 
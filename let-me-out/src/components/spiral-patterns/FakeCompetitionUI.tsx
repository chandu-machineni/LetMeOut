import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../../context/AppContext';

interface FakeCompetitionUIProps {
  onComplete: () => void;
  onFail: () => void;
  onFrustrationIncrease: (amount: number) => void;
}

const FakeCompetitionUI: React.FC<FakeCompetitionUIProps> = ({ onComplete, onFail, onFrustrationIncrease }) => {
  const { theme, setNarratorMessage } = useContext(AppContext) as any;
  
  // Set a narrator message on render
  React.useEffect(() => {
    setNarratorMessage("Others are doing better than you. They always were. You never had a chance.");
  }, [setNarratorMessage]);
  
  return (
    <div className="max-w-md mx-auto">
      <motion.div
        className={`p-6 border border-${theme}-700 rounded-lg bg-gray-900`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold mb-4">Fake Competition</h2>
        <p className="text-gray-400 mb-6">This pattern is being enhanced with psychological horror elements.</p>
        
        <div className="flex justify-between">
          <button
            className={`px-4 py-2 bg-${theme}-600 text-white rounded`}
            onClick={onComplete}
          >
            Complete Pattern
          </button>
          
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={() => {
              onFail();
              setNarratorMessage("Quitting won't help. They'll still outperform you.");
              onFrustrationIncrease(0.5);
            }}
          >
            Forfeit Competition
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FakeCompetitionUI; 
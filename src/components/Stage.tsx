import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StageProps {
  stageNumber: number;
  title: string;
  description: string;
  children: ReactNode;
  onComplete: () => void;
}

const Stage: React.FC<StageProps> = ({ stageNumber, title, description, children, onComplete }) => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header className="p-4 border-b border-gray-800">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
            <div className="text-sm text-gray-500">
              Stage {stageNumber}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
    </motion.div>
  );
};

export default Stage; 
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StageProps {
  stageNumber: number;
  title: string;
  description: string;
  children: ReactNode;
  onComplete: () => void;
}

const Stage: React.FC<StageProps> = ({ children }) => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
    </motion.div>
  );
};

export default Stage; 
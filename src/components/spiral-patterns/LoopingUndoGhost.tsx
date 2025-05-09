import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoopingUndoGhostProps {
  onComplete: () => void;
  onFail: () => void;
}

const LoopingUndoGhost: React.FC<LoopingUndoGhostProps> = ({ onComplete, onFail }) => {
  // Canvas elements state
  const [shapes, setShapes] = useState<Array<{id: number, type: string, x: number, y: number, color: string, size: number}>>([
    { id: 1, type: 'circle', x: 100, y: 100, color: '#FF5555', size: 50 },
    { id: 2, type: 'square', x: 200, y: 150, color: '#55FF55', size: 40 },
    { id: 3, type: 'triangle', x: 300, y: 100, color: '#5555FF', size: 60 }
  ]);
  
  // History of actions for undo
  const [history, setHistory] = useState<Array<Array<any>>>([]);
  const [undoCount, setUndoCount] = useState(0);
  const [message, setMessage] = useState("Arrange the shapes, then try to use undo.");
  const [canComplete, setCanComplete] = useState(false);
  const [glitchLevel, setGlitchLevel] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  
  // Keep track of selected shape
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Track random mutations after undo
  const mutations = [
    // Swap colors between two random shapes
    () => {
      setShapes(prev => {
        if (prev.length < 2) return prev;
        
        const idx1 = Math.floor(Math.random() * prev.length);
        let idx2 = Math.floor(Math.random() * prev.length);
        while (idx2 === idx1) {
          idx2 = Math.floor(Math.random() * prev.length);
        }
        
        return prev.map((shape, idx) => {
          if (idx === idx1) return { ...shape, color: prev[idx2].color };
          if (idx === idx2) return { ...shape, color: prev[idx1].color };
          return shape;
        });
      });
      setMessage("Undo caused colors to swap between shapes!");
    },
    
    // Change a shape's type
    () => {
      setShapes(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        const shapeTypes = ['circle', 'square', 'triangle'];
        const newType = shapeTypes.filter(t => t !== prev[idx].type)[Math.floor(Math.random() * 2)];
        
        return prev.map((shape, i) => {
          if (i === idx) return { ...shape, type: newType };
          return shape;
        });
      });
      setMessage("Undo transformed a shape into something else!");
    },
    
    // Add a new random shape
    () => {
      setShapes(prev => {
        const colors = ['#FF5555', '#55FF55', '#5555FF', '#FFFF55', '#FF55FF', '#55FFFF'];
        const types = ['circle', 'square', 'triangle'];
        const newShape = {
          id: Date.now(),
          type: types[Math.floor(Math.random() * types.length)],
          x: Math.random() * 350 + 50,
          y: Math.random() * 200 + 50,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 30 + 30
        };
        
        return [...prev, newShape];
      });
      setMessage("Undo created a new shape from nothing!");
    },
    
    // Remove a random shape
    () => {
      setShapes(prev => {
        if (prev.length <= 1) return prev;
        const idx = Math.floor(Math.random() * prev.length);
        return prev.filter((_, i) => i !== idx);
      });
      setMessage("Undo made a shape disappear completely!");
    },
    
    // Resize all shapes
    () => {
      setShapes(prev => prev.map(shape => ({
        ...shape,
        size: Math.max(20, Math.min(80, shape.size * (Math.random() * 1.5 + 0.5)))
      })));
      setMessage("Undo distorted the size of everything!");
    }
  ];
  
  // Handle shape selection
  const handleShapeClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Get the shape
    const shape = shapes.find(s => s.id === id);
    if (!shape) return;
    
    // Calculate click offset relative to shape position
    setDragOffset({
      x: e.clientX - shape.x,
      y: e.clientY - shape.y
    });
    
    setSelectedShape(id);
    
    // Save state to history for undo
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(shapes))]);
  };
  
  // Handle shape drag
  const handleMouseMove = (e: React.MouseEvent) => {
    if (selectedShape === null) return;
    
    // Update shape position
    setShapes(prev => prev.map(shape => {
      if (shape.id === selectedShape) {
        return {
          ...shape,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        };
      }
      return shape;
    }));
  };
  
  // Handle mouse up to end drag
  const handleMouseUp = () => {
    setSelectedShape(null);
  };
  
  // Handle undo operation
  const handleUndo = () => {
    if (history.length === 0) return;
    
    // Increase undo count
    setUndoCount(prev => prev + 1);
    
    // Normal undo for first few attempts
    if (undoCount < 2) {
      const previousState = history[history.length - 1];
      setShapes(previousState);
      setHistory(prev => prev.slice(0, prev.length - 1));
      setMessage("Undo successful... for now.");
    } 
    // After a few undos, start random mutations
    else {
      // Perform a random mutation
      const mutationIndex = Math.min(
        mutations.length - 1, 
        Math.floor(undoCount / 2)
      );
      
      // Apply a random mutation with increasing probability
      mutations[Math.floor(Math.random() * (mutationIndex + 1))]();
      
      // Increase glitch level
      setGlitchLevel(prev => Math.min(10, prev + 1));
      
      // Clear history to prevent further normal undos
      setHistory([]);
      
      // Show warning about undo
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      
      // Enable completion after 3+ mutations
      if (undoCount >= 5) {
        setCanComplete(true);
      }
    }
  };
  
  // Reset the canvas
  const handleReset = () => {
    // Save to history first
    setHistory(prev => [...prev, JSON.parse(JSON.stringify(shapes))]);
    
    // Reset shapes
    setShapes([
      { id: 1, type: 'circle', x: 100, y: 100, color: '#FF5555', size: 50 },
      { id: 2, type: 'square', x: 200, y: 150, color: '#55FF55', size: 40 },
      { id: 3, type: 'triangle', x: 300, y: 100, color: '#5555FF', size: 60 }
    ]);
    
    // After multiple undos, reset might cause a mutation too
    if (undoCount >= 3 && Math.random() > 0.5) {
      setTimeout(() => {
        mutations[Math.floor(Math.random() * mutations.length)]();
      }, 500);
    }
  };
  
  // Render shape based on type
  const renderShape = (shape: any) => {
    const { type, color, size } = shape;
    const isSelected = selectedShape === shape.id;
    
    switch (type) {
      case 'circle':
        return (
          <motion.div 
            className={`absolute rounded-full ${isSelected ? 'ring-2 ring-white' : ''}`}
            style={{ 
              width: size, 
              height: size, 
              backgroundColor: color,
              left: shape.x - size/2,
              top: shape.y - size/2,
              cursor: 'move'
            }}
            whileHover={{ scale: 1.05 }}
            animate={{ scale: isSelected ? 1.1 : 1 }}
          />
        );
      case 'square':
        return (
          <motion.div 
            className={`absolute ${isSelected ? 'ring-2 ring-white' : ''}`}
            style={{ 
              width: size, 
              height: size, 
              backgroundColor: color,
              left: shape.x - size/2,
              top: shape.y - size/2,
              cursor: 'move'
            }}
            whileHover={{ scale: 1.05 }}
            animate={{ scale: isSelected ? 1.1 : 1 }}
          />
        );
      case 'triangle':
        return (
          <motion.div 
            className={`absolute ${isSelected ? 'ring-2 ring-white' : ''}`}
            style={{ 
              width: 0, 
              height: 0, 
              borderLeft: `${size/2}px solid transparent`,
              borderRight: `${size/2}px solid transparent`,
              borderBottom: `${size}px solid ${color}`,
              left: shape.x - size/2,
              top: shape.y - size,
              cursor: 'move'
            }}
            whileHover={{ scale: 1.05 }}
            animate={{ scale: isSelected ? 1.1 : 1 }}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-2">Undo Haunt</h2>
      <p className={`text-sm ${glitchLevel > 5 ? 'text-red-400 font-glitch' : 'text-gray-400'} mb-4`}>
        {message}
      </p>
      
      {/* Canvas area */}
      <div 
        className="relative border border-gray-700 rounded-lg h-[300px] mb-4 overflow-hidden bg-gray-900"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {shapes.map(shape => (
          <div 
            key={shape.id} 
            onMouseDown={(e) => handleShapeClick(shape.id, e)}
          >
            {renderShape(shape)}
          </div>
        ))}
        
        {/* Glitch overlay when undo is breaking things */}
        {glitchLevel > 0 && (
          <motion.div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ 
              opacity: glitchLevel * 0.05, 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='glitch' patternUnits='userSpaceOnUse' width='100' height='100'%3E%3Cpath d='M0 0L100 100M100 0L0 100' stroke='%23ff00ff' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23glitch)'/%3E%3C/svg%3E")` 
            }}
          />
        )}
      </div>
      
      <AnimatePresence>
        {showWarning && (
          <motion.div
            className="mb-4 p-2 bg-red-900/50 text-sm text-red-300 rounded"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Warning: Undo functionality is unstable and causing unexpected mutations!
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex space-x-2 mb-4">
        <motion.button
          className={`px-4 py-2 bg-blue-600 text-white rounded ${history.length === 0 && undoCount >= 3 ? 'opacity-50' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleUndo}
          disabled={history.length === 0 && undoCount >= 3}
        >
          Undo
        </motion.button>
        
        <motion.button
          className="px-4 py-2 bg-gray-600 text-white rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleReset}
        >
          Reset
        </motion.button>
      </div>
      
      <div className="flex justify-between">
        {canComplete && (
          <motion.button
            className="px-4 py-2 bg-green-600 text-white rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
          >
            Accept The Chaos
          </motion.button>
        )}
        
        <motion.button
          className="px-4 py-2 bg-red-600 text-white rounded ml-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFail}
        >
          Give Up
        </motion.button>
      </div>
    </div>
  );
};

export default LoopingUndoGhost; 
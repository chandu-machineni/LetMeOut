import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';

interface EvilCaptchaProps {
  onSuccess?: () => void;
  onFailure?: () => void;
}

const EvilCaptcha: React.FC<EvilCaptchaProps> = ({ onSuccess, onFailure }) => {
  const { theme, userBehavior, setUserBehavior } = useContext(AppContext);
  const [captchaType, setCaptchaType] = useState<'text' | 'image' | 'audio' | 'math' | 'puzzle'>('text');
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [captchaAttempts, setCaptchaAttempts] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [isShaking, setIsShaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [countdown, setCountdown] = useState(false);
  const [message, setMessage] = useState('Prove you are human');
  const [mathProblem, setMathProblem] = useState({ problem: '', answer: '' });
  const [imageOptions, setImageOptions] = useState<string[]>([]);
  const [correctImageIndex, setCorrectImageIndex] = useState(0);
  const [puzzlePieces, setPuzzlePieces] = useState<number[]>([]);
  const [puzzleArrangement, setPuzzleArrangement] = useState<number[]>([]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Generate random captcha based on type and difficulty
  useEffect(() => {
    generateCaptcha();
  }, [captchaType, difficulty]);
  
  // Start countdown once captcha is shown
  useEffect(() => {
    if (countdown) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFailure();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [countdown]);
  
  const generateCaptcha = () => {
    setUserInput('');
    setMessage('Prove you are human');
    
    // Determine captcha type based on attempts
    if (captchaAttempts > 0) {
      const types: Array<'text' | 'image' | 'audio' | 'math' | 'puzzle'> = ['text', 'image', 'math', 'puzzle'];
      const newType = types[Math.min(captchaAttempts, types.length - 1)];
      setCaptchaType(newType);
    }
    
    switch (captchaType) {
      case 'text':
        generateTextCaptcha();
        break;
      case 'image':
        generateImageCaptcha();
        break;
      case 'math':
        generateMathCaptcha();
        break;
      case 'puzzle':
        generatePuzzleCaptcha();
        break;
      default:
        generateTextCaptcha();
    }
    
    // Increase difficulty based on attempts
    setDifficulty(Math.min(5, 1 + Math.floor(captchaAttempts / 2)));
    
    // Start countdown
    setTimeLeft(Math.max(10, 30 - captchaAttempts * 3));
    setCountdown(true);
  };
  
  const generateTextCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    // Length increases with difficulty
    const length = 4 + difficulty;
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setCaptchaText(result);
    renderTextCaptcha(result);
  };
  
  const renderTextCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text
    ctx.font = `bold ${20 + difficulty}px Arial`;
    
    // Draw each character with distortion
    for (let i = 0; i < text.length; i++) {
      // Rotate and position each character slightly differently
      ctx.save();
      
      // Position
      const x = 20 + i * (25 + difficulty);
      const y = 30 + Math.random() * (10 * difficulty);
      
      // Rotation based on difficulty
      const rotation = (Math.random() - 0.5) * (0.2 * difficulty);
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Color
      const hue = Math.floor(Math.random() * 360);
      ctx.fillStyle = `hsl(${hue}, 100%, 70%)`;
      
      // Draw character
      ctx.fillText(text[i], 0, 0);
      
      // Restore context
      ctx.restore();
    }
    
    // Add noise lines
    for (let i = 0; i < 5 * difficulty; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.stroke();
    }
    
    // Add noise dots
    for (let i = 0; i < 50 * difficulty; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      ctx.fill();
    }
  };
  
  const generateImageCaptcha = () => {
    // Since we can't actually load images in this environment, 
    // we'll simulate an image selection CAPTCHA
    setMessage('Select all squares with traffic lights');
    
    // Pretend we have image options (in a real app, these would be actual image URLs)
    const options = Array.from({ length: 9 }, (_, i) => `image-${i + 1}`);
    setImageOptions(options);
    
    // Randomly determine the correct one
    setCorrectImageIndex(Math.floor(Math.random() * options.length));
  };
  
  const generateMathCaptcha = () => {
    let problem = '';
    let answer = 0;
    
    // Generate increasingly complex math problems based on difficulty
    switch (difficulty) {
      case 1:
        // Simple addition
        const a = Math.floor(Math.random() * 10);
        const b = Math.floor(Math.random() * 10);
        problem = `${a} + ${b} = ?`;
        answer = a + b;
        break;
      case 2:
        // Addition and subtraction
        const c = Math.floor(Math.random() * 20);
        const d = Math.floor(Math.random() * 10);
        const op = Math.random() > 0.5 ? '+' : '-';
        problem = `${c} ${op} ${d} = ?`;
        answer = op === '+' ? c + d : c - d;
        break;
      case 3:
        // Mixed operations
        const e = Math.floor(Math.random() * 15);
        const f = Math.floor(Math.random() * 10);
        const g = Math.floor(Math.random() * 5);
        problem = `${e} + ${f} - ${g} = ?`;
        answer = e + f - g;
        break;
      case 4:
        // Multiplication
        const h = Math.floor(Math.random() * 10);
        const i = Math.floor(Math.random() * 10);
        problem = `${h} × ${i} = ?`;
        answer = h * i;
        break;
      case 5:
        // Complex expression
        const j = Math.floor(Math.random() * 10);
        const k = Math.floor(Math.random() * 10);
        const l = Math.floor(Math.random() * 5);
        problem = `(${j} × ${k}) - ${l} = ?`;
        answer = (j * k) - l;
        break;
      default:
        problem = '1 + 1 = ?';
        answer = 2;
    }
    
    setMathProblem({ problem, answer: answer.toString() });
    setMessage(`Solve this math problem: ${problem}`);
  };
  
  const generatePuzzleCaptcha = () => {
    setMessage('Arrange the tiles in ascending order');
    
    // Create puzzle pieces 1-9
    const pieces = Array.from({ length: 9 }, (_, i) => i + 1);
    setPuzzlePieces(pieces);
    
    // Create shuffled arrangement
    const shuffled = [...pieces].sort(() => Math.random() - 0.5);
    setPuzzleArrangement(shuffled);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };
  
  const handleImageSelect = (index: number) => {
    if (index === correctImageIndex) {
      handleSuccess();
    } else {
      handleFailure();
    }
  };
  
  const handlePuzzleTileClick = (index: number) => {
    const newArrangement = [...puzzleArrangement];
    
    // Swap with adjacent tile if possible
    const emptyIndex = newArrangement.indexOf(9); // 9 is our "empty" tile
    
    // Check if clicked tile is adjacent to empty tile
    const isAdjacent = 
      (Math.abs(index - emptyIndex) === 1 && Math.floor(index / 3) === Math.floor(emptyIndex / 3)) || // same row
      (Math.abs(index - emptyIndex) === 3); // same column
    
    if (isAdjacent) {
      // Swap tiles
      [newArrangement[index], newArrangement[emptyIndex]] = [newArrangement[emptyIndex], newArrangement[index]];
      setPuzzleArrangement(newArrangement);
      
      // Check if solved
      const isSolved = newArrangement.every((value, i) => value === puzzlePieces[i]);
      if (isSolved) {
        handleSuccess();
      }
    }
  };
  
  const handleSubmit = () => {
    switch (captchaType) {
      case 'text':
        if (userInput === captchaText) {
          handleSuccess();
        } else {
          handleFailure();
        }
        break;
      case 'math':
        if (userInput === mathProblem.answer) {
          handleSuccess();
        } else {
          handleFailure();
        }
        break;
      default:
        handleFailure();
    }
  };
  
  const handleSuccess = () => {
    setCountdown(false);
    setMessage('Verification successful... or was it?');
    
    // Only succeed 20% of the time if difficulty is high
    if (difficulty > 3 && Math.random() > 0.2) {
      setTimeout(() => {
        setMessage('Wait, error detected. Try again.');
        setCaptchaAttempts(prev => prev + 1);
        generateCaptcha();
      }, 1500);
      return;
    }
    
    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }
  };
  
  const handleFailure = () => {
    setCountdown(false);
    setMessage('Verification failed. Are you sure you are human?');
    setIsShaking(true);
    
    // Track error count in user behavior
    setUserBehavior(prev => ({
      ...prev,
      errorCount: prev.errorCount + 1
    }));
    
    setTimeout(() => {
      setIsShaking(false);
      setCaptchaAttempts(prev => prev + 1);
      generateCaptcha();
    }, 1500);
    
    if (onFailure) {
      onFailure();
    }
  };
  
  const renderCaptchaContent = () => {
    switch (captchaType) {
      case 'text':
        return (
          <>
            <canvas ref={canvasRef} width="280" height="80" className="mb-4" />
            <input
              type="text"
              className={`input-${theme} w-full mb-4`}
              value={userInput}
              onChange={handleInputChange}
              placeholder="Enter the text you see above"
              autoComplete="off"
            />
            <button 
              className={`btn-${theme} w-full`}
              onClick={handleSubmit}
            >
              Verify
            </button>
          </>
        );
      
      case 'image':
        return (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {imageOptions.map((img, index) => (
                <div 
                  key={index}
                  className={`h-20 border-2 border-${theme}-500 flex items-center justify-center cursor-pointer hover:border-${theme}-300 transition-colors`}
                  onClick={() => handleImageSelect(index)}
                >
                  <span className="text-sm">Image {index + 1}</span>
                </div>
              ))}
            </div>
          </>
        );
      
      case 'math':
        return (
          <>
            <div className="text-2xl font-bold mb-4 text-center">{mathProblem.problem}</div>
            <input
              type="text"
              className={`input-${theme} w-full mb-4`}
              value={userInput}
              onChange={handleInputChange}
              placeholder="Enter your answer"
              autoComplete="off"
            />
            <button 
              className={`btn-${theme} w-full`}
              onClick={handleSubmit}
            >
              Verify
            </button>
          </>
        );
      
      case 'puzzle':
        return (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {puzzleArrangement.map((piece, index) => (
                <div 
                  key={index}
                  className={`h-16 w-16 flex items-center justify-center cursor-pointer transition-colors ${
                    piece === 9 ? `bg-${theme}-900` : `bg-${theme}-700 hover:bg-${theme}-600`
                  }`}
                  onClick={() => handlePuzzleTileClick(index)}
                >
                  {piece !== 9 && (
                    <span className="text-lg font-bold">{piece}</span>
                  )}
                </div>
              ))}
            </div>
          </>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      className={`p-6 bg-${theme}-800 rounded-lg shadow-lg max-w-md w-full mx-auto`}
      animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">CAPTCHA Challenge</h3>
        {countdown && (
          <div className={`text-sm ${timeLeft < 10 ? 'text-error animate-pulse' : ''}`}>
            Time left: {timeLeft}s
          </div>
        )}
      </div>
      
      <div className="mb-4 text-sm">
        {message}
        {difficulty > 1 && (
          <span className="text-xs block mt-1 text-gray-400">
            Difficulty level: {difficulty}/5
          </span>
        )}
      </div>
      
      {renderCaptchaContent()}
      
      {captchaAttempts > 0 && (
        <div className="mt-4 text-xs text-gray-400">
          Failed attempts: {captchaAttempts}
        </div>
      )}
    </motion.div>
  );
};

export default EvilCaptcha; 
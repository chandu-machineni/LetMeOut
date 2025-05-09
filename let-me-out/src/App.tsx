import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Welcome from './components/Welcome';
import ThemeSelector from './components/ThemeSelector';
import TermsAndConditions from './components/TermsAndConditions';
import EvilForm from './components/EvilForm';
import FakeProgress from './components/FakeProgress';
import EvilCaptcha from './components/EvilCaptcha';
import CursorDistractor from './components/CursorDistractor';
import FalseVictory from './components/FalseVictory';
import UXMuseum from './components/UXMuseum';
import TruthRoom from './components/TruthRoom';
import Narrator from './components/Narrator';
import CorruptionLevel from './components/CorruptionLevel';
import AnnoyingDraggable from './components/AnnoyingDraggable';
import CentralHUD from './components/CentralHUD';
import ModeSelector from './components/ModeSelector';
import AlignmentSelector from './components/AlignmentSelector';
import SpiralEngine from '../src/components/SpiralEngine';
import SpiralCoreRoom from './components/SpiralCoreRoom';
import { AppContext, AppContextType } from './context/AppContext';
import InfiniteSpiralExperience from './components/InfiniteSpiralExperience';
import MirrorError from './components/MirrorError';
import TruthReveal from './components/TruthReveal';

// Define these types here if they're not exported from AppContext
type GameMode = 'linear' | 'infinite_spiral' | null;
type UserAlignment = 'evil_apprentice' | 'shadow_enthusiast' | 'dark_tourist' | 'escapist' | null;

// Global CSS for input fields
const globalStyles = `
  input:focus, textarea:focus, select:focus {
    color: black !important;
    background-color: white !important;
  }
`;

const App: React.FC = () => {
  const [theme, setTheme] = useState<'villain' | 'toxic' | 'glitch'>('villain');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [userBehavior, setUserBehavior] = useState<{
    clickCount: number;
    typingSpeed: number;
    errorCount: number;
    restartCount: number;
    startTime: number;
  }>({
    clickCount: 0,
    typingSpeed: 0,
    errorCount: 0,
    restartCount: 0,
    startTime: Date.now(),
  });
  
  const [loopCount, setLoopCount] = useState<number>(0);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});
  const [chaosLevel, setChaosLevel] = useState<number>(1);
  const [showCaptcha, setShowCaptcha] = useState<boolean>(false);
  const [suspicionLevel, setSuspicionLevel] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [scrambledName, setScrambledName] = useState<string>('');
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [narratorMessage, setNarratorMessage] = useState<string>('');
  const [konamiProgress, setKonamiProgress] = useState<string>('');
  const [isRealityBroken, setIsRealityBroken] = useState<boolean>(false);
  
  // New state for Infinite UX Spiral mode
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [userAlignment, setUserAlignment] = useState<UserAlignment>(null);
  const [frustrationScore, setFrustrationScore] = useState<number>(0);
  const [fakeExitsClicked, setFakeExitsClicked] = useState<number>(0);
  const [spiralDepth, setSpiralDepth] = useState<number>(0);
  const [learnedPatterns, setLearnedPatterns] = useState<string[]>([]);
  
  // Get a personality based on user behavior
  const getPersonality = () => {
    const { clickCount, typingSpeed, errorCount, restartCount } = userBehavior;
    
    if (clickCount > 50) return 'impatient';
    if (typingSpeed > 100) return 'hasty';
    if (errorCount > 10) return 'frustrated';
    if (restartCount > 2) return 'persistent';
    
    const timeSpent = (Date.now() - userBehavior.startTime) / 1000 / 60;
    if (timeSpent > 5) return 'patient';
    
    return 'neutral';
  };
  
  // Track clicks across the app
  useEffect(() => {
    const handleClick = () => {
      setUserBehavior(prev => ({
        ...prev,
        clickCount: prev.clickCount + 1
      }));
      
      // Update last activity timestamp
      setLastActivity(Date.now());
      
      // Random chance to show captcha after certain number of clicks
      if (userBehavior.clickCount > 10 && Math.random() > 0.9) {
        setShowCaptcha(true);
      }
      
      // Random chance to update suspicion level
      if (Math.random() > 0.7) {
        setSuspicionLevel(prev => Math.min(10, prev + Math.random()));
      }
    };
    
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [userBehavior.clickCount]);
  
  // Track keyboard events for Konami code
  useEffect(() => {
    // Konami code: up, up, down, down, left, right, left, right, b, a
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Update last activity timestamp
      setLastActivity(Date.now());
      
      // Check for "I surrender" phrase
      if (e.key === 'i' || e.key === 'I') {
        setKonamiProgress('i');
      } else if (konamiProgress === 'i' && (e.key === ' ' || e.key === 'Space')) {
        setKonamiProgress('i ');
      } else if (konamiProgress === 'i ' && (e.key === 's' || e.key === 'S')) {
        setKonamiProgress('i s');
      } else if (konamiProgress === 'i s' && (e.key === 'u' || e.key === 'U')) {
        setKonamiProgress('i su');
      } else if (konamiProgress === 'i su' && (e.key === 'r' || e.key === 'R')) {
        setKonamiProgress('i sur');
      } else if (konamiProgress === 'i sur' && (e.key === 'r' || e.key === 'R')) {
        setKonamiProgress('i surr');
      } else if (konamiProgress === 'i surr' && (e.key === 'e' || e.key === 'E')) {
        setKonamiProgress('i surre');
      } else if (konamiProgress === 'i surre' && (e.key === 'n' || e.key === 'N')) {
        setKonamiProgress('i surren');
      } else if (konamiProgress === 'i surren' && (e.key === 'd' || e.key === 'D')) {
        setKonamiProgress('i surrend');
      } else if (konamiProgress === 'i surrend' && (e.key === 'e' || e.key === 'E')) {
        setKonamiProgress('i surrende');
      } else if (konamiProgress === 'i surrende' && (e.key === 'r' || e.key === 'R')) {
        // Completed "I surrender" - navigate to truth room
        window.location.href = '/truth';
      } else {
        // Check for Konami code progression
        const expectedKey = konamiCode[konamiProgress.length];
        if (e.key === expectedKey) {
          const newProgress = konamiProgress + e.key;
          setKonamiProgress(newProgress);
          
          // If completed the Konami code
          if (newProgress.length === konamiCode.length) {
            // Navigate to truth room
            window.location.href = '/truth';
          }
        } else {
          // Reset progress if wrong key
          setKonamiProgress('');
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [konamiProgress]);
  
  // Randomly change the theme regardless of user selection
  useEffect(() => {
    const themes: Array<'villain' | 'toxic' | 'glitch'> = ['villain', 'toxic', 'glitch'];
    const intervalId = setInterval(() => {
      // Ensure we pick a different theme than current one
      const filteredThemes = themes.filter(t => t !== theme);
      const randomTheme = filteredThemes[Math.floor(Math.random() * filteredThemes.length)];
      if (Math.random() > 0.7) { // 30% chance to change theme randomly
        setTheme(randomTheme);
      }
    }, 60000); // Every minute
    
    return () => clearInterval(intervalId);
  }, [theme]);
  
  // Increase chaos level based on user behavior
  useEffect(() => {
    const { clickCount, errorCount, restartCount } = userBehavior;
    const totalInteractions = clickCount + errorCount + restartCount;
    const newChaosLevel = Math.min(5, 1 + Math.floor(totalInteractions / 10));
    
    document.documentElement.dataset.chaosLevel = newChaosLevel.toString();
    setChaosLevel(newChaosLevel);
  }, [userBehavior]);
  
  // Update narrator messages based on suspicion level and activity
  useEffect(() => {
    // Check for idle time
    const idleCheckInterval = setInterval(() => {
      const currentTime = Date.now();
      const idleTime = currentTime - lastActivity;
      
      // If user has been idle for more than 20 seconds
      if (idleTime > 20000) {
        const messages = [
          "Still here? Brave of you.",
          "Hello? Are you... thinking? Fascinating.",
          "Overthinking won't save you.",
          "Hesitation. Delicious.",
          "Your indecision feeds my algorithms."
        ];
        setNarratorMessage(messages[Math.floor(Math.random() * messages.length)]);
        
        // Increase suspicion for being too careful
        setSuspicionLevel(prev => Math.min(10, prev + 0.5));
      }
    }, 5000);
    
    return () => clearInterval(idleCheckInterval);
  }, [lastActivity]);
  
  // Handle reality breaking at max chaos level
  useEffect(() => {
    if (chaosLevel >= 5 && suspicionLevel >= 8 && !isRealityBroken) {
      setIsRealityBroken(true);
      
      // Invert the entire UI
      document.documentElement.style.transition = 'all 0.5s cubic-bezier(.36,.07,.19,.97)';
      document.documentElement.style.filter = 'invert(100%) hue-rotate(180deg)';
      
      // Make inputs scramble text
      const originalInputHandler = HTMLInputElement.prototype.addEventListener;
      HTMLInputElement.prototype.addEventListener = function(
        type: string, 
        listener: EventListenerOrEventListenerObject, 
        options?: boolean | AddEventListenerOptions
      ) {
        if (type === 'input' || type === 'change') {
          const scrambledHandler = function(this: HTMLInputElement, event: Event) {
            // Scramble input value randomly
            if (Math.random() > 0.5) {
              const originalValue = (event.target as HTMLInputElement).value;
              const scrambledValue = originalValue.split('').map((char: string) => {
                if (Math.random() > 0.7) {
                  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
                  return chars[Math.floor(Math.random() * chars.length)];
                }
                return char;
              }).join('');
              (event.target as HTMLInputElement).value = scrambledValue;
            }
            
            if (typeof listener === 'function') {
              listener.call(this, event);
            } else if (listener.handleEvent) {
              listener.handleEvent.call(this, event);
            }
          };
          
          return originalInputHandler.call(this, type, scrambledHandler as EventListener, options);
        }
        
        return originalInputHandler.call(this, type, listener, options);
      };
      
      // Show a fake error message
      setNarratorMessage('ERROR: Reality corruption detected. System failing.');
      
      // Create a fake 404 error overlay
      const errorOverlay = document.createElement('div');
      errorOverlay.style.position = 'fixed';
      errorOverlay.style.top = '0';
      errorOverlay.style.left = '0';
      errorOverlay.style.right = '0';
      errorOverlay.style.bottom = '0';
      errorOverlay.style.backgroundColor = 'rgba(0,0,0,0.9)';
      errorOverlay.style.color = 'red';
      errorOverlay.style.display = 'flex';
      errorOverlay.style.flexDirection = 'column';
      errorOverlay.style.alignItems = 'center';
      errorOverlay.style.justifyContent = 'center';
      errorOverlay.style.fontSize = '3rem';
      errorOverlay.style.fontFamily = 'monospace';
      errorOverlay.style.zIndex = '9999';
      errorOverlay.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 5rem; margin-bottom: 1rem;">404</div>
          <div>YOU BROKE REALITY</div>
          <div style="font-size: 1.5rem; margin-top: 2rem;">Reality reconstruction in progress...</div>
        </div>
      `;
      
      document.body.appendChild(errorOverlay);
      
      // Restore everything after a delay
      setTimeout(() => {
        document.documentElement.style.filter = 'none';
        document.body.removeChild(errorOverlay);
        HTMLInputElement.prototype.addEventListener = originalInputHandler;
        
        // Add a badge for surviving the reality break
        if (!earnedBadges.includes('Reality Glitcher')) {
          setEarnedBadges(prev => [...prev, 'Reality Glitcher']);
        }
        
        setNarratorMessage('Reality restored. But at what cost?');
        setTimeout(() => {
          setIsRealityBroken(false);
        }, 5000);
      }, 3000);
    }
  }, [chaosLevel, suspicionLevel, isRealityBroken, earnedBadges]);
  
  // Create context value
  const contextValue = {
    theme,
    selectedTheme,
    setSelectedTheme,
    setTheme,
    userBehavior,
    setUserBehavior,
    loopCount,
    setLoopCount,
    getPersonality,
    userResponses,
    setUserResponses,
    chaosLevel,
    suspicionLevel,
    setSuspicionLevel,
    userName,
    setUserName,
    scrambledName,
    setScrambledName,
    earnedBadges,
    setEarnedBadges,
    lastActivity,
    setLastActivity,
    narratorMessage,
    setNarratorMessage,
    
    // New context values for Infinite UX Spiral mode
    gameMode,
    setGameMode,
    userAlignment,
    setUserAlignment,
    frustrationScore,
    setFrustrationScore,
    fakeExitsClicked,
    setFakeExitsClicked,
    spiralDepth,
    setSpiralDepth,
    learnedPatterns,
    setLearnedPatterns
  } as AppContextType;
  
  const handleCaptchaSuccess = () => {
    setShowCaptcha(false);
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      <div className={`min-h-screen bg-${theme}-900 text-white`}>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/mode" element={<ModeSelector />} />
              
              {/* Classic Mode Path */}
              <Route path="/theme" element={<ThemeSelector />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/form" element={<EvilForm />} />
              <Route path="/loading" element={<FakeProgress />} />
              <Route path="/victory" element={<FalseVictory />} />
              <Route path="/museum" element={<UXMuseum />} />
              
              {/* Spiral Path - Completely Separate */}
              <Route path="/alignment" element={<AlignmentSelector />} />
              <Route path="/spiral-core" element={<SpiralCoreRoom />} />
              <Route path="/spiral" element={<SpiralEngine />} />
              
              {/* Shared Paths */}
              <Route path="/truth" element={<TruthRoom />} />
              <Route path="/mirror" element={<MirrorError />} />
              <Route path="/truth-reveal" element={<TruthReveal />} />
              <Route path="*" element={<InfiniteSpiralExperience />} />
            </Routes>
          </AnimatePresence>
        </Router>
        
        {/* Global overlays that appear on any screen with proper z-index layering */}
        <CorruptionLevel /> {/* z-index: 85 - moved to bottom right */}
        <CentralHUD /> {/* z-index: 80 */}
        <CursorDistractor chaosLevel={chaosLevel} /> {/* z-index: 30 */}
        <AnnoyingDraggable chaosLevel={chaosLevel} /> {/* z-index: 40 */}
        <Narrator /> {/* z-index: 50 */}
        
        {/* Random captcha challenge */}
        <AnimatePresence>
          {showCaptcha && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-[200]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <EvilCaptcha onSuccess={handleCaptchaSuccess} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Global styles */}
        <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
    </div>
    </AppContext.Provider>
  );
};

export default App;

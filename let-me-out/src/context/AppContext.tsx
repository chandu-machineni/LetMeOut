import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { SpiralPatternId } from '../data/spiralData';

export type UserAlignment = 'evil_apprentice' | 'shadow_enthusiast' | 'dark_tourist' | 'escapist' | null;
export type GameMode = 'linear' | 'infinite_spiral' | null;

export interface AppContextType {
  // User info
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  
  // Game state
  userAlignment: UserAlignment;
  setUserAlignment: (alignment: UserAlignment) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  currentStage: number;
  setCurrentStage: (stage: number) => void;
  
  // UI preferences
  theme: string;
  setTheme: (theme: string) => void;
  
  // Psychological metrics
  frustrationScore: number;
  setFrustrationScore: (score: number) => void;
  chaosLevel: number;
  setChaosLevel: (level: number) => void;
  suspicionLevel: number;
  setSuspicionLevel: (level: number) => void;
  
  // Spiral mode state
  spiralDepth: number;
  setSpiralDepth: (depth: number) => void;
  learnedPatterns: SpiralPatternId[];
  setLearnedPatterns: (patterns: SpiralPatternId[]) => void;
  earnedBadges: string[];
  setEarnedBadges: (badges: string[]) => void;
  
  // Narrator system
  narratorMessage: string;
  setNarratorMessage: (message: string) => void;
  
  // User interaction tracking
  userInteractions: Record<string, number>;
  recordInteraction: (type: string) => void;
}

// Create context with default values
export const AppContext = createContext<AppContextType>({
  name: '',
  setName: () => {},
  email: '',
  setEmail: () => {},
  
  userAlignment: null,
  setUserAlignment: () => {},
  gameMode: null,
  setGameMode: () => {},
  currentStage: 0,
  setCurrentStage: () => {},
  
  theme: 'purple',
  setTheme: () => {},
  
  frustrationScore: 0,
  setFrustrationScore: () => {},
  chaosLevel: 0,
  setChaosLevel: () => {},
  suspicionLevel: 0,
  setSuspicionLevel: () => {},
  
  spiralDepth: 0,
  setSpiralDepth: () => {},
  learnedPatterns: [],
  setLearnedPatterns: () => {},
  earnedBadges: [],
  setEarnedBadges: () => {},
  
  narratorMessage: '',
  setNarratorMessage: () => {},
  
  userInteractions: {},
  recordInteraction: () => {}
});

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // User info
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  // Game state
  const [userAlignment, setUserAlignment] = useState<UserAlignment>(null);
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [currentStage, setCurrentStage] = useState<number>(0);
  
  // UI preferences
  const [theme, setTheme] = useState<string>('purple');
  
  // Psychological metrics
  const [frustrationScore, setFrustrationScore] = useState<number>(0);
  const [chaosLevel, setChaosLevel] = useState<number>(0);
  const [suspicionLevel, setSuspicionLevel] = useState<number>(0);
  
  // Spiral mode state
  const [spiralDepth, setSpiralDepth] = useState<number>(0);
  const [learnedPatterns, setLearnedPatterns] = useState<SpiralPatternId[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  
  // Narrator system
  const [narratorMessage, setNarratorMessage] = useState<string>('');
  
  // User interaction tracking
  const [userInteractions, setUserInteractions] = useState<Record<string, number>>({});
  
  // Record user interactions
  const recordInteraction = (type: string) => {
    setUserInteractions(prev => ({
      ...prev,
      [type]: (prev[type] || 0) + 1
    }));
  };
  
  // Update chaos level based on frustration score and spiral depth
  useEffect(() => {
    const newChaosLevel = Math.min(10, Math.floor((frustrationScore + spiralDepth) / 3));
    setChaosLevel(newChaosLevel);
  }, [frustrationScore, spiralDepth]);
  
  // Increase suspicion level as the user proceeds
  useEffect(() => {
    if (currentStage > 0) {
      setSuspicionLevel(prev => Math.min(10, prev + 0.2));
    }
  }, [currentStage]);
  
  // Contextual values to be provided
  const contextValue: AppContextType = {
    name,
    setName,
    email,
    setEmail,
    
    userAlignment,
    setUserAlignment,
    gameMode,
    setGameMode,
    currentStage,
    setCurrentStage,
    
    theme,
    setTheme,
    
    frustrationScore,
    setFrustrationScore,
    chaosLevel,
    setChaosLevel,
    suspicionLevel,
    setSuspicionLevel,
    
    spiralDepth,
    setSpiralDepth,
    learnedPatterns,
    setLearnedPatterns,
    earnedBadges,
    setEarnedBadges,
    
    narratorMessage,
    setNarratorMessage,
    
    userInteractions,
    recordInteraction
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}; 
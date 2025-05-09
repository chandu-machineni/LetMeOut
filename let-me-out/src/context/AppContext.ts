import { createContext } from 'react';
import { SpiralPatternId } from '../data/spiralData';

export type UserAlignment = 'evil_apprentice' | 'shadow_enthusiast' | 'dark_tourist' | 'escapist' | null;
export type GameMode = 'linear' | 'infinite_spiral' | null;

export interface AppContextType {
  theme: 'villain' | 'toxic' | 'glitch';
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  setTheme: (theme: 'villain' | 'toxic' | 'glitch') => void;
  userBehavior: {
    clickCount: number;
    typingSpeed: number;
    errorCount: number;
    restartCount: number;
    startTime: number;
  };
  setUserBehavior: React.Dispatch<React.SetStateAction<{
    clickCount: number;
    typingSpeed: number;
    errorCount: number;
    restartCount: number;
    startTime: number;
  }>>;
  loopCount: number;
  setLoopCount: React.Dispatch<React.SetStateAction<number>>;
  getPersonality: () => string;
  userResponses: Record<string, any>;
  setUserResponses: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  chaosLevel: number;
  suspicionLevel: number;
  setSuspicionLevel: React.Dispatch<React.SetStateAction<number>>;
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  scrambledName: string;
  setScrambledName: React.Dispatch<React.SetStateAction<string>>;
  earnedBadges: string[];
  setEarnedBadges: React.Dispatch<React.SetStateAction<string[]>>;
  lastActivity: number;
  setLastActivity: React.Dispatch<React.SetStateAction<number>>;
  narratorMessage: string;
  setNarratorMessage: React.Dispatch<React.SetStateAction<string>>;
  
  // Adding missing properties
  userAlignment: UserAlignment;
  setUserAlignment: (alignment: UserAlignment) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  frustrationScore: number;
  setFrustrationScore: (score: number) => void;
  spiralDepth: number;
  setSpiralDepth: (depth: number) => void;
  learnedPatterns: SpiralPatternId[];
  setLearnedPatterns: (patterns: SpiralPatternId[]) => void;
  fakeExitsClicked: number;
  setFakeExitsClicked: React.Dispatch<React.SetStateAction<number>>;
}

export const AppContext = createContext<AppContextType>({
  theme: 'villain',
  selectedTheme: '',
  setSelectedTheme: () => {},
  setTheme: () => {},
  userBehavior: {
    clickCount: 0,
    typingSpeed: 0,
    errorCount: 0,
    restartCount: 0,
    startTime: 0,
  },
  setUserBehavior: () => {},
  loopCount: 0,
  setLoopCount: () => {},
  getPersonality: () => 'neutral',
  userResponses: {},
  setUserResponses: () => {},
  chaosLevel: 1,
  suspicionLevel: 0,
  setSuspicionLevel: () => {},
  userName: '',
  setUserName: () => {},
  scrambledName: '',
  setScrambledName: () => {},
  earnedBadges: [],
  setEarnedBadges: () => {},
  lastActivity: Date.now(),
  setLastActivity: () => {},
  narratorMessage: '',
  setNarratorMessage: () => {},
  
  // Default values for added properties
  userAlignment: null,
  setUserAlignment: () => {},
  gameMode: null,
  setGameMode: () => {},
  frustrationScore: 0,
  setFrustrationScore: () => {},
  spiralDepth: 0,
  setSpiralDepth: () => {},
  learnedPatterns: [],
  setLearnedPatterns: () => {},
  fakeExitsClicked: 0,
  setFakeExitsClicked: () => {},
}); 
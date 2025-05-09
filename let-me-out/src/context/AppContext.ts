import { createContext } from 'react';

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
}); 
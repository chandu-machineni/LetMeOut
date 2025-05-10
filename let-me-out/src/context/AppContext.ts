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
  setUserBehavior: (userBehavior: {
    clickCount: number;
    typingSpeed: number;
    errorCount: number;
    restartCount: number;
    startTime: number;
  } | ((prev: {
    clickCount: number;
    typingSpeed: number;
    errorCount: number;
    restartCount: number;
    startTime: number;
  }) => {
    clickCount: number;
    typingSpeed: number;
    errorCount: number;
    restartCount: number;
    startTime: number;
  })) => void;
  loopCount: number;
  setLoopCount: (loopCount: number | ((prev: number) => number)) => void;
  getPersonality: () => string;
  userResponses: Record<string, any>;
  setUserResponses: (userResponses: Record<string, any> | ((prev: Record<string, any>) => Record<string, any>)) => void;
  chaosLevel: number;
  suspicionLevel: number;
  setSuspicionLevel: (suspicionLevel: number | ((prev: number) => number)) => void;
  userName: string;
  setUserName: (userName: string | ((prev: string) => string)) => void;
  scrambledName: string;
  setScrambledName: (scrambledName: string | ((prev: string) => string)) => void;
  earnedBadges: string[];
  setEarnedBadges: (earnedBadges: string[] | ((prev: string[]) => string[])) => void;
  lastActivity: number;
  setLastActivity: (lastActivity: number | ((prev: number) => number)) => void;
  narratorMessage: string;
  setNarratorMessage: (narratorMessage: string | ((prev: string) => string)) => void;
  
  // Adding missing properties
  userAlignment: UserAlignment;
  setUserAlignment: (alignment: UserAlignment | ((prev: UserAlignment) => UserAlignment)) => void;
  gameMode: GameMode;
  setGameMode: (mode: GameMode | ((prev: GameMode) => GameMode)) => void;
  frustrationScore: number;
  setFrustrationScore: (score: number | ((prev: number) => number)) => void;
  spiralDepth: number;
  setSpiralDepth: (depth: number | ((prev: number) => number)) => void;
  learnedPatterns: SpiralPatternId[];
  setLearnedPatterns: (patterns: SpiralPatternId[] | ((prev: SpiralPatternId[]) => SpiralPatternId[])) => void;
  fakeExitsClicked: number;
  setFakeExitsClicked: (count: number | ((prev: number) => number)) => void;
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
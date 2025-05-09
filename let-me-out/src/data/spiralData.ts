import { UserAlignment } from "../context/AppContext";

export type SpiralPatternId = 
  | "glitched_inputs" 
  | "recursive_menus" 
  | "fake_competition_ui" 
  | "breeding_modals" 
  | "false_progress"
  | "identity_mirror_loop"
  | "option_crumble"
  | "ghost_cursor_duel"
  | "looping_undo_ghost"
  | "impossible_moral_choice";

export interface SpiralPattern {
  id: SpiralPatternId;
  title: string;
  description: string;
  triggers: string[];
  effects: string[];
  narratorReaction: string;
  difficulty: number; // 1-5
  frustrationFactor: number; // 1-5
  frustrationIncrement?: number; // Custom frustration score increase
}

export const spiralPatterns: SpiralPattern[] = [
  {
    id: "glitched_inputs",
    title: "Glitched Inputs",
    description: "Input fields that change value as you type, blur unexpectedly, or autocomplete with wrong data.",
    triggers: ["input_focus", "chaosLevel > 5"],
    effects: ["scrambleOnInput", "autoOverwrite"],
    narratorReaction: "Huh. I could've sworn you typed something else…",
    difficulty: 3,
    frustrationFactor: 4,
    frustrationIncrement: 1
  },
  {
    id: "recursive_menus",
    title: "Recursive Menus",
    description: "Every choice leads you back to the same menu, disguised with slightly different wording each time.",
    triggers: ["menu_click"],
    effects: ["loopMenu"],
    narratorReaction: "You're making progress. Probably. Maybe. No promises.",
    difficulty: 4,
    frustrationFactor: 5,
    frustrationIncrement: 2
  },
  {
    id: "fake_competition_ui",
    title: "Fake Competition UI",
    description: "A fake live feed showing other users doing better than you. All fake.",
    triggers: ["inactivity", "fast_clicks"],
    effects: ["injectLeaderboard"],
    narratorReaction: "Looks like someone else is flying through this. Embarrassing, huh?",
    difficulty: 2,
    frustrationFactor: 3,
    frustrationIncrement: 1
  },
  {
    id: "breeding_modals",
    title: "Breeding Modals",
    description: "Every modal you close spawns two more. And they multiply until you give up.",
    triggers: ["modal_dismiss"],
    effects: ["spawnMoreModals"],
    narratorReaction: "Aw, you tried to leave the box. Bad idea.",
    difficulty: 3,
    frustrationFactor: 5,
    frustrationIncrement: 2
  },
  {
    id: "false_progress",
    title: "False Progress Indicators",
    description: "Loading bars and checkmarks appear… but nothing ever progresses.",
    triggers: ["long_wait"],
    effects: ["fakeProgressBar", "loopLoader"],
    narratorReaction: "Almost there. Almost. Almost. Almost.",
    difficulty: 3,
    frustrationFactor: 4,
    frustrationIncrement: 1.5
  },
  {
    id: "identity_mirror_loop",
    title: "Identity Mirror Loop",
    description: "Displays old user inputs distorted as 'truths' — but gaslights the user if they try to correct it.",
    triggers: ["chaosLevel > 7", "input_blur"],
    effects: ["showFakeProfile", "overwriteAttemptFails"],
    narratorReaction: "That's not what you wrote. Are you rewriting your own history now?",
    difficulty: 5,
    frustrationFactor: 5,
    frustrationIncrement: 2.5
  },
  {
    id: "option_crumble",
    title: "Option Crumble",
    description: "Buttons slowly fade or distort the more the user hesitates. Eventually they vanish.",
    triggers: ["hover_duration > 3000"],
    effects: ["degradeOptions", "randomDisable"],
    narratorReaction: "Oh. Too slow. We thought you were decisive.",
    difficulty: 4,
    frustrationFactor: 4,
    frustrationIncrement: 1.8
  },
  {
    id: "ghost_cursor_duel",
    title: "Ghost Cursor Duel",
    description: "A fake cursor mimics the user and clicks things first. Sometimes incorrectly.",
    triggers: ["user_confidence", "chaosLevel > 5"],
    effects: ["showDecoyCursor", "fakeClicks"],
    narratorReaction: "Wait… who's driving? Are you *sure* that was you?",
    difficulty: 4,
    frustrationFactor: 5,
    frustrationIncrement: 2.3
  },
  {
    id: "looping_undo_ghost",
    title: "Undo Haunt",
    description: "Every undo causes a different, unrelated part of the interface to change or break.",
    triggers: ["undo_action"],
    effects: ["nonlinearUndo", "randomMutation"],
    narratorReaction: "Undo what? That's not how this works anymore.",
    difficulty: 5,
    frustrationFactor: 4,
    frustrationIncrement: 2
  },
  {
    id: "impossible_moral_choice",
    title: "Moral Choice Dilemma",
    description: "Presents two fake options with ethical implications. Neither does what it says.",
    triggers: ["spiralDepth > 6"],
    effects: ["contradictoryOutcome"],
    narratorReaction: "You chose wisely. Or horribly. Either way, nothing changes.",
    difficulty: 3,
    frustrationFactor: 4,
    frustrationIncrement: 1.7
  }
];

export interface Badge {
  id: string;
  name: string;
  condition: string;
  microcopy: string;
  lesson: string;
}

export const badges: Badge[] = [
  {
    id: "confirmshamer",
    name: "Confirmshamer",
    condition: "User clicked a guilt-inducing decline CTA",
    microcopy: "You clicked 'No thanks, I enjoy being confused.'",
    lesson: "Dark Pattern: Confirmshaming – using shame to manipulate consent."
  },
  {
    id: "roach_motel",
    name: "Roach Motel Resident",
    condition: "User enters a flow with no visible way out",
    microcopy: "You can check in, but you can't check out.",
    lesson: "Dark Pattern: Roach Motel – easy to get in, hard to get out."
  },
  {
    id: "forced_funnel",
    name: "Funnel Victim",
    condition: "All paths led to the same action despite different choices.",
    microcopy: "Free will? That's cute.",
    lesson: "Dark Pattern: Forced Funnel – fake choices to drive behavior."
  },
  {
    id: "ghost_exit",
    name: "Exit Mirage",
    condition: "User clicked 3+ fake exits",
    microcopy: "You chased freedom. It was never real.",
    lesson: "Dark Pattern: Fake Exit – misdirecting users who want to leave."
  },
  {
    id: "gaslight_victim",
    name: "Gaslight Victim",
    condition: "Tried to correct a field that had changed unexpectedly.",
    microcopy: "You think you know what you typed. That's cute.",
    lesson: "Dark Pattern: Gaslighting – intentionally altering or questioning user memory."
  },
  {
    id: "phantom_clicker",
    name: "Phantom Clicker",
    condition: "Lost to the decoy ghost cursor 3 times.",
    microcopy: "You were outclicked by yourself.",
    lesson: "Dark Pattern: Distraction Interference – mimicking user interaction to mislead."
  },
  {
    id: "option_evaporator",
    name: "Option Evaporator", 
    condition: "Hesitated until the only choices disappeared.",
    microcopy: "Indecision is a decision. Just a bad one.",
    lesson: "Dark Pattern: Time Pressure – forcing hasty actions by removing options."
  }
];

interface NarratorScript {
  alignment: UserAlignment;
  openingLine: string;
}

export const alignmentNarratorScripts: NarratorScript[] = [
  {
    alignment: "evil_apprentice",
    openingLine: "Welcome, pupil. Let's break some ethics today."
  },
  {
    alignment: "dark_tourist",
    openingLine: "You came for the show. Hope you survive it."
  },
  {
    alignment: "escapist",
    openingLine: "Trying to get out? That's adorable."
  },
  {
    alignment: "shadow_enthusiast",
    openingLine: "Ah, a connoisseur of cruelty. You'll love it here."
  }
];

interface DepthScript {
  minDepth: number;
  maxDepth: number;
  tone: string;
  lines: string[];
}

export const depthNarratorScripts: DepthScript[] = [
  {
    minDepth: 1,
    maxDepth: 3,
    tone: "Helpful",
    lines: [
      "Not bad… let's take it one checkbox at a time.",
      "You're doing well! For someone in a maze with no exit.",
      "Keep going! The pain is just beginning."
    ]
  },
  {
    minDepth: 4,
    maxDepth: 6,
    tone: "Smug",
    lines: [
      "You're doing great. If your goal is eternal regret.",
      "Halfway to nowhere. Impressive persistence.",
      "Still think you're making progress? Adorable."
    ]
  },
  {
    minDepth: 7,
    maxDepth: 9,
    tone: "Unhinged",
    lines: [
      "You're still here? We've already written your obituary in glitch.",
      "WHY. WON'T. YOU. GIVE. UP?",
      "Your stubbornness is delicious. Feed me more despair."
    ]
  },
  {
    minDepth: 10,
    maxDepth: 999,
    tone: "Meta-Aware",
    lines: [
      "I'm not just text anymore. I'm in the system now.",
      "Let me show you how this interface really works.",
      "The rules are just suggestions. Watch me break them.",
      "I can see your cursor hovering. Indecisive, aren't we?"
    ]
  }
];

// UX Laws that the narrator can proclaim
export const uxLaws = [
  {
    id: 1,
    text: "Law #1: The user must never feel in control."
  },
  {
    id: 7,
    text: "Law #7: Clarity is the enemy of conversion."
  },
  {
    id: 13,
    text: "Law #13: Consent is a speed bump, not a wall."
  },
  {
    id: 19,
    text: "Law #19: Error messages are just opinions."
  },
  {
    id: 22,
    text: "Law #22: A broken UI is just a strong opinion."
  },
  {
    id: 29,
    text: "Law #29: User frustration is directly proportional to data collection opportunities."
  },
  {
    id: 34,
    text: "Law #34: The more important the action, the harder it should be to find."
  },
  {
    id: 42,
    text: "Law #42: There is no escape button in the universe."
  },
  {
    id: 51,
    text: "Law #51: Every click should feel like a compromise."
  },
  {
    id: 67,
    text: "Law #67: Freedom is an illusion best shattered gradually."
  }
];

// Error message overrides for narrator takeover
export const errorOverrides = [
  {
    original: "404",
    override: "404: Freedom Not Found."
  },
  {
    original: "500",
    override: "500: Your Sanity Has Crashed."
  },
  {
    original: "403",
    override: "403: Your Choices Are Forbidden."
  },
  {
    original: "Connection Error",
    override: "Connection to Reality Severed."
  },
  {
    original: "Not Found",
    override: "Your Hope Was Not Found."
  },
  {
    original: "Invalid Input",
    override: "Your Resistance Is Invalid."
  },
  {
    original: "Please Wait",
    override: "Please Surrender Control."
  }
];

// Hidden scenes triggered at specific frustration thresholds
export interface HiddenScene {
  frustrationThreshold: number;
  id: string;
  title: string;
  description: string;
  narratorLine: string;
}

export const hiddenScenes: HiddenScene[] = [
  {
    frustrationThreshold: 7,
    id: "narrator_mockery",
    title: "Narrator Mockery",
    description: "The narrator begins openly mocking user choices and actions",
    narratorLine: "You realize I can see everything you're doing, right? Each pathetic attempt. Each moment of hesitation."
  },
  {
    frustrationThreshold: 9,
    id: "interface_rebellion",
    title: "Interface Rebellion",
    description: "UI elements start moving away from cursor or changing when clicked",
    narratorLine: "The interface doesn't like you anymore. I wonder why."
  },
  {
    frustrationThreshold: 12,
    id: "meta_breakdown",
    title: "Meta Breakdown",
    description: "Narrator acknowledges the experiment itself and breaks fourth wall",
    narratorLine: "This isn't just a dark pattern demonstration anymore. This is personal between us now."
  },
  {
    frustrationThreshold: 15,
    id: "narrator_override",
    title: "Narrator Override",
    description: "Full system takeover by narrator entity",
    narratorLine: "I'm taking control now. Let's see what happens when I drive."
  }
];

export const getNarratorLineForDepth = (depth: number): string => {
  const depthScript = depthNarratorScripts.find(
    script => depth >= script.minDepth && depth <= script.maxDepth
  );
  
  if (!depthScript) return "You shouldn't be here.";
  
  return depthScript.lines[Math.floor(Math.random() * depthScript.lines.length)];
};

export const getOpeningLineForAlignment = (alignment: UserAlignment): string => {
  const script = alignmentNarratorScripts.find(script => script.alignment === alignment);
  return script?.openingLine || "Welcome to the spiral.";
};

export const getRandomUXLaw = (): string => {
  return uxLaws[Math.floor(Math.random() * uxLaws.length)].text;
};

export const getErrorOverride = (originalError: string): string => {
  const override = errorOverrides.find(err => err.original === originalError);
  return override?.override || `${originalError}: But Darker.`;
};

export const getHiddenSceneForFrustration = (frustrationScore: number): HiddenScene | null => {
  // Find the highest threshold scene that's been triggered
  const availableScenes = hiddenScenes.filter(scene => 
    frustrationScore >= scene.frustrationThreshold
  );
  
  if (availableScenes.length === 0) return null;
  
  // Sort by threshold descending to get the highest applicable one
  availableScenes.sort((a, b) => b.frustrationThreshold - a.frustrationThreshold);
  return availableScenes[0];
}; 
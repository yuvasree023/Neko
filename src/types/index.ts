export type CharacterState =
  | 'IDLE'
  | 'LOOKING'
  | 'WALKING'
  | 'RUNNING'
  | 'SITTING'
  | 'SWINGING_FEET'
  | 'LYING'
  | 'SLEEPING'
  | 'WAKING'
  | 'STRETCHING'
  | 'THINKING'
  | 'CURIOUS'
  | 'HAPPY'
  | 'EXCITED'
  | 'SAD'
  | 'WORRIED'
  | 'SURPRISED'
  | 'FRUSTRATED'
  | 'CALM'
  | 'PROUD'
  | 'CELEBRATING'
  | 'TIRED'
  | 'CLIMBING'
  | 'BOX_HIDE'
  | 'DRACULA';

export type CharacterEmotion =
  | 'neutral'
  | 'happy'
  | 'excited'
  | 'sad'
  | 'worried'
  | 'surprised'
  | 'frustrated'
  | 'curious'
  | 'confused'
  | 'relieved'
  | 'calm'
  | 'proud'
  | 'tired';

export type CharacterAction =
  | 'idle'
  | 'walk'
  | 'sit'
  | 'swing_feet'
  | 'lie'
  | 'sleep'
  | 'wake'
  | 'stretch'
  | 'think'
  | 'celebrate'
  | 'climb'
  | 'look'
  | 'box_hide'
  | 'dracula';

export type MovementMode =
  | 'FOLLOW_CURSOR'
  | 'GO_TO_TARGET'
  | 'GO_TO_JOURNAL'
  | 'GO_TO_BUTTON'
  | 'GO_TO_CARD'
  | 'GO_TO_NAV'
  | 'RETURN_HOME'
  | 'RANDOM_WALK'
  | 'STAY'
  | 'LOCKED_POSITION';

export type UIZone =
  | 'HOME'
  | 'CAT_HOME'
  | 'JOURNAL_EDITOR'
  | 'SAVE_BUTTON'
  | 'ENTRY_CARD'
  | 'RECENT_ENTRIES'
  | 'SIDEBAR'
  | 'SETTINGS'
  | 'GEMINI_PANEL'
  | 'FLOOR';

export type AnimationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export interface CharacterReaction {
  emotion: CharacterEmotion;
  action: CharacterAction;
  expression: string;
  sound: string;
  intensity: number;
  priority?: AnimationPriority;
  timestamp?: number;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  wordCount: number;
  tags: string[];
  moodHint?: CharacterEmotion;
  characterReaction?: CharacterReaction;
  characterState?: CharacterState;
}

export interface UserSettings {
  companionMode: 'full' | 'minimal' | 'hidden';
  followCursor: boolean;
  idleAnimations: boolean;
  textReactions: boolean;
  soundEffects: boolean;
  reducedMotion: boolean;
  companionSize: 'sm' | 'md' | 'lg';
  theme: 'light' | 'dark' | 'system';
  aiEnabled: boolean;
  autoSaveInterval: number; // in seconds
}

export interface GeminiMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  reaction?: CharacterReaction;
}

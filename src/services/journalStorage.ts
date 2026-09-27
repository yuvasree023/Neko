import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { JournalEntry, CharacterEmotion, CharacterReaction } from '../types';

const LOCAL_STORAGE_KEY_PREFIX = 'momo_journal_entries_';

// Initial sample entries for delight on first launch
const DEMO_SAMPLE_ENTRIES: (userId: string) => JournalEntry[] = (userId) => [
  {
    id: 'sample-1',
    userId,
    title: 'A quiet morning and fresh coffee ☕',
    content: `Woke up early before sunrise today. The house was completely still, with only the gentle hum of the kettle in the kitchen.\n\nI poured a fresh cup of coffee and sat near the window watching the mist lift over the trees. It felt so grounding to have thirty minutes just for myself before the flurry of the day began.\n\nToday's intention: Move with intention, listen more than I speak, and be gentle with myself.`,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    wordCount: 84,
    tags: ['morning', 'gratitude', 'peace'],
    moodHint: 'calm',
    characterReaction: {
      emotion: 'calm',
      action: 'sit',
      expression: 'peaceful',
      sound: 'hehe',
      intensity: 0.4,
    },
    characterState: 'CALM',
  },
  {
    id: 'sample-2',
    userId,
    title: 'Finally cracked the tricky problem! 🎉',
    content: `I spent almost three hours trying to debug a weird state synchronization issue yesterday. I felt so stuck and was almost about to rewrite everything.\n\nStepped away, took a short walk, and when I looked at the code with fresh eyes, the missing race condition was right there! Fixed it with one clean useEffect cleanup.\n\nBig reminder: Stepping away is productive.`,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    wordCount: 79,
    tags: ['milestone', 'coding', 'clarity'],
    moodHint: 'excited',
    characterReaction: {
      emotion: 'excited',
      action: 'celebrate',
      expression: 'happy',
      sound: 'YAY!',
      intensity: 0.9,
    },
    characterState: 'CELEBRATING',
  },
];

export async function fetchUserEntries(userId: string): Promise<JournalEntry[]> {
  if (!userId) return [];

  // 1. Try fetching from Firestore if configured
  if (isFirebaseConfigured && db) {
    try {
      const entriesRef = collection(db, 'users', userId, 'entries');
      const q = query(entriesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const entries: JournalEntry[] = [];
      snapshot.forEach((docSnap) => {
        entries.push(docSnap.data() as JournalEntry);
      });

      if (entries.length > 0) {
        // Cache to local storage
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + userId, JSON.stringify(entries));
        return entries;
      }
    } catch (err) {
      console.warn('Firestore fetch failed, using local cache:', err);
    }
  }

  // 2. Fetch from Local Storage
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + userId);
  if (cached) {
    try {
      const parsed: JournalEntry[] = JSON.parse(cached);
      return parsed.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (e) {
      console.error('Failed to parse cached entries', e);
    }
  }

  // 3. If brand new user, seed with sample entries
  const initial = DEMO_SAMPLE_ENTRIES(userId);
  localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + userId, JSON.stringify(initial));
  return initial;
}

export async function saveUserEntry(userId: string, entry: JournalEntry): Promise<void> {
  if (!userId || !entry.id) return;

  // 1. Save to Firestore if available
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'users', userId, 'entries', entry.id);
      await setDoc(docRef, entry, { merge: true });
    } catch (err) {
      console.warn('Firestore save failed, persisting locally:', err);
    }
  }

  // 2. Save to Local Storage cache
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + userId);
  let entries: JournalEntry[] = cached ? JSON.parse(cached) : [];
  const existingIndex = entries.findIndex((e) => e.id === entry.id);

  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.unshift(entry);
  }

  localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + userId, JSON.stringify(entries));
}

export async function deleteUserEntry(userId: string, entryId: string): Promise<void> {
  if (!userId || !entryId) return;

  // 1. Delete from Firestore if available
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, 'users', userId, 'entries', entryId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore delete failed:', err);
    }
  }

  // 2. Delete from Local Storage
  const cached = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + userId);
  if (cached) {
    const entries: JournalEntry[] = JSON.parse(cached);
    const filtered = entries.filter((e) => e.id !== entryId);
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + userId, JSON.stringify(filtered));
  }
}

export function calculateJournalStats(entries: JournalEntry[]) {
  const totalEntries = entries.length;
  const totalWords = entries.reduce((acc, curr) => acc + (curr.wordCount || 0), 0);

  // Calculate streak (consecutive days with an entry)
  let streak = 0;
  if (entries.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = entries.map((e) => {
      const d = new Date(e.createdAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

    const uniqueDates = Array.from(new Set(dates)).sort((a, b) => b - a);

    const oneDayMs = 24 * 60 * 60 * 1000;
    const latestDate = uniqueDates[0];

    // Check if the latest is today or yesterday
    if (latestDate >= today.getTime() - oneDayMs) {
      streak = 1;
      let checkDate = latestDate;

      for (let i = 1; i < uniqueDates.length; i++) {
        if (checkDate - uniqueDates[i] === oneDayMs) {
          streak++;
          checkDate = uniqueDates[i];
        } else {
          break;
        }
      }
    }
  }

  return {
    totalEntries,
    totalWords,
    streak,
    avgWordsPerEntry: totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0,
  };
}

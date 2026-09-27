import { CharacterReaction, GeminiMessage } from '../types';

export interface GeminiJournalApiResponse {
  reply: string;
  character: CharacterReaction;
  error?: string;
}

export async function askGeminiAssistant(params: {
  journalText?: string;
  userPrompt?: string;
  conversationHistory?: GeminiMessage[];
  idToken?: string;
  userId?: string;
}): Promise<GeminiJournalApiResponse> {
  const { journalText, userPrompt, conversationHistory = [], idToken, userId } = params;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    } else if (userId) {
      headers['x-demo-user'] = userId;
    }

    const res = await fetch('/api/gemini/journal', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        journalText,
        userPrompt,
        conversationHistory: conversationHistory.map((m) => ({
          role: m.role,
          parts: m.text,
        })),
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Backend API request failed or offline:', error);

    // Provide friendly fallback when backend is unreachable
    return {
      reply: "I'm listening and right here with you. Keep writing whatever is in your heart.",
      character: {
        emotion: 'calm',
        action: 'sit',
        expression: 'peaceful',
        sound: 'aww...',
        intensity: 0.5,
      },
    };
  }
}

export async function getLiveTextReaction(params: {
  journalText: string;
  idToken?: string;
  userId?: string;
}): Promise<CharacterReaction> {
  const { journalText, idToken, userId } = params;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    } else if (userId) {
      headers['x-demo-user'] = userId;
    }

    const res = await fetch('/api/gemini/react', {
      method: 'POST',
      headers,
      body: JSON.stringify({ journalText }),
    });

    if (!res.ok) throw new Error('Reaction failed');

    const data: GeminiJournalApiResponse = await res.json();
    return data.character;
  } catch (error) {
    // Return subtle default
    return {
      emotion: 'neutral',
      action: 'idle',
      expression: 'neutral',
      sound: 'hmm...',
      intensity: 0.2,
    };
  }
}

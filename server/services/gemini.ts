import { GoogleGenAI, Type } from '@google/genai';
import { z } from 'zod';
import { config } from '../config.js';

export const CharacterReactionSchema = z.object({
  reply: z.string(),
  character: z.object({
    emotion: z.enum([
      'neutral',
      'happy',
      'excited',
      'sad',
      'worried',
      'surprised',
      'frustrated',
      'curious',
      'confused',
      'relieved',
      'calm',
      'proud',
      'tired',
    ]),
    action: z.enum([
      'idle',
      'walk',
      'sit',
      'lie',
      'climb',
      'sleep',
      'think',
      'celebrate',
      'stretch',
      'look',
    ]),
    expression: z.string(),
    sound: z.string(),
    intensity: z.number().min(0).max(1),
  }),
});

export type GeminiJournalResponse = z.infer<typeof CharacterReactionSchema>;

const SYSTEM_INSTRUCTION = `You are the AI companion inside Momo Journal, a private, cozy journaling application.
Help users reflect, brainstorm, organize thoughts, and express themselves.
Never diagnose medical or mental health conditions.
Do not make assumptions about sensitive personal attributes.
Keep normal responses concise, warm, and empathetic (1-3 sentences) unless the user specifically asks for elaboration.

Additionally, generate a playful companion reaction for "Momo", a tiny cute living friend who lives inside the journal UI.
The companion's reactions must be subtle, friendly, and non-intrusive.

Allowed emotions:
neutral, happy, excited, sad, worried, surprised, frustrated, curious, confused, relieved, calm, proud, tired.

Allowed actions:
idle, walk, sit, lie, climb, sleep, think, celebrate, stretch, look.

Allowed short sounds/expressions (1-3 words max):
aww..., oh!, ouch!, hmm..., uh-oh..., yay!, wow!, hehe, huh?, zzz..., yayyy!, hehe!, phew...

Always output valid JSON matching the schema.`;

// Fallback generator for offline/demo mode or API fallback
export function generateSmartMockReaction(
  text: string,
  userMessage?: string
): GeminiJournalResponse {
  const combined = ((text || '') + ' ' + (userMessage || '')).toLowerCase();

  if (
    combined.includes('finish') ||
    combined.includes('done') ||
    combined.includes('won') ||
    combined.includes('succeed') ||
    combined.includes('solve') ||
    combined.includes('yay') ||
    combined.includes('proud') ||
    combined.includes('great') ||
    combined.includes('complete') ||
    combined.includes('awesome')
  ) {
    return {
      reply: userMessage
        ? "That's wonderful! Celebrating your milestone today."
        : "What a great accomplishment! Momo is so proud of you.",
      character: {
        emotion: 'excited',
        action: 'celebrate',
        expression: 'happy',
        sound: 'YAY!',
        intensity: 0.9,
      },
    };
  }

  if (
    combined.includes('tired') ||
    combined.includes('exhaust') ||
    combined.includes('sleep') ||
    combined.includes('drained') ||
    combined.includes('bed') ||
    combined.includes('rest')
  ) {
    return {
      reply: "It's important to rest after giving your best. Take good care of yourself tonight.",
      character: {
        emotion: 'tired',
        action: 'lie',
        expression: 'sleepy',
        sound: 'zzz...',
        intensity: 0.8,
      },
    };
  }

  if (
    combined.includes('sad') ||
    combined.includes('cry') ||
    combined.includes('hurt') ||
    combined.includes('terrible') ||
    combined.includes('awful') ||
    combined.includes('wrong') ||
    combined.includes('fail') ||
    combined.includes('lonely')
  ) {
    return {
      reply: "I'm really sorry you had a tough time. Acknowledging your feelings here is a brave first step.",
      character: {
        emotion: 'sad',
        action: 'sit',
        expression: 'empathetic',
        sound: 'aww...',
        intensity: 0.7,
      },
    };
  }

  if (
    combined.includes('angry') ||
    combined.includes('frustrat') ||
    combined.includes('annoy') ||
    combined.includes('hate') ||
    combined.includes('stuck') ||
    combined.includes('bug')
  ) {
    return {
      reply: "Frustrations happen to all of us. Taking a breath and writing it down can help clear the fog.",
      character: {
        emotion: 'frustrated',
        action: 'think',
        expression: 'worried',
        sound: 'uh-oh...',
        intensity: 0.6,
      },
    };
  }

  if (
    combined.includes('why') ||
    combined.includes('how') ||
    combined.includes('wonder') ||
    combined.includes('curious') ||
    combined.includes('idea') ||
    combined.includes('think')
  ) {
    return {
      reply: "That's an interesting thought to explore. What do you think is at the root of it?",
      character: {
        emotion: 'curious',
        action: 'think',
        expression: 'thinking',
        sound: 'hmm...',
        intensity: 0.5,
      },
    };
  }

  if (
    combined.includes('calm') ||
    combined.includes('peace') ||
    combined.includes('quiet') ||
    combined.includes('tea') ||
    combined.includes('relax') ||
    combined.includes('grateful') ||
    combined.includes('thank')
  ) {
    return {
      reply: "Sounds like a grounded, peaceful moment. Cherish these gentle pauses.",
      character: {
        emotion: 'calm',
        action: 'sit',
        expression: 'serene',
        sound: 'hehe',
        intensity: 0.4,
      },
    };
  }

  return {
    reply: userMessage
      ? "I hear you. Thank you for sharing your thoughts with me."
      : "Writing down your daily reflection brings clarity over time.",
    character: {
      emotion: 'neutral',
      action: 'idle',
      expression: 'neutral',
      sound: 'hmm...',
      intensity: 0.3,
    },
  };
}

export async function generateGeminiJournalReaction(params: {
  journalText?: string;
  userPrompt?: string;
  conversationHistory?: Array<{ role: 'user' | 'model'; parts: string }>;
}): Promise<GeminiJournalResponse> {
  const { journalText = '', userPrompt = '', conversationHistory = [] } = params;

  if (!config.geminiApiKey) {
    // Return smart fallback for instant local experience
    return generateSmartMockReaction(journalText, userPrompt);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey });

    let prompt = '';
    if (journalText && userPrompt) {
      prompt = `Journal context:\n"""\n${journalText}\n"""\n\nUser message:\n${userPrompt}`;
    } else if (userPrompt) {
      prompt = `User message: ${userPrompt}`;
    } else if (journalText) {
      prompt = `Here is a journal entry written by the user. Give a gentle 1-2 sentence reflection and companion reaction:\n"""\n${journalText}\n"""`;
    } else {
      prompt = 'The user just sat down at their journal. Say a brief, friendly hello and companion reaction.';
    }

    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            character: {
              type: Type.OBJECT,
              properties: {
                emotion: {
                  type: Type.STRING,
                  enum: [
                    'neutral',
                    'happy',
                    'excited',
                    'sad',
                    'worried',
                    'surprised',
                    'frustrated',
                    'curious',
                    'confused',
                    'relieved',
                    'calm',
                    'proud',
                    'tired',
                  ],
                },
                action: {
                  type: Type.STRING,
                  enum: [
                    'idle',
                    'walk',
                    'sit',
                    'lie',
                    'climb',
                    'sleep',
                    'think',
                    'celebrate',
                    'stretch',
                    'look',
                  ],
                },
                expression: { type: Type.STRING },
                sound: { type: Type.STRING },
                intensity: { type: Type.NUMBER },
              },
              required: ['emotion', 'action', 'expression', 'sound', 'intensity'],
            },
          },
          required: ['reply', 'character'],
        },
        temperature: 0.7,
      },
    });

    const rawText = response.text?.trim() || '';
    const parsed = JSON.parse(rawText);
    const validated = CharacterReactionSchema.parse(parsed);
    return validated;
  } catch (error) {
    console.error('Gemini API Error, falling back to smart engine:', error);
    return generateSmartMockReaction(journalText, userPrompt);
  }
}

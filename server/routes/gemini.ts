import { Router } from 'express';
import { verifyAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { geminiRateLimiter } from '../middleware/rateLimiter.js';
import { generateGeminiJournalReaction } from '../services/gemini.js';

export const geminiRouter = Router();

// Endpoint for conversational assistant or full reflection
geminiRouter.post('/journal', verifyAuth, geminiRateLimiter, async (req: AuthenticatedRequest, res) => {
  try {
    const { journalText, userPrompt, conversationHistory } = req.body;

    if (!journalText && !userPrompt) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Either journalText or userPrompt must be provided.',
      });
      return;
    }

    // Safety checks / string length limits
    const safeJournalText = typeof journalText === 'string' ? journalText.slice(0, 10000) : '';
    const safeUserPrompt = typeof userPrompt === 'string' ? userPrompt.slice(0, 1000) : '';

    const result = await generateGeminiJournalReaction({
      journalText: safeJournalText,
      userPrompt: safeUserPrompt,
      conversationHistory: Array.isArray(conversationHistory) ? conversationHistory : [],
    });

    res.json(result);
  } catch (error) {
    console.error('Error in /api/gemini/journal:', error);
    res.status(500).json({
      reply: "Oops... Momo's little brain got a bit sleepy. Try asking again in a moment!",
      character: {
        emotion: 'tired',
        action: 'sleep',
        expression: 'sleepy',
        sound: 'uh-oh...',
        intensity: 0.3,
      },
      error: 'Internal Server Error',
    });
  }
});

// Lightweight fast reaction endpoint for live text changes in editor
geminiRouter.post('/react', verifyAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { journalText } = req.body;
    const safeJournalText = typeof journalText === 'string' ? journalText.slice(0, 4000) : '';

    const result = await generateGeminiJournalReaction({
      journalText: safeJournalText,
    });

    res.json(result);
  } catch (error) {
    console.error('Error in /api/gemini/react:', error);
    res.json({
      reply: '',
      character: {
        emotion: 'neutral',
        action: 'idle',
        expression: 'neutral',
        sound: 'hmm...',
        intensity: 0.2,
      },
    });
  }
});

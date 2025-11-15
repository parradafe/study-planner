import express from 'express';
import spacedRepetitionService from '../services/spacedRepetitionService.js';

const router = express.Router();

/**
 * GET /api/spaced-repetition/recommendations
 * Query: ?max=5
 */
router.get('/recommendations', async (req, res) => {
  try {
    const max = req.query.max ? parseInt(req.query.max, 10) : 5;
    const recommendations = spacedRepetitionService.generateRecommendations(max);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/spaced-repetition/suggested
 * Query: ?max=5
 * Get suggested topics for current study session
 */
router.get('/suggested', async (req, res) => {
  try {
    const max = req.query.max ? parseInt(req.query.max, 10) : 5;
    const suggested = spacedRepetitionService.getSuggestedTopicsForCurrentSession(max);
    res.json(suggested);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/spaced-repetition/save
 * Persist current engine state to database
 */
router.post('/save', async (req, res) => {
  try {
    const saved = await spacedRepetitionService.saveState();
    res.json({ success: !!saved });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/spaced-repetition/load
 * Load engine state from database
 */
router.post('/load', async (req, res) => {
  try {
    const loaded = await spacedRepetitionService.loadState();
    res.json({ success: !!loaded });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/spaced-repetition/topics
 * Body: { topics: ['A','B'] }
 * Add/load topics into the engine
 */
router.post('/topics', async (req, res) => {
  try {
    const { topics } = req.body;
    await spacedRepetitionService.loadTopics(topics || []);
    res.status(201).json({ success: true, totalTopics: topics ? topics.length : 0 });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

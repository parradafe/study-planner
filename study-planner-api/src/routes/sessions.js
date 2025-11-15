import express from 'express';
import sessionsService from '../services/sessionsService.js';

const router = express.Router();

/**
 * GET /api/sessions
 * Get all sessions
 */
router.get('/', async (req, res) => {
  try {
    const sessions = await sessionsService.getAllSessions();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sessions/due
 * Get sessions that are due for review today
 */
router.get('/due', async (req, res) => {
  try {
    const sessions = await sessionsService.getSessionsDueForReview();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/sessions/:id
 * Get session by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const session = await sessionsService.getSessionById(req.params.id);
    res.json(session);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * POST /api/sessions
 * Create new session
 * Body: { name, lastReviewed?, difficultyScore?, interval?, nextReviewDate?, reviewCount? }
 */
router.post('/', async (req, res) => {
  try {
    const session = await sessionsService.createSession(req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/sessions/:id
 * Update session
 * Body: { name?, lastReviewed?, difficultyScore?, interval?, nextReviewDate?, reviewCount? }
 */
router.put('/:id', async (req, res) => {
  try {
    const session = await sessionsService.updateSession(req.params.id, req.body);
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/sessions/:id
 * Delete session
 */
router.delete('/:id', async (req, res) => {
  try {
    await sessionsService.deleteSession(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * PATCH /api/sessions/:id/review
 * Mark session as reviewed with difficulty level
 * Body: { difficulty: 'easy' | 'normal' | 'hard' }
 */
router.patch('/:id/review', async (req, res) => {
  try {
    const { difficulty = 'normal' } = req.body;
    const session = await sessionsService.markSessionAsReviewed(req.params.id, difficulty);
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

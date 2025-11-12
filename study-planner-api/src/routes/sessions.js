import express from 'express';
import sessionsService from '../services/sessionsService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const sessions = await sessionsService.getAllSessions();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const session = await sessionsService.getSessionById(req.params.id);
    res.json(session);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const session = await sessionsService.createSession(req.body);
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const session = await sessionsService.updateSession(req.params.id, req.body);
    res.json(session);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await sessionsService.deleteSession(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const session = await sessionsService.toggleSessionCompletion(req.params.id);
    res.json(session);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;

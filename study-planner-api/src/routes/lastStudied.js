import express from 'express';
import lastStudiedService from '../services/lastStudiedService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const lastStudied = await lastStudiedService.getAllLastStudied();
    res.json(lastStudied);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await lastStudiedService.getLastStudiedById(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = await lastStudiedService.createLastStudied(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await lastStudiedService.updateLastStudied(req.params.id, req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await lastStudiedService.deleteLastStudied(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const item = await lastStudiedService.toggleLastStudiedCompletion(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;

import express from 'express';
import topicsService from '../services/topicsService.js';

const router = express.Router();

/**
 * GET /api/topics
 * Get all topics (optionally filtered by domain_id)
 */
router.get('/', async (req, res) => {
  try {
    const { domain_id } = req.query;
    
    if (domain_id) {
      const topics = await topicsService.getTopicsByDomainId(domain_id);
      return res.json(topics);
    }
    
    const topics = await topicsService.getAllTopics();
    res.json(topics);
  } catch (error) {
    const status = error.message === 'Domain not found' ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const topic = await topicsService.getTopicById(req.params.id);
    res.json(topic);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * POST /api/topics
 * Create new topic (requires domain_id in body)
 */
router.post('/', async (req, res) => {
  try {
    const topic = await topicsService.createTopic(req.body);
    res.status(201).json(topic);
  } catch (error) {
    const status = error.message === 'Domain not found' ? 404 : 400;
    res.status(status).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const topic = await topicsService.updateTopic(req.params.id, req.body);
    res.json(topic);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await topicsService.deleteTopic(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.patch('/:id/toggle', async (req, res) => {
  try {
    const topic = await topicsService.toggleTopicCompletion(req.params.id);
    res.json(topic);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;

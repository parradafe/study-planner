import express from 'express';
import domainsService from '../services/domainsService.js';

const router = express.Router();

/**
 * GET /api/domains
 * Get all domains (optionally with topics)
 */
router.get('/', async (req, res) => {
  try {
    const { include_topics } = req.query;
    
    if (include_topics === 'true') {
      const domains = await domainsService.getAllDomainsWithTopics();
      return res.json(domains);
    }
    
    const domains = await domainsService.getAllDomains();
    res.json(domains);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/domains/:id
 * Get domain by ID (optionally with topics)
 */
router.get('/:id', async (req, res) => {
  try {
    const { include_topics } = req.query;
    
    if (include_topics === 'true') {
      const domain = await domainsService.getDomainWithTopics(req.params.id);
      return res.json(domain);
    }
    
    const domain = await domainsService.getDomainById(req.params.id);
    res.json(domain);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * POST /api/domains
 * Create new domain
 */
router.post('/', async (req, res) => {
  try {
    const domain = await domainsService.createDomain(req.body);
    res.status(201).json(domain);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * PUT /api/domains/:id
 * Update domain
 */
router.put('/:id', async (req, res) => {
  try {
    const domain = await domainsService.updateDomain(req.params.id, req.body);
    res.json(domain);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * DELETE /api/domains/:id
 * Delete domain
 */
router.delete('/:id', async (req, res) => {
  try {
    await domainsService.deleteDomain(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

/**
 * PATCH /api/domains/:id/toggle
 * Toggle completion status
 */
router.patch('/:id/toggle', async (req, res) => {
  try {
    const domain = await domainsService.toggleDomainCompletion(req.params.id);
    res.json(domain);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

export default router;

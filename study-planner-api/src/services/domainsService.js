import domainsRepository from '../repositories/domainsRepository.js';

/**
 * Business Logic Layer for Domains
 */
class DomainsService {
  /**
   * Get all domains
   */
  async getAllDomains() {
    return await domainsRepository.findAll();
  }

  /**
   * Get domain by ID
   */
  async getDomainById(id) {
    const domain = await domainsRepository.findById(id);
    if (!domain) {
      throw new Error('Domain not found');
    }
    return domain;
  }

  /**
   * Create new domain with validation
   */
  async createDomain(data) {
    // Validation
    if (!data.title || data.title.trim() === '') {
      throw new Error('Title is required');
    }
    if (!data.time || data.time.trim() === '') {
      throw new Error('Time is required');
    }

    return await domainsRepository.create({
      time: data.time,
      title: data.title.trim(),
      completed: data.completed ?? false,
    });
  }

  /**
   * Update domain with validation
   */
  async updateDomain(id, data) {
    const existingDomain = await this.getDomainById(id);

    // Validation
    if (data.title !== undefined && data.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }
    if (data.time !== undefined && data.time.trim() === '') {
      throw new Error('Time cannot be empty');
    }

    const updateData = {
      time: data.time ?? existingDomain.time,
      title: data.title !== undefined ? data.title.trim() : existingDomain.title,
      completed: data.completed ?? existingDomain.completed,
    };

    return await domainsRepository.update(id, updateData);
  }

  /**
   * Delete domain
   */
  async deleteDomain(id) {
    await this.getDomainById(id); // Verify exists
    return await domainsRepository.delete(id);
  }

  /**
   * Toggle completion status
   */
  /**
   * Toggle completion status
   */
  async toggleDomainCompletion(id) {
    await this.getDomainById(id); // Verify exists
    return await domainsRepository.toggleCompletion(id);
  }

  /**
   * Get domain with its topics
   */
  async getDomainWithTopics(id) {
    const domain = await domainsRepository.findByIdWithTopics(id);
    if (!domain) {
      throw new Error('Domain not found');
    }
    return domain;
  }

  /**
   * Get all domains with their topics
   */
  async getAllDomainsWithTopics() {
    return await domainsRepository.findAllWithTopics();
  }
}

export default new DomainsService();

import topicsRepository from '../repositories/topicsRepository.js';
import domainsRepository from '../repositories/domainsRepository.js';

/**
 * Business Logic Layer for Topics
 */
class TopicsService {
  /**
   * Get all topics
   */
  async getAllTopics() {
    return await topicsRepository.findAll();
  }

  /**
   * Get topics by domain ID
   */
  async getTopicsByDomainId(domainId) {
    // Verify domain exists
    const domain = await domainsRepository.findById(domainId);
    if (!domain) {
      throw new Error('Domain not found');
    }
    return await topicsRepository.findByDomainId(domainId);
  }

  /**
   * Get topic by ID
   */
  async getTopicById(id) {
    const topic = await topicsRepository.findById(id);
    if (!topic) {
      throw new Error('Topic not found');
    }
    return topic;
  }

  /**
   * Create new topic with validation
   */
  async createTopic(data) {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Title is required');
    }
    if (!data.time || data.time.trim() === '') {
      throw new Error('Time is required');
    }
    if (!data.domainId) {
      throw new Error('Domain ID is required');
    }

    // Verify domain exists
    const domain = await domainsRepository.findById(data.domainId);
    if (!domain) {
      throw new Error('Domain not found');
    }

    return await topicsRepository.create({
      domainId: data.domainId,
      time: data.time,
      title: data.title.trim(),
      completed: data.completed ?? false,
    });
  }

  /**
   * Update topic with validation
   */
  async updateTopic(id, data) {
    const existingTopic = await this.getTopicById(id);

    if (data.title !== undefined && data.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }
    if (data.time !== undefined && data.time.trim() === '') {
      throw new Error('Time cannot be empty');
    }

    // If domain_id is being changed, verify new domain exists
    if (data.domainId !== undefined && data.domainId !== existingTopic.domain_id) {
      const domain = await domainsRepository.findById(data.domainId);
      if (!domain) {
        throw new Error('Domain not found');
      }
    }

    const updateData = {
      domainId: data.domainId ?? existingTopic.domain_id,
      time: data.time ?? existingTopic.time,
      title: data.title !== undefined ? data.title.trim() : existingTopic.title,
      completed: data.completed ?? existingTopic.completed,
    };

    return await topicsRepository.update(id, updateData);
  }

  async deleteTopic(id) {
    await this.getTopicById(id);
    return await topicsRepository.delete(id);
  }

  async toggleTopicCompletion(id) {
    await this.getTopicById(id);
    return await topicsRepository.toggleCompletion(id);
  }
}

export default new TopicsService();

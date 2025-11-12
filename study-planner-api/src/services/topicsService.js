import topicsRepository from '../repositories/topicsRepository.js';

/**
 * Business Logic Layer for Topics
 */
class TopicsService {
  async getAllTopics() {
    return await topicsRepository.findAll();
  }

  async getTopicById(id) {
    const topic = await topicsRepository.findById(id);
    if (!topic) {
      throw new Error('Topic not found');
    }
    return topic;
  }

  async createTopic(data) {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Title is required');
    }
    if (!data.time || data.time.trim() === '') {
      throw new Error('Time is required');
    }

    return await topicsRepository.create({
      time: data.time,
      title: data.title.trim(),
      completed: data.completed ?? false,
    });
  }

  async updateTopic(id, data) {
    const existingTopic = await this.getTopicById(id);

    if (data.title !== undefined && data.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }
    if (data.time !== undefined && data.time.trim() === '') {
      throw new Error('Time cannot be empty');
    }

    const updateData = {
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

import lastStudiedRepository from '../repositories/lastStudiedRepository.js';

/**
 * Business Logic Layer for Last Studied
 */
class LastStudiedService {
  async getAllLastStudied() {
    return await lastStudiedRepository.findAll();
  }

  async getLastStudiedById(id) {
    const item = await lastStudiedRepository.findById(id);
    if (!item) {
      throw new Error('Last studied item not found');
    }
    return item;
  }

  async createLastStudied(data) {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Title is required');
    }
    if (!data.time || data.time.trim() === '') {
      throw new Error('Time is required');
    }

    return await lastStudiedRepository.create({
      time: data.time,
      title: data.title.trim(),
      completed: data.completed ?? false,
    });
  }

  async updateLastStudied(id, data) {
    const existingItem = await this.getLastStudiedById(id);

    if (data.title !== undefined && data.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }
    if (data.time !== undefined && data.time.trim() === '') {
      throw new Error('Time cannot be empty');
    }

    const updateData = {
      time: data.time ?? existingItem.time,
      title: data.title !== undefined ? data.title.trim() : existingItem.title,
      completed: data.completed ?? existingItem.completed,
    };

    return await lastStudiedRepository.update(id, updateData);
  }

  async deleteLastStudied(id) {
    await this.getLastStudiedById(id);
    return await lastStudiedRepository.delete(id);
  }

  async toggleLastStudiedCompletion(id) {
    await this.getLastStudiedById(id);
    return await lastStudiedRepository.toggleCompletion(id);
  }
}

export default new LastStudiedService();

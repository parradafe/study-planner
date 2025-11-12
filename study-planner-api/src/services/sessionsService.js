import sessionsRepository from '../repositories/sessionsRepository.js';

/**
 * Business Logic Layer for Sessions
 */
class SessionsService {
  async getAllSessions() {
    return await sessionsRepository.findAll();
  }

  async getSessionById(id) {
    const session = await sessionsRepository.findById(id);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }

  async createSession(data) {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Title is required');
    }
    if (!data.time || data.time.trim() === '') {
      throw new Error('Time is required');
    }

    return await sessionsRepository.create({
      time: data.time,
      title: data.title.trim(),
      completed: data.completed ?? false,
    });
  }

  async updateSession(id, data) {
    const existingSession = await this.getSessionById(id);

    if (data.title !== undefined && data.title.trim() === '') {
      throw new Error('Title cannot be empty');
    }
    if (data.time !== undefined && data.time.trim() === '') {
      throw new Error('Time cannot be empty');
    }

    const updateData = {
      time: data.time ?? existingSession.time,
      title: data.title !== undefined ? data.title.trim() : existingSession.title,
      completed: data.completed ?? existingSession.completed,
    };

    return await sessionsRepository.update(id, updateData);
  }

  async deleteSession(id) {
    await this.getSessionById(id);
    return await sessionsRepository.delete(id);
  }

  async toggleSessionCompletion(id) {
    await this.getSessionById(id);
    return await sessionsRepository.toggleCompletion(id);
  }
}

export default new SessionsService();

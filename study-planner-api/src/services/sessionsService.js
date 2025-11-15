import sessionsRepository from '../repositories/sessionsRepository.js';

/**
 * Business Logic Layer for Sessions
 * Compatible with SpacedRepetitionEngine structure
 */
class SessionsService {
  /**
   * Get all sessions
   */
  async getAllSessions() {
    return await sessionsRepository.findAll();
  }

  /**
   * Get session by ID
   */
  async getSessionById(id) {
    const session = await sessionsRepository.findById(id);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }

  /**
   * Get session by name
   */
  async getSessionByName(name) {
    const session = await sessionsRepository.findByName(name);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }

  /**
   * Create new session with validation
   */
  async createSession(data) {
    // Validations
    if (!data.name || data.name.trim() === '') {
      throw new Error('Name is required');
    }

    // Check if session with same name already exists
    const existing = await sessionsRepository.findByName(data.name.trim());
    if (existing) {
      throw new Error('Session with this name already exists');
    }

    if (data.difficultyScore !== undefined) {
      const score = parseFloat(data.difficultyScore);
      if (isNaN(score) || score < 0 || score > 1) {
        throw new Error('Difficulty score must be between 0 and 1');
      }
    }

    if (data.interval !== undefined) {
      const interval = parseInt(data.interval);
      if (isNaN(interval) || interval < 1) {
        throw new Error('Interval must be at least 1 day');
      }
    }

    // Set defaults if not provided
    const now = new Date();
    const sessionData = {
      name: data.name.trim(),
      lastReviewed: data.lastReviewed || null,
      difficultyScore: data.difficultyScore !== undefined ? parseFloat(data.difficultyScore) : 0.5,
      interval: data.interval !== undefined ? parseInt(data.interval) : 1,
      nextReviewDate: data.nextReviewDate || now.toISOString(),
      reviewCount: data.reviewCount !== undefined ? parseInt(data.reviewCount) : 0,
    };

    return await sessionsRepository.create(sessionData);
  }

  /**
   * Update session with validation
   */
  async updateSession(id, data) {
    const existingSession = await this.getSessionById(id);

    // Validations
    if (data.name !== undefined && data.name.trim() === '') {
      throw new Error('Name cannot be empty');
    }

    // Check if new name already exists (if name is being changed)
    if (data.name && data.name.trim() !== existingSession.name) {
      const existing = await sessionsRepository.findByName(data.name.trim());
      if (existing) {
        throw new Error('Session with this name already exists');
      }
    }

    if (data.difficultyScore !== undefined) {
      const score = parseFloat(data.difficultyScore);
      if (isNaN(score) || score < 0 || score > 1) {
        throw new Error('Difficulty score must be between 0 and 1');
      }
    }

    if (data.interval !== undefined) {
      const interval = parseInt(data.interval);
      if (isNaN(interval) || interval < 1) {
        throw new Error('Interval must be at least 1 day');
      }
    }

    const updateData = {
      name: data.name ? data.name.trim() : existingSession.name,
      lastReviewed: data.lastReviewed !== undefined ? data.lastReviewed : existingSession.lastReviewed,
      difficultyScore: data.difficultyScore !== undefined ? parseFloat(data.difficultyScore) : existingSession.difficultyScore,
      interval: data.interval !== undefined ? parseInt(data.interval) : existingSession.interval,
      nextReviewDate: data.nextReviewDate || existingSession.nextReviewDate,
      reviewCount: data.reviewCount !== undefined ? parseInt(data.reviewCount) : existingSession.reviewCount,
    };

    return await sessionsRepository.update(id, updateData);
  }

  /**
   * Delete session
   */
  async deleteSession(id) {
    await this.getSessionById(id);
    return await sessionsRepository.delete(id);
  }

  /**
   * Get sessions due for review today
   */
  async getSessionsDueForReview() {
    return await sessionsRepository.findDueForReview();
  }

  /**
   * Mark session as reviewed with difficulty adjustment
   * @param {number} id - Session ID
   * @param {string} difficulty - 'easy', 'normal', or 'hard'
   */
  async markSessionAsReviewed(id, difficulty = 'normal') {
    const session = await this.getSessionById(id);

    let difficultyScore = session.difficultyScore;
    let interval = session.interval;

    // Adjust difficulty score based on user feedback
    switch (difficulty) {
      case 'easy':
        difficultyScore = Math.max(0, difficultyScore - 0.15);
        interval = Math.round(interval * 2);
        break;
      case 'normal':
        difficultyScore = difficultyScore * 0.95;
        interval = Math.round(interval * 1.3);
        break;
      case 'hard':
        difficultyScore = Math.min(1, difficultyScore + 0.2);
        interval = 1;
        break;
      default:
        throw new Error('Difficulty must be "easy", "normal", or "hard"');
    }

    // Ensure minimum interval
    interval = Math.max(1, interval);

    // Calculate next review date
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    return await sessionsRepository.markAsReviewed(id, {
      difficultyScore,
      interval,
      nextReviewDate: nextReviewDate.toISOString(),
    });
  }
}

export default new SessionsService();

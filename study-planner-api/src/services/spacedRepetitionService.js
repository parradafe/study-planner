import { SpacedRepetitionEngine } from '../logic/spacedRepetition.js';
import spacedRepetitionRepository from '../repositories/spacedRepetitionRepository.js';

/**
 * Business logic layer for spaced repetition features.
 * Maintains singleton instance of SpacedRepetitionEngine
 * and manages persistence through the repository.
 */
class SpacedRepetitionService {
  constructor() {
    this.engine = new SpacedRepetitionEngine();
  }

  /**
   * Load state from repository
   * @returns {Promise<boolean>}
   */
  async loadState() {
    try {
      const state = await spacedRepetitionRepository.loadState();
      if (state) {
        return this.engine.importState(state);
      }
      return false;
    } catch (error) {
      console.error('Error loading state in service:', error);
      return false;
    }
  }

  /**
   * Save current engine state via repository
   * @returns {Promise<boolean>}
   */
  async saveState() {
    try {
      const state = this.engine.exportState();
      return await spacedRepetitionRepository.saveState(state);
    } catch (error) {
      console.error('Error saving state in service:', error);
      return false;
    }
  }

  /**
   * Initialize or add topics to the engine with validation
   * @param {string[]} topicNames
   * @returns {Promise<boolean>}
   */
  async loadTopics(topicNames) {
    if (!Array.isArray(topicNames)) {
      throw new Error('topics must be an array of strings');
    }
    // basic validation of items
    const clean = topicNames
      .filter(t => typeof t === 'string' && t.trim() !== '')
      .map(t => t.trim());
    
    this.engine.loadTopics(clean);
    return true;
  }

  /**
   * Generate recommendations with validation
   * @param {number} maxSuggestions
   * @returns {Object}
   */
  generateRecommendations(maxSuggestions = 5) {
    const max = Number.isInteger(+maxSuggestions) ? +maxSuggestions : 5;
    return this.engine.generateRecommendations(max);
  }

  /**
   * Get suggested topics for current session with validation
   * @param {number} maxSuggestions
   * @returns {Object[]}
   */
  getSuggestedTopicsForCurrentSession(maxSuggestions = 5) {
    const max = Number.isInteger(+maxSuggestions) ? +maxSuggestions : 5;
    return this.engine.getSuggestedTopicsForCurrentSession(max);
  }

  /**
   * Export current state as JSON
   * @returns {Object}
   */
  exportState() {
    return this.engine.exportState();
  }

  /**
   * Get engine instance for advanced usage (use with caution)
   * @returns {SpacedRepetitionEngine}
   */
  getEngine() {
    return this.engine;
  }
}

export default new SpacedRepetitionService();

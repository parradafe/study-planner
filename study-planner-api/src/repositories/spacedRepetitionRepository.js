import pool from '../config/database.js';

/**
 * Data access layer for spaced repetition persistence.
 * Maneja el almacenamiento y recuperación del estado en PostgreSQL.
 */
class SpacedRepetitionRepository {
  /**
   * Save complete state to database
   * Reemplaza todos los topics existentes con el nuevo estado
   * @param {Object} state - State object to persist
   * @returns {Promise<boolean>}
   */
  async saveState(state) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Limpiar tabla antes de insertar nuevo estado
      await client.query('DELETE FROM spaced_repetition_topics');
      
      // Insertar todos los topics del estado
      if (state.topics && state.topics.length > 0) {
        const insertQuery = `
          INSERT INTO spaced_repetition_topics 
          (name, last_reviewed, difficulty_score, interval, next_review_date, review_count, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        
        for (const topic of state.topics) {
          await client.query(insertQuery, [
            topic.name,
            topic.lastReviewed || null,
            topic.difficultyScore,
            topic.interval,
            topic.nextReviewDate,
            topic.reviewCount || 0,
            topic.createdAt || new Date().toISOString()
          ]);
        }
      }
      
      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error saving state to database:', error);
      return false;
    } finally {
      client.release();
    }
  }

  /**
   * Load complete state from database
   * @returns {Promise<Object|null>}
   */
  async loadState() {
    try {
      const query = `
        SELECT 
          name,
          last_reviewed AS "lastReviewed",
          difficulty_score AS "difficultyScore",
          interval,
          next_review_date AS "nextReviewDate",
          review_count AS "reviewCount",
          created_at AS "createdAt"
        FROM spaced_repetition_topics
        ORDER BY created_at ASC
      `;
      
      const result = await pool.query(query);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return {
        topics: result.rows,
        lastUpdated: new Date().toISOString(),
        totalTopics: result.rows.length
      };
    } catch (error) {
      console.error('Error loading state from database:', error);
      return null;
    }
  }

  /**
   * Get a single topic by name
   * @param {string} name - Topic name
   * @returns {Promise<Object|null>}
   */
  async findTopicByName(name) {
    try {
      const query = `
        SELECT 
          id,
          name,
          last_reviewed AS "lastReviewed",
          difficulty_score AS "difficultyScore",
          interval,
          next_review_date AS "nextReviewDate",
          review_count AS "reviewCount",
          created_at AS "createdAt"
        FROM spaced_repetition_topics
        WHERE name = $1
      `;
      
      const result = await pool.query(query, [name]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error finding topic by name:', error);
      return null;
    }
  }

  /**
   * Update a single topic
   * @param {string} name - Topic name
   * @param {Object} updates - Topic data to update
   * @returns {Promise<Object|null>}
   */
  async updateTopic(name, updates) {
    try {
      const query = `
        UPDATE spaced_repetition_topics
        SET 
          last_reviewed = $1,
          difficulty_score = $2,
          interval = $3,
          next_review_date = $4,
          review_count = $5,
          updated_at = CURRENT_TIMESTAMP
        WHERE name = $6
        RETURNING 
          name,
          last_reviewed AS "lastReviewed",
          difficulty_score AS "difficultyScore",
          interval,
          next_review_date AS "nextReviewDate",
          review_count AS "reviewCount",
          created_at AS "createdAt"
      `;
      
      const result = await pool.query(query, [
        updates.lastReviewed || null,
        updates.difficultyScore,
        updates.interval,
        updates.nextReviewDate,
        updates.reviewCount || 0,
        name
      ]);
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error('Error updating topic:', error);
      throw error;
    }
  }

  /**
   * Delete all topics (clear state)
   * @returns {Promise<boolean>}
   */
  async clearState() {
    try {
      await pool.query('DELETE FROM spaced_repetition_topics');
      return true;
    } catch (error) {
      console.error('Error clearing state:', error);
      return false;
    }
  }
}

export default new SpacedRepetitionRepository();

import pool from '../config/database.js';

/**
 * Data Access Layer for Topics
 */
class TopicsRepository {
  /**
   * Get all topics
   */
  async findAll() {
    const result = await pool.query(
      'SELECT id, domain_id, time, title, completed, created_at, updated_at FROM topics ORDER BY id ASC'
    );
    return result.rows;
  }

  /**
   * Get topics by domain ID
   */
  async findByDomainId(domainId) {
    const result = await pool.query(
      'SELECT id, domain_id, time, title, completed, created_at, updated_at FROM topics WHERE domain_id = $1 ORDER BY id ASC',
      [domainId]
    );
    return result.rows;
  }

  /**
   * Get topic by ID
   */
  async findById(id) {
    const result = await pool.query(
      'SELECT id, domain_id, time, title, completed, created_at, updated_at FROM topics WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  /**
   * Create new topic
   */
  async create({ domainId, time, title, completed = false }) {
    const result = await pool.query(
      'INSERT INTO topics (domain_id, time, title, completed) VALUES ($1, $2, $3, $4) RETURNING id, domain_id, time, title, completed, created_at, updated_at',
      [domainId, time, title, completed]
    );
    return result.rows[0];
  }

  /**
   * Update topic
   */
  async update(id, { domainId, time, title, completed }) {
    const result = await pool.query(
      'UPDATE topics SET domain_id = $1, time = $2, title = $3, completed = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING id, domain_id, time, title, completed, created_at, updated_at',
      [domainId, time, title, completed, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM topics WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  /**
   * Toggle completion status
   */
  async toggleCompletion(id) {
    const result = await pool.query(
      'UPDATE topics SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, domain_id, time, title, completed, created_at, updated_at',
      [id]
    );
    return result.rows[0];
  }
}

export default new TopicsRepository();

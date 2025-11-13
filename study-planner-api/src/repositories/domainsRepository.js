import pool from '../config/database.js';

/**
 * Data Access Layer for Domains
 */
class DomainsRepository {
  /**
   * Get all domains
   */
  async findAll() {
    const result = await pool.query(
      'SELECT * FROM domains ORDER BY id ASC'
    );

    return result.rows;
  }

  /**
   * Get domain by ID
   */
  async findById(id) {
    const result = await pool.query(
      'SELECT id, time, title, completed, created_at, updated_at FROM domains WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  /**
   * Create new domain
   */
  async create({ time, title, completed = false }) {
    const result = await pool.query(
      'INSERT INTO domains (time, title, completed) VALUES ($1, $2, $3) RETURNING id, time, title, completed, created_at, updated_at',
      [time, title, completed]
    );
    return result.rows[0];
  }

  /**
   * Update domain
   */
  async update(id, { time, title, completed }) {
    const result = await pool.query(
      'UPDATE domains SET time = $1, title = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, time, title, completed, created_at, updated_at',
      [time, title, completed, id]
    );
    return result.rows[0];
  }

  /**
   * Delete domain
   */
  async delete(id) {
    const result = await pool.query('DELETE FROM domains WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  /**
   * Toggle completion status
   */
  async toggleCompletion(id) {
    const result = await pool.query(
      'UPDATE domains SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, time, title, completed, created_at, updated_at',
      [id]
    );
    return result.rows[0];
  }

  /**
   * Get domain with its topics
   */
  async findByIdWithTopics(id) {
    const domainResult = await pool.query(
      'SELECT id, time, title, completed, created_at, updated_at FROM domains WHERE id = $1',
      [id]
    );
    
    if (!domainResult.rows[0]) {
      return null;
    }

    const topicsResult = await pool.query(
      'SELECT id, domain_id, time, title, completed, created_at, updated_at FROM topics WHERE domain_id = $1 ORDER BY id ASC',
      [id]
    );

    return {
      ...domainResult.rows[0],
      topics: topicsResult.rows,
    };
  }

  /**
   * Get all domains with their topics
   */
  async findAllWithTopics() {
    const domainsResult = await pool.query(
      'SELECT id, time, title, completed, created_at, updated_at FROM domains ORDER BY id ASC'
    );

    const domains = domainsResult.rows;

    // Get topics for all domains
    const domainsWithTopics = await Promise.all(
      domains.map(async (domain) => {
        const topicsResult = await pool.query(
          'SELECT id, domain_id, time, title, completed, created_at, updated_at FROM topics WHERE domain_id = $1 ORDER BY id ASC',
          [domain.id]
        );
        return {
          ...domain,
          topics: topicsResult.rows,
        };
      })
    );

    return domainsWithTopics;
  }
}

export default new DomainsRepository();

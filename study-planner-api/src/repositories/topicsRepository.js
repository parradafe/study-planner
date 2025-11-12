import pool from '../config/database.js';

/**
 * Data Access Layer for Topics
 */
class TopicsRepository {
  async findAll() {
    const result = await pool.query(
      'SELECT id, time, title, completed, created_at, updated_at FROM topics ORDER BY id ASC'
    );
    return result.rows;
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT id, time, title, completed, created_at, updated_at FROM topics WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async create({ time, title, completed = false }) {
    const result = await pool.query(
      'INSERT INTO topics (time, title, completed) VALUES ($1, $2, $3) RETURNING id, time, title, completed, created_at, updated_at',
      [time, title, completed]
    );
    return result.rows[0];
  }

  async update(id, { time, title, completed }) {
    const result = await pool.query(
      'UPDATE topics SET time = $1, title = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, time, title, completed, created_at, updated_at',
      [time, title, completed, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM topics WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  async toggleCompletion(id) {
    const result = await pool.query(
      'UPDATE topics SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, time, title, completed, created_at, updated_at',
      [id]
    );
    return result.rows[0];
  }
}

export default new TopicsRepository();

import pool from '../config/database.js';

/**
 * Data Access Layer for Sessions
 * Compatible with SpacedRepetitionEngine structure
 */
class SessionsRepository {
  /**
   * Get all sessions
   */
  async findAll() {
    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        last_reviewed AS "lastReviewed", 
        difficulty_score AS "difficultyScore", 
        interval, 
        next_review_date AS "nextReviewDate", 
        review_count AS "reviewCount", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM sessions 
      ORDER BY id ASC`
    );
    return result.rows;
  }

  /**
   * Get session by ID
   */
  async findById(id) {
    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        last_reviewed AS "lastReviewed", 
        difficulty_score AS "difficultyScore", 
        interval, 
        next_review_date AS "nextReviewDate", 
        review_count AS "reviewCount", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM sessions 
      WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  /**
   * Find session by name
   */
  async findByName(name) {
    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        last_reviewed AS "lastReviewed", 
        difficulty_score AS "difficultyScore", 
        interval, 
        next_review_date AS "nextReviewDate", 
        review_count AS "reviewCount", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM sessions 
      WHERE name = $1`,
      [name]
    );
    return result.rows[0];
  }

  /**
   * Create new session
   */
  async create({ name, lastReviewed = null, difficultyScore = 0.5, interval = 1, nextReviewDate, reviewCount = 0 }) {
    const result = await pool.query(
      `INSERT INTO sessions 
        (name, last_reviewed, difficulty_score, interval, next_review_date, review_count) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING 
        id, 
        name, 
        last_reviewed AS "lastReviewed", 
        difficulty_score AS "difficultyScore", 
        interval, 
        next_review_date AS "nextReviewDate", 
        review_count AS "reviewCount", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"`,
      [name, lastReviewed, difficultyScore, interval, nextReviewDate, reviewCount]
    );
    return result.rows[0];
  }

  /**
   * Update session
   */
  async update(id, { name, lastReviewed, difficultyScore, interval, nextReviewDate, reviewCount }) {
    const result = await pool.query(
      `UPDATE sessions 
      SET 
        name = $1, 
        last_reviewed = $2, 
        difficulty_score = $3, 
        interval = $4, 
        next_review_date = $5, 
        review_count = $6,
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $7 
      RETURNING 
        id, 
        name, 
        last_reviewed AS "lastReviewed", 
        difficulty_score AS "difficultyScore", 
        interval, 
        next_review_date AS "nextReviewDate", 
        review_count AS "reviewCount", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"`,
      [name, lastReviewed, difficultyScore, interval, nextReviewDate, reviewCount, id]
    );
    return result.rows[0];
  }

  /**
   * Delete session
   */
  async delete(id) {
    const result = await pool.query('DELETE FROM sessions WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  /**
   * Get sessions that need review today
   */
  async findDueForReview() {
    const result = await pool.query(
      `SELECT 
        id, 
        name, 
        last_reviewed AS "lastReviewed", 
        difficulty_score AS "difficultyScore", 
        interval, 
        next_review_date AS "nextReviewDate", 
        review_count AS "reviewCount", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"
      FROM sessions 
      WHERE next_review_date <= CURRENT_TIMESTAMP
      ORDER BY next_review_date ASC`
    );
    return result.rows;
  }

  /**
   * Mark session as reviewed with difficulty level
   */
  async markAsReviewed(id, { difficultyScore, interval, nextReviewDate }) {
    const result = await pool.query(
      `UPDATE sessions 
      SET 
        last_reviewed = CURRENT_TIMESTAMP,
        difficulty_score = $1,
        interval = $2,
        next_review_date = $3,
        review_count = review_count + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING 
        id, 
        name, 
        last_reviewed AS "lastReviewed", 
        difficulty_score AS "difficultyScore", 
        interval, 
        next_review_date AS "nextReviewDate", 
        review_count AS "reviewCount", 
        created_at AS "createdAt", 
        updated_at AS "updatedAt"`,
      [difficultyScore, interval, nextReviewDate, id]
    );
    return result.rows[0];
  }
}

export default new SessionsRepository();

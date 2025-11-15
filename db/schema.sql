-- Study Planner Database Schema

-- Create Domains table
CREATE TABLE IF NOT EXISTS domains (
    id SERIAL PRIMARY KEY,
    time VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Topics table
CREATE TABLE IF NOT EXISTS topics (
    id SERIAL PRIMARY KEY,
    domain_id INTEGER NOT NULL,
    time VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_domain
        FOREIGN KEY(domain_id)
        REFERENCES domains(id)
        ON DELETE CASCADE
);

-- Create Sessions table (compatible with SpacedRepetitionEngine)
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    last_reviewed TIMESTAMP DEFAULT NULL,
    difficulty_score DECIMAL(3,2) DEFAULT 0.5 CHECK (difficulty_score >= 0 AND difficulty_score <= 1),
    interval INTEGER DEFAULT 1 CHECK (interval >= 1),
    next_review_date TIMESTAMP NOT NULL,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_topics_domain_id ON topics(domain_id);
CREATE INDEX IF NOT EXISTS idx_sessions_next_review_date ON sessions(next_review_date);
CREATE INDEX IF NOT EXISTS idx_sessions_name ON sessions(name);

-- Insert sample data
INSERT INTO domains (time, title, completed) VALUES
    ('18:00', 'Call mom', false),
    ('14:30', 'Review math concepts', true),
    ('10:00', 'Finish project proposal', false),
    ('16:45', 'Team meeting', false)
ON CONFLICT DO NOTHING;

INSERT INTO topics (domain_id, time, title, completed) VALUES
    (2, '09:15', 'JavaScript basics', false),
    (2, '13:00', 'React hooks', true),
    (2, '15:30', 'TypeScript types', false),
    (3, '11:00', 'Research documentation', false),
    (3, '14:45', 'Draft outline', true)
ON CONFLICT DO NOTHING;

INSERT INTO sessions (name, last_reviewed, difficulty_score, interval, next_review_date, review_count) VALUES
    ('Algorithm Analysis', NULL, 0.5, 1, CURRENT_TIMESTAMP, 0),
    ('Database Design', CURRENT_TIMESTAMP - INTERVAL '2 days', 0.35, 2, CURRENT_TIMESTAMP + INTERVAL '2 days', 1),
    ('System Architecture', CURRENT_TIMESTAMP - INTERVAL '1 day', 0.7, 1, CURRENT_TIMESTAMP + INTERVAL '1 day', 1)
ON CONFLICT (name) DO NOTHING;

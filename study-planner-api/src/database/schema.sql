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
    time VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    time VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Last Studied table
CREATE TABLE IF NOT EXISTS last_studied (
    id SERIAL PRIMARY KEY,
    time VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_domains_completed ON domains(completed);
CREATE INDEX IF NOT EXISTS idx_topics_completed ON topics(completed);
CREATE INDEX IF NOT EXISTS idx_sessions_completed ON sessions(completed);
CREATE INDEX IF NOT EXISTS idx_last_studied_completed ON last_studied(completed);

-- Insert sample data
INSERT INTO domains (time, title, completed) VALUES
    ('18:00', 'Call mom', false),
    ('14:30', 'Review math concepts', true),
    ('10:00', 'Finish project proposal', false),
    ('16:45', 'Team meeting', false)
ON CONFLICT DO NOTHING;

INSERT INTO topics (time, title, completed) VALUES
    ('09:15', 'JavaScript basics', false),
    ('13:00', 'React hooks', true),
    ('15:30', 'TypeScript types', false)
ON CONFLICT DO NOTHING;

INSERT INTO sessions (time, title, completed) VALUES
    ('08:00', 'Morning study', false),
    ('14:00', 'Practice exercises', true)
ON CONFLICT DO NOTHING;

INSERT INTO last_studied (time, title, completed) VALUES
    ('Yesterday', 'Algorithm complexity', true),
    ('2 days ago', 'Database design', true),
    ('1 week ago', 'CSS Grid layout', true)
ON CONFLICT DO NOTHING;

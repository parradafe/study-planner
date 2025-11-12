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

INSERT INTO sessions (time, title, completed) VALUES
    ('08:00', 'Morning study', false),
    ('14:00', 'Practice exercises', true)
ON CONFLICT DO NOTHING;

INSERT INTO last_studied (time, title, completed) VALUES
    ('Yesterday', 'Algorithm complexity', true),
    ('2 days ago', 'Database design', true),
    ('1 week ago', 'CSS Grid layout', true)
ON CONFLICT DO NOTHING;

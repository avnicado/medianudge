-- Initialize MediaNudge Database
-- This script creates the necessary tables and initial data

-- Create sessions table for express-session
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR NOT NULL PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Create index on expire column for efficient cleanup
CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY NOT NULL,
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create guiding questions table
CREATE TABLE IF NOT EXISTS guiding_questions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    question TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create media items table
CREATE TABLE IF NOT EXISTS media_items (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    type VARCHAR NOT NULL,
    author VARCHAR,
    description TEXT,
    image_url VARCHAR,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user media ratings table
CREATE TABLE IF NOT EXISTS user_media_ratings (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    media_id INTEGER NOT NULL REFERENCES media_items(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, media_id)
);

-- Create user follows table
CREATE TABLE IF NOT EXISTS user_follows (
    id SERIAL PRIMARY KEY,
    follower_id VARCHAR NOT NULL REFERENCES users(id),
    following_id VARCHAR NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Create yearly goals table
CREATE TABLE IF NOT EXISTS yearly_goals (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    year INTEGER NOT NULL,
    books_target INTEGER DEFAULT 0,
    courses_target INTEGER DEFAULT 0,
    podcasts_target INTEGER DEFAULT 0,
    movies_target INTEGER DEFAULT 0,
    debates_target INTEGER DEFAULT 0,
    games_target INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, year)
);

-- Create user content table
CREATE TABLE IF NOT EXISTS user_content (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    title VARCHAR NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create weekly challenges table
CREATE TABLE IF NOT EXISTS weekly_challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create user challenge progress table
CREATE TABLE IF NOT EXISTS user_challenge_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    challenge_id INTEGER NOT NULL REFERENCES weekly_challenges(id),
    progress JSONB DEFAULT '{}',
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- Insert sample data
INSERT INTO media_items (title, type, author, description, image_url, avg_rating, total_ratings) VALUES
('The Pragmatic Programmer', 'book', 'Dave Thomas, Andy Hunt', 'A guide to becoming a better programmer', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop', 4.5, 120),
('Clean Code', 'book', 'Robert C. Martin', 'A handbook of agile software craftsmanship', 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop', 4.3, 89),
('JavaScript: The Good Parts', 'book', 'Douglas Crockford', 'Unearthing the excellence in JavaScript', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', 4.1, 156),
('You Don''t Know JS', 'book', 'Kyle Simpson', 'A series about the JavaScript language', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop', 4.7, 203),
('Machine Learning by Andrew Ng', 'course', 'Andrew Ng', 'Stanford''s machine learning course', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop', 4.8, 1250),
('CS50', 'course', 'David Malan', 'Harvard''s introduction to computer science', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=600&fit=crop', 4.9, 2100),
('Hardcore History', 'podcast', 'Dan Carlin', 'Hardcore History by Dan Carlin', 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=600&fit=crop', 4.6, 567),
('Inception', 'movie', 'Christopher Nolan', 'A thief who steals corporate secrets through dream-sharing technology', 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop', 4.4, 890),
('The Matrix', 'movie', 'The Wachowskis', 'A computer programmer is led to fight an underground war against powerful computers', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop', 4.5, 1200),
('Portal 2', 'game', 'Valve', 'A puzzle-platform game with innovative mechanics', 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=600&fit=crop', 4.7, 445),
('The Witness', 'game', 'Jonathan Blow', 'A puzzle game that challenges your perception', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop', 4.2, 223),
('Intelligence Squared', 'debate', 'Various', 'Oxford-style debates on current affairs', 'https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&h=600&fit=crop', 4.3, 334);

INSERT INTO weekly_challenges (title, description, start_date, end_date, is_active) VALUES
('Read 5 High-Quality Articles', 'Challenge yourself to read 5 high-quality articles this week from reputable sources', '2024-01-01', '2024-01-07', TRUE);
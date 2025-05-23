CREATE DATABASE IF NOT EXISTS chatapp;
USE chatapp;

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add an index for faster querying of messages
CREATE INDEX idx_created_at ON messages(created_at); 
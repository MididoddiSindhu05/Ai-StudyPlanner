import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export async function initDb() {
  const client = await pool.connect();
  try {
    console.log('Initializing Database...');
    
    // Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        picture TEXT DEFAULT '',
        role VARCHAR(50) DEFAULT 'Student',
        streak INTEGER DEFAULT 12,
        last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        productivity_score INTEGER DEFAULT 84,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Tasks Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        priority VARCHAR(50) DEFAULT 'Medium',
        status VARCHAR(50) DEFAULT 'Todo',
        due_date TIMESTAMP,
        estimated_time INTEGER,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Study Plans Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS study_plans (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        schedule JSONB,
        is_ai BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Pomodoro Sessions Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pomodoro_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(255),
        duration INTEGER,
        type VARCHAR(50) DEFAULT 'Focus',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Database Initialized Successfully');
  } catch (err) {
    console.error('Database Initialization Error:', err);
  } finally {
    client.release();
  }
}

export default pool;

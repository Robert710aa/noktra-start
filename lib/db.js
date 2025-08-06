import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is not set in environment variables!');
  throw new Error('DATABASE_URL is not set in environment variables!');
}

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: process.env.NODE_ENV === 'production' ? true : false,
  },
  max: process.env.DB_MAX_CONNECTIONS ? parseInt(process.env.DB_MAX_CONNECTIONS) : 10,
  idleTimeoutMillis: process.env.DB_IDLE_TIMEOUT ? parseInt(process.env.DB_IDLE_TIMEOUT) : 30000,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
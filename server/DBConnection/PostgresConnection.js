import pkg from 'pg';
const { Pool } = pkg;

export default async function postgresConnect() {
  let pool;
  
  // Support both DATABASE_URL (Render/Heroku) and individual env vars (local dev)
  if (process.env.DATABASE_URL || process.env.EXTERNAL_DATABASE_URL) {
    // Use connection string (Render/Heroku style)
    const connectionString = process.env.DATABASE_URL || process.env.EXTERNAL_DATABASE_URL;
    pool = new Pool({
      connectionString: connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    console.log("📌 Using DATABASE_URL connection string");
  } else {
    // Use individual environment variables (local development)
    pool = new Pool({
      user: process.env.PG_USER,
      host: process.env.PG_HOST || 'localhost',
      database: process.env.PG_DATABASE,
      password: String(process.env.PG_PASSWORD),
      port: Number(process.env.PG_PORT) || 5432,
    });
    console.log("📌 Using individual environment variables");
  }

  try { 
    await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL connected");
    return pool;
  } catch (err) {
    console.error("❌ PostgreSQL connection error:", err.message || err);
    throw err;
  }
}

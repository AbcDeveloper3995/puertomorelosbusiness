import Database from 'better-sqlite3';
import path from 'path';

// Using a local file for the SQLite database
const dbPath = path.join(process.cwd(), 'leads_cache.db');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    query TEXT NOT NULL,
    category TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    search_id INTEGER,
    place_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    rating REAL,
    user_ratings_total INTEGER,
    google_maps_url TEXT,
    website TEXT,
    category TEXT,
    potential_level TEXT, -- 'HIGH', 'MEDIUM', 'LOW'
    photo_url TEXT,
    lat REAL,
    lng REAL,
    reviews_json TEXT,
    FOREIGN KEY(search_id) REFERENCES searches(id)
  );
`);

export default db;

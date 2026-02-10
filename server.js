
// server.js
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config'; // optional, loads DATABASE_URL from .env

const app = express();
const port = process.env.PORT || 3000;

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Dev-friendly CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://thecitytrail.com'
    // add your frontend URL if hosted remotely
  ]
}));

// Check DATABASE_URL
//if (!process.env.DATABASE_URL) {
  //console.error('❌ DATABASE_URL not set. Exiting.');
  //process.exit(1);
//}

// PostgreSQL pool
const pool = new Pool({
  connectionString: "postgres://postgres:pw@13.36.39.66:5432/travelfoxdb",
  ssl: { rejectUnauthorized: false }, // remove or adjust if your DB doesn't require SSL
  connectionTimeoutMillis: 5000
});

// Test DB connection at startup
pool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL database');
    client.release();
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
    process.exit(1);
  });

// --- API ROUTES ---

// Get destination by name
app.get('/destination', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: 'Destination name is required' });

  // 'SELECT * FROM destinations WHERE name = $1 LIMIT 1',

console.log("GGJGJG");
  try {
const result = await pool.query(
  `SELECT 
      d.*, 
      i.*, 
      d.name AS dest_name,   -- alias destination name
      i.name AS img_name     -- alias image name
   FROM destinations d
   LEFT JOIN images i 
     ON d.main_image = i.id
   WHERE d.name = $1
   LIMIT 1`,
  [name]
);

    console.log(result);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Destination not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
});

app.get('/restaurants', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: 'Destination name is required' });
console.log(name, typeof name);

  
  try {
    const result = await pool.query(
        `SELECT r.*
   FROM restaurants r
   JOIN destinations d ON r.destination_id = d.id
   LEFT JOIN images i ON r.image_id = i.id
   WHERE d.name = $1`,
  [name] // name = 'Barcelona'

    );
    console.log(result);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Destination not found' });
    res.json(result.rows);
  } catch (err) {
    console.error("HELLO");
    console.error('Database query error:', err.message);
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
});

app.get('/local_cuisine', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: 'Destination name is required' });
  console.log(name, typeof name);

  try {
    const result = await pool.query(
        `SELECT l.*
   FROM local_cuisine l
   JOIN destinations d ON l.destination_id = d.id
   WHERE d.name = $1`,
  [name] // name = 'Barcelona'

    );
    console.log("*******************");
    console.log(result);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Destination not found' });
    res.json(result.rows);
  } catch (err) {
    console.error("HELLO");
    console.error('Database query error:', err.message);
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
});

app.get('/sightseeing', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: 'Destination name is required' });
  console.log(name, typeof name);

  try {
    const result = await pool.query(
        `SELECT s.*
   FROM sightseeing s
   JOIN destinations d ON s.destination_id = d.id
   WHERE d.name = $1`,
  [name] // name = 'Barcelona'

    );
    console.log(result);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Destination not found' });
    res.json(result.rows);
  } catch (err) {
    console.error("HELLO");
    console.error('Database query error:', err.message);
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
});

app.get('/activities', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: 'Destination name is required' });
console.log(name, typeof name);

  
  try {
    const result = await pool.query(
        `SELECT a.*
   FROM activities a
   JOIN destinations d ON a.destination_id = d.id
   WHERE d.name = $1`,
  [name] // name = 'Barcelona'

    );
    console.log(result);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Destination not found' });
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
});

app.get('/essentials', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: 'Destination name is required' });
console.log(name, typeof name);

  
  try {
    const result = await pool.query(
        `SELECT e.*
   FROM essentials e
   JOIN destinations d ON e.destination_id = d.id
   WHERE d.name = $1`,
  [name] // name = 'Barcelona'

    );
    console.log("We're getting essentials here guys:");
    console.log(result);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Destination not found' });
    res.json(result.rows);
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
});

app.get('/local_cuisine', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: 'Destination name is required' });
console.log(name, typeof name);

  
  try {
    const result = await pool.query(
        `SELECT l.*
   FROM local_cuisine l
   JOIN destinations d ON l.destination_id = d.id
   WHERE d.name = $1`,
  ["Barcelona"] // name = 'Barcelona'

    );
    console.log(result);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Destination not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("HELLO");
    console.error('Database query error:', err.message);
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
});

// Get image by ID
app.get('/image', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'Image ID is required' });

  try {
    const result = await pool.query('SELECT * FROM images WHERE id = $1 LIMIT 1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Image not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
});


// --- SPA FALLBACK ---
// Must come after API routes to catch frontend routes like /destination/restaurants/
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

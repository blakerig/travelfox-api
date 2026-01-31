import cors from 'cors';

const express = require('express');
const { Pool } = require('pg'); // use Pool instead of Client
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

/* for dev only, eventually needs changing to something like:
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://your-frontend.onrender.com'
  ]
})); */
app.use(cors());

console.log('DATABASE_URL:', process.env.DATABASE_URL);
//exit;
// PostgreSQL pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // required for Render / EC2 testing
  connectionTimeoutMillis: 5000
});

// Test connection once at startup
pool.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL database');
    client.release(); // release client back to pool
  })
  .catch(err => console.error('❌ Database connection error:', err));

// API route to get destination by name
app.get('/destination', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: 'Destination name is required' });

  try {
    const result = await pool.query(
      'SELECT * FROM destinations WHERE name = $1 LIMIT 1',
      [name]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Destination not found' });

    console.log('Query result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
});

// API route to get image by ID
app.get('/image', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: 'Image ID is required' });

  try {
    const result = await pool.query('SELECT * FROM images WHERE id = $1 LIMIT 1', [id]);

    if (result.rows.length === 0) return res.status(404).json({ message: 'Image not found' });

    console.log('Query result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

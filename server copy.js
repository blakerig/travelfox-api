const express = require('express');
const { Client } = require('pg');
const app = express();
const port = 3000;

// Serve static files (HTML, JS) from the "public" folder
app.use(express.static('public'));

// PostgreSQL client
const client = new Client({
  host: '13.36.39.66',
  port: 5432,
  database: 'travelfoxdb',
  user: 'postgres',
  password: 'pw',
});

client.connect()
  .then(() => console.log('✅ Connected to PostgreSQL database'))
  .catch(err => console.error('❌ Database connection error:', err));

// API route to get destination names
app.get('/destination', async (req, res) => {
  try {
    console.log('Fetching destinations with name = Barcelona...');


      const { name } = req.query; // 👈 from client
        console.log(name);
      if (!name) {
      return res.status(400).json({ message: 'Destination name is required' });
    }

  
    // Parameterized query
    const result = await client.query(
      'SELECT * FROM destinations WHERE name = $1 LIMIT 1',
      [name] // $1 is replaced by 'Barcelona'
    );

    console.log('Query result:', result.rows);
    res.json(result.rows[0]); // send all fields as JSON
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).send('Database query error: ' + err.message);
  }
});

app.get('/image', async (req, res) => {
  try {
    const { id } = req.query;
    console.log('Fetching image with id =', id);

    if (!id) {
      return res.status(400).json({ message: 'Image ID is required' });
    }

    const result = await client.query(
      'SELECT * FROM images WHERE id = $1 LIMIT 1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    console.log('Query result:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database query error:', err.message);
    res.status(500).json({ message: 'Database query error', error: err.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
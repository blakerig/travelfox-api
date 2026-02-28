const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Initialize PostgreSQL connection pool
const pool = new Pool({
    host: '13.36.39.66',
    port: 5432,
    database: 'travelfoxdb',
    user: 'postgres',
    password: 'pw'
});

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Import route files for restaurants, sightseeing, and activities
const restaurantRoutes = require('./routes/restaurants');
const sightseeingRoutes = require('./routes/sightseeing');

// If you have the activities route file ready, uncomment the line below
// const activityRoutes = require('./routes/activities');

// Mount routes to handle specific paths
app.use('/restaurants', restaurantRoutes);
app.use('/sightseeing', sightseeingRoutes);

// If you have the activities route ready, uncomment this line
// app.use('/activities', activityRoutes);

// Start the server
app.listen(port, () => console.log(`App running on http://localhost:${port}`));
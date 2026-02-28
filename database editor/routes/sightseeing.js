const express = require('express');
const router = express.Router();
const pool = require('../helpers/dbHelpers');  // For db queries and connection

// Similar to restaurants, create routes for sightseeing
router.get('/', async (req, res) => {
    const result = await pool.query('SELECT * FROM sightseeing ORDER BY name');
    res.render('sightseeing-list', { sightseeing: result.rows });
});

// Add new sightseeing spot
router.get('/add', (req, res) => {
    res.render('sightseeing-form');
});

module.exports = router;
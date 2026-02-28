const express = require('express');
const router = express.Router();
const pool = require('../helpers/dbHelpers');  // For db queries and connection

// Route to list restaurants
router.get('/', async (req, res) => {
    const selectedDestId = req.query.destination_id || '';
    // Fetch destinations and restaurants
    const destResult = await pool.query('SELECT id, name FROM destinations ORDER BY name');
    const destinations = destResult.rows;
    let destOptions = '<option value="">--All Destinations--</option>';
    destinations.forEach(d => {
        const selected = String(d.id) === String(selectedDestId) ? 'selected' : '';
        destOptions += `<option value="${d.id}" ${selected}>${d.name}</option>`;
    });
    
    let query = `SELECT * FROM restaurants ORDER BY name`;
    const params = [];
    if (selectedDestId) {
        query = `SELECT * FROM restaurants WHERE destination_id = $1 ORDER BY name`;
        params.push(selectedDestId);
    }
    const restaurantResult = await pool.query(query, params);

    // HTML rendering with table of restaurants
    let html = `
        <h1>Restaurants</h1>
        <form method="GET" action="/restaurants">
            <label>Filter by Destination:
                <select name="destination_id" onchange="this.form.submit()">
                    ${destOptions}
                </select>
            </label>
        </form>
        <table>
            <tr><th>Name</th><th>Address</th><th>Destination</th><th>Edit</th></tr>
    `;
    restaurantResult.rows.forEach(r => {
        html += `<tr><td>${r.name}</td><td>${r.address}</td><td>${r.destination_name}</td><td><a href="/restaurants/${r.id}">Edit</a></td></tr>`;
    });
    html += `</table>`;
    res.send(html);
});

// Route to add/edit restaurant (reuse for both add and update)
router.get('/:id?', async (req, res) => {
    const restaurantId = req.params.id;
    let restaurant = {};
    if (restaurantId) {
        // Fetch the restaurant data from the database
        const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [restaurantId]);
        if (result.rows.length) restaurant = result.rows[0];
    }
    // Render the form for adding or editing the restaurant
    res.render('restaurant-form', { restaurant });  // This is assuming you're using a view engine like EJS
});

module.exports = router;
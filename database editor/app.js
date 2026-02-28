const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

const pool = new Pool({
    host: '13.36.39.66',
    port: 5432,
    database: 'travelfoxdb',
    user: 'postgres',
    password: 'pw'
});

app.use(bodyParser.urlencoded({ extended: true }));

// ================= STYLES =================
const styles = `
<style>
body { font-family: Arial, sans-serif; margin: 40px; background-color: #f9f9f9; }
form { background: #fff; padding: 20px; border-radius: 8px; max-width: 600px; }
label { display: block; margin-bottom: 10px; }
input, textarea, select { width: 100%; padding: 8px; margin-top: 4px; border-radius: 4px; border: 1px solid #ccc; }
textarea { resize: vertical; min-height: 80px; }
textarea[name=description] { height: 150px; }
textarea[name=notes] { height: 120px; }
button { background-color: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
button:hover { background-color: #218838; }
table { width: 100%; border-collapse: collapse; background: #fff; }
th, td { padding: 12px; border-bottom: 1px solid #ddd; }
th { background-color: #007bff; color: white; }
tr:nth-child(even) { background-color: #f2f2f2; }
a { color: #007bff; text-decoration: none; }
a:hover { text-decoration: underline; }
</style>
`;

// ================= AUTO EXPAND =================
const autoExpandScript = `
<script>
function autoExpand(field) {
    field.style.height = 'auto';
    field.style.height = field.scrollHeight + 'px';
}
window.addEventListener('input', function(e) {
    if (e.target.tagName.toLowerCase() === 'textarea') autoExpand(e.target);
});
</script>
`;

// ================= LIST RESTAURANTS =================
app.get('/restaurants', async (req, res) => {
    const selectedDestId = req.query.destination_id || '';

    const destinations = (await pool.query('SELECT id, name FROM destinations ORDER BY name')).rows;

    let destOptions = '<option value="">-- All Destinations --</option>';
    destinations.forEach(d => {
        const selected = String(d.id) === String(selectedDestId) ? 'selected' : '';
        destOptions += `<option value="${d.id}" ${selected}>${d.name}</option>`;
    });

    let query = `
        SELECT r.id, r.name, r.address, d.name AS destination_name
        FROM restaurants r
        LEFT JOIN destinations d ON r.destination_id = d.id
    `;
    const params = [];

    if (selectedDestId) {
        query += ' WHERE r.destination_id = $1';
        params.push(selectedDestId);
    }

    query += ' ORDER BY r.name';

    const restaurants = (await pool.query(query, params)).rows;

    let html = `${styles}<h1>Restaurants</h1>`;

    html += `
        <form method="GET">
            <label>Filter by Destination:
                <select name="destination_id" onchange="this.form.submit()">
                    ${destOptions}
                </select>
            </label>
        </form>
        <br>
    `;

    html += `
        <table>
            <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Destination</th>
                <th>Edit</th>
            </tr>
    `;

    restaurants.forEach(r => {
        html += `
            <tr>
                <td>${r.name}</td>
                <td>${r.address || ''}</td>
                <td>${r.destination_name || ''}</td>
                <td>
                    <a href="/restaurant?id=${r.id}&destination_id=${selectedDestId}">Edit</a>
                </td>
            </tr>
        `;
    });

    html += `
        </table>
        <br>
        <a href="/restaurant${selectedDestId ? '?destination_id=' + selectedDestId : ''}">Add New Restaurant</a>
    `;

    res.send(html);
});

// ================= ADD / EDIT RESTAURANT =================
app.get('/restaurant', async (req, res) => {
    const id = req.query.id;
    const defaultDestinationId = req.query.destination_id || '';
    let restaurant = {};

    const destinations = (await pool.query('SELECT id, name FROM destinations ORDER BY name')).rows;

    if (id) {
        const result = await pool.query(`
            SELECT *, 
                ST_Y(location::geometry) AS latitude,
                ST_X(location::geometry) AS longitude
            FROM restaurants WHERE id=$1
        `, [id]);
        restaurant = result.rows[0] || {};
    } else {
        restaurant.destination_id = defaultDestinationId;
    }

    let destOptions = '<option value="">-- Select Destination --</option>';
    destinations.forEach(d => {
        const selected = String(d.id) === String(restaurant.destination_id) ? 'selected' : '';
        destOptions += `<option value="${d.id}" ${selected}>${d.name}</option>`;
    });

    res.send(`${styles}
        <form method="POST" action="/restaurant${id ? '?id=' + id : ''}">
            <input type="hidden" name="return_destination_id" value="${defaultDestinationId}">

            <label>Destination:
                <select name="destination_id">${destOptions}</select>
            </label>

            <label>Name <input name="name" value="${restaurant.name || ''}"></label>
            <label>Address <textarea name="address">${restaurant.address || ''}</textarea></label>
            <label>Description <textarea name="description">${restaurant.description || ''}</textarea></label>
            <label>Cost <input name="cost" value="${restaurant.cost || ''}"></label>
            <label>Email <input type="email" name="email" value="${restaurant.email || ''}"></label>
            <label>Cuisine <input name="cuisine" value="${restaurant.cuisine || ''}"></label>
            <label>Price Range <input name="price_range" value="${restaurant.price_range || ''}"></label>
            <label>Website <input name="website" value="${restaurant.website || ''}"></label>
            <label>Telephone <input name="telephone" value="${restaurant.telephone || ''}"></label>
            <label>Opening Hours <input name="opening_hours" value="${restaurant.opening_hours || ''}"></label>
            <label>Latitude <input name="latitude" value="${restaurant.latitude || ''}"></label>
            <label>Longitude <input name="longitude" value="${restaurant.longitude || ''}"></label>
            <label>Must See <input type="checkbox" name="must_see" ${restaurant.must_see ? 'checked' : ''}></label>
            <label>Proof Read <input type="checkbox" name="proof_read" ${restaurant.proof_read ? 'checked' : ''}></label>
            <label>Notes <textarea name="notes">${restaurant.notes || ''}</textarea></label>
            <label>Closed Down <input type="checkbox" name="closeddown" ${restaurant.closeddown ? 'checked' : ''}></label>

            <button>${id ? 'Update' : 'Add'} Restaurant</button>
        </form>

        <br>
        <a href="/restaurants${defaultDestinationId ? '?destination_id=' + defaultDestinationId : ''}">Back to List</a>
        ${autoExpandScript}
    `);
});

// ================= SAVE =================
app.post('/restaurant', async (req, res) => {
    let {
        id,
        destination_id,
        return_destination_id,
        name,
        address,
        description,
        cost,
        email,
        cuisine,
        price_range,
        website,
        telephone,
        opening_hours,
        latitude,
        longitude,
        must_see,
        proof_read,
        notes,
        closeddown
    } = req.body;

    if (!destination_id && return_destination_id) destination_id = return_destination_id;
    if (!id) id = uuidv4();

    const location = latitude && longitude ? `POINT(${longitude} ${latitude})` : null;

    if (req.query.id) {
        await pool.query(`
            UPDATE restaurants SET
                destination_id=$1, name=$2, address=$3, description=$4,
                cost=$5, email=$6, cuisine=$7, price_range=$8,
                website=$9, telephone=$10, opening_hours=$11,
                location=CASE WHEN $12 IS NULL THEN NULL ELSE ST_GeogFromText($12) END,
                must_see=$13, proof_read=$14, notes=$15, closeddown=$16
            WHERE id=$17
        `, [
            destination_id, name, address, description, cost, email, cuisine, price_range,
            website, telephone, opening_hours, location,
            must_see === 'on', proof_read === 'on', notes, closeddown === 'on', id
        ]);
    } else {
        await pool.query(`
            INSERT INTO restaurants (
                id, destination_id, name, address, description, cost,
                email, cuisine, price_range, website, telephone,
                opening_hours, location, must_see, proof_read, notes, closeddown
            ) VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,
                CASE WHEN $13::text IS NULL THEN NULL ELSE ST_GeogFromText($13::text) END,
                $14,$15,$16,$17
            )
        `, [
            id, destination_id, name, address, description, cost,
            email, cuisine, price_range, website, telephone,
            opening_hours, location,
            must_see === 'on', proof_read === 'on', notes, closeddown === 'on'
        ]);
    }

    res.redirect(
        return_destination_id
            ? `/restaurants?destination_id=${return_destination_id}`
            : '/restaurants'
    );
});

// ================= START SERVER =================
app.listen(port, () => console.log(`App running on http://localhost:${port}`));

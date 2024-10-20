import express from 'express';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('data.db');

db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS points (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        description TEXT NOT NULL
    )
`, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Table "points" created successfully or already exists');
            db.run(`
                INSERT INTO points (lat, lng, description) 
                VALUES 
                (37.7749, -122.4194, 'Default point in San Francisco'),
                (34.0522, -118.2437, 'Default point in Los Angeles'),
                (40.7128, -74.0060, 'Default point in New York')
            `, (insertErr) => {
                if (insertErr) {
                    console.error('Error inserting default values:', insertErr.message);
                } else {
                    console.log('Default values inserted successfully');
                }
            });
        }
    });
});


app.get('/markers', (req, res) => {
    console.log(`GET`);
    db.all(`SELECT * FROM points`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/ADD', (req, res) => {
    const { lat, lng, info } = req.body;
    console.log(`ADD`);
    console.log(req.lat);
    db.run(`INSERT INTO markers (lat, lng, description) VALUES (?,?, ?)`, [lat, lng, info], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

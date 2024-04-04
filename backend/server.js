const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4200;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Povezivanje na bazu podataka
const pool = mysql.createPool({
  connectionLimit: 10,
  host: '193.198.97.21',
  user: 'iooa-turisticke',
  password: '11',
  database: 'iooa-turisticke'
});

// API endpoint za spremanje emaila i lozinke
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  pool.query('INSERT INTO korisnici_test (email, password) VALUES (?, ?)', [email, password], (error, results, fields) => {
    if (error) {
      res.status(500).send({ status: 'error', message: 'Greška prilikom registracije.' });
    } else {
      res.send({ status: 'success', message: 'Uspješna registracija' });
    }
  });
});

app.listen(4200, function () {
    console.log('Node app is running on port 4200');
    });
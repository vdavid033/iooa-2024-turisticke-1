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


    
    // Dodajemo endpoint za prijavu
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Provjeravamo da li korisnik s navedenim emailom i lozinkom postoji u bazi
  pool.query('SELECT * FROM korisnici_test WHERE email = ? AND password = ?', [email, password], (error, results, fields) => {
    if (error) {
      // U slučaju greške s bazom podataka, šaljemo odgovor s greškom
      res.status(500).send({ status: 'error', message: 'Greška prilikom prijave.' });
    } else {
      // Ako je rezultat prazan, znači da korisnik s tim kredencijalima ne postoji
      if (results.length > 0) {
        // Korisnik postoji, šaljemo poruku o uspješnoj prijavi
        res.send({ status: 'success', message: 'Uspješna prijava.' });
      } else {
        // Korisnik ne postoji, šaljemo odgovarajuću poruku
        res.send({ status: 'failure', message: 'Neispravni kredencijali.' });
      }
    }
  });
});

// ovo treba biti pokrenuto kako bi Axios radio
// pokreće se sa: node index.js

const mysql = require('mysql');
const express = require('express');
const app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
//const conn=require('./connection')
const jwt = require('jsonwebtoken');
const config = require("./auth.config.js");
const authJwt = require("./authJwt.js");

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); 
app.use(express.json());
const dbConfig = require("./dbConfig");

app.use(cors());
//const cors = require('cors');
app.use(cors({ origin: "*" }));




var dbConn = mysql.createConnection({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

//spajanje s bazom
dbConn.connect();





// Ovo riješava problem: 
// Origin <origin> is not allowed by Access-Control-Allow-Origin
// from origin 'http://localhost:4200' has been blocked by CORS policy
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// kraj fix-a


app.post('/unosAtrakcija', function (request, response) {
  const data = request.body;
  // Dodavanje vrijednosti 1 za id_korisnika na kraj svakog niza atributa atrakcije
  atrakcija = [
    [
      data.naziv, 
      data.opis, 
      data.slika, 
      data.prosjecna_ocjena, 
      data.geografska_duzina, 
      data.geografska_sirina, 
      data.adresa,
      1 // Ovdje dodajemo id_korisnika sa vrijednošću 1
    ]
  ];
  
  // Prilagodba SQL upita za uključivanje id_korisnika
  dbConn.query('INSERT INTO atrakcije (naziv, opis, slika, prosjecna_ocjena, geografska_duzina, geografska_sirina, adresa, id_korisnika) VALUES ?',
  [atrakcija], function (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results, message: 'Atrakcija unesena.' });
  });
});
app.post('/dodavanje_slike', function (request, response) {
  const data = request.body;
  slika = [[data.id_atrakcije_s, data.slika_s]]
  
  dbConn.query('INSERT INTO slike (id_atrakcije_s, slika_s ) VALUES ? ',
  [slika], function (error, results, fields) {
  if (error) throw error;
  return response.send({ error: false, data: results, message:'Slika dodana.' });
  });
});
app.post("/api/unos-slike", function (req, res) {
  const data = req.body;
  const slika = data.slika;

  connection.query(
    "INSERT INTO predmet (slika) VALUES (?)",
    [slika],
    function (error, results, fields) {
      if (error) {
        console.error(error);
        return res.status(500).send({
          error: true,
          message: "Dogodila se greška prilikom dodavanja teksta.",
        });
      }
      return res.send({
        error: false,
        data: results,
        message: "Slika je dodana.",
      });
    }
  );
});


//uzimanje podataka o atrakcijama
app.get('/atrakcije', (req,res)=>{
    dbConn.query("SELECT * FROM atrakcije WHERE id_korisnika = 1 ", (err,result)=>{
        if(err){
            res.send('error');
        }else{
            res.send(result);
        }
    });
});
app.get('/slike', (req,res)=>{
  dbConn.query("select * from slike", (err,result)=>{
      if(err){
          res.send('error');
      }else{
          res.send(result);
      }
  });
});

//uzimanje podataka o atrakcijama
app.get('/sveatrakcije', (req,res)=>{
  dbConn.query("SELECT * FROM atrakcije ", (err,result)=>{
      if(err){
          res.send('error');
      }else{
          res.send(result);
      }
  });
});
app.get('/slike', (req,res)=>{
dbConn.query("select * from slike", (err,result)=>{
    if(err){
        res.send('error');
    }else{
        res.send(result);
    }
});
});

/// uzimanje podataka o komentarima
app.get("/komentari", function (request, response) {
  dbConn.query("SELECT * FROM Komentari", function (error, results, fields) {
      if (error) throw error;
      return response.send({
          error: false,
          data: results,
          message: "lista komentara.",
      });
  });
});


app.get('/komentari/:id', function (request, response) {
let id_atrakcije = request.params.id;
dbConn.query("SELECT * FROM Komentari WHERE VK_ID_atrakcije=?", id_atrakcije, function (error, results, fields) {
    if (error) throw error;
    return response.send({
        error: false,
        data: results,
        message: "lista komentara.",
    });
});
});
// Dodavanje komentara za atrakciju po ID-u

app.post('/dodajKomentar/:id', (req, res) => {
const data = [req.body.Komentar, req.params.id]
dbConn.query("INSERT INTO Komentari( Komentar, VK_ID_atrakcije) VALUES (?,?)", data,(err,result)=>{
  if(err){
    res.send('Error')
  }else{
    res.send(result)
  }
})
});


//registracija korisnika
app.post('/dodajKorisnika', (req, res) => {
  const data = [req.body.Komentar, req.params.id]
  dbConn.query("INSERT INTO korisnici_test ( email, password) VALUES (?,?)", data,(err,result)=>{
    if(err){
      res.send('Error')
    }else{
      res.send(result)
    }
  })
  });



//uzimanje podataka o korisnicima
app.get("/korisnici", function (request, response) {
    dbConn.query("SELECT * FROM korisnici", function (error, results, fields) {
        if (error) throw error;
        return response.send({
            error: false,
            data: results,
            message: "lista korisnika.",
        });
    });
});



app.get('/atrakcije/:id', function (request, response) {
    let id_atrakcije = request.params.id;
    if (!id_atrakcije) {
        return response.status(400).send({
            error: true, 
            
            message: 'Unesite id_atrakcije'
        });
    }
    dbConn.query('SELECT * FROM atrakcije where id_atrakcije=?', id_atrakcije, function
        (error, results, fields) {
        if (error) throw error;
        return response.send({
           data: results[0]
                
        });
    });
});


/*
app.delete('/atrakcije/id', function (request, response) {
    let id_atrakcije = request.params.id;
    if (!id_atrakcije) {
    return response.status(400).send({ error: true, message:
    'nedostaje id atrakcije' });
    }
    dbConn.query("DELETE * FROM atrakcije WHERE id_atrakcije = ?",[id_atrakcije],
    function (error, results) {
    if (error) throw error;
    return response.send({ error: false, data: results, message:
    'atrakcija je obrisana.' });
    });
});*/



app.delete('/obrisi_atrakcije/:id', authJwt.verifyToken("admin"), function (request, response){

    
    let id_atrakcije = request.params.id;
  
    console.log(`Received request to delete atrakcija with id: ${id_atrakcije}`); // Log the received id
  
    if (!id_atrakcije) {
      return response.status(400).send({ error: true, message: 'nedostaje id atrakcije' });
    }
  
   const deleteQuery = "DELETE FROM atrakcije WHERE id_atrakcije = ? ";
     //const deleteQuery = "DELETE  FROM atrakcije WHERE id_atrakcije = '${id}'";
    dbConn.query(deleteQuery, [id_atrakcije], function (error, results) {
      if (error) {
        console.log(`Error when executing the delete query: ${error}`); // Log any error from the query
        throw error;
      }
  
      console.log('Deletion result: ${JSON.stringify(results)}'); // Log the result of the deletion
  
      return response.send({ error: false, data: results, message: 'atrakcija je obrisana obrisi_atrakcije.' });
    });
  });

 // Dodavanje ocjene za atrakciju
 
 app.put('/dodajOcjenu/:id', (req, res) => {
  const data = [req.body.prosjecna_ocjena, req.params.id]
  dbConn.query("UPDATE atrakcije SET prosjecna_ocjena = ? WHERE id_atrakcije = ?", data,(err,result)=>{
    if(err){
      res.send('Error')
    }else{
      res.send(result)
    }
  })
});


//DOHVAT PROSJEČNE OCJENE ZA ATRAKCIJU
app.get('/atrakcijeProsjecneOcjene/:id', (req, res) => {
  const data = [req.params.id]
  //SELECT AVG(ocjena) FROM `Ocjena` WHERE VK_ID_Atrakcije = 141
  dbConn.query("SELECT AVG(ocjena) as prosjek FROM Ocjena WHERE VK_ID_Atrakcije = ?", data,(err,result)=>{
    if(err){
      res.send('Error')
    }else{
      res.send(result)
    }
  })
});


   // Dodavanje ocjene za atrakciju u tablicu OCJENE
 
   app.post('/dodajOcjenuOcjene/:id', (req, res) => {
    const data = [req.body.prosjecna_ocjena, req.params.id]
    //INSERT INTO `Ocjena`( `ocjena`, `VK_ID_Atrakcije`) VALUES (2,141)
    dbConn.query("INSERT INTO Ocjena (ocjena, VK_ID_Atrakcije) VALUES ( ? , ?)", data,(err,result)=>{
      if(err){
        res.send('Error')
      }else{
        res.send(result)
      }
    })
  });





  app.delete('/obrisi_sliku_atrakcije/:id', function (request, response){

    
    let id_atrakcije = request.params.id;
  
    console.log(`Received request to delete atrakcija with id: ${id_atrakcije}`); // Log the received id
  
    if (!id_atrakcije) {
      return response.status(400).send({ error: true, message: 'nedostaje id atrakcije' });
    }
  
   const deleteQuery = "UPDATE atrakcije SET slika = NULL WHERE id_atrakcije = ?";
     //const deleteQuery = "DELETE  FROM atrakcije WHERE id_atrakcije = '${id}'";
    dbConn.query(deleteQuery, [id_atrakcije], function (error, results) {
      if (error) {
        console.log(`Error when executing the delete query: ${error}`); // Log any error from the query
        throw error;
      }
  
      console.log('Deletion result: ${JSON.stringify(results)}'); // Log the result of the deletion
  
      return response.send({ error: false, data: results, message: 'slika atrakcija je obrisana ' });
    });
  });





  app.delete('/obrisi_ocjenu_atrakcije/:id', function (request, response){

    
    let id_atrakcije = request.params.id;
  
    console.log(`Received request to delete atrakcija with id: ${id_atrakcije}`); // Log the received id
  
    if (!id_atrakcije) {
      return response.status(400).send({ error: true, message: 'nedostaje id atrakcije' });
    }
  
   const deleteQuery = "UPDATE atrakcije SET prosjecna_ocjena = NULL WHERE id_atrakcije = ?";
     //const deleteQuery = "DELETE  FROM atrakcije WHERE id_atrakcije = '${id}'";
    dbConn.query(deleteQuery, [id_atrakcije], function (error, results) {
      if (error) {
        console.log(`Error when executing the delete query: ${error}`); // Log any error from the query
        throw error;
      }
  
      console.log('Deletion result: ${JSON.stringify(results)}'); // Log the result of the deletion
  
      return response.send({ error: false, data: results, message: 'ocjena atrakcija je obrisana ' });
    });
  });
/*
  app.put('/dodaj_sliku_atrakcije/:id', function (request, response){

    
    let id_atrakcije = request.params.id;
  
    console.log(`Received request to delete atrakcija with id: ${id_atrakcije}`); // Log the received id
  
    if (!id_atrakcije) {
      return response.status(400).send({ error: true, message: 'nedostaje id atrakcije' });
    }
  
   const deleteQuery = "UPDATE atrakcije SET slika = ? WHERE id_atrakcije = ?";
     //const deleteQuery = "DELETE  FROM atrakcije WHERE id_atrakcije = '${id}'";
    dbConn.query(deleteQuery,[slika],[id_atrakcije], function (error, results) {
      if (error) {
        console.log(`Error when executing the delete query: ${error}`); // Log any error from the query
        throw error;
      }
  
      console.log('Deletion result: ${JSON.stringify(results)}'); // Log the result of the deletion
  
      return response.send({ error: false, data: results, message: 'slika atrakcija je obrisana ' });
    });
  });*/


  app.delete('/obrisi_ocjenu_atrakcije/:id', function (request, response){

    
    let id_atrakcije = request.params.id;
  
    console.log(`Received request to delete atrakcija with id: ${id_atrakcije}`); // Log the received id
  
    if (!id_atrakcije) {
      return response.status(400).send({ error: true, message: 'nedostaje id atrakcije' });
    }
  
   const deleteQuery = "UPDATE atrakcije SET prosjecna_ocjena = NULL WHERE id_atrakcije = ?";
     //const deleteQuery = "DELETE  FROM atrakcije WHERE id_atrakcije = '${id}'";
    dbConn.query(deleteQuery, [id_atrakcije], function (error, results) {
      if (error) {
        console.log(`Error when executing the delete query: ${error}`); // Log any error from the query
        throw error;
      }
  
      console.log('Deletion result: ${JSON.stringify(results)}'); // Log the result of the deletion
  
      return response.send({ error: false, data: results, message: 'ocjena atrakcija je obrisana ' });
    });
  });
//brisanje komentara

app.delete('/obrisi_komentar/:id', function (request, response){

    
  let id_komentara = request.params.id;

  console.log(`Received request to delete komentar with id: ${id_komentara}`); // Log the received id

  if (!id_komentara) {
    return response.status(400).send({ error: true, message: 'nedostaje id komentara' });
  }

 const deleteQuery = "DELETE  FROM Komentari WHERE ID_komentara = ?";
  dbConn.query(deleteQuery, [id_komentara], function (error, results) {
    if (error) {
      console.log(`Error when executing the delete query: ${error}`); // Log any error from the query
      throw error;
    }

    console.log('Deletion result: ${JSON.stringify(results)}'); // Log the result of the deletion

    return response.send({ error: false, data: results, message: 'komentar je obrisan obrisi komentar.' });
  });
});

  app.put('/atrakcije/azuriraj/:id', (req, res) => {
    console.log(req.body)
    const data = [req.body.naziv, req.body.opis, req.body.slika, req.body.prosjecna_ocjena, req.body.geografska_sirina, req.body.geografska_duzina, req.body.adresa, req.params.id]
    dbConn.query("UPDATE atrakcije SET naziv = ?, opis = ?,  slika = ?,  prosjecna_ocjena = ?,  geografska_sirina = ?,  geografska_duzina = ?,  adresa = ? WHERE id_atrakcije = ?", data,(err,result)=>{
      if(err){
        res.send('Error' + err)
      }else{
        res.send(result)
      }
    })
  });
//port na kojem je app
app.listen(4200, function () {
console.log('Node app is running on port 4200');
});
//module.exports = app;




// API endpoint za spremanje emaila i lozinke
app.post('/register', (req, res) => {
  const { korisnicko_ime, lozinka } = req.body;
  const uloga = 'korisnik';  // Postavljanje default vrijednosti 'korisnik' za uloga

  // Prvo hashiramo lozinku
  bcrypt.hash(lozinka, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send({ status: 'error', message: 'Greška prilikom hashiranja lozinke.', error: err.message });
    }

    // Ako nema greške, nastavljamo s upisom u bazu
    dbConn.query('INSERT INTO korisnici_test (korisnicko_ime, lozinka, uloga) VALUES (?, ?, ?)',
      [korisnicko_ime, hashedPassword, uloga], (error, results, fields) => {
        if (error) {
          console.error("Database error:", error);
          res.status(500).send({ status: 'error', message: 'Greška prilikom registracije.', error: error.sqlMessage });
        } else {
          res.send({ status: 'success', message: 'Uspješna registracija' });
        }
      });
  });
});

const bcrypt = require('bcrypt');
const saltRounds = 10; 


// Dodajemo endpoint za prijavu
app.post("/prijavi", function (req, res) {
  const { korisnicko_ime, lozinka } = req.body;

  dbConn.query(
    "SELECT * FROM `korisnici_test` WHERE `korisnicko_ime` = ?",
    [korisnicko_ime],
    function (error, results) {
      if (error) {
        console.error("Error logging in:", error);
        return res.status(501).send({ error: true, message: "Problem prilikom prijave.", detailedError: error.sqlMessage });
      }
      if (results.length > 0) {
        bcrypt.compare(lozinka, results[0].lozinka, function (err, isMatch) {
          if (err) {
            console.error("Error comparing password:", err);
            console.log(lozinka);
            console.log(results[0].lozinka);
            return res.status(500).send({ error: true, message: "Problem prilikom provjere lozinke.", detailedError: err.message });
          }
          if (isMatch) {
            const token = jwt.sign({ id: results[0].id_korisnika, uloga: results[0].uloga }, config.secret, { expiresIn: '24h' });
            res.status(200).json({ success: true, message: "Login successful", token: token });
          } else {
            res.status(401).send({ success: false, message: 'Neispravno korisničko ime ili lozinka.' });
          }
        });
      } else {
        res.status(404).send({ success: false, message: 'Korisničko ime nije pronađeno.' });
      }
    }
  );
});


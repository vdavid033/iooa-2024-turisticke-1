

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

const multer = require('multer');


const upload = multer();

app.put('/updateImage/:id', (req, res) => {
  const { id } = req.params;
  const { slika } = req.body; 

  if (!slika) {
    return res.status(400).send({ error: true, message: 'Slika je potrebna.' });
  }

  const updateQuery = "UPDATE atrakcije SET slika = ? WHERE id_atrakcije = ?";
  dbConn.query(updateQuery, [slika, id], (err, result) => {
    if (err) {
      console.error('Error updating image:', err);
      return res.status(500).send({ error: true, message: 'Došlo je do pogreške prilikom ažuriranja slike.' });
    }
    res.send({ error: false, data: result, message: 'Slika uspješno ažurirana.' });
  });
});



// Ovo riješava problem: 
// Origin <origin> is not allowed by Access-Control-Allow-Origin
// from origin 'http://localhost:4200' has been blocked by CORS policy
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



app.post('/unosAtrakcija', authJwt.verifyToken("admin, korisnik"), function (request, response) {
  const data = request.body;

  
  const atrakcija = [
    [
      data.naziv,
      data.opis,
      data.slika,
      data.prosjecna_ocjena || null,
      data.geografska_duzina,
      data.geografska_sirina,
      data.adresa,
      data.id_korisnika 
    ]
  ];

  
  dbConn.query(
    'INSERT INTO atrakcije (naziv, opis, slika, prosjecna_ocjena, geografska_duzina, geografska_sirina, adresa, id_korisnika) VALUES ?',
    [atrakcija],
    function (error, results, fields) {
      if (error) {
        console.error('Error inserting attraction:', error);
        return response.status(500).send({ error: true, message: 'Došlo je do pogreške prilikom unosa atrakcije.' });
      }

      return response.send({ error: false, data: results, message: 'Atrakcija uspješno unesena.' });
    }
  );
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
app.get('/atrakcije', (req, res) => {
  const idKorisnika = req.query.id_korisnika;
  console.log("id korisnika: "+ idKorisnika);
  if (!idKorisnika) {
    return res.status(400).send({ error: 'ID korisnika je potreban' });
  }

  dbConn.query("SELECT * FROM atrakcije WHERE id_korisnika = ?", [idKorisnika], (err, result) => {
    if (err) {
      res.status(500).send('Error in fetching attractions');
    } else {
      res.send(result);
    }
  });
});


app.get('/natrakcije/:id', (req, res) => {
  const { id } = req.params;
  console.log("Request received for ID:", req.params.id);


  dbConn.query("SELECT * FROM atrakcije WHERE id_atrakcije = ? ", [id], (err, result) => {
    if (err) {
      return res.status(500).send('Error in fetching attraction');
    }
    if (result.length === 0) {
      return res.status(404).send('Attraction not found');
    }
    res.send(result[0]); 
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
app.get("/komentari", (request, response) => {
  dbConn.query("SELECT * FROM Komentari", (error, results, fields) => {
    if (error) throw error;
    return response.send({
      error: false,
      data: results,
      message: "lista komentara.",
    });
  });
});

app.get('/komentari/:id', (request, response) => {
  let id_atrakcije = request.params.id;
  console.log("Id atrakcije: " + id_atrakcije);
  dbConn.query("SELECT * FROM Komentari WHERE VK_ID_atrakcije = ?", [id_atrakcije], (error, results, fields) => {
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
  const data = [req.body.Komentar, req.params.id];
  console.log('Received data:', data);  
  dbConn.query("INSERT INTO Komentari(Komentar, VK_ID_atrakcije) VALUES (?,?)", data, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);  
      res.status(500).send('Error');
    } else {
      console.log('Insert result:', result);  
      res.send(result);
    }
  });
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



app.delete('/obrisi_atrakcije/:id_atrakcije', function (request, response) {
  const id_atrakcije = request.params.id_atrakcije;
  const id_korisnika = request.query.id_korisnika;
  const uloga = request.query.uloga;

  console.log(`Received request to delete atrakcija with id: ${id_atrakcije} by user: ${id_korisnika}, role: ${uloga}`);

  if (!id_atrakcije || (!id_korisnika && uloga !== 'admin')) {
    return response.status(400).send({ error: true, message: 'Missing id_atrakcije or id_korisnika' });
  }

  if (uloga === 'admin') {
    
    const adminDeleteQuery = "DELETE FROM atrakcije WHERE id_atrakcije = ?";
    dbConn.query(adminDeleteQuery, [id_atrakcije], function (error, deleteResults) {
      if (error) {
        console.log(`Error when executing the admin delete query: ${error}`);
        return response.status(500).send({ error: true, message: 'Error deleting attraction' });
      }

      console.log(`Admin deletion result: ${JSON.stringify(deleteResults)}`);
      return response.send({ error: false, data: deleteResults, message: 'Atrakcija je obrisana by admin.' });
    });
  } else {
    
    const selectQuery = "SELECT * FROM atrakcije WHERE id_atrakcije = ? AND id_korisnika = ?";
    dbConn.query(selectQuery, [id_atrakcije, id_korisnika], function (error, results) {
      if (error) {
        console.log(`Error fetching data: ${error}`);
        return response.status(500).send({ error: true, message: 'Error retrieving attraction' });
      }

      if (results.length === 0) {
        return response.status(403).send({ error: true, message: 'User not authorized to delete this attraction' });
      }

      const deleteQuery = "DELETE FROM atrakcije WHERE id_atrakcije = ? AND id_korisnika = ?";
      dbConn.query(deleteQuery, [id_atrakcije, id_korisnika], function (error, deleteResults) {
        if (error) {
          console.log(`Error when executing the user delete query: ${error}`);
          return response.status(500).send({ error: true, message: 'Error deleting attraction' });
        }

        console.log(`User deletion result: ${JSON.stringify(deleteResults)}`);
        return response.send({ error: false, data: deleteResults, message: 'Atrakcija je obrisana by user.' });
      });
    });
  }
});



 // Dodavanje ocjene za atrakciju
 
app.put('/dodajOcjenu/:id', authJwt.verifyToken("admin, korisnik"), (req, res) => {
  const userId = req.body.id_korisnika;  
  const data = [req.body.prosjecna_ocjena, req.params.id, userId];
  console.log(userId);
  
  dbConn.query("UPDATE atrakcije SET prosjecna_ocjena = ? WHERE id_atrakcije = ? AND id_korisnika = ?", data, (err, result) => {
    if (err) {
      res.send('Error');
    } else if (result.affectedRows === 0) {
      res.status(403).send('Unauthorized: No update was made.');
    } else {
      res.send(result);
    }
  });
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
  
    console.log(`Received request to delete atrakcija with id: ${id_atrakcije}`); 
  
    if (!id_atrakcije) {
      return response.status(400).send({ error: true, message: 'nedostaje id atrakcije' });
    }
  
   const deleteQuery = "UPDATE atrakcije SET slika = NULL WHERE id_atrakcije = ?";
     //const deleteQuery = "DELETE  FROM atrakcije WHERE id_atrakcije = '${id}'";
    dbConn.query(deleteQuery, [id_atrakcije], function (error, results) {
      if (error) {
        console.log(`Error when executing the delete query: ${error}`); 
        throw error;
      }
  
      console.log('Deletion result: ${JSON.stringify(results)}'); 
  
      return response.send({ error: false, data: results, message: 'slika atrakcija je obrisana ' });
    });
  });





app.delete('/obrisi_ocjenu_atrakcije/:id/:userId', function (request, response) {
  let id_atrakcije = request.params.id;
  let id_korisnika = request.params.userId;

  console.log(`Received request to delete atrakcija with id: ${id_atrakcije} and user ID: ${id_korisnika}`);

  if (!id_atrakcije) {
    return response.status(400).send({ error: true, message: 'Nedostaje ID atrakcije' });
  }

  const deleteQuery = "UPDATE atrakcije SET prosjecna_ocjena = NULL WHERE id_atrakcije = ? AND id_korisnika = ?"; 
  dbConn.query(deleteQuery, [id_atrakcije, id_korisnika], function (error, results) {
    if (error) {
      return response.status(500).send({ error: true, message: 'Error executing deletion' });
    }

    if (results.affectedRows === 0) {
      return response.status(403).send({ error: true, message: 'No deletion occurred, unauthorized or non-existent record' });
    }

    return response.send({ error: false, data: results, message: 'Ocjena atrakcije je obrisana' });
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


app.put('/updatePost/:id', (req, res) => {
  const { id } = req.params;
  const { naziv, opis, adresa } = req.body;

  let updateFields = [];
  let updateValues = [];

  if (naziv !== undefined) {
    updateFields.push("naziv = ?");
    updateValues.push(naziv);
  }
  if (opis !== undefined) {
    updateFields.push("opis = ?");
    updateValues.push(opis);
  }
  if (adresa !== undefined) {
    updateFields.push("adresa = ?");
    updateValues.push(adresa);
  }

  if (updateFields.length === 0) {
    return res.status(400).send({ error: true, message: 'Nema polja za ažuriranje' });
  }

  updateValues.push(id);

  const updateQuery = `UPDATE atrakcije SET ${updateFields.join(", ")} WHERE id_atrakcije = ?`;
  dbConn.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      console.error('Error updating attraction:', err);
      return res.status(500).send({ error: true, message: 'Došlo je do pogreške prilikom ažuriranja atrakcije.' });
    }
    res.send({ error: false, data: result, message: 'Atrakcija uspješno ažurirana.' });
  });
});






  
//brisanje komentara

app.delete('/obrisi_komentar/:id', function (request, response){

    
  let id_komentara = request.params.id;

  console.log(`Received request to delete komentar with id: ${id_komentara}`); 

  if (!id_komentara) {
    return response.status(400).send({ error: true, message: 'nedostaje id komentara' });
  }

 const deleteQuery = "DELETE  FROM Komentari WHERE ID_komentara = ?";
  dbConn.query(deleteQuery, [id_komentara], function (error, results) {
    if (error) {
      console.log(`Error when executing the delete query: ${error}`); 
      throw error;
    }

    console.log('Deletion result: ${JSON.stringify(results)}'); 

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




app.post('/register', (req, res) => {
  const { korisnicko_ime, lozinka } = req.body;
  const uloga = 'korisnik';  

  bcrypt.hash(lozinka, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send({ status: 'error', message: 'Greška prilikom hashiranja lozinke.', error: err.message });
    }

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


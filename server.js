/*
Script aggiuntivo, è un piccolo server NodeJS utile per testare il progetto
*/
// Import dei moduli usati
var http    = require("http");
var express = require("express");

//Utilizzo della porta 8080
var port = process.env.PORT || 8080;

//Utilizzo della cartella public in modo statico (gli url locali sono localhost:8080/file.estensione)
var app = express();
app.use(express.static('examples'));

// Fa partire il server e si mette in attesa di richieste
var webServer = http.createServer(app);
webServer.listen(port, function () {
    console.log('listening on http://localhost:' + port);
});

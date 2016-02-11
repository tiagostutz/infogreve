/*
* Dependencias
*/
var express = require('express'); //npm install express
var path = require('path');
var querystring = require('querystring');
var nunjucks = require('nunjucks');

var app = express();
var dataDir = "../web/frontend";	

app.use(express.json());
app.use(express.urlencoded());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render('error', { error: err });
}
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}


nunjucks.configure(dataDir, {
    autoescape: true,
    express: app
});

app.use(express.static(path.join(__dirname, dataDir))); //  diretorio onde estao os recursos estaticos

app.get('/view_home', function(req, res) {
    res.render('index.html');
}).use(errorHandler);
app.get('/view_noticias', function(req, res) {
    res.render('noticias.html');
}).use(errorHandler);
app.get('/view_noticias_listagem', function(req, res) {
    res.render('listagem_noticias.html');
}).use(errorHandler);

app.get('/view_noticia', function(req, res) {
    res.render('noticia.html');
}).use(errorHandler);
app.get('/view_entenda', function(req, res) {
    res.render('entenda-a-greve.html');
}).use(errorHandler);
app.get('/view_emergencia', function(req, res) {
    res.render('emergencia.html');
}).use(errorHandler);

app.get('/view_lei', function(req, res) {
    res.render('o-que-diz-a-lei.html');
}).use(errorHandler);
app.get('/view_etapas', function(req, res) {
    res.render('etapas-da-greve.html');
}).use(errorHandler);
app.get('/view_contato', function(req, res) {
    res.render('contato.html');
}).use(errorHandler);

app.listen(3000);
console.log("API InfoGreve pronta para receber requisições na porta 3000");

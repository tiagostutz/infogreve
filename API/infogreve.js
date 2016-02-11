/*
* Dependencias
*/
var express = require('express'); //npm install express
var request = require('request');
var querystring = require('querystring');
var Cache   = require("mem-cache");
var cacheOptions = {
        timeout: (process.argv[3] * 60 * 1000)
    };
var cache = new Cache(cacheOptions);

var PodioApp = require("./lib/node-podio.js");

var app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin','*');
  cachedResult = cache.get(req.url);
  if (cachedResult) {
    res.send(cachedResult);    
  }else{
    next();
  }
});
app.use(app.router);

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, { error: 'Something blew up!' });
  } else {
    next(err);
  }
}
function errorHandler(err, req, res, next) {
  res.status(500);
  res.send('error');
}
function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

var TopicosApp = function() { return new PodioApp("topicos", "7718970", "7ba0c527188f441b943900da2e9d0ebb", ["titulo", "texto", "perguntas-e-respostas", "modelos-relacioandos", "fase", "autor-2", "ordem"]); }
var ItensLegislativosApp = function() { return new PodioApp("itensLegislativos", "7719060", "4cfde59b9d8e41f1bd395ffa40416710", ["titulo","topico", "texto", "categoria", "link", "fase"]); }
var ItensJurisprudenciaApp = function() { return new PodioApp("itensLegislativos", "7719060", "4cfde59b9d8e41f1bd395ffa40416710", ["titulo","topico", "texto", "categoria", "link", "fase"]); }
var ItensProposicoesApp = function() { return new PodioApp("itensLegislativos", "7719060", "4cfde59b9d8e41f1bd395ffa40416710", ["titulo","topico", "texto", "categoria", "link", "fase"]); } 
var NoticiasApp = function() { return new PodioApp("noticias", "7719068", "37af0e5a39f2402cb9d95fcedbea865d", ["titulo", "chamada", "texto", "fonte", "link-para-noticia-original", "data-de-publicacao", "topicos", "fase"]); }
var EmergenciasApp = function() { return new PodioApp("emergencia", "7951187", "0e2a2108d03447ea8852512c007fed99", ["titulo", "email", "telefone", "mensagem", "imagem"]); }
var EmergenciasAppTest = function() { return new PodioApp("emergenciaTest", "8198892", "5fa52ede41ba44669be9c8d2fd39b21b", ["titulo", "email", "telefone", "mensagem", "imagem"]); }
var PerguntasApp = function() { return  new PodioApp("perguntas","7718988","7ecd1c33a4264fb6925608c961580b1d",["pergunta","resposta"]); }
var ModelosApp = function() { return new PodioApp("modelos","7719000","3640da4e0d5e4514aee0623f5b2cb87d",["nome-do-modelo","descricao","fase"]); }

function sendResult(req, res, result) {
  cache.set(req.url, result);
  res.send(result);
}
app.get('/noticias/', function (req, res){
    NoticiasApp().itemsFilterItems({ body: req.query }, function(result) {
        sendResult(req, res, result);
    });
}).use(errorHandler);

app.get('/noticias/:id', function (req, res){
    NoticiasApp().itemsGetItem({item_id : req.param("id")}, function(result) {
        sendResult(req, res, result);
    });
}).use(errorHandler);


app.get('/topicos/:itemId/noticias/', function (req, res){
    var query = req.query;
    query.filters = {
       63244069: [parseInt(req.param("itemId"))]
    };
    NoticiasApp().itemsFilterItems({ body: query }, function(result) {
        sendResult(req, res, result);
    });
}).use(errorHandler);

app.get('/topicos/', function (req, res){
    TopicosApp().itemsFilterItems({ body: req.query }, function(result) {
      sendResult(req, res, result);
    });
}).use(errorHandler);

app.get('/perguntas/', function (req, res){
    PerguntasApp().itemsFilterItems({ body: req.query }, function(result) {
        sendResult(req, res, result);
    });
}).use(errorHandler);

app.get('/perguntas/:id', function (req, res){
    PerguntasApp().itemsGetItemByAppItemId(req.param("id"), function(result) {
        sendResult(req, res, result);
    });
}).use(errorHandler);

app.get('/legislativos/', function (req, res){
    ItensLegislativosApp().itemsFilterItems({ body: req.query }, function(result) {
        sendResult(req, res, result);
    });
}).use(errorHandler);

app.get('/fases/', function (req, res){
    result = [
       {
        id: 1,
        value: "Reivindicação"
      },
      {
        id: 2,
        value: "Deflagração"
      },
      {
        id: 3,
        value: "Condução"
      },
      {
        id: 4,
        value: "Encerramento"
      }
    ];
    sendResult(req, res, result);
}).use(errorHandler);

app.get('/etapas/:faseId/noticias/', function (req, res){
    var query = req.query;
    query.filters = {
       63244068: [parseInt(req.param("faseId"))]
    };
    NoticiasApp().itemsFilterItems({ body: query }, function(result) {
      sendResult(req, res, result);
    });
}).use(errorHandler);


app.get('/etapas/:faseId/topicos/', function (req, res){
    var query = req.query;
    query.filters = {
       59845821: [parseInt(req.param("faseId"))]
    };    
    TopicosApp().itemsFilterItems({ body: query }, function(result) {
      sendResult(req, res, result);
    });
}).use(errorHandler);

app.get('/etapas/:faseId/modelos/', function (req, res){
    var query = req.query;
    query.filters = {
       59845619: [parseInt(req.param("faseId"))]
    };
    
    ModelosApp().itemsFilterItems({ body: query }, function(result) {
      sendResult(req, res, result);
    });  
}).use(errorHandler);

app.get('/etapas/:faseId/legislacao/', function (req, res){
    var query = req.query;
    query.filters = {
       60547038: [parseInt(req.param("faseId"))],
       62828818: [1]

    };
    ItensLegislativosApp().itemsFilterItems({ body: query }, function(result) {
      sendResult(req, res, result);
    });
}).use(errorHandler);

app.get('/etapas/:faseId/jurisprudencia/', function (req, res){
    var query = req.query;
    query.filters = {
       60547038: [parseInt(req.param("faseId"))],
       62828818: [2]

    };
    ItensJurisprudenciaApp().itemsFilterItems({ body: query }, function(result) {
      sendResult(req, res, result);
    });
}).use(errorHandler);

app.get('/etapas/:faseId/proposicao/', function (req, res){
    var query = req.query;
    query.filters = {
       60547038: [parseInt(req.param("faseId"))],
       62828818: [3]

    };
    ItensProposicoesApp().itemsFilterItems({ body: query }, function(result) {
      sendResult(req, res, result);
    });
}).use(errorHandler);

app.get('/emergencias/', function (req, res){
    EmergenciasApp().itemsFilterItems({ body: req.query }, function(result) {  
      sendResult(req, res, result);
    });
}).use(errorHandler);

app.get('/emergencias/test/', function (req, res){
  request.post({
    uri: 'http://api.infogreve.com.br:3001/emergencia/',
    headers: {'content-type' : 'application/x-www-form-urlencoded'},      
    body:  querystring.stringify({latlang: "-15.79211,-47.897751", titulo: "MPFT", email: "funci@mpft.com", telefone: "8888-2211", mensagem: "Ajude!"})
  });
}).use(errorHandler);


app.post('/emergencia/', function (req, res){
  local = request.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + req.body.latlang + '&sensor=true', function(error, response, body) {
    mapResult = JSON.parse(body);
    primeiraLocalizacao = null;
    if (mapResult.results.length > 0) {
      primeiraLocalizacao = {
                  city: mapResult.results[0].address_components[4].short_name, 
                  country: mapResult.results[0].address_components[6].short_name,
                  formatted: mapResult.results[0].formatted_address,
                  lat: mapResult.results[0].geometry.location.lat,
                  lng: mapResult.results[0].geometry.location.lng,
                  state: mapResult.results[0].address_components[5].long_name,
                  value: mapResult.results[0].formatted_address,
                }
    }
    newItem = {
          fields: { 
            titulo: req.body.infogreve_emergencia_nome, 
            email: req.body.infogreve_emergencia_email, 
            telefone: req.body.infogreve_emergencia_tel, 
            mensagem: req.body.infogreve_emergencia_mensagem,
            localizacao: primeiraLocalizacao
          }
        };
    EmergenciasApp().itemsAddNewItem(newItem, function(result) {
      var push = require( 'pushover-notifications' );
      var users = [
          '1bMNO9tXmwKvmnYhRqnp1DGWKry1ve'
        //, 'uHcW9agYVgmknsxPKJ5piNABUfcXnz'
      ];

      var p = new push( {
          user: '1bMNO9tXmwKvmnYhRqnp1DGWKry1ve',
          token: 'aEWBxFH1NXtLyiSdt9ckgUfTYn19cV',
          // onerror: function(error) {},
          update_sounds: true // update the list of sounds every day - will
          // prevent app from exiting.
      });
      var msg = {
        message: 'Emergência InfoGreve',
        title: newItem.fields.telefone + " (" + newItem.fields.titulo + ") pede ajuda pelo InfoGreve. E-mail: " + newItem.fields.email + " Mensagem: " + newItem.fields.mensagem,
        sound: 'Bike', // optional
        priority: 1 // optional,
      };

      for ( var i = 0, l = users.length; i < l; i++ ) {

        msg.user = users[i];
        // token can be overwritten as well.

        p.send( msg, function( err, result ) {
          if ( err ) {
            throw err;
          }

          res.send( result );
        });
      }
    }); // fim EmergenciasApp().itemsAddNewItem

  }); // fim request.get

}).use(errorHandler); //fim app.post




app.post('/emergenciaApp/', function (req, res){
  local = request.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + req.body.latlang + '&sensor=true', function(error, response, body) {
    mapResult = JSON.parse(body);
    primeiraLocalizacao = null;
    if (mapResult.results.length > 0) {
      primeiraLocalizacao = {
                  city: mapResult.results[0].address_components[4].short_name, 
                  country: mapResult.results[0].address_components[6].short_name,
                  formatted: mapResult.results[0].formatted_address,
                  lat: mapResult.results[0].geometry.location.lat,
                  lng: mapResult.results[0].geometry.location.lng,
                  state: mapResult.results[0].address_components[5].long_name,
                  value: mapResult.results[0].formatted_address,
                }
    }
    newItem = {
          fields: { 
            titulo: req.body.infogreve_emergencia_nome, 
            email: req.body.infogreve_emergencia_email, 
            telefone: req.body.infogreve_emergencia_tel, 
            mensagem: req.body.infogreve_emergencia_mensagem,
            localizacao: primeiraLocalizacao
          }
        };
    EmergenciasAppTest().itemsAddNewItem(newItem, function(result) {
      var push = require( 'pushover-notifications' );
      var users = [
          '1bMNO9tXmwKvmnYhRqnp1DGWKry1ve'
        //, 'uHcW9agYVgmknsxPKJ5piNABUfcXnz'
      ];
    }); // fim EmergenciasApp().itemsAddNewItem

  }); // fim request.get

}).use(errorHandler); //fim app.post





app.listen(process.argv[2]);
console.log("API InfoGreve pronta para receber requisições na porta " + process.argv[2]);


var mqtt = require('mqtt');

app.get('/mqtt/', function (req, res){
    client = mqtt.connect('mqtt://user:user@gostutz.com:61613');
  client.on('message', function (topic, message) {

    console.log(message);

  });

  client.subscribe('*');
  client.publish('presence', 'Hello mqtt');


  client.end();
  res.send("OK");
}).use(errorHandler);

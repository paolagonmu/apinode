
//catalog.js
/* Declaracion de constantes que se utilizan para requerir los modulos de node necesarios*/
const express = require('express');
const url = require('url');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const CacheControl = require("express-cache-control");
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const router = express.Router();

/* constantes que hacen una instancia de los archivos donde esta la logica del catalogo
 y la de la base de datos*/ 

const catalogV1 = require('../modules/catalogV1');
const catalogV2 = require('../modules/catalogV2');
const model = require('../model/item.js');

/* el CacheControl sirve para almacenar en cache una respuesta  del servidor
 por un período de tiempo definido*/ 
var cache = new CacheControl().middleware;

/*
passport.use(new BasicStrategy(function(username, password, done) {
if (username == 'user' && password=='default') {
return done(null, username);
}
}));
/*
passport.use(new BasicStrategy(
  function(username, password, done) {
  AuthUser.findOne({username: username, password: password},
  function(error, user) {
  if (error) {
  return done(error);
  } else {
  if (!user) {
  console.log('unknown user');
  return done(error);
  } else {
  console.log(user.username + 'authenticated successfully');
  return done(null, user);
  }
  }
  });
  })
  );
/*router.get('/v1/',
passport.authenticate('basic', { session: false }),
function(request, response, next) {
catalogV1.findAllItems(response);
});
router.get('/v2/',
passport.authenticate('basic', { session: false }),
function(request, response, next) {
catalogV1.findAllItems(response);
});
router.get('/',
passport.authenticate('basic', { session: false }),
function(request, response, next) {
catalogV1.findAllItems(response);
});
*/




/* TODAS LAS ENTRADAS DE RUTAS QUE RECIBIRA LA API EN LA  VERSION1*/

/*entradas de vizualizacion con el verbo GET mostrara todos los datos, 
datos segun un id y datos segun una categoria*/
router.get('/v1/', function(request, response, next) {
  catalogV1.findAllItems(response);
});
router.get('/v1/item/:itemId', function(request, response, next) {
  console.log(request.url + ' : querying for ' + request.params.itemId);
  catalogV1.findItemById(request.params.itemId, response);
});
router.get('/v1/:categoryId', function(request, response, next) {
  console.log(request.url + ' : querying for ' + request.params.categoryId);
  catalogV1.findItemsByCategory(request.params.categoryId, response);
});

/*entrada para ingresar un artiiculo en la version1*/
router.post('/v1/', function(request, response, next) {
  catalogV1.saveItem(request, response);
});

/*entrada para actualizar  un artiiculo en la version1*/
router.put('/v1/', function(request, response, next) {
  catalogV1.saveItem(request, response);
});

router.put('/v1/:itemId', function(request, response, next) {
  catalogV1.saveItem(request, response);
});

/*elimina el elemento segun el item ingresado*/
router.delete('/v1/item/:itemId', function(request, response, next) {
  catalogV1.remove(request, response);
});


/* TODAS LAS ENTRADAS DE RUTAS QUE RECIBIRA LA API EN LA  VERSION2*/

/*entradas de vizualizacion con el metodo GET*/
router.get('/v2/:categoryId', function(request, response, next) {
  console.log(request.url + ' : querying for ' + request.params.categoryId);
  catalogV2.findItemsByCategory(request.params.categoryId, response);
});

router.get('/v2/item/:itemId', function(request, response, next) {
  console.log(request.url + ' : querying for ' + request.params.itemId);
  var gfs = Grid(model.connection.db, mongoose.mongo);

  catalogV2.findItemById(gfs, request, response);
});

/*entrada para ingresar un artiiculo en la version2*/

router.post('/v2/', function(request, response, next) {
  catalogV2.saveItem(request, response);
});

/*entrada para actualizar  un artiiculo en la version2*/

router.put('/v2/', function(request, response, next) {
  catalogV2.saveItem(request, response);
});

router.put('/v2/:itemId', function(request, response, next) {
  catalogV1.saveItem(request, response);
});

/*elimina el elemento segun el item ingresado*/

router.delete('/v2/item/:itemId', function(request, response, next) {
  catalogV2.remove(request, response);
});



/*hace una redireccion  a la version2*/ 

router.get('/', function(request, response) {
  console.log('Redirecting to v2');
  response.writeHead(302, {'Location' : '/catalog/v2/'});
  response.end('Version 2 is is available at /catalog/v2/: ');
});

/* TODAS LAS ENTRADAS DE RUTAS QUE RECIBIRA LA API EN LA  VERSION2 PARA LAS IMAGENES*/

/*entradas de vizualizacion  de las iamgenes con el metodo GET*/

router.get('/v2/item/:itemId/image',
  function(request, response){
    var gfs = Grid(model.connection.db, mongoose.mongo);
    catalogV2.getImage(gfs, request, response);
});

router.get('/item/:itemId/image',
  function(request, response){
    var gfs = Grid(model.connection.db, mongoose.mongo);
    catalogV2.getImage(gfs, request, response);
});

/*entrada para ingresar una imagen asociada a un itemid en la version2*/

router.post('/v2/item/:itemId/image',
  function(request, response){
    var gfs = Grid(model.connection.db, mongoose.mongo);
    catalogV2.saveImage(gfs, request, response);
});

router.post('/item/:itemId/image',
  function(request, response){
    var gfs = Grid(model.connection.db, mongoose.mongo);
    catalogV2.saveImage(gfs, request.params.itemId, response);
});


/*entrada para actualizar  en la version2*/

router.put('/v2/item/:itemId/image',
  function(request, response){
    var gfs = Grid(model.connection.db, mongoose.mongo);
    catalogV2.saveImage (gfs, request.params.itemId, response);
});

router.put('/item/:itemId/image',
function(request, response){
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.saveImage(gfs, request.params.itemId, response);
});

/*eliminauna imagen  segun el item ingresado*/
  
router.delete('/v2/item/:itemId/image',
function(request, response){
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.deleteImage(gfs, model.connection,
  request.params.itemId, response);
});

router.delete('/item/:itemId/image',
function(request, response){
  var gfs = Grid(model.connection.db, mongoose.mongo);
  catalogV2.deleteImage(gfs, model.connection,  request.params.itemId, response);
});


router.get('/v2/', cache('minutes', 1), function(request, response) {
  var getParams = url.parse(request.url, true).query;
  if (getParams['page'] !=null || getParams['limit'] != null) {
  catalogV2.paginate(model.CatalogItem, request, response);
  } else {
  var key = Object.keys(getParams)[0];
  var value = getParams[key];
  catalogV2.findItemsByAttribute(key, value, response);
  }
  });
module.exports = router;

// app.js
// en este documento se expondra toda la logica para iniciar la api.
/* Declaracion de variables que se utilizan para requerir los modulos de node*/
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressPaginate = require('express-paginate');
var CacheControl = require("express-cache-control")

/* constantes que hacen una instancia de los archivos donde estan 
las rutas que va a requerir la api*/ 
var routes = require('./routes/index');
var catalog = require('./routes/catalog');
var cache = new CacheControl().middleware;

var app = express();
const cors = require('cors');

// ver la configuración del motor
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(expressPaginate.middleware(10, 100));

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

/* llamado de las rutas que se necesitan en la API */
app.use('/', routes);
app.use('/catalog', catalog);
app.use(expressPaginate.middleware(10,100));

 /*  Constantes para la documentacion requieren el moduelo de swagger y
 llama al archivo que realiza la documentacion.*/
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./static/swagger.json');

/** llamado de las rutas que se necesitan en la API para la documentacion */
app.use('/catalog/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/catalog/static', express.static('static'));


// poner 404 y reenviar a manejador de errores
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// manejadores de errores

// controlador de errores de desarrollo
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

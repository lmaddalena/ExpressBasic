"use strict"

// set up express
var express = require('express');
var app = express();

// set up handlebars
var handlebars = require('express3-handlebars').create({ defaultLayout: 'main', extname: '.hbs' });
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// =======================================================================================
// MIDDLEWARE
// =======================================================================================

// logger 
switch(app.get('env')){
    case 'development':
        app.use(require('morgan')('dev'));
        break;
    case 'production':
        app.use(require('express-logger')({
            path: __dirname + '/log/request.log'
        }))
        break;
};

// body parser (for handling form)
var bodyparser = require('body-parser');
app.use(bodyparser.json()); 
app.use(bodyparser.urlencoded({ extended: true }));

// cookie parser (for handling cookie)
var credentials = require('./credentials.js');
var cookieparser = require('cookie-parser');
app.use(cookieparser(credentials.cookieSecret));

// set up routes
var routes = require('./routes.js')(app);

// 500 error handler 
app.use(function(err, req, res, next){
    res.render('500', { message: err.message, error: err });
});

// 404 catch all handler. Must always placed at the end of pipeline
app.use(function(req, res, next){
    res.render('404', { url: req.url });
});

module.exports = app;
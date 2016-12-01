'use strict'
var express = require('express');

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var morgan = require('morgan');
var bodyParser = require('body-parser');
// var api = require('./api/api');
var dbConfig = require('./config/database.config.json');
var mongoService = require('./db/mongo.service');

var connectionString = "mongodb://"+dbConfig.mongodb.host+":"+dbConfig.mongodb.port+"/"+dbConfig.mongodb.dbname;

var app = express();

var handlebars = require('express3-handlebars').create({
	defaultLayout: 'main',
	extname: '.html',
});

app.engine('html', handlebars.engine);
app.set('view engine', 'html');

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({ secret: 'n2qv1994', 
				  cookie: { maxAge: 60000 },
				  resave: true, 
				  saveUninitialized: true, 
				  store: new MongoStore({ url: 'mongodb://localhost:27017/test' }) 
				  }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
// app.use(flash()); // use connect-flash for flash messages stored in session
// set api
// app.use('/api', api);
// set route link to home.html
// app.get('/home', function(req, res){
// 	res.sendFile(__dirname + "/views/home.html");
// });

// start connection mongodb and starting app

mongoService.connect(connectionString, function(err){
	console.log('connection string:\n' + connectionString);
	if(err){
		console.log('Unable to connect Mongo DB');
		process.exit(1);
	} else{
		app.use('/api', require('./api/api'));
		app.use(require('./routes/routes.js'));
		// var collection = mongoService.getConnection().collection('task');
		// console.log(collection);
		app.listen(app.get('port'), function(){
			console.log("application started on http://localhost:"+app.get('port')+";\n please press Ctrl+C to terminate");
		});
	}
});
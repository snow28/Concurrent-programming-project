var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
var assets = require('assert');

mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;
var url = 'mongodb://localhost/loginapp';
var router = express.Router();


var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

var gameInfo = {
    x : 4,
    y : 4
};

var GameScene = [];


// Global Vars
app.use(function (req, res, next) {
    res.locals.gameScene = GameScene;
    res.locals.username = users.Username;
    res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.test_msg = req.flash('test_msg');


  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


//Game Routing
app.use('/', routes);
app.use('/users', users);

app.get('/left', router);

router.get('/left',function(req,res){
    console.log(gameScene);
    //changing right column of game pixels
    if(gameInfo.x <= 6 ){
        for(var x=0; x<5; x++){
            var x2 =gameInfo.x+2;
            var y2 = gameInfo.y-2;
            gameInfo[2] = 'x';
        }
    }


    res.redirect('/');
});

app.get('/start',router);

router.get(('/start'),function(req, res){
    gameScene = [
        ['xxxxxxxxx'],
        ['xxxxxxxxx'],
        ['xxoooooxx'],
        ['xxomoooxx'],
        ['xxoopooxx'],
        ['xxoooooxx'],
        ['xxoooooxx'],
        ['xxxxxxxxx'],
        ['xxxxxxxxx']
    ];
    req.flash('success_msg', gameScene);
    res.redirect('/');
});



// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
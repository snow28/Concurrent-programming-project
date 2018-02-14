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


// Global Vars
app.use(function (req, res, next) {
    res.locals.score = req.flash('score');
    res.locals.gameScene = req.flash('gameScene');
    res.locals.username = users.Username;
    res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.test_msg = req.flash('test_msg');


  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);


        //------------------  STARTING GAME LOGIC  -------------

var mapTemplate = [
    [['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x']],
    [['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x']],
    [['x'],['x'],['Y'],['o'],['o'],['o'],['o'],['x'],['x']],
    [['x'],['x'],['o'],['o'],['o'],['o'],['o'],['x'],['x']],
    [['x'],['x'],['o'],['o'],['p'],['o'],['o'],['x'],['x']],
    [['x'],['x'],['o'],['o'],['o'],['o'],['o'],['x'],['x']],
    [['x'],['x'],['o'],['o'],['o'],['o'],['o'],['x'],['x']],
    [['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x']],
    [['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x'],['x']]
];

//we will use it to store current map
var currentTemplate = [];

var gameInfo = {
    x : 4,
    y : 4
};


//Staring the game by adding our map to the client-side variable
app.get('/start',router);
router.get(('/start'),function(req, res){
    currentTemplate = mapTemplate;
    req.flash('score' , 0);
    req.flash('gameScene', mapTemplate);
    res.redirect('/');
});



app.get('/left', router);

router.get('/left',function( req, res){
    var posX = gameInfo.x;
    var posY = gameInfo.y;
    if(gameInfo.x >= 3) {
        for (var x = 0; x < 5; x++) {
            currentTemplate[posY - 2 + x][posX + 2] = 'x';
        }
        if (gameInfo.x >= 2) {
            for (var x = 0; x < 5; x++) {
                currentTemplate[posY - 2 + x][posX - 3] = 'o';
            }
        }
        currentTemplate[posY][posX] = 'o';
        currentTemplate[posY][posX - 1] = 'p';


        gameInfo.x -= 1;
    }

    req.flash('gameScene', currentTemplate);
    res.redirect('/');
});

app.get('/right', router);

router.get('/right',function( req, res){
    var posX = gameInfo.x;
    var posY = gameInfo.y;
    if(gameInfo.x <= 6) {

        currentTemplate[posY][posX] = 'o';
        currentTemplate[posY][posX + 1] = 'p';
        gameInfo.x +=1;
    }


    req.flash('gameScene', currentTemplate);
    res.redirect('/');
});



                //------------------  END OF GAME LOGIC  -------------


// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});
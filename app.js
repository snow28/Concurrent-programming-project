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
    res.locals.gameError = req.flash('gameError');
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
    [['m'],['o'],['o'],['o'],['o'],['o'],['o'],['o'],['m']],
    [['o'],['o'],['o'],['o'],['o'],['o'],['o'],['m'],['o']],
    [['o'],['o'],['m'],['o'],['o'],['o'],['o'],['o'],['o']],
    [['o'],['o'],['o'],['o'],['o'],['o'],['o'],['o'],['o']],
    [['o'],['o'],['o'],['o'],['m'],['o'],['o'],['o'],['o']],
    [['o'],['o'],['o'],['o'],['o'],['o'],['o'],['o'],['o']],
    [['o'],['o'],['o'],['o'],['o'],['o'],['o'],['o'],['o']],
    [['o'],['o'],['o'],['o'],['o'],['o'],['m'],['o'],['o']],
    [['o'],['o'],['m'],['o'],['o'],['o'],['o'],['o'],['o']]
];

//we will use it to store current map
const startTemplate = [
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

var currentTemplate = [];

var gameInfo = {
    x : 4,
    y : 4
};


//Staring the game by adding our map to the client-side variable
app.get('/start',router);
router.get(('/start'),function(req, res){
    req.flash('score' , '0');
    currentTemplate = startTemplate;
    req.flash('gameScene',  startTemplate);
    res.redirect('/');
});



app.get('/left', router);

router.get('/left',function( req, res){
    if(gameInfo.x != 0) {
        if (gameInfo.x <= 6) {
            for (var x = 0; x < 5; x++) {
                if (gameInfo.y - 2 >= 0 && gameInfo.x + 2 >= 0 && gameInfo.y + 2 <= 8 && gameInfo.x + 2 <= 8) {
                    currentTemplate[gameInfo.y - 2 + x][gameInfo.x + 2] = 'x';
                }
            }
        }
        if (gameInfo.x >= 2) {
            for (var x = 0; x < 5; x++) {
                if (gameInfo.y - 2 >= 0 && gameInfo.x - 2 >= 0 && gameInfo.y + 2 <= 8 && gameInfo.x + 2 <= 8) {
                    currentTemplate[gameInfo.y - 2 + x][gameInfo.x - 3] = mapTemplate[gameInfo.y - 2 + x][gameInfo.x - 3];
                }
            }
        }
        currentTemplate[gameInfo.y][gameInfo.x] = mapTemplate[gameInfo.y][gameInfo.x];
        currentTemplate[gameInfo.y][gameInfo.x - 1] = 'p';
        gameInfo.x--;
        req.flash('gameScene', currentTemplate);
    }else{
        req.flash('gameError', 'You are at the edge of the universe, Press Start to continue game!');
    }
    res.redirect('/');
});

app.get('/right', router);

router.get('/right',function( req, res){
    if(gameInfo.x <=7){
        //правая стенка через один ряд
        if(gameInfo.x >= 2){
            for(var x=0;x<5;x++){
                if (gameInfo.y-2+x >= 0 && gameInfo.y-2+x <=8 &&  gameInfo.x-2 >= 0) {
                    currentTemplate[gameInfo.y - 2 + x][gameInfo.x - 2] = 'x';
                }
            }
        }
        if(gameInfo.x + 3 <= 8){
            for(var x=0;x<5;x++){
                if( gameInfo.y-2+x >= 0 && gameInfo.y-2+x <= 8 && gameInfo.x + 3 <= 8 ){
                    currentTemplate[gameInfo.y-2+x][gameInfo.x + 3] = mapTemplate[gameInfo.y-2+x][gameInfo.x + 3];
                }
            }
        }

        currentTemplate[gameInfo.y][gameInfo.x] = mapTemplate[gameInfo.y][gameInfo.x];
        currentTemplate[gameInfo.y][gameInfo.x + 1] = 'p';
        gameInfo.x++;
    }else{
        req.flash('gameError', 'You are at the edge of the universe, u cant go out, Press Start to continue game!');
    }

    req.flash('gameScene', currentTemplate);
    res.redirect('/');
});

app.get('/top', router);

router.get('/top',function( req, res){
    if(gameInfo.y >= 1){
        if(gameInfo.y <=6 ){
                for(var x=0; x<5; x++){
                    if (gameInfo.y + 2 <=8 && gameInfo.x-2+x>=0 &&  gameInfo.x-2+x <= 8 ) {
                        currentTemplate[gameInfo.y + 2][gameInfo.x - 2 + x] = 'x';
                    }
                }
        }
        if(gameInfo.y >= 2){
            for(x =0; x<5; x++){
                if (gameInfo.y - 3 >= 0 && gameInfo.x-2+x >=0 && gameInfo.x-2+x <= 8) {
                    currentTemplate[gameInfo.y - 3][gameInfo.x - 2 + x] = mapTemplate[gameInfo.y - 3][gameInfo.x - 2 + x];
                }
            }
        }

        currentTemplate[gameInfo.y][gameInfo.x] = mapTemplate[gameInfo.y][gameInfo.x];
        currentTemplate[gameInfo.y - 1][gameInfo.x] = 'p';
        gameInfo.y--;

    }else{
        req.flash('gameError', 'You are at the edge of the universe, u cant go out, Press Start to continue game!');
    }

    req.flash('gameScene', currentTemplate);
    res.redirect('/');
});

app.get('/bottom', router);

router.get('/bottom',function( req, res){
    if(gameInfo.y <= 7){
        if(gameInfo.y >= 2){
            for(var x=0;x<5;x++){
                if(gameInfo.y - 2 >= 0 && gameInfo.x-2+x >=0 && gameInfo.x-2+x <=8){
                    currentTemplate[gameInfo.y - 2][gameInfo.x - 2 + x] = 'x';
                }
            }
        }
        if(gameInfo.y + 3 <= 8){
            for(var x=0;x<5;x++){
                if(gameInfo.x-2+x >=0 && gameInfo.x-2+x <=8){
                    currentTemplate[gameInfo.y + 3][gameInfo.x - 2 + x] = mapTemplate[gameInfo.y + 3][gameInfo.x - 2 + x];
                }
            }
        }


        currentTemplate[gameInfo.y][gameInfo.x] = mapTemplate[gameInfo.y][gameInfo.x];
        currentTemplate[gameInfo.y +1 ][gameInfo.x] = 'p';
        gameInfo.y++;

    }else{
        req.flash('gameError', 'You are at the edge of the universe, u cant go out, Press Start to continue game!');
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
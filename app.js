let express = require('express')
let app = express()
let bodyParser = require('body-parser')
let mustacheExpress = require('mustache-express')
let path = require('path')
let expressValidator = require('express-validator')
let expressSession = require('express-session')
let passport = require('passport')
let LocalStrategy = require('passport-local').Strategy
let flash = require('express-flash-messages')

let config = require('config')
let mysql = require('mysql');

// session store
let MySQLStore = require('express-mysql-session')(expressSession);
let options = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gabble'
};

let sessionStore = new MySQLStore(options);

// express session
app.use(expressSession({
  secret: 'keyboard cat',
  saveUninitialized: false,
  store: sessionStore,
  resave: false
}))

// body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// mustache
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

// static public
app.use(express.static(__dirname + '/public'))

// passport
app.use(passport.initialize());
app.use(passport.session());

// validator
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

// flash
app.use(flash());

// locals
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// routes file
let mRoutes = require('./routes/mainRoutes')
app.use('/', mRoutes)

// server
app.listen(3000, function(){
  console.log("App running on port 3000")
})
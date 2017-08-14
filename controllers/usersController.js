
let User = require('../models/user')
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let bcrypt = require('bcryptjs')
let saltRounds = 10


exports.create = function(req, res, next) {

    

	let username = req.body.username;
	let password = req.body.password;
    let password2 = req.body.password2;

    console.log(username)
    console.log(password)
    console.log(password2)

    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req.checkBody('username', 'Username must be between 4-15 characters long.').len(4, 15);
    req.checkBody('password', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody("password", "Password must include one lowercase character, one uppercase character, a number, and a special character.").matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i");
    req.checkBody('password2', 'Password must be between 8-100 characters long.').len(8, 100);
    req.checkBody('password2', 'Passwords do not match, please try again.').equals(req.body.password);

    let errors = req.validationErrors()
    
    if(errors) {
        console.log(`errors: ${JSON.stringify(errors)}`)

        res.render("register", {title: "Registration Error", errors: errors})
    } else {
        let db = require('../db/db.js')
        
        bcrypt.hash(password, saltRounds, function(err, hash) {
            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], function(error, results, fields){
                if (error) throw error;



                db.query('SELECT LAST_INSERT_ID() as user_id', function(error, results, fields){
                    if (error) throw error;
                    let user_id = results[0]
                    console.log(results[0])
                    req.login(user_id, function(error) {
                        res.redirect('/')
                    })

                    res.render('register', {title: "Registration"})
                })
                
            })

        });
            

    }

} 


passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("local strategy")
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'Unknown User'});
            }
    
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    })
);
      
passport.serializeUser(
    function(user_id, done) {
        done(null, user_id)
    }
)

passport.deserializeUser(
    function(user_id, done) {
        done(null, user_id);
            
    }
)
      
      
exports.login = function(req, res, next) {
    console.log("got here")
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login',failureFlash: true})(req, res, next),
    function(req, res) {
        console.log("got past auth")
        res.redirect('/');
    }
}


exports.loginForm = function(req, res, next) {
    res.render("login")
}

exports.register = function(req, res, next) {


    res.render("register", {title: "Register"})
}
var express = require('express')
var router = express.Router()
let LocalStrategy = require('passport-local').Strategy
let gabsController = require('../controllers/gabsController')
let usersController = require('../controllers/usersController')
let bcrypt = require('bcryptjs')
let passport = require('passport')

// define the home page route
router.get('/', authenticationMiddleware(),gabsController.index)

router.get('/login', usersController.loginForm)

router.get('/gab/new', authenticationMiddleware(), gabsController.new)

router.post('/gab/new', authenticationMiddleware(), gabsController.create)

router.get('/gab/delete/:gab_id', authenticationMiddleware(), gabsController.delete)

router.get('/logout', function(req, res){
    req.logout()
    req.session.destroy()
    res.redirect('/')
})

router.get('/gab/like/:gab_id', gabsController.like)

router.get('/gab/show/:gab_id', gabsController.show)

router.post('/login', passport.authenticate(
    'local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }
))

router.get('/register', usersController.register)

router.post('/register', usersController.create)

function authenticationMiddleware() {
    return (req, res, next) => {
        console.log(`
            req.session.passport.user: ${JSON.stringify(req.session.passport)}
        `)

        if (req.isAuthenticated()) return next()

        res.redirect('/login')
    }
}

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log(username)
        console.log(password)

        let db = require('../db/db.js')

        db.query('SELECT id, password FROM users WHERE username = ?', [username], 
        function(err, results, fields){
            if(err) {done(err)}

            if(results.length === 0) {
                done(null, false)
            } else {
                let hash = results[0].password.toString()
                
                bcrypt.compare(password, hash, function(err, response) {
                    if(response === true) {
                        return done(null, {user_id: results[0].id, username: username})
                    } else {
                        return done(null, false)
                    }
                })

            } 

        })

    }
  ));


module.exports = router
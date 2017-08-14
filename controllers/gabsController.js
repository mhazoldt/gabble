let gab = require('../models/gab.js')
let user = require('../models/user.js')
let passport = require('passport');
let db = require('../db/db.js')

exports.index = function(req, res, next) {
    console.log(req.user)
    console.log(req.isAuthenticated())
    console.log("--index--")

    db.query('SELECT gab.id, users.username, gab.content, likes.id AS like_id, COUNT(*) AS like_count FROM gab LEFT OUTER JOIN users ON users.id = gab.author LEFT OUTER JOIN likes ON likes.gab_id = gab.id GROUP BY gab.id', function(error, results, fields) {
        if(error) throw error;
        console.log(results)

        let button = function() {
            let button = ""
            if(req.user.username === this.username) {
                return true
            } else {
                return false
            }
        }

        res.render("index", {gabs: results, button})
    })

}

exports.new = function(req, res, next) {
    console.log(req.user)
    console.log(req.isAuthenticated())

    res.render("gab_new")
}

exports.create = function(req, res, next) {
    console.log(req.user)
    console.log(req.isAuthenticated())

    db.query('INSERT INTO gab (author, content) VALUES (?, ?)', [req.user.user_id, req.body.gab], function(error, results, fields) {
        if(error) throw error;
        res.redirect('/')
    })
    
}

exports.delete = function(req, res, next) {
    console.log(req.user)
    console.log(req.isAuthenticated())

    db.query('SELECT author FROM gab WHERE id = ?', [req.params.gab_id], function(error, results, fields) {
        if(error) throw error;
        console.log("author of gab: ")
        console.log(results)
        console.log("req.user.user_id")
        console.log(req.user.user_id)
        if(results[0].author === req.user.user_id){
            db.query('DELETE FROM gab WHERE id = ?', [req.params.gab_id], function(error, results, fields) {
                if(error) throw error;
                console.log(results)
                res.redirect('/')
            })

        } else {
            console.log("no match")
            res.redirect('/')
        }
        
    })
    
}

exports.like = function(req, res, next) {
    console.log(req.user)
    console.log(req.isAuthenticated())

    db.query('INSERT INTO likes (user_id, gab_id) VALUES (?, ?)', [req.user.user_id, req.params.gab_id], function(error, results, fields) {
        // if(error) throw error;
        console.log("author of gab: ")
        console.log(results)
        console.log("req.user.user_id")
        console.log(req.user.user_id)
        res.redirect('/')
        
    })
}

exports.show = function(req, res, next) {
    console.log(req.user)
    console.log(req.isAuthenticated())

    db.query('SELECT gab.id, users.username, gab.content, likes.id AS like_id, COUNT(*) AS like_count FROM gab LEFT OUTER JOIN users ON users.id = gab.author LEFT OUTER JOIN likes ON likes.gab_id = gab.id WHERE gab.id = ? GROUP BY gab.id', [req.params.gab_id], function(error, gab_results, fields) {
        // if(error) throw error;
        console.log("--show--")
        console.log(gab_results[0])
        console.log("req.user.user_id")
        console.log(req.user.user_id)


        db.query('SELECT users.username FROM gabble.likes JOIN users ON users.id = likes.user_id WHERE likes.gab_id = ?', [req.params.gab_id], function(error, likes_results, fields) {


            let button = function() {
                let button = ""
                if(req.user.username === this.username) {
                    return true
                } else {
                    return false
                }
            }
            console.log('likes_results')
            console.log(likes_results)
    
            res.render('show', {gab: gab_results[0], likes: likes_results,button})

        })
        
    })
}
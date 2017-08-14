let bcrypt = require('bcryptjs')



module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash
            newUser.save(callback)
        })
    })
}

module.exports.getUserByUsername = function(username, callback) {
    let query = {username: username}
    User.findOne(query, callback)
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback)
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if(err) throw err
        callback(null, isMatch)
    })
}

module.exports.getAllUsers = function(res, callback) {
    User.find({}, function(err, users) {
        callback(res, users)
    })
    
}
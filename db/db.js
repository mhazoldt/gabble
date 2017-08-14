let mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : 'localhost',
  database: 'gabble',
  user     : 'root',
  password : ''
});

module.exports = connection
const mysql = require('mysql');
const config = require('./config');

// Create the db connection
var db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.pwd,
    database:   config.mysql.db
});
db.connect();

// Export
module.exports = db;
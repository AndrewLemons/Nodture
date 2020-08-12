const express = require('express');
const helmet = require('helmet');
const fs = require('fs');

// Config
const config = require('./config');

// Database
const db = require('./database');

// Create required tables if they don't already exist
db.query('CREATE TABLE IF NOT EXISTS photos (id INT AUTO_INCREMENT PRIMARY KEY, uuid TEXT NOT NULL, type TEXT NOT NULL)');

// Create required dirs if they don't already exist
if (!fs.existsSync(config.storageDir)) {
    fs.mkdirSync(config.storageDir);
}
if (!fs.existsSync(`${config.storageDir}/photos`)) {
    fs.mkdirSync(`${config.storageDir}/photos`);
}

// Create the Express app
const app = express();
app.set('view engine', 'ejs'); // Use EJS renderer
app.use(helmet()); // Use Helmet
app.use(express.static('public')); // Use public as static dir

// Routes
const apiRoute = require('./routes/api');
app.use('/api', apiRoute);
const photosRoute = require('./routes/photos');
app.use('/photos', photosRoute);

// Redirect '/' to the actual index '/photos'
app.get('/', (req, res) => {
    res.status(301).redirect('/photos'); // Redirect
});

// Start the server
app.listen(config.port);
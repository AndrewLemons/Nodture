const express = require('express')
const formidable = require('formidable');
const mysql = require('mysql')
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Settings
var config = require('./config');

// Create the db connection
var db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.pwd,
    database:   config.mysql.db
});
db.connect();

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
app.use(express.static('public')); // Use public as static dir

// Index
app.get('/', (req, res) => {
    res.render('index');
});

// Upload
app.get('/upload', (req, res) => {
    res.render('upload');
});

// Manage uploads
app.post('/upload', (req, res) => {
    const form = formidable({
        multiples: true
    });

    // Parse the form data
    form.parse(req, (err, fields, files) => {
        // Handle errors
        if (err) {
            res.status(500).render('upload-status', {
                'error': 'Server failed to process images.'
            });
            return;
        }

        var yes = no = 0;

        // Handle the image(s)
        if (Array.isArray(files.images)) {
            // Loop through the recived images
            for (var file of files.images) {
                // Save the recived image
                saveImage(file.path, file.type) ? yes += 1 : no += 1;
            }
        } else {
            // Save the recived image
            saveImage(files.images.path, files.images.type) ? yes += 1 : no += 1;
        }

        res.render('upload-status', {
            'yes': yes,
            'no': no
        });
    });
});

app.get('/photos', (req, res) => {
    db.query('SELECT uuid FROM photos;', function (error, results, fields) {
        var photos = [];
        for (var data of results) {
            photos.push(data.uuid);
        }
        res.send(photos);
    });
});

app.get('/photos/:uuid', (req, res) => {
    res.sendFile(`${config.storageDir}/photos/${req.params.uuid}`);
});

// Start the server
app.listen(config.port, () => {
    console.log(`Nodture running on port ${config.port}`);
});

// Function to save images sent to the server
function saveImage(path, type) {
    if (type != 'image/png' && type != 'image/jpeg') { return false; }

    var uuid = uuidv4();
    fs.renameSync(path, `${config.storageDir}/photos/${uuid}`);
    db.query(`INSERT INTO photos (uuid, type) VALUES ('${uuid}', '${type}');`);

    return true;
}

process.on('exit', (code) => {
    console.log("Stopping Nodture...");
    db.end();
});
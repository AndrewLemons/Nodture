const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
var config = require('../config');
var db = require('../database');

// Setup express
var router = express.Router();

// API status
router.get('/', (req, res) => {
    res.json({
        "status": "active"
    });
});

// Get photo UUIDs
router.get('/photos', (req, res) => {
    // Query stored photo UUIDs
    db.query('SELECT uuid FROM photos;', function (error, results, fields) {
        // Handle errors
        if (error) {
            res.sendStatus(500);
        }

        // Parse results and send to client
        var photos = [];
        for (var data of results) {
            photos.push(data.uuid);
        }
        res.status(200).json(photos); // OK
    });
});

// Upload photo(s)
router.post('/photos', (req, res) => {
    const form = formidable({
        multiples: true
    });

    // Parse the form data
    form.parse(req, (err, fields, files) => {
        // Handle errors
        if (err) {
            res.sendStatus(500); // Server error
            return;
        }

        // Handle the photo(s)
        if (Array.isArray(files.photos)) {
            // Loop through the recived photos
            for (var file of files.photos) {
                // Save the recived photo
                savePhoto(file.path, file.type);
            }
        } else {
            // Save the recived photo
            savePhoto(files.photos.path, files.photos.type);
        }

        res.sendStatus(201); // OK
    });
});

// Get photo file
router.get('/photos/:uuid', (req, res) => {
    // Send the file
    res.sendFile(`${config.storageDir}/photos/${req.params.uuid}`);
});

// Delete photo
router.delete('/photos/:uuid', (req, res) => {
    // Delete from db
    db.query(`DELETE FROM photos WHERE uuid = '${req.params.uuid}';`);
    // Delete file
    fs.unlinkSync(`${config.storageDir}/photos/${req.params.uuid}`);
    // Send OK
    res.sendStatus(200);
});

// Function to save photos
function savePhoto(path, type) {
    // Verify the photo type is valid
    if (type != 'image/png' && type != 'image/jpeg') {
        return false;
    }

    // Save the photo to db and file
    var uuid = uuidv4();
    fs.renameSync(path, `${config.storageDir}/photos/${uuid}`);
    db.query(`INSERT INTO photos (uuid, type) VALUES ('${uuid}', '${type}');`);

    return true;
}

module.exports = router;
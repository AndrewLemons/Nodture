const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Config
const config = require('../config');

// Database
var db = require('../database');

// Router
var router = express.Router();

router.post('/', (req, res) => {
    const form = formidable({
        multiples: true
    });

    // Parse the form data
    form.parse(req, (err, fields, files) => {
        // Handle errors
        if (err) {
            res.status(500).redirect('/');
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

        res.status(200).redirect('/');
    });
});

// Function to save images sent to the server
function saveImage(path, type) {
    if (type != 'image/png' && type != 'image/jpeg') { return false; }

    var uuid = uuidv4();
    fs.renameSync(path, `${config.storageDir}/photos/${uuid}`);
    db.query(`INSERT INTO photos (uuid, type) VALUES ('${uuid}', '${type}');`);

    return true;
}

module.exports = router;
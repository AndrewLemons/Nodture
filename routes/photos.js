const express = require('express');
const fs = require('fs');

var router = express.Router();

// Config
var config = require('../config');

// Database
var db = require('../database');
const { fstat } = require('fs');

router.get('/', (req, res) => {
    db.query('SELECT uuid FROM photos;', function (error, results, fields) {
        var photos = [];
        for (var data of results) {
            photos.push(data.uuid);
        }
        res.send(photos);
    });
});

router.get('/:uuid', (req, res) => {
    res.render('photos/preview', {"uuid": req.params.uuid});
});

router.get('/:uuid/file', (req, res) => {
    res.sendFile(`${config.storageDir}/photos/${req.params.uuid}`);
});

router.delete('/:uuid', (req, res) => {
    db.query(`DELETE FROM photos WHERE uuid = '${req.params.uuid}';`);
    fs.unlinkSync(`${config.storageDir}/photos/${req.params.uuid}`);
    res.sendStatus(200);
})

module.exports = router;
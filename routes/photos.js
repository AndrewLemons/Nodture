const express = require('express');
const fs = require('fs');
var db = require('../database');

// Setup express
var router = express.Router();

// Get home index
router.get('/', (req, res) => {
    res.render('index');
});

// Preview photo
router.get('/:uuid', (req, res) => {
    res.render('preview', {
        "uuid": req.params.uuid
    });
});

module.exports = router;
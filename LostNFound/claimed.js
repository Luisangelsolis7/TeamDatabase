let express = require('express');
let router = express.Router();
let db = require('../database');
// another routes also appear here
// this script to fetch data from MySQL databse table
router.get('/claimed-list', function(req, res, next) {
    let sql = 'SELECT * FROM found';
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        res.render('found-list', { title: 'Found List', userData: data});
    });
});
module.exports = router;
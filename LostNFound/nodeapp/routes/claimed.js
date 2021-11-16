var express = require('express');
var router = express.Router();
var db=require('../database');

router.get('/claimed', function(req, res, next) {
    var sql='SELECT * FROM Found';
    db.query(sql, function (err, data, fields) {
        if (err) throw err;
        //name of view file in res.render
        res.render('Claimed', { title: 'Claimed List', userData: data});
    });
});
module.exports = router;
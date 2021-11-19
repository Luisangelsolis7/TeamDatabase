var express = require('express');
var router = express.Router();
var db=require('../database');
// another routes also appear here
// this script to fetch data from MySQL databse table
//router.get looks for words in url
router.get('/unclaimed', function(req, res, next) {
  var sql='SELECT * FROM Item';
  db.query(sql, function (err, data, fields) {
    if (err) throw err;
    //name of view file in res.render
    res.render('unclaimed', { title: 'Unclaimed List', userData: data});
  });
});
module.exports = router;
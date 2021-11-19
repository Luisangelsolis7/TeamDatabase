var express = require('express');
var router = express.Router();
var db=require('../database');

router.get('/claimed', function(req, res, next) {
res.render("Claimed",{title:"Claimed"});
});
module.exports = router;
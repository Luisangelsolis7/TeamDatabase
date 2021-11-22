var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/itemform', function(req, res, next) {
    res.render('itemform', { title: 'Lost And Found' });
});

module.exports = router;
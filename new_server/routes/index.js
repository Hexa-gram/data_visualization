var express = require('express');
var router = express.Router();

router.get('/pie', function (req, res, next) {
  res.render('pies');
});

router.get('/bar', function (req, res, next) {
  res.render('bar');
})

router.get('/table', function (req, res, next) {
  res.render('table');
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect('/table');
});

module.exports = router;
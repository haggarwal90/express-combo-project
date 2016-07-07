var express = require('express');
var router = express.Router();
var sf = require('./../lib/salesforce');

/* GET home page. */
/*
router.get('*', function(req, res) {
  res.renderFile('./views/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
*//*
router.get('*', function(req, res, next) {
  res.render('index');
});*/

router.get('/', function(req, res, next) {
  res.send('respond with a api resource');
});

router.get('/salesObject', function(req, res,next) { //isthe next important here? I dont think so because we are usinf send but plz check
  var sf = res.app.get('sf');
  sf.getSObejctTypes(function(result) {
    res.status(200).send(result);
  },function(err) {
    console.log(err)
  })
});

router.get('/mongoObject', function(req, res, next) {
  var mongoObj = res.app.get('mongoObj');
  var mObj = [];
  for(var key in mongoObj) {
    mObj.push(key);
  }
  res.status(200).send(mObj);
});

router.get('/config', function(req, res, next) {
  var sfconfig = res.app.get('salesmongoconfig');
  res.status(200).send(sfconfig);
});

module.exports = router;

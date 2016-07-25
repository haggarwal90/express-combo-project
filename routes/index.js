var express = require('express');
var router = express.Router();
var sf = require('./../lib/salesforce');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var Q = require('q');
var fs = require('fs');

/* GET home page. */
/*
 router.get('*', function(req, res) {
 res.renderFile('./views/index.html'); // load the single view file (angular will handle the page changes on the front-end)
 });
 *//*
 router.get('*', function(req, res, next) {
 res.render('index');
 });*/

router.get('/', function (req, res, next) {
  res.send('respond with a api resource');
});

router.get('/salesObjects', function (req, res, next) { //isthe next important here? I dont think so because we are usinf send but plz check
  var sf = res.app.get('sf');
  sf.getSObejctTypes(function (result) {
    res.status(200).send(result);
  }, function (err) {
    console.log(err)
  })
});

router.get('/mongoObjects', function (req, res, next) {
  var mongoObj = res.app.get('mongoObj');
  var mObj = [];
  for (var key in mongoObj) {
    mObj.push(key);
  }
  res.status(200).send(mObj);
});

router.get('/mongoObjectsIds', function (req, res, next) {
  var mongoObj = res.app.get('mongoObj');
  res.status(200).send(mongoObj);
});

router.get('/config', function (req, res, next) {
  var sfconfig = res.app.get('salesmongoconfig');
  res.status(200).send(sfconfig);
});

router.get('/salesObjects/:objectName/attributes', function (req, res, next) { //isthe next important here? I dont think so because we are usinf send but plz check
  var saf = res.app.get('sf');
  var objName = req.params.objectName;
  var p = getSalesObject(saf, objName);
  p.then(function(data) {
    //console.log('data isss'+JSON.stringify(data))
    res.status(200).json(data);
  })
  /*sf.getSObjectAttribs(objName, function (result) {
    res.status(200).send(result);
  }, function (err) {
    console.log(err)
  })*/
});

router.get('/mongoObjects/:objectName/:objId', function (req, res, next) { //isthe next important here? I dont think so because we are usinf send but plz check
  var db = res.app.get('database');
  var objName = req.params.objectName;
  var objId = req.params.objId;
  var p = getMongoObject(db, objName, objId);
  p.then(function(data) {
    //console.log('data isss'+JSON.stringify(data))
    res.status(200).json(data);
  })

  /*db.collection(objName).find({_id: new ObjectID(objId)}).toArray(function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(data[0]);
    }
  })*/

});

router.post('/attributes', function (req, res, next) {
  var body = req.body;
  var db = res.app.get('database');
  var saf = res.app.get('sf');
  var mongoObj = res.app.get('mongoObj');
  var promise1 = [];
  var promise2 = [];
  /*var objName = req.params.objectName;
  var objId = req.params.objId;*/
  console.log('body is ' + JSON.stringify(body))
  for (var i = 0; i < body.length; i++) {
    var temp = body[i];
    var salesTemp = temp.salesObjects[0];
    var mongoTemp = temp.mongoObjects[0];
    var objName = mongoTemp;
    var objId = mongoObj[mongoTemp];
    var SobjName = salesTemp;
    var p1 = getMongoObject(db, objName, objId);
    promise1.push(p1);
    var p2 = getSalesObject(saf, SobjName);
    promise2.push(p2);
    /*expresSales.mongoObjId().then(function (data) {
      console.log('data is ' + JSON.stringify(data.data));
      if (data.data[mongoTemp]) {
        console.log('data.data[mongoTemp] ' + data.data[mongoTemp])
        var p1 = expresSales.mongoObjAttr(mongoTemp, data.data[mongoTemp]);
        var p2 = expresSales.salesObjAttr(salesTemp);
        $q.all([p1, p2]).then(function (result) {
          console.log('after p1 and p2 is '+JSON.stringify(result));
        }, function (error) {
          console.log(error);
        })
      } else {
        console.log('No match')
      }


    }, function (error) {

    })*/
  }
  Q.all(promise1).then (function(result1){
    Q.all(promise2).then(function(result2){
      for(var v = 0; v < body.length; v++) {
        var matr = [];
        var satr = [];
        for(var key in result1[v]) {
          matr.push(key);
        }
        body[v].mongoAttributes = matr;
        for(var i = 0; i < result2[v].length; i++) {
          satr.push(result2[v][i].name);
        }
        body[v].salesAttributes = satr;
        body[v].selectedOption = {
            "selectedSales" : satr[0],
            "selectedMongo" : matr[0]
        }
      }
      res.status(200).send(body);
    })
  })

});

router.post('/savemappings', function (req, res, next) {
  var body = req.body;
  var filePath = __dirname + '/test.txt';
  console.log('filepath is '+filePath);
  fs.open(filePath,'a+',function(err,fd) {
    fs.write(fd, JSON.stringify(body) ,null,  'utf8', function() {
      fs.close(fd, function(){
        console.log('file closed');
        res.status(200).send('Writting completed');
      });
    })
  })
});

function getMongoObject(db, objName, objId) {
  var q = Q.defer();
  try {
    db.collection(objName).find({_id: new ObjectID(objId)}).toArray(function (err, data) {
      if (err) {
        console.log(err);
        q.reject(err);
      } else {
        //console.log(JSON.stringify(data[0]));
        q.resolve(data[0]);
      }
    })
  } catch (e) {
    q.reject(e);
  } finally {
    return q.promise;
  }

};

function getSalesObject(saf, objName) {
  var q = Q.defer();
  try {
    saf.getSObjectAttribs(objName, function (result) {
      //console.log(JSON.stringify(result));
      q.resolve(result)
    }, function (err) {
      q.reject(err)
    })
  } catch (e) {
    q.reject(e);
  } finally {
    return q.promise;
  }

}
module.exports = router;
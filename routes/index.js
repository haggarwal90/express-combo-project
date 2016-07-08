var express = require('express');
var router = express.Router();
var sf = require('./../lib/salesforce');
var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;

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
    var sf = res.app.get('sf');
    var objName = req.params.objectName;
    sf.getSObjectAttribs(objName, function (result) {
        res.status(200).send(result);
    }, function (err) {
        console.log(err)
    })
});

router.get('/mongoObjects/:objectName/:objId', function (req, res, next) { //isthe next important here? I dont think so because we are usinf send but plz check
    var db = res.app.get('database');
    var objName = req.params.objectName;
    var objId = req.params.objId;

    db.collection(objName).find({_id: new ObjectID(objId)}).toArray(function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(data[0]);
        }
    })

});

router.post('/attibutes', function (req, res, next) {
    var body = req.body;
    console.log('body is ' + JSON.stringify(body))
    for (var i = 0; i < body.length; i++) {
        var temp = body[i];
        var salesTemp = temp.salesObjects[0];
        var mongoTemp = temp.mongoObjects[0];
        expresSales.mongoObjId().then(function (data) {
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

        })
    }
    res.status(200).send('Hello , i m post ')

    function
});
module.exports = router;

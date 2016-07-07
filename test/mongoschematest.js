var mdm = require('./../lib/mongomdm');
var Q = require('q');
var conf = require('./../config/monogobjects.json');
var http = require('http');

var options = {
    host: '127.0.0.1',
    path: '/salesmongo/LastSync/?_id=5729dff6a41faabcac58aa81',
    //since we are listening on a custom port, we need to specify it by hand
    port: '28017',
    //This is what changes the request to a POST request
    method: 'GET'
};

callback = function(response) {
    var str = ''
    response.on('data', function (chunk) {
        str += chunk;
    });

    response.on('end', function () {
        console.log(str);
    });
}

var req = http.request(options, callback);
//This is the data we are posting, it needs to be a string or a buffer
req.write("hello world!");
req.end();

/*mongoose.connect('mongodb://localhost:27017/salesmongoMIM', function(err, db){

for(var key in conf) {
    console.log(key+ ' Key '+ conf[key]);

}


})*/

/*var ObjectId = require('mongodb').ObjectID;

var promices = [];
var sch = {};
config = {
    "url" : "mongodb://localhost:27017/salesmongoMIM"
}
mdm.init(config).then(function(res) {
   /!* console.log(conf.LastSync);
    //{_id : conf.LastSync}
    mdm.getDocumnets(mdm.db,'LastSync',{_id : ObjectId(conf.LastSync)}, false).then(function(res) {
        console.log(res)
    },function(err) {
        console.log(err)
    })*!/
    for(var key in conf) {
        console.log(key+ ' Key '+ conf[key]);
        var p = mdm.getDocumnets(mdm.db, key,{_id : ObjectId(conf[key])}, false);
        promices.push(p);
    }
    Q.all(promices).then(function(res) {
        console.log(res);
        var s = schemaDeveloper(res, conf);
        console.log(s);
    })


    function schemaDeveloper(data, conf){
        var count = 0;
        var temp ;
        for(var key in conf) {
            temp = data[0][count];
            sch[key] = [];
            for(var att in temp) {
                sch[key].push(att);
            }
            count++;
        }
        return sch;
    }
})*/



/*
function getRecord(db, id) {
    try {
        var d = Q.defer();
    } catch(e) {
        console.log(e);
        d.reject(e);
    } finally {
        return d.promise();
    }

}*/

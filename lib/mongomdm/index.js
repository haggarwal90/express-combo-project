var MongoClient = require('mongodb').MongoClient;
var Q = require('q');

var self = {
    url: null,
    db: null,

    init: function (config) {
        var d = Q.defer();
        try {
            self.url = config.url;
            MongoClient.connect(self.url, function (err, db) {
                if (err) {
                    console.log("Connection error");
                    d.reject(false);
                }
                if (db) {
                    console.log("Connected correctly to client server.");
                    self.db = db;
                    d.resolve(true)
                }
            });
        } catch (e) {
            d.reject(false);
            console.log(e);
        } finally {
            return d.promise;
        }
    },

    upsertDocuments: function (data, cname, smflag, callback) {
        var d = Q.defer();
        try {
            var promises = [];

            for (var i = 0; i < data.length; i++) {
                console.log('record is:' + JSON.stringify(data[i].salesId));
                var p = upsertCollection(data[i]);
                promises.push(p);
            }

            Q.all(promises).then(function (res) {
                console.log("upsertDocuments completed");
                d.resolve(true);
            })

            function upsertCollection(record) {
                var def = Q.defer();
                var ob;
                try {
                    if (!cname) {
                        cname = record.type
                    }
                    if (smflag) { //update from sales to mongo
                        ob = {"salesId": record.salesId}
                    } else { // update salesId in mongo
                        ob = {"_id": record.id}
                    }

                    var proj = record;
                    var d = {$set: proj};
                    self.db.collection(cname).update(ob, d, {upsert: true}, function (err, result) {
                        if (err) {
                            def.reject(err);
                            console.log('error is ::' + err);
                        }
                        if (result) {
                            def.resolve(result);
                            console.log('result is::' + JSON.stringify(result));
                        }
                        console.log("Upsert into the collections.");
                    });
                } catch (e) {
                    def.reject(err);
                    console.log(e);
                } finally {
                    return def.promise;
                }
            }
        } catch (e) {
            d.reject(false);
            console.log(e);
        } finally {
            return d.promise;
        }
    },

    insertDocuments: function (db, cname, data) {
        var d = Q.defer();
        try {
            db.collection(cname).insert(data, function (err, result) {
                if (err) {
                    d.reject(err);
                    console.log("error in insertion, " + err);
                } else {
                    console.log('result is ' + result);
                    console.log("Inserted a document in " + cname);
                    d.resolve(result);
                    //callback(result);
                }
            });
        } catch (e) {
            d.reject(e);
            console.log("error in insertion, " + e);
        } finally {
            return d.promise;
        }

    },

    deleteDocuments: function (db, cname, data, callback) {
        var d = Q.defer();
        try {
            db.collection(cname).remove(data, function (err, result) {
                if (err) {
                    d.reject(err);
                    console.log("Error in deletion, " + err);
                } else {
                    console.log('result is ' + result);
                    console.log("Removed the document from " + cname);
                    d.resolve(result);
                    if (callback) {
                        callback(result);
                    }
                }
            });
        } catch (e) {
            d.reject(e);
            console.log("error in deletion, " + e.stack);
        } finally {
            return d.promise;
        }
    },

    getDocumnets: function (db, cname, criteria, projection) {
        var d = Q.defer();
        try {
            if (projection && criteria) {
                db.collection(cname).find(criteria, projection).toArray(function (err, result) {
                    if (err) {
                        d.reject(err);
                        console.log("Error in finding, " + err);
                    } else {
                        console.log('result is ' + JSON.stringify(result));
                        console.log("found from the document " + cname);
                        d.resolve(result);
                    }
                })
            } else if (projection) {
                db.collection(cname).find({}, projection).toArray(function (err, result) {
                    if (err) {
                        d.reject(err);
                        console.log("Error in finding, " + err);
                    } else {
                        console.log('result is ' + JSON.stringify(result));
                        console.log("found from the document " + cname);
                        d.resolve(result);
                    }
                })
            } else if (criteria) {
                db.collection(cname).find(criteria).toArray(function (err, result) {
                    if (err) {
                        d.reject(err);
                        console.log("Error in finding, " + err);
                    } else {
                        console.log('result is ' + JSON.stringify(result));
                        console.log("found from the document " + cname);
                        d.resolve(result);
                    }
                })
            } else {
                db.collection(cname).find().toArray(function (err, result) {
                    if (err) {
                        d.reject(err);
                        console.log("Error in finding, " + err);
                    } else {
                        console.log('result is ' + JSON.stringify(result));
                        console.log("found from the document " + cname);
                        d.resolve(result);
                    }
                })
            }
        } catch (e) {
            d.reject(e);
            console.log("error in deletion, " + e.stack);
        } finally {
            return d.promise;
        }


    },

    updateDocument: function (db, id, record, cname, smflag, callback) {
        var d = Q.defer();
        var ob;
        try {
            if (!cname) {
                cname = record.type
            }
            if (smflag) {
                ob = {"salesId": record.salesId}
            } else {
                ob = {"_id": record.id}
            }
            if (!db) {
                db = self.db;
            }
            db.collection(cname).update(id, record, function (err, result) {
                if (err) {
                    d.reject(err);
                    console.log('error is ::' + err);
                }
                if (result) {
                    d.resolve(result);
                    console.log('result is::' + JSON.stringify(result));
                }
                console.log("Updated into the collections.");
            });
        } catch (err) {
            d.reject(err);
            console.log(err);
        } finally {
            return d.promise;
        }
    }

}
module.exports = self;


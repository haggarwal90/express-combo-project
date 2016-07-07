var sf = require('node-salesforce');
var Q = require('q');
var _ = require('lodash');
var soap = require('soap');

var self = {
    _sfdetails: {},
    _batchsize: 200,
    _initialized: false,
    init: function (config, callback) {
        if (config == null && self._sfdetails.config) {
            config = self._sfdetails.config;
        } else {
            self._sfdetails.config = config;
        }

        if (self._initialized) {
            initComplete();
            return;
        }

        console.log('initializing salesforce...');
        var conn = new sf.Connection({
            // you can change loginUrl to connect to sandbox or prerelease env.
            loginUrl: config.loginUrl
        });

        conn.login(config.user, config.password, function (err, userInfo) {
            if (err) {
                return console.error(err);
            }

            self._sfdetails.conn = conn;
            self._initialized = true;
            //_sfdetails.userInfo = userInfo;

            // Now you can get the access token and instance URL information.
            // Save them to establish connection next time.
            console.log(conn.accessToken);
            console.log(conn.instanceUrl);
            // logged in user property
            console.log("User ID: " + userInfo.id);
            console.log("Org ID: " + userInfo.organizationId);
            // ...

            initComplete();
        });

        function initComplete() {
            if (callback) {
                callback();
            }
        }
    },

    isInitialized: function () {
        return self._initialized;
    },

    getSObejctTypes: function(callback, errorCallback) {
        var def = Q.defer();

        self.describeGlobal(function(data) {
            var objects = [];
            _.forEach(data.sobjects, function(sobject) {
                objects.push(sobject.name);
            });

            if (callback) {
                callback(objects);
            }

            def.resolve(objects);
        }, errorCallback);

        return def.promise;
    },

    getSObjectAttribs: function(type, callback, errorcallback) {
        var def = Q.defer();
        var fields = [];

        self.describe(type, function(data) {
            _.forEach(data.fields, function(field) {
                fields.push({name: field.name, type: field.type, deprecated: field.deprecatedAndHidden});
            });

            if (callback) {
                callback(fields);
            }

            def.resolve(fields);
        });
        return def.promise;
    },

    describe: function(type, callback, errorCallback) {
        var def = Q.defer();
        self._sfdetails.conn.describe(type, function (err, res) {
            if (err) {
                console.error(err);
                if (errorCallback) {
                    errorCallback(err);
                }
                def.reject(err);
            }
//            console.log('describe: ' + JSON.stringify(res, null, 2));

            if (callback) {
                callback(res);
            }
            def.resolve(res)
        });

        return def.promise;
    },

    describeGlobal: function(callback, errorCallback) {
        var def = Q.defer();
        self._sfdetails.conn.describeGlobal(function (err, res) {
            if (err) {
                console.error(err);
                if (errorCallback) {
                    errorCallback(err);
                }
                def.reject(err);
            }
//            console.log('describeGlobal: ' + JSON.stringify(res, null, 2));
//            console.log('Num of SObjects : ' + res.sobjects.length);

            if (callback) {
                callback(res);
            }
            def.resolve(res)
        });

        return def.promise;
    },

    _processErrors: function(err, fn, args) {
        console.error(err);
        if (err.errorCode == 'INVALID_SESSION_ID') {
            self.init(null, function() {
                fn.apply(self, args);
            })
        } else {
            return;
        }
    },

    _log: function(op, err, results) {
        if (err) { return console.error(err, results); }

        var successes = [];
        var errors = [];
        if (_.isArray(results)) {
            _.forEach(results, function(result) {
               if (result.success) {
                   successes.push(result);
               } else {
                   errors.push(result);
               }
            });
        } else {
            if (results.success) {
                successes.push(result);
            } else {
                errors.push(result);
            }
        }

        if (successes.length > 0) {
            console.log(op + ' success count: ' + successes.length);
//            console.log(op + ' success results: ' + JSON.stringify(successes, null, 2));
        } else if (errors.length > 0) {
            console.log(op + ' errors count: ' + successes.length);
            console.log(op + ' error results: ' + JSON.stringify(errors, null, 2));
        }
    }
}

module.exports = self;
angular.module("salesApp", ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                controller: 'salesController',
                templateUrl: "all_configuration.html"

            })
            .when('/objectmapping', {
                controller: 'salesObjectMapper',
                templateUrl: 'objectmapping.html'
            })

            .when('/attributemapping', {
                controller: 'salesAttrMapper',
                templateUrl: 'attributemapping.html'
            })

            .otherwise({
                redirectTo: "/"
            })
    })

    .factory('expresSales', function ($http, $q) { // returning singleton object
        return {
            salesObj: function () {
                var deferred = $q.defer();
                return $http.get("/api/salesObjects").
                    success(function (responce) { // responce : { data : {} , status,cpnfig,headers }
                        //console.log('r is ' + responce);
                        deferred.resolve(responce);
                    })
                    .error(function (msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;

            },
            mongoObj: function () {
                var deferred = $q.defer();
                return $http.get("/api/mongoObjects")
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (msg, code) {
                        deferred.reject(msg)
                    })
                return deferred.promise;

            },
            mongoObjId: function () {
                var deferred = $q.defer();
                return $http.get("/api/mongoObjectsIds")
                    .success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (msg, code) {
                        deferred.reject(msg)
                    })
                return deferred.promise;

            },
            salesmongoconfig: function () {
                var deferred = $q.defer();
                return $http.get("/api/config")
                    .success(function (responce) { // responce : { data : {} , status,cpnfig,headers }
                        console.log('config is ' + responce);
                        deferred.resolve(responce);
                    })
                    .error(function (msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;
            },
            salesObjAttr: function (objName) {
                var deferred = $q.defer();
                var uri = "/api/salesObjects/" + objName + "/attributes";
                return $http.get(uri).
                    success(function (responce) { // responce : { data : {} , status,cpnfig,headers }
                        //console.log('r is ' + responce);
                        deferred.resolve(responce);
                    })
                    .error(function (msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;

            },
            mongoObjAttr: function (objName, objId) {
                var deferred = $q.defer();
                var uri = "/api/mongoObjects/" + objName + "/" + objId;
                return $http.get(uri).
                    success(function (responce) { // responce : { data : {} , status,cpnfig,headers }
                        //console.log('r is ' + responce);
                        deferred.resolve(responce);
                    })
                    .error(function (msg, code) {
                        deferred.reject(msg);
                    });
                return deferred.promise;

            }
        }
    })

    .controller('salesController', function ($scope, expresSales) {
        var p = expresSales.salesmongoconfig();
        p.then(function (data) {
            $scope.mongourl = data.data.mongourl;
            $scope.salesforcelogin = data.data.loginUrl;
            $scope.username = data.data.user;
            $scope.password = data.data.password;
        }, function (error) {
            console.log(error);
        })
    })

    .controller('salesObjectMapper', function ($rootScope, $scope, $q, expresSales) {
        var p1 = expresSales.salesObj();
        var p2 = expresSales.mongoObj();
        $q.all([p1, p2]).then(function (data) {
            //console.log(JSON.stringify(data));
            $scope.salesObjects = data[0].data;
            $scope.mongoObjects = data[1].data;
        }, function (error) {
            console.log(error);
        })
        /*p1.then(function (data) {
         $scope.salesObject = data.data;
         console.log('$scope.salesObject ' + JSON.stringify($scope.salesObject));
         }, function (error) {
         console.log(error);
         })*/
        //$rootScope.objMap = [];
        console.log('sessionStorage1.objMap ' + sessionStorage.objMap);
        if (sessionStorage.objMap) {
            console.log('sessionStorage2.objMap ' + sessionStorage.objMap);
            var t = JSON.parse(sessionStorage.objMap)
            /*for(var i = 0; i<t.length; i++) {
             $rootScope.objMap.push(t[i]);
             }*/
            $rootScope.objMap = t;
            console.log('$rootScope.objMap ' + $rootScope.objMap);
        } else {
            $rootScope.objMap = [];
        }
        $scope.saveObjMapping = function () {
            /*console.log('$scope.selectedSalesObject :'+$scope.selectedSalesObject);
             console.log('$scope.selectedMongoObject :'+$scope.selectedMongoObject);*/
            var temp = {};
            temp.salesObjects = $scope.selectedSalesObject;
            temp.mongoObjects = $scope.selectedMongoObject;
            console.log($scope.objMap);
            $rootScope.objMap.push(temp);
            sessionStorage.objMap = JSON.stringify($rootScope.objMap);
            console.log('sessionStorage3.objMap ' + sessionStorage.objMap);
        }

    })

    .controller('salesAttrMapper', function ($rootScope, $scope, $q, expresSales) {

        var objMapp = $rootScope.objMap;

        /*for (var i = 0; i < objMapp.length; i++) {
            var temp = objMapp[i];
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

                /!*var p1 = expresSales.mongoObjAttr();
                 var p2 = expresSales.salesObjAttr();*!/
            }, function (error) {

            })
        }*/

        //var objMapp = JSON.parse(sessionStorage.objMap);

        console.log('$rootScope.objMap '+ JSON.stringify(objMapp));



    })


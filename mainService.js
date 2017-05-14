           myApp.factory('mainService', ['$http', '$q', function mainService($http, $q) {
                // interface
                var service = {
                    values: [],
                    url:"",
                    getvalues: getvalues
                };
                return service;

                // implementation
                function getvalues(url) {
                    var def = $q.defer();

                    //ajax call
                    $http.get(url)
                    .then(function successCallback(response){
                            service.values = response.data;
                            def.resolve(response.data);
                            }, 
                          function errorCallback(response){
                            console.log('Failed: ', response);
                            alert('Call failed');
                            def.reject("Failed to get values");
                        });
                    return def.promise;
                }
            }]);
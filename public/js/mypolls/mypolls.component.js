'use strict';

angular.module('mypolls')
    .component('mypolls', {
        templateUrl: '/public/js/mypolls/mypolls.template.html',
        controller: ['$scope', '$http', '$q', function($scope, $http, $q) {
            $http.get('/api/users/:uid').then(function(res) {
                
                $scope.isLoaded = false;
                
                const promises = res.data.ownPolls.reduce(function(titles, pid) {
                        return titles.concat($http.get('/api/polls/' + pid));
                    }, []);
                
                $q
                    .all(promises)
                    .then(function(res) {
                        $scope.ownPolls = res;
                        $scope.isLoaded = true;
                    });
                    
            });
        }]
    });
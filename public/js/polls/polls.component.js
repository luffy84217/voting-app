'use strict';

angular.module('polls')
    .component('polls', {
        templateUrl: '/public/js/polls/polls.template.html',
        controller: ['$scope', '$http', function($scope, $http) {
            
            $scope.isLoaded = false;
            
            $http
                .get('/api/users/isLoggedIn')
                .then(function(res) {
                    $scope.isLoggedIn = res.data.isLoggedIn;
                });
            
            $http
                .get('/api/polls/all')
                .then(function(res) {
                    $scope.polls = res.data;
                    $scope.isLoaded = true;
                });
                
        }]
    });
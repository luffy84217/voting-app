'use strict';

angular.module('newpoll')
    .component('newpoll', {
        templateUrl: '/public/js/newpoll/newpoll.template.html',
        controller: ['$scope', '$http', '$location', function($scope, $http, $location) {
            $scope.title = '';
            $scope.options = '';
            $scope.create = function() {
                $http.post('/api/polls/create', { title: $scope.title, options: $scope.options });
                $location.url('/');
            };
        }]
    });
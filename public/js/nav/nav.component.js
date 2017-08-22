'use strict';

angular.module('navbar')
    .component('navbar', {
        templateUrl: '/public/js/nav/nav.template.html',
        controller: ['$scope', '$http', function($scope, $http) {
            
            $http.get('/api/users/isLoggedIn').then(function(res) {
                $scope.isLoggedIn = res.data.isLoggedIn;
            });
            
            $scope.selected = 1;
            
            $scope.tab = function(selected) {
                $scope.selected = selected;
            };
            
            $scope.isActive = function(selected) {
                return $scope.selected === selected ? 'active' : '';
            };
            
        }]
    });
'use strict';

angular.module('votingApp')
    .config(['$locationProvider' , '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

             $routeProvider
                .when('/polls', {
                    title: 'Home',
                    template: '<polls></polls>'
                })
                .when('/polls/:pid', {
                    title: 'Poll',
                    template: '<poll></poll>'
                })
                .when('/mypolls', {
                    title: 'My Polls',
                    template: '<mypolls></mypolls>'
                })
                .when('/newpoll', {
                    title: 'New Poll',
                    template: '<newpoll></newpoll>'
                })
                .otherwise('/polls');
        }
    ]);
    
angular.module('votingApp')
    .run(['$rootScope', function($rootScope) {
        $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
            $rootScope.title = current.$$route.title;
        });
    }]);

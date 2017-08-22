'use strict';

angular.module('poll')
    .component('poll', {
        templateUrl: '/public/js/poll/poll.template.html',
        controller: ['$window', '$scope', '$http', '$location', '$routeParams', function($window, $scope, $http, $location, $routeParams) {
            
            $scope.absUrl = encodeURIComponent($location.absUrl());
            
            $scope.isOwned = false;
            
            $scope.isLoaded = false;
            
            $http.get('/api/polls/' + $routeParams.pid).then(function(res) {
                
                $scope.poll = res.data;
                
                $http
                    .get('/api/users/:uid')
                    .then(function(res) {
                        if (res.data.ownPolls) {
                            for (let i = 0, polls = res.data.ownPolls; i < polls.length; ++i) {
                                if (polls[i] === $scope.poll._id) {
                                    $scope.isOwned = true;
                                }
                            }
                        }
                    });
                
                // generate poll chart
                createPollChart(res.data.options);
                
                $scope.isLoaded = true;
                
            });
            
            $scope.selected = '';
            
            $scope.vote = function() {
                $http
                    .post('/api/polls/' + $routeParams.pid, { selected: $scope.selected })
                    .then(function(res) {
                        if (res.data.hasVoted) {
                            $window.alert('Sorry, you can only vote once a poll.');
                        }
                        $location.url('#!/polls/' + $routeParams.pid);
                    });
            };
            
            $scope.removePoll = function() {
                $http
                    .delete('/api/polls/' + $routeParams.pid)
                    .then(function(res) {
                        $location.url('/');
                    });
            };
            
        }]
    });
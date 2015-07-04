var rest_controller = angular.module('rest_app', ['$httpProvider','rest_app']).config( 'rest_app', function($httpProvider, rest_app) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

rest_controller.controller('rest-controller', function ($scope, $http) {
    $scope.friends = ['friend_1', 'friend_2', 'friend_3', 'friend_4'];

    $scope.getFriends = function (str) {

        $http.get("http://localhost:8000/user/get/?name="+str)
            .success(function(data, status, headers, config) {
                $scope.friends = data;
            })
            .error(function() {
                alert('????');
            });
    }

    $scope.logoutRequest = function() {
        $http.post('http://localhost:8000/user/log_out/')
    }

    $scope.subscribe = function(id) {
        $http.post('http://localhost:8000/user/subscribe/?id='+id)
            .success(function(data, status, headers, config) {
                alert('lol')
            })
    }
});


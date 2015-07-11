var rest_controller = angular.module('rest_app', []).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);

rest_controller.controller('rest-controller', function ($scope, $http) {

    $scope.friends = ['friend_1', 'friend_2', 'friend_3', 'friend_4'];
    $scope.friend_request_str = ''
    $scope.getFriends = function (str) {

        $http.get("http://localhost:8000/user/get/?name="+str)
            .success(function(data, status, headers, config) {
                $scope.friends = data;
                $scope.friend_request_str = str;
            })
            .error(function() {
                alert('????');
            });
    }

    $scope.logoutRequest = function() {
        $http.post('http://localhost:8000/user/log_out/')
    }

    $scope.subscribe = function(id) {
        var alreadyFollowing;

        $http.post('http://localhost:8000/user/subscribe/?id='+id)
            .success(function(data, status, headers, config) {
                 $scope.getFriends($scope.friend_request_str)
            })
    }

    $scope.postMind = function() {
        var data = $scope.mind;

        $http.post('http://localhost:8000/home/postmind/', data).success(function() {

        });
    }

    $scope.getUserStats  = function(id) {
        var request;
        if(!id)
            request = $http.get("http://localhost:8000/user/stats/")
        else
            request = $http.get("http://localhost:8000/user/stats/?id=")

        request.success(function(data, status, headers, config){
            $scope.user = data;
        })
    }

    $scope.getUserStats();
});


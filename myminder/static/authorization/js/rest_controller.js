var rest_controller = angular.module('rest-app', []);

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
        $http.post('http://localhost:8000/user/logout/')
    }
});
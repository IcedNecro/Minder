var rest_controller = angular.module('rest_app', []).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);

rest_controller.controller('rest-controller', function ($scope, $http) {

    $scope.friends = ['friend_1', 'friend_2', 'friend_3', 'friend_4'];
    $scope.friend_request_str = ''
    $scope.selectedCats = []
    $scope.categories = []
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
        $http.post('http://localhost:8000/user/log_out/').success(function(){
            window.location.replace('/home/page');
        })
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
        var cat_ids = []
        for(var i=0; i<$scope.selectedCats.length; i++)
            cat_ids.push($scope.selectedCats[i]["id"])
        data["categories"] = cat_ids;
        $http.post('http://localhost:8000/home/postmind/', data).success(function() {

        });
    }

    $scope.getMindTree = function(id) {
        var request;
        if(!id) {
            request = $http.get('http://localhost:8000/home/minds/')
            request.success(function(data, status, headers, config) {
                $scope.mind_tree = data
            })
        }
    }

    $scope.getUserStats  = function(id) {
        var request;
        if(!id) {
            request = $http.get("http://localhost:8000/user/stats/")
            request.success(function(data, status, headers, config){
                $scope.user = data;
            })
        }
        else {
            //disappearContent()
            request = $http.get("http://localhost:8000/user/stats/?id="+id)
            request.success(function(data, status, headers, config){
                $scope.anotherUser = data;
            })
            appearContent()
        }
    }

    $scope.getSubscribersGraph = function(id) {
        var request;
        $scope.graphData = {}
        if(!id)
            request = $http.get("http://localhost:8000/user/graph/subscribers/")
        else
            request = $http.get("http://localhost:8000/user/graph/subscribers/?id="+id)
        var res = {}

        request.then(function(data, status, headers, config){
            drawGraph(data.data);
        })
        //return res.resolve();
    }

    $scope.getFollowersGraph = function(id) {
        var request;
        $scope.graphData = {}
        if(!id)
            request = $http.get("http://localhost:8000/user/graph/followers/")
        else
            request = $http.get("http://localhost:8000/user/graph/followers/?id="+id)
        var res = {}

        request.then(function(data, status, headers, config){
            drawGraph(data.data);
        })
        //return res.resolve();
    }

    $scope.getCategories = function(name) {
        $http.get("http://localhost:8000/home/categories/?name="+name)
            .success(function(data, status, headers, config) {
                $scope.categories = data;
                $scope.category_request_str =  name;
            });
    }

    $scope.removeCategory = function(cat) {
        var index = $scope.selectedCats.indexOf(cat)
        $scope.selectedCats.splice(index, 1)
    }

    $scope.addCategory = function(cat) {
        $scope.selectedCats.push(cat);
    }

    $scope.getUserStats();
    $scope.getSubscribersGraph();
})


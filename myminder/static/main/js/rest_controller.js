var rest_controller = angular.module('rest_app', []).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);

rest_controller.controller('rest-controller', function ($scope, $http) {

    $scope.friends = ['friend_1', 'friend_2', 'friend_3', 'friend_4'];
    $scope.friend_request_str = ''
    $scope.selectedCats = []
    $scope.categories = []
    $scope.graph = new GraphVisualization()

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
                 $scope.getSubscribersGraph()
            })
    }

    $scope.postMind = function() {
        if(!submind_mode) {
            var data = $scope.mind;
            var cat_ids = []
            for(var i=0; i<$scope.selectedCats.length; i++)
                cat_ids.push($scope.selectedCats[i]["id"])
            data["categories"] = cat_ids;
            $http.post('http://localhost:8000/home/postmind/', data).success(function() {
                $scope.getMindTree()
            });
        } else {
            var data = $scope.mind;
            $http.post('http://localhost:8000/home/postmind/?submind='+$scope._mind.mind.id, data).success(function() {
                $scope.getMindTree()
            });
        }
    }

    $scope.postSubmind = function(id) {
        $scope.submind = $scope._mind.mind.title
        $scope.openCreateSubMindDialog()
        submind_mode = true
    }

    $scope.getMindTree = function(id) {
        var request;
        if(!id) {
            request = $http.get('http://localhost:8000/home/minds/')
        } else
            request = $http.get('http://localhost:8000/home/minds/?id='+id)
        request.success(function(data, status, headers, config) {
            $scope.mind_tree = data
            $scope.graph.drawNode =  mindsGraphNode;
            $scope.graph.onClickCallback = mindsClickCallback;
            $scope.graph.drawGraph(data);
        })
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
            $scope.graph.drawNode =  subscribersGraphNode;
            $scope.graph.onClickCallback = subscribersGraphCallback;
            $scope.graph.drawGraph(data.data);
        })
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
            $scope.graph.drawNode =  subscribersGraphNode;
            $scope.graph.onClickCallback = subscribersGraphCallback;
            $scope.graph.drawGraph(data.data);
        })
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

    $scope.fullMindData = function(id){
        $http.get("http://localhost:8000/home/minds/"+id+'/').success(function(data,status,headers,config) {
            $scope._mind = data;
        })
    }

    $scope.requestFullMind = function(id) {
        $scope.fullMindData(id)
        $('#display-mind-dialog').dialog('open')
    }

    $scope.rateMind = function(like) {
        $http.post('http://localhost:8000/home/like/?positive='+like
                    +'&mind_id='+$scope._mind.mind.id).success(function(){
                        $scope.fullMindData($scope._mind.mind.id);
                    })
    }

    $scope.openCreateSubMindDialog = function() {
        $('.popup-dialog').dialog('close')
        $('#create-mind-dialog').dialog('open')
    }

    $scope.getUserStats();
    $scope.getSubscribersGraph();
})


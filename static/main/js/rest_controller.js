var rest_controller = angular.module('rest_app', []).config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);

rest_controller.controller('rest-controller', function ($scope, $http) {

    $scope.friend_request_str = ''
    $scope.selectedCats = []
    $scope.categories = []
    $scope.graph = new GraphVisualization()
    $scope.process = "Edit"
    $scope.getFriends = function (str) {

        $http.get("/user/get/?name="+str)
            .success(function(data, status, headers, config) {
                $scope.friends = data;
                $scope.friend_request_str = str;
            })
            .error(function() {
                alert('????');
            });
    }

    $scope.logoutRequest = function() {
        $http.post('/user/log_out/').success(function(){
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
            $http.post('/home/postmind/', data).success(function() {
                $scope.getMindTree()
                $scope.getUserStats()
                delete $scope.mind
                delete $scope.categories
            });
        } else {
            var data = $scope.mind;
            $http.post('/home/postmind/?submind='+$scope._mind.mind.id, data).success(function() {
                $scope.getMindTree($scope._mind.mind.author.id)
                $scope.getUserStats()
                delete $scope.categories
                delete $scope.mind
                delete $scope._mind
            });
            submind_mode = false;
            $scope.submind_mode = false;
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
            request = $http.get('/home/minds/')
        } else
            request = $http.get('/home/minds/?id='+id)
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
            request = $http.get("/user/stats/")
            request.success(function(data, status, headers, config){
                $scope.user = data;
            })
        }
        else {
            request = $http.get("/user/stats/?id="+id)
            request.success(function(data, status, headers, config){
                $scope.anotherUser = data;
                $('.right-top-info-panel').show()

            })
        }
    }

    $scope.getSubscribersGraph = function(id) {
        var request;
        $scope.graphData = {}
        if(!id)
            request = $http.get("/user/graph/subscribers/")
        else
            request = $http.get("/user/graph/subscribers/?id="+id)
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
            request = $http.get("/user/graph/followers/")
        else
            request = $http.get("/user/graph/followers/?id="+id)
        var res = {}

        request.then(function(data, status, headers, config){
            $scope.graph.drawNode =  subscribersGraphNode;
            $scope.graph.onClickCallback = subscribersGraphCallback;
            $scope.graph.drawGraph(data.data);
        })
    }

    $scope.getCategories = function(name) {
        $http.get("/home/categories/?name="+name)
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

    $scope.createCategory = function(name) {
        var data = {
            category: name,
        }
        $http.post('/home/categories/create/', data).success(function(data, status, headers, config) {
            $scope.getCategories(name)
        })
    }

    $scope.fullMindData = function(id){
        $http.get("/home/minds/"+id+'/').success(function(data,status,headers,config) {
            if(data.mind.parent) {
                $scope._mind = data;

                $http.get("/home/minds/"+data.mind.parent+'/').success(function(data,status,headers,config) {
                   var parent = data;
                    $scope._mind.mind.parent = parent.mind;

                })
            } else {
                $scope._mind = data;
            }
        })
    }

    $scope.requestFullMind = function(id) {
        $scope.fullMindData(id)

        $('#display-mind-dialog').dialog('open')
    }

    $scope.rateMind = function(like) {
        $http.post('/home/like/?positive='+like
                    +'&mind_id='+$scope._mind.mind.id).success(function(){
                        $scope.fullMindData($scope._mind.mind.id);
                    })
    }

    $scope.openCreateSubMindDialog = function() {
        $('.popup-dialog').dialog('close')
        $('#create-mind-dialog').dialog('open')
    }

    $scope.causeEdit = function(id) {
        if(!$scope.edit) {
            $scope.edit = true;
            $scope.process = "Save";
        } else {
            $scope.updateMind(id);
            $scope.edit = false;
            $scope.process = 'Edit';
        }
    }

    $scope.stopEdit = function() {
        $scope.edit = false;
        $scope.process = "Edit";
    }

    $scope.deleteMind = function(id) {
        $http.post('/home/minds/delete/?mind_id='+id)
            .success(function() {
                $('#display-mind-dialog').dialog('close')
                $scope.getMindTree($scope._mind.mind.author.id)

            })
    }

    $scope.updateMind = function(id) {
        $http.post('/home/minds/update/?mind_id='+id, $scope._mind.mind)
            .success(function() {
                $scope.requestFullMind($scope._mind.mind.id)
                $scope.getMindTree($scope._mind.mind.author.id)
            })
    }

    $scope.wrapText = function(text) {
        return text.length<100 ? text: text.slice(0,100)+'...';
    }

    $scope.resetSubmindMode = function() {
        delete $scope.submind;
        delete $scope._mind;
    }

    $scope.getUserStats();
    $scope.getSubscribersGraph();
})


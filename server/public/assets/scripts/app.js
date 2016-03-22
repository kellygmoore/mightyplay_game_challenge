
var myApp = angular.module("myApp", ['ngRoute']);

myApp.config(["$routeProvider", function($routeProvider){
    $routeProvider.
        when('/start', {
            templateUrl: "assets/views/routes/start.html",
            controller: "gameCtrl"
        }).
        when('/category', {
            templateUrl: "assets/views/routes/category.html",
            controller: "gameCtrl"
        }).
        when('/questionpage', {
            templateUrl: "assets/views/routes/questionpage.html",
            controller: "gameCtrl"
        }).
        //when('/completion', {
        //    templateUrl: "assets/views/routes/completion.html",
        //    controller: "gameCtrl"
        //}).
        otherwise({
            redirectTo: 'start'
        })
}]);


//var myApp = angular.module("myApp", []);

//myApp.controller('gameCtrl', ["$scope", '$http', '$filter', function($scope, $http, $filter){

myApp.controller('gameCtrl', ["$scope", "$location", "ShareData", function($scope, $location, ShareData){

    //controller only function to show instructions when clicked//////////
    $scope.flip = true;
    $scope.showCredits = true;

    $scope.showInstructions = function(){
        $scope.flip = !$scope.flip;
    };

    $scope.showLogoCredits = function(){
        $scope.showCredits = !$scope.showCredits;
    }




}]);





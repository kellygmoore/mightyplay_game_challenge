//var myApp = angular.module("myApp", []);

myApp.controller('startCtrl', ["$scope", function($scope){

    //controller only function to show instructions when clicked//////////
    $scope.flip = true;
    $scope.showCredits = true;

    $scope.showInstructions = function(){
        $scope.flip = !$scope.flip;
    };

    $scope.showLogoCredits = function(){
        $scope.showCredits = !$scope.showCredits;
    };
}]);


myApp.controller('gameCtrl', ["$scope", "$location", "ShareData", function($scope, $location, ShareData){
    //set variables
    //var catCounter = 0;
    //var lastPts = 0;
    //var gameOverCounter = 0;
    //var havePointsHere = 0;
    var catTitle;

    //set booleans for ng-hide
    //$scope.trueOrFalse = true;
    //$scope.showNextArrow = true;
    //$scope.showNextCatArrow = true;
    //$scope.showSuccessMsg = true;
    //$scope.showSolution = true;
    //$scope.disableAnswers = false;
    //$scope.noPointsMsg = true;
    //$scope.showGameOver = true;

    $scope.catPlayed = "";
    $scope.trivia = [];
    $scope.totalPoints = 0;
    $scope.runningTotalPts = 0;
    $scope.newCatValues = {};
    //$scope.newCatValues.runningTotal = 100;
    //console.log("running total: ", $scope.newCatValues.runningTotal);


    $scope.shareData = ShareData;

    //get shared data from db store in trivia////////////////////////////////
    if($scope.shareData.triviaData() === undefined){
        $scope.shareData.retrieveData()
            .then(function() {
                $scope.trivia = $scope.shareData.triviaData();
            });
    } else {
        $scope.trivia = $scope.shareData.triviaData();
    }
    console.log($scope.trivia);
    //play a session based on Category clicked on/////////////////////////////
    $scope.catObject = $scope.shareData.getCategory();
    console.log("CatObject1: ", $scope.catObject);

    //talk to factory to get shared data and load first question in category/////////////////////
    $scope.playCategory = function(newValue){
        $location.path('/questionpage');
        newValue.disabled = true;
        newValue.showRibbon = true;
        //console.log("Showribbon: ", newValue.showRibbon);
        $scope.shareData.playCategory(newValue);
    };

    catTitle = $scope.catObject.category;
    $scope.category = catTitle;
    $scope.catPoints = $scope.catObject.points;



}]);





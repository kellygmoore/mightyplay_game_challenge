//var myApp = angular.module("myApp", []);

myApp.controller('startCtrl', ["$scope", function($scope){

    //controller only function to show instructions when clicked//////////
    $scope.showHow = true;
    $scope.showCredits = true;

    $scope.showInstructions = function(){
        $scope.showHow = !$scope.showHow;
    };

    $scope.showLogoCredits = function(){
        $scope.showCredits = !$scope.showCredits;
    };
}]);


myApp.controller('gameCtrl', ["$scope", "$location", "$timeout", "ShareData", function($scope, $location, $timeout, ShareData){
    //set variables
    var lastPts = 0;
    var catTitle;
    var stopped;
    $scope.counter = 60;
    $scope.pointsEarnedCounter = 0;
    $scope.totPts = 0;
    $scope.catPlayed = "";

    //set booleans for ng-hide or ng-show
    $scope.gameOver = true;
    $scope.beginPlay = false;
    $scope.gamePlay = true;
    $scope.showNextArrow = false;
    //$scope.showNextCatArrow = false;
    $scope.showSuccessMsg = false;
    $scope.showIncorrectMsg = false;
    $scope.isFlipped = false;
    $scope.disableAnswers = false;
    $scope.isDisabled = false;

    $scope.trivia = [];
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
    //console.log($scope.trivia);

    //play a session based on Category clicked on/////////////////////////////
    $scope.catObject = $scope.shareData.getCategory();
    console.log("CatObject: ", $scope.catObject);


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
    //$scope.catPoints = $scope.catObject.points;

    //TIMEOUT BEGIN------------------------------------//

    $scope.onTimeout = function() {
        if($scope.counter ===  0) {
            $scope.gameOver = false;
            $scope.showNextArrow = false;
            //$scope.showNextCatArrow = true;
            $timeout.cancel(mytimeout);
            return;
        }
        $scope.counter--;
        mytimeout = $timeout($scope.onTimeout, 1000);
    };

    $scope.beginGame = function() {
        mytimeout = $timeout($scope.onTimeout, 1000);
        $scope.gameOver = true;
        $scope.gamePlay = false;
        $scope.beginPlay = true;
    };


    //--------------CHECK CLICKED ANSWER------------------------//
    $scope.checkAnswer = function(clickedAnswer){

        //console.log("I clicked on answer: ", clickedAnswer);
        $scope.isFlipped = true;
        $scope.disableAnswers = true;
        $scope.isDisabled = true;
        $scope.showNextArrow = true;
        $scope.nextCatObjectIndex = $scope.catObject.idNum;
        //$scope.showNextArrow = !$scope.showNextArrow;
        if(clickedAnswer.sol === clickedAnswer.ans) {
            //console.log("Yes, match!");
            $scope.showSuccessMsg = true;
            $scope.pointsEarnedCounter++;
        } else {
            //console.log("No, not a match");
            $scope.showIncorrectMsg = true;
        }
    };


    //on click of the next arrow after correctly ordered//////////////////////////////
    $scope.nextQuestion = function(next) {
        if(next.category === null) {
            //console.log("Next question click: ", next);
            //set the new view//////////
            $scope.showNextArrow = false;
            $scope.isFlipped = false;
            $scope.showSuccessMsg = false;
            $scope.disableAnswers = false;
            lastPts = $scope.pointsEarnedCounter;
            console.log("lastPts: ", lastPts);

            //get shared data to set up new catObject//////////////////////////
            $scope.catObject = $scope.shareData.playCategory(next);
            //make sure category title doesn't change (in db, it is null)
            $scope.category = catTitle;
            //$scope.catPoints = $scope.catObject.points;
        } else {
            console.log("In else statement, cat not null.");
            $scope.showNextArrow = false;
            //calculate total category points to show back on completion page/////////
            $scope.totPts = lastPts;
            console.log("lastpts: ", lastPts);
            console.log("scope totPts: ", $scope.totPts);
            $scope.gameOver = false;
            $timeout.cancel(mytimeout);
            //$scope.showNextCatArrow = true;
        }
    };


    //click to play another category - resets category page////////////////////////////////////
    $scope.updateCatPage = function(runningTotalPts, kittyName){
        $scope.shareData.updateCat(runningTotalPts, kittyName);
    };
    $scope.newCatValues = $scope.shareData.getUpdateCatPage();

}]);





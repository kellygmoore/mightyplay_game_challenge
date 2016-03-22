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
    var catCounter = 0;
    var lastPts = 0;
    var havePointsHere = 0;
    var catTitle;

    //set booleans for ng-hide
    $scope.gameOver = true;
    $scope.beginPlay = false;
    $scope.gamePlay = true;
    $scope.showNextArrow = false;
    $scope.showNextCatArrow = false;
    $scope.showSuccessMsg = false;
    $scope.showIncorrectMsg = false;
    $scope.isFlipped = false;
    $scope.pointsEarnedCounter = 0;
    $scope.catPlayed = "";
    $scope.disableAnswers = false;
    $scope.trivia = [];
    //$scope.counter = 0;
    $scope.totalPoints = 0;
    $scope.runningTotalPts = 0;
    $scope.newCatValues = {};
    $scope.counter = 30;
    var stopped;
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

    //
    //$scope.beginGame = function() {
    //    //$scope.gameOver = true;
    //    $scope.gamePlay = false;
    //    $scope.beginPlay = true;
        //stopped = $timeout(function() {
        //    console.log($scope.counter);
        //    $scope.counter--;
        //    //if($scope.counter === 0) {
        //    //    $scope.showNextCatArrow = true;
        //    //    $scope.gameOver = false;
        //    //}
        //    $scope.countdown();
        //}, 1000);

        //$scope.counter = 5;
        //$scope.beginGame = function(){
        //    $scope.gamePlay = false;
        //    $scope.beginPlay = true;
        //    $scope.counter--;
        //    if ($scope.counter > 0) {
        //        mytimeout = $timeout($scope.onTimeout,1000);
        //    }
        //    else {
        //        console.log("Time is up!");
        //    }
        //};
        //var mytimeout = $timeout($scope.onTimeout,1000);

    //};

    $scope.onTimeout = function() {
        if($scope.counter ===  0) {
            //$scope.$broadcast('timer-stopped', 0);
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

        console.log("I clicked on answer: ", clickedAnswer);
        $scope.isFlipped = true;
        $scope.disableAnswers = true;
        //$scope.counter++;
        $scope.showNextArrow = true;
        $scope.nextCatObjectIndex = $scope.catObject.idNum;
        //$scope.showNextArrow = !$scope.showNextArrow;
        if(clickedAnswer.sol === clickedAnswer.ans) {
            //console.log("Yes, match!");
            //$scope.isFlipped = true;
            $scope.showSuccessMsg = true;
            $scope.pointsEarnedCounter++;

        } else {
            //console.log("No, not a match");
            $scope.showIncorrectMsg = true;
            //$scope.isFlipped = true;
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
            lastPts = $scope.catPoints;
            $scope.totalPoints += $scope.catPoints;
            //console.log("Total Points: ", $scope.totalPoints);

            //get shared data to set up new catObject//////////////////////////
            $scope.catObject = $scope.shareData.playCategory(next);
            //make sure category title doesn't change (in db, it is null)
            $scope.category = catTitle;

            $scope.catPoints = $scope.catObject.points;


            //$scope.nextCatObjectIndex = $scope.catObject.idNum;
        } else {
            console.log("In else statement, cat not null.");
                $scope.showNextArrow = false;
                $scope.showNextCatArrow = true;
        }

    };

    //$scope.gameOver = true;



//when completed category, set points total and category name to display on page//////////////////////
    $scope.playNewCat = function(pts, cat){
        //gameOverCounter++;
        //console.log("GameOverCounter after clicking playNewcat arrow: ", gameOverCounter);
        $scope.shareData.newCategory(pts, cat);
    };

    $scope.completionObject = $scope.shareData.getNewCat();

    //calculate total category points to show back on completion page/////////
    $scope.totPts = $scope.completionObject.totPts + lastPts;


    //click to play another category - resets category page////////////////////////////////////
    $scope.updateCatPage = function(runningTotalPts, kittyName){
        $scope.shareData.updateCat(runningTotalPts, kittyName);
    };
    $scope.newCatValues = $scope.shareData.getUpdateCatPage();
    //console.log("gameover on catpage: ", + gameOverCounter +  ", trivia length: " + $scope.trivia.length);
    //if(gameOverCounter === $scope.trivia.length){
    //    $scope.showGameOver = false;
    //}



}]);





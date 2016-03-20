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


myApp.controller('gameCtrl', ["$scope", "$location", "ShareData", function($scope, $location, ShareData){
    //set variables
    var catCounter = 0;
    var lastPts = 0;
    var havePointsHere = 0;
    var catTitle;

    //set booleans for ng-hide
    $scope.beginPlay = false;
    $scope.gamePlay = true;
    $scope.trueOrFalse = true;
    $scope.showNextArrow = false;
    $scope.showNextCatArrow = false;
    $scope.showSuccessMsg = false;
    $scope.showIncorrectMsg = false;
    $scope.isFlipped = false;
    $scope.pointsEarnedCounter = 0;
    $scope.catPlayed = "";
    $scope.trivia = [];
    $scope.counter = 0;
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


    $scope.beginGame = function(){
        $scope.gamePlay = false;
        $scope.beginPlay = true;
    };

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

    //--------------CHECK CLICKED ANSWER------------------------//
    $scope.checkAnswer = function(clickedAnswer){

        console.log("I clicked on answer: ", clickedAnswer);
        $scope.isFlipped = true;
        $scope.counter++;
        $scope.showNextArrow = true;
        //$scope.showNextArrow = !$scope.showNextArrow;
        if(clickedAnswer.sol === clickedAnswer.ans) {
            console.log("Yes, match!");
            //$scope.isFlipped = true;
            $scope.showSuccessMsg = true;
            $scope.pointsEarnedCounter++;
        } else {
            console.log("No, not a match");
            $scope.showIncorrectMsg = true;
            //$scope.isFlipped = true;
        }
    };

    //if all answers are ordered correctly/////////////////////////////////
    //if($scope.counter === 5){
    //    catCounter++;
    //    //$scope.disableAnswers = true;
    //    //console.log("catCounter: ", catCounter);
    //    $scope.showNextArrow = false;

        //once all 5 questions have been played, ask to play new category/////////////
        //if(catCounter === 5){
        //    $scope.showNextArrow = true;
        //    $scope.showNextCatArrow = false;
        //}

        //$scope.showSuccessMsg = false;
        //$scope.showSolution = false;
        //$scope.nextCatObjectIndex = $scope.catObject.idNum;

        //else if the answers are NOT ordered correctly subtract points//////////////////
    //} else {
    //    //$scope.catPoints -= 50;
    //    //havePointsHere = $scope.catPoints;
    //
    //    //if you have 0 points you must move on to next question////////////////////////
    //    //if(havePointsHere === 0){
    //
    //        //console.log("scope.catPoints after click check answers button: ", $scope.catPoints);
    //        //reset the page view////////////////////
    //        //$scope.noPointsMsg = false;
    //        //$scope.showSolution = false;
    //        //$scope.disableAnswers = true;
    //        $scope.showNextArrow = false;
    //        //$scope.trueOrFalse = true;
    //        //$scope.showSuccessMsg = true;
    //        catCounter++;
    //        if(catCounter === 5){
    //            $scope.showNextArrow = true;
    //            $scope.showNextCatArrow = false;
    //        }
    //        $scope.nextCatObjectIndex = $scope.catObject.idNum;
    //    }



    //on click of the next arrow after correctly ordered//////////////////////////////
    $scope.nextQuestion = function(next){
        $scope.isFlipped = false;
        $scope.showSuccessMsg = false;
        lastPts = $scope.catPoints;
        $scope.totalPoints += $scope.catPoints;
        //console.log("Total Points: ", $scope.totalPoints);

        //get shared data to set up new catObject//////////////////////////
        $scope.catObject = $scope.shareData.playCategory(next);
        //make sure category title doesn't change (in db, it is null)
        $scope.category = catTitle;

        $scope.catPoints = $scope.catObject.points;
        //set the new view//////////
        $scope.noPointsMsg = true;
        $scope.showSuccessMsg = true;
        $scope.disableAnswers = false;
        $scope.showSolution = true;
        $scope.trueOrFalse = true;
        $scope.showNextArrow = true;
    };

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

 //end of gameCtrl controller///////////////////////////////////////


}]);





app.controller("mainController", function($scope, $http){

	$scope.apiKey = "2c1eec97eb7bf6993bbb5a4a25c0f1c1";
	$scope.results = [];
	$scope.filterText = null;
	$scope.availableGenres = [];
    $scope.genreFilter = null;
    $scope.init = function() {
        //API requires a start date
        var today = new Date();

        //Create the date string and ensure leading zeros if required
        var apiDate = today.getFullYear() + ("0" + (today.getMonth() + 1)).slice(-2) + "" + ("0" + today.getDate()).slice(-2);

        $http.jsonp('http://api.trakt.tv/calendar/premieres.json' + '/' + $scope.apiKey + '/' + apiDate + '/' + 30 + '/?callback=JSON_CALLBACK').success(function(data) {
            
        	angular.forEach(data, function(value, index){
        		var date = value.date;

        		angular.forEach(value.episodes, function(eachtvshow,index){
        			eachtvshow.date = date;
        			$scope.results.push(eachtvshow);

        			//Loop through each genre for this episode
                    angular.forEach(eachtvshow.show.genres, function(genre, index){
                        //Only add to the availableGenres array if it doesn't already exist
                        var exists = false;
                        angular.forEach($scope.availableGenres, function(avGenre, index){
                            if (avGenre == genre) {
                                exists = true;
                            }
                        });
                        if (exists === false) {
                            $scope.availableGenres.push(genre);
                        }
                    });
        		});
        	});

            //console.log($scope.results);
        }).error(function(error) {

        });
    };

    $scope.setGenreFilter = function(genre){
    	$scope.genreFilter = genre;
    }

    $scope.customOrder = function(eachtvshow){
    	switch($scope.orderField){
    		case "Air Date":
    			return eachtvshow.episode.first_aired;
    			break;
    		case "Rating":
    			return eachtvshow.episode.ratings.percentage;
    			break;
    	}
    }

    $scope.orderFields = ["Air Date", "Rating"];
    $scope.orderDirections = ["Descending", "Ascending"];
    $scope.orderField = "Air Date"; //Default order field
    $scope.orderReverse = false;

});

app.filter('isGenre', function() {
	return function(input, genre) {
		if (typeof genre == 'undefined' || genre == null) {
			return input;
		} else {
			var out = [];
			for (var a = 0; a < input.length; a++){
				for (var b = 0; b < input[a].show.genres.length; b++){
					if(input[a].show.genres[b] == genre) {
						out.push(input[a]);
					}
				}
			}
			return out;
		}
	};
});

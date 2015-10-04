var GMap_ng=angular.module('GMap_ng', []);
GMap_ng.controller('mapController',mapController);

function mapController($rootScope, $scope, $http){
	$rootScope.listOfAreas=null;
	$rootScope.listOfAreaAp=null;
	$scope.zipCode='';
	$scope.markers=[];
	
	$http.get('http://localhost:8080/GoogleMap_Angularjs/data/locations.json')	
	.success(function (data) {
	    $rootScope.listOfAreas = data.area;
	    if ($rootScope.listOfAreas.length > 0) {
	       $scope.zipCode=data.area[0].zipCode;
	       $rootScope.listOfAreaAp=data.area[0].ap;
	       for (i = 0; i < $rootScope.listOfAreaAp.length; i++){
		        createMarker($rootScope.listOfAreaAp[i]);
		    }
	    }
	})
	.error(function (data, status, headers, config) {
	    $scope.errorMessage = "Couldn't load the list of Script, error # " + status;
	});
	
	$scope.findArea = function() {
		$scope.zipCodeFound=false;
		angular.forEach($rootScope.listOfAreas, function(value, key){
			if(value.zipCode==$scope.searchArea){
				$scope.zipCode=value.zipCode;
				$rootScope.listOfAreaAp=value.ap;
				$scope.zipCodeFound=true;
				for (i = 0; i < $scope.markers.length; i++){
					$scope.markers[i].setMap(null);
			    }
				for (i = 0; i < $rootScope.listOfAreaAp.length; i++){
			        createMarker($rootScope.listOfAreaAp[i]);
			    }
			}
		})
		if($scope.zipCodeFound==false){
			alert('Zip Code is Invalid');
		}
	};
	
	var mapOptions = {
	        zoom: 5,
	        center: new google.maps.LatLng(21.1400, 81.3800),
	        mapTypeId: google.maps.MapTypeId.ROADMAP
	    }

	    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
	    
	    var infoWindow = new google.maps.InfoWindow();
	var deleteMarker = function (){
		var marker = new google.maps.Marker(null);
	}
	
	var createMarker = function (info){
        var marker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(info.lat, info.long),
            title: info.city
        });
        marker.content = '<div class="infoWindowContent">' + info.address + '</div>';
        google.maps.event.addListener(marker, 'click', function(){
            infoWindow.setContent('<h2 align="left">' + marker.title + '</h2>' + marker.content);
            infoWindow.open($scope.map, marker);
        });
        $scope.markers.push(marker);
    }

    $scope.openInfoWindow = function(e, selectedMarker){
        e.preventDefault();
        google.maps.event.trigger(selectedMarker, 'click');
    }
}
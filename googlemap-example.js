	// This example creates circles on the map, representing
	// populations in the United States.

	// First, create an object containing LatLng and population for each city.
	var citymap = {};
	citymap['chicago'] = {
	  center: new google.maps.LatLng(41.878113, -87.629798),
	  population: 2842518
	};
	citymap['newyork'] = {
	  center: new google.maps.LatLng(40.714352, -74.005973),
	  population: 8143197
	};
	citymap['losangeles'] = {
	  center: new google.maps.LatLng(34.052234, -118.243684),
	  population: 3844829
	};
	var cityCircle;

	function initialize2() {
	  // Create the map.
	  var mapOptions = {
	    zoom: 4,
	    center: new google.maps.LatLng(37.09024, -95.712891),
	    mapTypeId: google.maps.MapTypeId.TERRAIN
	  };

	  var map = new google.maps.Map(document.getElementById('map-canvas'),
	      mapOptions);

	  // Construct the circle for each value in citymap.
	  // Note: We scale the population by a factor of 20.
	  for (var city in citymap) {
	    var populationOptions = {
	      strokeColor: '#FF0000',
	      strokeOpacity: 0.8,
	      strokeWeight: 2,
	      fillColor: '#FF0000',
	      fillOpacity: 0.35,
	      map: map,
	      center: citymap[city].center,
	      radius: citymap[city].population / 20
	    };
	    // Add the circle for this city to the map.
	    cityCircle = new google.maps.Circle(populationOptions);
	  }
	}


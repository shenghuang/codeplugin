const base_geolocation_url = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true&language=EN&latlng=';

function init() {
  var onfail = function(reason) {
    console.warn(reason);
  };

  navigator.geolocation.getCurrentPosition(
    function(position) {
      var searchurl = base_geolocation_url + position.coords.latitude + ',' + position.coords.longitude;
      initialize(position.coords.latitude,  position.coords.longitude);
    },
    onfail.bind(null, "Geocoder failed")
  );
}

function initialize(latitude, longitude) {
    var mapOptions = {
      zoom: 8,
      center: new google.maps.LatLng(latitude, longitude),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    
    var map = new google.maps.Map(document.getElementById("map-canvas"),
        mapOptions);
    
	  // Construct the circle
	    var circleOptions = {
	      strokeColor: '#FF0000',
	      strokeOpacity: 0.8,
	      strokeWeight: 2,
	      fillColor: '#FF0000',
	      fillOpacity: 0.35,
	      map: map,
	      center:  new google.maps.LatLng(latitude, longitude),
	      radius: 50000
	    };
	    // Add the circle for this city to the map.
	    var dataCircle = new google.maps.Circle(circleOptions);
	    dataCircle.setEditable(true);
	    
	    google.maps.event.addListener(dataCircle, 'radius_changed', function() {
	    	  console.log(dataCircle.getRadius());
	    	});

	    google.maps.event.addListener(dataCircle, 'center_changed', function() {
	    	  console.log('Vertex moved.');
	    	});

  }




google.maps.event.addDomListener(window, 'load', init);

const base_geolocation_url = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=true&language=EN&latlng=';

function rad(x) {return x*Math.PI/180;}

function distHaversine(p1, p2) {
  var R = 6371; // earth's mean radius in km
  var dLat  = rad(p2.lat() - p1.lat());
  var dLong = rad(p2.lng() - p1.lng());

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return d.toFixed(3);
}

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
	var currentLoc = new google.maps.LatLng(latitude, longitude);
	var mapOptions = {
      zoom: 6,
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
	      center: currentLoc,
	      radius: 50000
	    };
	    // Add the circle for this city to the map.
	    var dataCircle = new google.maps.Circle(circleOptions);

	    var geocode = getQuerySting("geocode");
	    //alert('param '+geocode);
	    if (geocode != null && geocode.length > 0) {
	    	geocode = LZString.decompressFromBase64(geocode);
	    	var startIndex = geocode.indexOf("[[");
	    	var endIndex = geocode.indexOf("]]}");
	    	geocode = geocode.substring(startIndex+1, endIndex+1);
	    	//alert('new geocode '+geocode);
	    	
	    	var polygon = JSON.parse(geocode);
	    	//alert('polygon length '+polygon.length);
    		var polygonCoords = [];
	    	for (var i = 0; i < polygon.length; i++) {
	    		var coords = polygon[i];
	    		var coordArray = JSON.stringify(coords).split(",");
	    		var lat = coordArray[1].trim().replace("]", "");
	    		var lng = coordArray[0].trim().replace("[", "");
	    		
	    		var point = new google.maps.LatLng(lat, lng);
	    		polygonCoords.push(point);
	    	}
	    	
	    	// Construct the polygon.
	    	  var polygonShape = new google.maps.Polygon({
	    	    paths: polygonCoords,
	    	    strokeColor: '#FF0000',
	    	    strokeOpacity: 0.8,
	    	    strokeWeight: 3,
	    	    fillColor: '#FF0000',
	    	    fillOpacity: 0.35,
	    	    map: map
	    	  });

	    	  //var distance = google.maps.geometry.spherical.computeDistanceBetween(currentLoc, polygonCoords[0]);
	    	  var distance = distHaversine(currentLoc, polygonCoords[0]);
	    	  
	    	  var line = new google.maps.Polyline({
	    		    path: [currentLoc, polygonCoords[0]],
	    		    strokeColor: "#FF0000",
	    		    strokeOpacity: 0.9,
	    		    strokeWeight: 5,
	    		    map: map
	    		});
	    	  

	    	  var infoWindow = new google.maps.InfoWindow({ maxWidth: 168 });
	    	  infoWindow.setContent(distance+" KM");
	    	  var newCoord = new google.maps.LatLng((currentLoc.lat()+polygonCoords[0].lat())/2, (currentLoc.lng()+polygonCoords[0].lng())/2); 
	    	  //alert('new pos '+newCoord.lat()+' : '+newCoord.lng());
	    	  infoWindow.setPosition(newCoord);
	    	  infoWindow.open(map);
	    }
  }

function getQuerySting(Key) {
    var url = window.location.href;
    KeysValues = url.split(/[\?&]+/);
    for (i = 0; i < KeysValues.length; i++) {
        KeyValue = KeysValues[i].split("=");
        if (KeyValue[0] == Key) {
            return KeyValue[1];
        }
    }
}


google.maps.event.addDomListener(window, 'load', init);

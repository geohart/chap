// get current user's position and refresh every 60 seconds
$(document).ready(function() {	
	
	updatePosition();
	setInterval("updatePosition()", 10000);
	
});

// use browser geolocation to get user lat, lon
function updatePosition() {
   
    // check if browser supports geolocation:
	if(navigator.geolocation) {
	
		// get current position
		navigator.geolocation.getCurrentPosition(function(position){
			// ajax post to database
			//$.post('/updateposition', {lat: position.coords.latitude, lon: position.coords.longitude, time: new Date().getTime()}, function(data) {
			  //alert('position updated');
			//});
			
			// update hidden field values
			$('#lat').val(position.coords.latitude);
			$('#lon').val(position.coords.longitude);
		});
	}
}
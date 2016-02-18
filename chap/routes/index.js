var express = require('express');
var router = express.Router();
var model  = require('./model');

/* GET home page */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ChapeDrone' });
});

/* GET trip page */
router.get('/trip/:id', function(req, res, next) {
	
	// look up trip
	var trip = model.Trip.findOne({'_id': req.params.id}, function(err, trip){
		if (err) return console.error(err);
		
		// get community
		var community = model.Community.findOne({'_id': trip.user.comm_id}, function(err, community){
			if (err) return console.error(err);
			
			// TODO: calculate current distance/time to destination
			
			res.render('trip', { 
				  title: 'ChapeDrone'
				, tripId: trip._id
				, name: trip.user.name
				, school: community.name
				, phone: community.phone
				, miles: 0.5
				, mins: 12
				, originLat: trip.origin.lat
				, originLon: trip.origin.lon
				, destinLat: trip.dest.lat
				, destinLon: trip.dest.lon});			
		});		
	});
});

/* GET monitor page */
router.get('/monitor', function(req, res, next){
	res.render('monitor', {title: 'Monitor', school: 'Harvard' });
});

/* POST new trip */
router.post('/start', function(req, res, next){
	
	console.log(req.body);
	
	// get the current time
	var startTime = Date.now();
	
	// estimate trip duration
	var tripDuration = 10;
	
	// get the origin position
	var origin = new model.Position({lat : req.body.lat, lon : req.body.lon, time : startTime});
	
	// get the destination position
	var destin = new model.Position({lat : req.body.destlat, lon : req.body.destlon, time : startTime + tripDuration});
	
	// create new community 
	// TODO: allow user to select their community from a drop down
	var comm = new model.Community({
		  name: 'Harvard Business School'
		, phone: '555-555-5555'
	})
	
	comm.save(function(err, comm){
		
		if (err) return console.error(err);
		
		// create new user
		var user = new model.Person({
			  name: 	req.body.name
			, phone:	req.body.phone 
			, comm_id:	comm._id
		});
		
		user.save(function(err, user){
		
			if (err) return console.error(err);
			
			// output user to console
			console.log(user);
			
			// create a new trip
			var trip = new model.Trip({
				  user		: user
				, startTime : startTime
				, duration 	: tripDuration
				, origin 	: origin
				, dest		: destin
				, destName 	: req.body.destination
				, status 	: 0
				, complete 	: 0
				, waypoints : [origin]
			});
			
			trip.save(function(err, trip){
				
				if (err) return console.error(err);
			
				// output trip to console
				console.log(trip);
				
				// send to trip view
				res.redirect('/trip/' + trip._id);
				
			});
		});
	});
});

/* POST end trip */
router.post('/end/:id', function(req, res, next){
	
	console.log(req.body);
	
	// look up trip
	var trip = model.Trip.findOne({'_id': req.params.id}, function(err, trip){
		if (err) return console.error(err);
		
		// update trip status
		trip.complete = 1;
		
		// save
		trip.save(function(err, trip){
			
			if (err) return console.error(err);
			
			// send to index view
			res.redirect('/');
			
		});
	});
});

module.exports = router;

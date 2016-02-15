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
			
			// calculate current distance/time to destination
			
			res.render('trip', { title: 'ChapeDrone', name: trip.user.name, school: community.name, miles: 0.5, mins: 12 });			
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
	var origin = new model.Position({lat : 30, lon : 40, time : startTime});
	
	// get the destination position
	var destin = new model.Position({lat : 30, lon : 40, time : startTime + tripDuration});
	
	// create new user
	var user = new model.Person({
		  name: 	req.body.name
		, phone:	req.body.phone 
		, comm_id:	'56c0fb45715ff4b80a26e487'
	});
	
	user.save(function(err, user){
		console.log('here comes origin');
		console.log(origin);
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

module.exports = router;

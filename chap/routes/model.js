var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

// connect to database
mongoose.connect('mongodb://localhost/chap');

// setup a database reference variable
var db = mongoose.connection;

// handle connection errors
db.on('error', console.error.bind(console, 'connection error:'));

// handle successful connection
db.once('open', function() {
	
  // define schemas and compile into models:
  // community
  var communitySchema = mongoose.Schema({
	    name: String
  });
  var Community = mongoose.model('community', communitySchema);
  
  // person
  var personSchema = mongoose.Schema({
	    name: String
	  , phone: String
	  , comm_id: { type: ObjectId, ref: 'Community' }
  });
  var Person = mongoose.model('person', personSchema);
  
  // position
  var positionSchema = mongoose.Schema({
	    time: Number
	  , lat: Number
	  , lon: Number
  });
  var Position = mongoose.model('position', positionSchema);
  
  // trip
  var tripSchema = mongoose.Schema({
	    user: personSchema
	  , startTime: Number
	  , duration: Number
	  , origin: positionSchema
	  , dest: positionSchema
	  , waypoints: [positionSchema]
	  , destName: String
	  , status: Number
	  , complete: Number		
  });
  var Trip = mongoose.model('trip', tripSchema);
  
  exports.Community = Community;
  exports.Person = Person;
  exports.Trip = Trip;
  exports.Position = Position;
  
});

exports.db = db;



/*exports.Community;
exports.Person;
exports.Position;
exports.Trip;*/

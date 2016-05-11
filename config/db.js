var MongoClient = require('mongodb').MongoClient

var config = {
        "USER" : "tennis",
        "PASS" : "tennis123",
        "HOST" : "192.168.1.33",
        "PORT" : "27017",
        "DATABASE" : "tennis"
};

var dbPath = "mongodb://"+config.USER+":"+config.PASS+"@"+config.HOST+":"+config.PORT+"/"+config.DATABASE;

var db;
/*var error;
var waiting = []; // Callbacks waiting for the connection to be made

MongoClient.connect(dbPath,function(err,database){
  error = err;
  db = database;

  waiting.forEach(function(callback) {
    callback(err, database);
  });
});

module.exports = function(callback) {
  if (db || error) {
    callback(error, db);
  } else {
    waiting.push(callback);
  }
}
*/
module.exports = {
  connect: function(callback){
    MongoClient.connect(dbPath,function(err,database){
    	if (err )
        return console.log(err);

      db = database;
      callback();
    });
  },
  getDB: function() {
    return db;
  }
  ,
  getTournaments: function(callback){
    db.collection('tournaments').find({},{tournamentName:1,tournamentYear:1}).toArray(function(err, result) {
  		if(err) return console.log(err);
      callback(result);
    })
  },

  getTournamentById: function(callback,id){
    db.collection('tournaments').findOne(
      {"_id": new ObjectId(id)}, function(err, result) {
        if(err) return console.log(err);
        callback(result);
    })
  }
}

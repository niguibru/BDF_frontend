var dbUtils = require('./dbUtils');

dbUtils.connectToDb(function(err, db) {
  if (err) throw err;
  var teams = db.collection('matches');
  
  exports.findAll = function(cb) {
    teams.find().toArray(function(err, results){
      cb(results);
    })
  }
  
  exports.clear = function() {
    teams.remove({},function(err){
    });
  }
  
  exports.insert = function(newData, cb) {
    teams.insert(newData ,function(err){  
    });
  }
  
});


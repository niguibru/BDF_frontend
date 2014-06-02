var mongoose = require('mongoose');

var schema = mongoose.Schema;
log_scheema = new schema(
  {
    'soId': String, 
    'datetime': String, 
    'page': String
  });
log = mongoose.model('logProd', log_scheema);

exports.findAll = function(cb) {
  log.find({},function(err, results){
    cb(results);
  })
};

exports.insert = function(newData) {
  new log(newData).save(function (errS) {
    //console.log('Log saved');
  });
};


var mongoose = require('mongoose');

var schema = mongoose.Schema;
abr_scheema = new schema(
  {
    'nameId': String, 
    'abr': String, 
  });
teamsAbr = mongoose.model('teams_abrs', abr_scheema);

exports.findAll = function(cb) {
  teamsAbr.find({},function(err, results){
    cb(results);
  })
};

exports.findOne = function(toFind, cb) {
  teamsAbr.find(toFind,function(err, results){
    cb(results);
  })
};

exports.insert = function(newData, cb) {
  teamsAbr.find({nameId: newData.nameId},function(errF, results){
    if (results.length > 0 || errF) {
      console.log('Team abr allready exist: ' + results[0].nameId);
      cb('Team abr allready exist: ' + results[0].nameId + '-' + results[0].abr);
    } else {
      new teamsAbr(newData).save(function (errS) {
        console.log('Team abr saved: ' + newData.nameId);
        cb('Team abr added: ' + newData.nameId);
      });
    }
  })
};


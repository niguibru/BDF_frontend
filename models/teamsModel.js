var mongoose = require('mongoose');
var teamsAbrModel = require('./teams_abrsModel');

var schema = mongoose.Schema;
teams_scheema = new schema(
  {
    'nameId': String, 
    'teamIndex': String, 
    'name': String, 
    'abr': String, 
    'group': {
                'letter': String, 
                'groupNumber': String
             }
  });
teams = mongoose.model('teams', teams_scheema);

exports.findAll = function(cb) {
  teams.find({},function(err, results){
    cb(results);
  })
};

exports.clear = function(cb) {
  teams.remove({},function(err){
    console.log('All teams deleted');
    cb();
  })
};

exports.insert = function(newData) {
  teamsAbrModel.findOne({nameId: newData.nameId}, function(data){
    if (data.length > 0) {
      newData.abr = data[0].abr;
    }
    new teams(newData).save(function (err) {
      console.log('Team added: ' + newData.name);
    });
  })
};



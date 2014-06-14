var mongoose = require('mongoose');
var teamsAbrModel = require('./teams_abrsModel');

var schema = mongoose.Schema;
matches_scheema = new schema(
  {
    'numId': String, 
    'type': String,
    'date': String, 
    'time': String, 
    'txtDateTime': String, 
    'group': {
      'letter': String,
      'number': String,
    }, 
    'local': {
      'name': String, 
      'abr': String, 
      'nameId': String,
      'goals': String,
    },
    'visitor': {
      'name': String,
      'abr': String, 
      'nameId': String,
      'goals': String,
    },
    'status': String, 
    'live_minute': String,
    'events': {
                  'cards': [{
                    minute: Number,
                    action: String,
                    action_type: String,
                    player: String,
                    player_id: String,
                    action_icon: String,
                    team: String
                  }],
                  'goals': [{
                    minute: Number,
                    action: String,
                    action_type: String,
                    player: String,
                    player_id: String,
                    action_icon: String,
                    team: String
                  }],
                  'changes': [{
                    minute: Number,
                    action: String,
                    action_type: String,
                    player: String,
                    player_id: String,
                    action_icon: String,
                    team: String
                  }]
               }
  });
matches = mongoose.model('matches', matches_scheema);


exports.findAll = function(cb) {
  matches.find({}).sort('date').sort('time').exec(function(err, results){
    cb(results);
  })
}

exports.findByDate = function(date, cb) {
  matches.find({date: date}).sort('date').sort('time').exec(function(err, results){
    cb(results);
  })
}

exports.findByNumId = function(numId, cb) {
  matches.findOne({numId: numId}).exec(function(err, match){
    cb(match);
  })
}

exports.updateMatch = function(matchToUpdate, events) {
  matches.findOne({numId: matchToUpdate.numId}).exec(function(err, matchDb){
    matchDb = matchToUpdate;
    matchDb.save(function (err) {
      if (err) console.log(err);
    });
  })
}
//
//exports.saveEventsInMatch = function(numId, events) {
//  matches.findOne({numId: numId}).exec(function(err, match){
//    match.events = events;
//    match.save(function (err) {
//      if (err) console.log(err);
//    });
//  })
//}
//
exports.clear = function(cb) {
  matches.remove({},function(err){
    console.log('All matches deleted');
    cb();
  })
}

exports.insert = function(newData, cb) {
  teamsAbrModel.findOne({nameId: newData.local.nameId}, function(dataL){
    if (dataL.length > 0) {
      newData.local.abr = dataL[0].abr;
    }
    teamsAbrModel.findOne({nameId: newData.visitor.nameId}, function(dataV){
      if (dataV.length > 0) {
        newData.visitor.abr = dataV[0].abr;
      }
      new matches(newData).save(function (err) {
        console.log('Match added');
        console.log('Local : ' + newData.local.name);
        console.log('Visitor : ' + newData.visitor.name);
      });
    })    
  })
}






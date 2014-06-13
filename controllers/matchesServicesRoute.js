var request = require("request");
var utils = require("./utils/utils");
var matchesModel = require('../models/matchesModel');

module.exports = exports = {

  // Web Services
  matchesComplete: function(req, res) {  
    matchesModel.clear(function(){
      rounds = utils.getRounds();
      for (var round=1; round <= rounds; round++) {
        request({
          url: utils.matches_getApiUrl(round),
          json: true
        }, function (error, response, data) {
          if (!error && response.statusCode === 200) {
            matchesArray = data.match;
            for(var matchIndex in matchesArray) {
              matchToAdd = utils.matches_builJsonMatch(matchesArray[matchIndex]);
              matchesModel.insert(matchToAdd);
            }
          }
        })
      }
      res.json({teams: 'All matches added'});  
    })
  },
  matches: function(req, res) {
    matchesModel.findAll(function(data){
      res.json(data);
    })
  },
  
  // Node Services
  findByNumId: function(numId, cb) {  
    matchesModel.findByNumId(numId, function(match){
      cb(match);
    });
  },
  matchesToday: function(cb) {
    var date = utils.nowInArgentina("YYYY/MM/DD");
    matchesModel.findByDate(date , function(data){
//      data = [ {  numId: '141496',
//                  type: 'G',
//                  date: '2014/06/13',
//                  time: '13:31:00',
//                  txtDateTime: '12 de junio, 17:00 hs',
//                  status: '-1',
//                  live_minute: '',
//                  _id: '53827bf82d4290000077368b',
//                  __v: '0',
//                  visitor: { name: 'Croacia', abr: 'CRO', nameId: 'croacia', goals: 'x' },
//                  local: { name: 'Brasil', abr: 'BRA', nameId: 'brasil', goals: 'x' },
//                  group: { letter: 'A', number: '1' } 
//              } ];
//        
      cb(data);
    })
  },
  getMatchEvents: function(matchId, cb) {  
    request({
      url: utils.matches_getState(matchId),
      json: true
    }, function (error, response, data) {
      if (!error && response.statusCode === 200) {
        cb(data);
      }
    })
  },
  updateMatch: function(matchToUpdate, cb) {  
    matchesModel.updateMatch(matchToUpdate);
  },
  
}


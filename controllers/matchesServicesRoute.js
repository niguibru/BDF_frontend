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
          if (!error) {
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
      cb(data);
    })
  },
  updateMatch: function(matchToUpdate, cb) {  
    matchesModel.updateMatch(matchToUpdate);
  },
  findByPosGroup: function(posGroup, cb) {  
    matchesModel.findByPosGroup(posGroup, function(match){
      cb(match);
    });
  },
  
}


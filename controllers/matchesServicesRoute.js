var request = require("request");
var utils = require("./utils/utils");
var matchesModel = require('../models/matchesModel');

module.exports = exports = {

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
  }
  
}


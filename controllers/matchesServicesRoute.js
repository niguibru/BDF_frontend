var matchesModel = require('../models/matchesModel');
var request = require("request");
var utils = require("./utils/utils");

module.exports = exports = {

  matchesComplete: function(req, res) {
    matchesModel.clear();
    
    rounds = utils.getRounds();
    for (var round=1; round <= rounds; round++) {
      request({
        url: utils.matches_getApiUrl(),
        json: true
      }, function (error, response, data) {
        if (!error && response.statusCode === 200) {
          allMatchesToAdd = [];
          matchesArray = data.match;
          for(var matchIndex in matchesArray) {
            matchToAdd = utils.matches_builJsonMatch(matchesArray[matchIndex]);
            allMatchesToAdd.push(matchToAdd);
          }
          matchesModel.insert(allMatchesToAdd, function(err){
            throw err;
          })
          res.json(allMatchesToAdd); 
        }
      })
    }
  },
  
  matches: function(req, res) {
    matchesModel.findAll(function(data){
      res.json(data);
    })
  }
  
}


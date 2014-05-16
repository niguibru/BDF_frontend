var teamsModel = require('../models/teamsModel');
var request = require("request");
var utils = require("./utils/utils");

module.exports = exports = {

  // TEAMS
  teamsComplete: function(req, res) {
    request({
      url: utils.teams_getApiUrl(),
      json: true
    }, function (error, response, data) {
      if (!error && response.statusCode === 200) {
        teamsModel.clear();
        
        allTeamsToAdd = [];
        teamsArray = data.table;
        for(var teamIndex in teamsArray) {
          teamToAdd = utils.teams_builJsonTeam(teamsArray[teamIndex], teamIndex);
          allTeamsToAdd.push(teamToAdd);
        }
        teamsModel.insert(allTeamsToAdd, function(){
          throw err;
        })
        res.json(allTeamsToAdd); 
      }
    })
  },
  
  teams: function(req, res) {
    teamsModel.findAll(function(data){
      res.json(data);
    })
  }

}
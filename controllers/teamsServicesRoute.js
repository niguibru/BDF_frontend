var request = require("request");
var utils = require("./utils/utils");
var teamsModel = require('../models/teamsModel');
var teamsAbrModel = require('../models/teams_abrsModel');

module.exports = exports = {

  // Web Services
  //  teams
  teamsComplete: function(req, res) {
    request({
      url: utils.teams_getApiUrl(),
      json: true
    }, function (error, response, data) {
      if (!error && response.statusCode === 200) {
        teamsModel.clear(function(){
          teamsArray = data.table;
          for(var teamIndex in teamsArray) {
            teamToAdd = utils.teams_builJsonTeam(teamsArray[teamIndex], teamIndex);
            teamsModel.insert(teamToAdd);
          }
          res.json({teams: 'All teams added'});    
        })
      }
    })
  },
  teams: function(req, res) {
    teamsModel.findAll(function(data){
      res.json(data);
    })
  },
  teamsByNameId: function(req, res) {
    teamsModel.findByNameId(req.query.nameId, function(data){
      res.json(data);
    })
  },
  
  // Node Services
  updateTeam: function(team) {
    teamsModel.updateTeam(team)
  },
  nTeamsByNameId: function(nameId, cb) {
    teamsModel.findByNameId(nameId, function(data){
      cb(data);
    })
  },
  
  
  //  teams_abbrs
  teams_abrs: function(req, res) {
    teamsAbrModel.findAll(function(data){
      res.json(data);
    })
  },
  teams_abrsComplete: function(req, res) {
    var nameId = req.query.nameId;
    var abr = req.query.abr;
    teamsAbrModel.insert({nameId: nameId, abr: abr}, function(msg){
      res.json({teams_abrs: msg});    
    })
  }
}

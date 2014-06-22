var request = require("request");

var apiUrl = "http://www.resultados-futbol.com/scripts/api/api.php";
//var apiKey = '?key=316c3695459c00f218b7a8d39382e5cf'; // niguibru@gmail.com
var apiKey = '?key=763440d17fc56443f173349dc91b9d57'; // bochadefutbol@gmail.com
var format = '&format=json';
var league = '&league=136'; // 136 = World Cup 2014
var table = '&req=tables';
var match = '&req=match';
var matchs = '&req=matchs';
var groupAll = '&group=all';
var group = '&group=';


function getState_URL(matchId) {
  var completeUrl = apiUrl + apiKey + format + match + '&id=' + matchId;
  return completeUrl;
}
function getTeamGrpPosition_URL(grpId) {
  var completeUrl = apiUrl + apiKey + format + table + league + group + grpId;
  return completeUrl;
}


module.exports = exports = {
  
  // Node Services
  getMatchEvents: function(matchId, cb) {  
    request({
      url: getState_URL(matchId),
      json: true
    }, function (error, response, data) {
      if (!error && response.statusCode === 200) {
        cb(data);
      }
    })
  },
  
  getTeamGrpPosition: function(grpId, cb) {  
    request({
      url: getTeamGrpPosition_URL(grpId),
      json: true
    }, function (error, response, data) {
      if (!error && response.statusCode === 200) {
        cb(data);
      }
    })
  }
  
}







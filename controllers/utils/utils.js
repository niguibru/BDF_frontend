var apiUrl = "http://www.resultados-futbol.com/scripts/api/api.php";
var apiKey = '?key=316c3695459c00f218b7a8d39382e5cf';
var format = '&format=json';
var league = '&league=136'; // 192 = World Cup 2014
var table = '&req=tables';
var matchs = '&req=matchs';
var group = '&group=all';

var groupLetters = ['all','A','B','C','D','E','F','G','H'];
var rounds = 3;

exports.getGroupLetters = function() {
  return groupLetters;
}

exports.getRounds = function() {
  return rounds;
}

// TEAMS
exports.teams_getApiUrl = function() {
  var completeUrl = apiUrl + apiKey + format + league + table + group;
  return completeUrl;
}

exports.teams_builJsonTeam = function(actualTeam, teamIndex) {
  var nameId = actualTeam.team.replace(/\s/g,'').toUpperCase();
  var name = actualTeam.team;
  var group = groupLetters[actualTeam.group];
  var groupNumber = actualTeam.group;
  var teamToAdd = {
                    'nameId': nameId, 
                    'teamIndex': teamIndex, 
                    'name': name, 
                    'group': {
                                'letter': group, 
                                'groupNumber': groupNumber
                             }
                  };
  return teamToAdd;
}

// MATCHES
exports.matches_getApiUrl = function() {
  var completeUrl = apiUrl + apiKey + format + league + table + matchs;
  return completeUrl;
}

exports.matches_builJsonMatch = function(actualMatch) {
  var numId = actualMatch.id;
  var type = 'G'; // Group type
  var group_letter = groupLetters[actualMatch.group_code];
  var group_number = actualMatch.group_code;
  var date = actualMatch.date;
  var hour = actualMatch.hour;
  var minute = actualMatch.minute;
  var local_name = actualMatch.local;
  var local_nameId = actualMatch.local.replace(/\s/g,'').toUpperCase();
  var local_goals = actualMatch.local_goals;
  var visitor_name = actualMatch.visitor;
  var visitor_nameId = actualMatch.visitor.replace(/\s/g,'').toUpperCase();
  var visitor_goals = actualMatch.visitor_goals;
  var status = actualMatch.status; // (-1 to play), (0 playing), (1 played)
  var result = actualMatch.result;
  var live_minute = actualMatch.live_minute ;
  var matchToAdd = {
                      'numId': numId, 
                      'type': type,
                      'date': date, 
                      'hour': hour, 
                      'minutes': minute,
                      'group': {
                        'letter': group_letter,
                        'number': group_number,
                      }, 
                      'local': {
                        'name': local_name, 
                        'nameId': local_nameId,
                        'goals': local_goals,
                      },
                      'visitor': {
                        'name': visitor_name, 
                        'nameId': visitor_nameId,
                        'goals': visitor_goals,
                      },
                      'status': status, 
                      'live_minute': live_minute
                   };
  return matchToAdd;
}

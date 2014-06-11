var moment = require('moment');
var teamsModel = require('../../models/teamsModel');

var apiUrl = "http://www.resultados-futbol.com/scripts/api/api.php";
var apiKey = '?key=316c3695459c00f218b7a8d39382e5cf';
var apiKeyBocha = '?key=763440d17fc56443f173349dc91b9d57';
var format = '&format=json';
var league = '&league=136'; // 192 = World Cup 2014
var table = '&req=tables';
var match = '&req=match';
var matchs = '&req=matchs';
var group = '&group=all';

var groupLetters = ['all','A','B','C','D','E','F','G','H'];
var rounds = 3;

// public var
exports.getGroupLetters = function() {
  return groupLetters;
}
exports.getRounds = function() {
  return rounds;
}

// To lowercase and not rare 
var normalize = (function() {
  var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
      to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      mapping = {};
 
  for(var i = 0, j = from.length; i < j; i++ )
      mapping[ from.charAt( i ) ] = to.charAt( i );
 
  return function( str ) {
      var ret = [];
      for( var i = 0, j = str.length; i < j; i++ ) {
          var c = str.charAt( i );
          if( mapping.hasOwnProperty( str.charAt( i ) ) )
              ret.push( mapping[ c ] );
          else
              ret.push( c );
      }
      return ret.join( '' );
  }
 
})();

// Get current time at Argentina
var moment = require('moment-timezone');
exports.nowInArgentina = (function (format) {
//  var format = 'YYYY/MM/DD HH:mm:ss ZZ';
  return moment().tz("America/Argentina/Buenos_Aires").format(format);
});

// TEAMS
exports.teams_getApiUrl = function() {
  var completeUrl = apiUrl + apiKey + format + league + table + group;
  return completeUrl;
}

exports.teams_builJsonTeam = function(actualTeam, teamIndex) {
  var nameId = actualTeam.team.replace(/\s/g,'').toLowerCase();
  nameId = normalize(nameId);
  var name = actualTeam.team;
  var group = groupLetters[actualTeam.group];
  var groupNumber = actualTeam.group;
  var teamToAdd = {
                    'nameId': nameId, 
                    'teamIndex': teamIndex, 
                    'name': name,
                    'abr': name,
                    'group': {
                                'letter': group, 
                                'groupNumber': groupNumber
                             }
                  };
  return teamToAdd;
}

// MATCHES
exports.matches_getApiUrl = function(round) {
  var completeUrl = apiUrl + apiKey + format + league + table + matchs + '&round=' + round;
  return completeUrl;
}

exports.matches_getState = function(matchId) {
  var completeUrl = apiUrl + apiKey + format + match + '&id=' + matchId;
  return completeUrl;
}

exports.matches_builJsonMatch = function(actualMatch) {
  moment.lang('es');
  
  var numId = actualMatch.id;
  var type = 'G'; // Group type
  var group_letter = groupLetters[actualMatch.group_code];
  var group_number = actualMatch.group_code;
  var datetime = moment(actualMatch.date, "YYYY-MM-DD")
                .hour(actualMatch.hour - 5)
                .minute(actualMatch.minute)
                .second(00);
  var date =datetime.format('YYYY/MM/DD');
  var time = datetime.format('HH:mm');
  var txtDateTime = datetime.format('DD [de] MMMM, HH:mm [hs]');
  var local_name = actualMatch.local;
  var local_nameId = actualMatch.local.replace(/\s/g,'').toLowerCase();
  local_nameId = normalize(local_nameId);
  var local_goals = actualMatch.local_goals;
  var visitor_name = actualMatch.visitor;
  var visitor_nameId = actualMatch.visitor.replace(/\s/g,'').toLowerCase();
  visitor_nameId = normalize(visitor_nameId);
  var visitor_goals = actualMatch.visitor_goals;
  var status = actualMatch.status; // (-1 to play), (0 playing), (1 played)
  var result = actualMatch.result;
  var live_minute = actualMatch.live_minute ;
  var matchToAdd = {
                      'numId': numId, 
                      'type': type,
                      'date': date, 
                      'time': time, 
                      'txtDateTime': txtDateTime, 
                      'group': {
                        'letter': group_letter,
                        'number': group_number,
                      }, 
                      'local': {
                        'name': local_name, 
                        'abr': local_name, 
                        'nameId': local_nameId,
                        'goals': local_goals,
                      },
                      'visitor': {
                        'name': visitor_name, 
                        'abr': visitor_name, 
                        'nameId': visitor_nameId,
                        'goals': visitor_goals,
                      },
                      'status': status, 
                      'live_minute': live_minute
                   };
  return matchToAdd;
}


var async = require('async');
var CronJob = require('cron').CronJob;
var utils = require('./utils/utils');
var matches = require('./matchesServicesRoute');
var resultsApi = require('./resultsApiService');
var teams = require('./teamsServicesRoute');

var socketIo = null;
var serverDifHours = 3;

exports.start = function(io) {
  
  socketIo = io;
  
  // All days at 00:00 get day matches
  var job = new CronJob('0 0 0 * * *', function(){
      setTimeForTodaysMatches();
    }, function () {
      // This function is executed when the job stops
      console.log('STOP - Day 00:00 checker');
    },
    true /* Start the job right now */,
    "America/Argentina/Buenos_Aires" /* Time zone of this job. */
  );

  // when server start chck todays maches
  setTimeForTodaysMatches();
//  calculateKeyClasification(1);
//  updateTeamGroupPosition('argelia', '8');
}
 
// Get all matches and set time schedule
function setTimeForTodaysMatches () {
  matches.matchesToday(function(data){
    console.log("/////// Today's Matchs ///////");
    // Iterate matches today and schedule
    data.forEach(function(match){
      // Set server time to start match
      var time = new Date(match.date + ' ' + match.time) ;
      time.setSeconds(time.getSeconds() + 5);       
      time.setHours(time.getHours() + serverDifHours);  
      console.log('  ' + match.numId + ' -> ' + match.local.name + ' - ' + match.visitor.name + ' -> ServerTime: ' + time);

      // Get match state in API
      resultsApi.getMatchEvents(match.numId, function(matchState){
        // Check if not match to play
        if (!matchToPlay(matchState.status)) {
          console.log('  ' + match.numId + ' -> playing or played -> Status ' + matchState.status);
          
          // Find Match in DB
          matches.findByNumId(match.numId,function(matchDb){
            // Update macth and new events
            updateMatchAndAddEvents(matchDb, matchState);
            if (matchPlaying(matchState.status)){
              // cambia la hora a la actual + 30sec asi empieza a seguirlo
              time = new Date();
              time.setMinutes(time.getMinutes() + 1);     
              console.log('  ' + match.numId + ' -> playing -> will start at: ' + time);
              setTimeSchedule(time, match);
            } else {
              // if "group" match update team positions
              if (matchDb.type == 'G'){
                async.series([
                  updateTeamGroupPosition(matchDb.local.nameId, matchDb.group.number),
                  updateTeamGroupPosition(matchDb.visitor.nameId, matchDb.group.number),
                  calculateKeyClasification(matchDb.group.number)
                ]);
              }
            }
          });
        } 
        
        // Schedule Match
        setTimeSchedule(time, match);
      })
    })
  })
};

// Set time schedule & set follow
function setTimeSchedule (time, match) {
  console.log('\n' + '-> Scheduling match -> ' + match.numId + ' -> ' + match.local.name + ' - ' + match.visitor.name + ' -> ServerTime: ' + time + ' -> LocalTime: ' + match.time);
  var job = new CronJob(time, function(){
      // Follow match
      console.log('\n' + '-> Following match -> ' + match.numId + ' -> ' + match.local.name + ' - ' + match.visitor.name + ' -> LocalTime:' + match.time);
      followMatch(match.numId);

    }, function () {
      // This function is executed when the job stops
      console.log('STOP - Match played - ' + match.numId);
    },
    true /* Start the job right now */,
    "America/Argentina/Buenos_Aires" /* Time zone of this job. */
  );
}

// Follow match result
function followMatch (matchNumId) {
  var job = new CronJob('0 * * * * *', function(){
    // Go to results server and check
    resultsApi.getMatchEvents(matchNumId, function(matchState){
      console.log('  ' + matchState.live_minute + ' -> ' + matchState.result + ' -> status ' + matchState.status);
      // Chack is match finished 
      if (matchPlaying(matchState.status)) {
        // Find Match in DB
        matches.findByNumId(matchNumId,function(matchDb){
          // If New goals, send goals to front popup
          if (haveNewGoals(matchDb.events.goals, matchState.events)) emitGoal(matchDb, matchState);
          // Update macth, new events and send match to front
          updateMatchAndAddEvents(matchDb, matchState);                                     
        });
      } else {
        if (matchToPlay(matchState.status)) {
          console.log('  Match To Play');
        } else {
          // Find Match in DB
          matches.findByNumId(matchNumId,function(matchDb){
            // Update macth and new events
            updateMatchAndAddEvents(matchDb, matchState);
            // if "group" match update team positions
            if (matchDb.type == 'G'){
              async.series([
                updateTeamGroupPosition(matchDb.local.nameId, matchDb.group.number),
                updateTeamGroupPosition(matchDb.visitor.nameId, matchDb.group.number),
                calculateKeyClasification(matchDb.group.number)
              ]);
            }
            
            job.stop();                                              
          });
        }
      }
    })
  }, function () {
    // This function is executed when the job stops
    console.log('STOP - Match finished -> ' + matchNumId);
  },
  true /* Start the job right now */,
  "America/Argentina/Buenos_Aires" /* Time zone of this job. */
  );
}

// Update macth and new events
function updateMatchAndAddEvents(matchToUpdate, newMatchState){
  console.log(' updating match')
  matchToUpdate.events = newMatchState.events;
  matchToUpdate.local.goals = newMatchState.local_goals;
  matchToUpdate.visitor.goals = newMatchState.visitor_goals; 
  matchToUpdate.live_minute = newMatchState.live_minute; 
  matchToUpdate.status = newMatchState.status;
  matches.updateMatch(matchToUpdate);
  socketIo.sockets.emit("actualizeMatch", {match: matchToUpdate});
}

// Send goals to front popup
function emitGoal(match, matchState){
  console.log('     checking local team goal ' + parseInt(match.local.goals) + ' < ' + parseInt(matchState.local_goals));
  if (parseInt(match.local.goals) < parseInt(matchState.local_goals) ) {
    match.local.goals = matchState.local_goals;
    socketIo.sockets.emit("newMatchEvents", {event: 'Gooool de ' + match.local.name,
                                             mtcNumId: match.numId});
    console.log('     Goooooool de ' + match.local.nameId);
  }
  console.log('     checking visitor team goal ' + parseInt(match.visitor.goals) + ' < ' + parseInt(matchState.visitor_goals));
  if (parseInt(match.visitor.goals) < parseInt(matchState.visitor_goals)) {
    match.visitor.goals = matchState.visitor_goals;
    socketIo.sockets.emit("newMatchEvents", {event: 'Gooool de ' + match.visitor.name,
                                             mtcNumId: match.numId});
    console.log('     Goooooool de ' + match.visitor.nameId);
  }
}

// Chack is match finished
function matchPlaying(status){
  var auxMatchPlaying = (status == '0')
  return auxMatchPlaying;
}

// Chack is match finished
function matchToPlay(status){
  var auxMatchToPlay = (status == '-1')
  return auxMatchToPlay;
}

// Chack if have new goals
function haveNewGoals(goals, events){
  var auxHaveNewGoals = false;
  if (events.goals != undefined){
    if (goals != undefined) {
      if (events.goals.length != goals.length) {
        console.log('     New Events -> Goals');
        auxHaveNewGoals = true;
      } 
    } else {
      console.log('     New Events -> Goals');
      auxHaveNewGoals = true;
    }
  }
  return auxHaveNewGoals;
};

// Chack if have new player changes
function haveNewChanges(changes, events){
  var auxHaveNewChanges = false;
  if (events.changes != undefined){
    if (changes != undefined){
      if (events.changes.length != changes.length) {
        console.log('     New Events -> Changes');
        auxHaveNewChanges = true;
      }
    } else {
      console.log('     New Events -> Changes');
      auxHaveNewChanges = true;
    }
  }
  return auxHaveNewChanges;
};

// Chack if have new cards
function haveNewCards(cards, events){
  var auxHaveNewCards = false;
  if (events.cards != undefined){
    if (cards != undefined){
      if (events.cards.length != cards.length) {
        console.log('     New Events -> Cards');
        auxHaveNewCards = true;
      }
    } else {
      console.log('     New Events -> Cards');
      auxHaveNewCards = true;
    }
  }
  return auxHaveNewCards;
};

function updateTeamGroupPosition(nameId, groupNumber){
  nameId =  utils.toNameId(nameId);
  resultsApi.getTeamGrpPosition(groupNumber, function(tableData){
    tableData.table.forEach(function(grpTeam) {
      if (nameId == utils.toNameId(grpTeam.team)){
        teams.nTeamsByNameId(nameId, function(team){
          team.group = {
            letter: team.group.letter,
            groupNumber: team.group.groupNumber,
            ju: grpTeam.round,
            ga: grpTeam.wins,
            en: grpTeam.draws,
            pe: grpTeam.losses,
            gf: grpTeam.gf,
            gc: grpTeam.ga,
            dg: grpTeam.avg,
            pts: grpTeam.points
          }

          teams.updateTeam(team);
          console.log('   calc position of team ---->' + utils.toNameId(grpTeam.team)); 
          console.log(team.group);
        })
      }
    });
  });
}


function calculateKeyClasification(grpNum){
  teams.nfindByGroupNum(grpNum, function(grpTeams){
    if (allRoundsFinished(grpTeams)){
      console.log('All matches played in group ' + grpNum)
      saveToKeyMatch(grpTeams[0], 'p1g'+grpNum);
      saveToKeyMatch(grpTeams[1], 'p2g'+grpNum);
    } else {
      console.log('There are matches to playe in group ' + grpNum)
      for (iTeam = 0; iTeam < 2; iTeam++){
        if (!someTeamCouldExceed(iTeam, grpTeams)){
          var pos = iTeam + 1;
          saveToKeyMatch(grpTeams[iTeam], 'p'+pos+'g'+grpNum);
        } else {
          console.log('A '+grpTeams[iTeam].name+' lo pueden pasar');
          iTeam = grpTeams.length;
        }
      }
    }
  })
}

function allRoundsFinished(grpTeams){
  var resp = true;
  for (i = 0; i <= grpTeams.length - 1; i++){
    if (grpTeams[i].group.ju < 3){
      resp = false;
    }
  }
  return resp;
};

function someTeamCouldExceed(iTeam, grpTeams){
  var resp = false;
  for (i = iTeam; i <= grpTeams.length - 1; i++){
    toPlay = (3 - grpTeams[i].group.ju) * 3;
    if (grpTeams[iTeam].group.pts <  (grpTeams[i].group.pts + toPlay)){
      resp = true;
      i = grpTeams.length;
    }
  }
  return resp;
}

function saveToKeyMatch(grpTeam, posGroup){
  matches.findByPosGroup(posGroup, function(keyMatch){
    console.log('Take '+grpTeam.name+' for the key ' + posGroup);
    if (keyMatch != null){
      if (keyMatch.local.nameId == posGroup) {
        console.log(keyMatch.local.abr);
        keyMatch.local.nameId = grpTeam.nameId;
        keyMatch.local.name = grpTeam.name;
        keyMatch.local.abr = grpTeam.abr;
        matches.updateMatch(keyMatch);
      } else if (keyMatch.visitor.nameId == posGroup) {
        console.log(keyMatch.visitor.abr);
        keyMatch.visitor.nameId = grpTeam.nameId;
        keyMatch.visitor.name = grpTeam.name;
        keyMatch.visitor.abr = grpTeam.abr;
        matches.updateMatch(keyMatch);
      }
    } else {
      console.log('Match not found');
    }
  })
}



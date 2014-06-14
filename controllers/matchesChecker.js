var CronJob = require('cron').CronJob;
var matches = require('./matchesServicesRoute');
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

  var dateToLog = new Date(); 
  console.log('Server time now: '+ dateToLog);
  
  setTimeForTodaysMatches();
}
 
// Get all matches and set time schedule
function setTimeForTodaysMatches () {
  matches.matchesToday(function(data){
    console.log("/////// Today's Matchs ///////");
    // Iterate matches today and schedule
    data.forEach(function(match){
      var time = new Date(match.date + ' ' + match.time) ;
      time.setSeconds(time.getSeconds() + 5);       
      time.setHours(time.getHours() + serverDifHours);  
      console.log('  ' + match.numId + ' -> ' + match.local.name + ' - ' + match.visitor.name + ' -> ServerTime: ' + time);

      matches.getMatchEvents(match.numId, function(matchState){
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
    matches.getMatchEvents(matchNumId, function(matchState){
      console.log('  ' + matchState.live_minute + ' -> ' + matchState.result + ' -> status ' + matchState.status);
      // Chack is match finished 
      if (matchPlaying(matchState.status)) {
        // Find Match in DB
        matches.findByNumId(matchNumId,function(matchDb){
          // Chack if have New Events
//          if (haveNewGoals(matchDb.events.goals, matchState.events) || 
//              haveNewChanges(matchDb.events.changes, matchState.events) || 
//              haveNewCards(matchDb.events.cards, matchState.events)){
            // If New goals, send goals to front popup
            if (haveNewGoals(matchDb.events.goals, matchState.events)) emitGoal(matchDb, matchState);
            // Update macth, new events and send match to front
            updateMatchAndAddEvents(matchDb, matchState);
//          }                                            
        });
      } else {
        if (matchToPlay(matchState.status)) {
          console.log('  Match To Play');
        } else {
          // Find Match in DB
          matches.findByNumId(matchNumId,function(matchDb){
            // Update macth and new events
            updateMatchAndAddEvents(matchDb, matchState);
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
  console.log('     checking team goal ' + parseInt(match.local.goals) + ' < ' + parseInt(matchState.local_goals);
  if (parseInt(match.local.goals) < parseInt(matchState.local_goals) ) {
    match.local.goals = matchState.local_goals;
    socketIo.sockets.emit("newMatchEvents", {event: 'Gooool de ' + match.local.name});
    console.log('     Goooooool de ' + match.local.nameId);
  }
  console.log('     checking team goal ' + parseInt(match.visitor.goals) + ' < ' + parseInt(matchState.visitor_goals);
  if (parseInt(match.visitor.goals) < parseInt(matchState.visitor_goals)) {
    match.visitor.goals = matchState.visitor_goals;
    socketIo.sockets.emit("newMatchEvents", {event: 'Gooool de ' + match.visitor.name});
    console.log('     Goooooool de ' + match.visitor.nameId);
  }
}

// Chack is match finished
function matchPlaying(status){
  var auxMatchPlaying = (status == '0')
//  if (status == '-1') console.log('  Match To Play');
//  if (status == '0') console.log('  Match Playing');
//  if (status == '1') console.log('  Match Finished');
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






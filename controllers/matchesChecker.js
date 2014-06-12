var CronJob = require('cron').CronJob;
var matches = require('./matchesServicesRoute');


exports.start = function(io) {
  
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

  setTimeForTodaysMatches();
  
  // Get all matches and set time schedule
  function setTimeForTodaysMatches () {
    matches.matchesToday(function(data){
      console.log("/////// Today's Matchs ///////");
      // Iterate matches today and schedule
      data.forEach(function(match){
        var time = new Date(match.date + ' ' + match.time) ;
        time.setSeconds(time.getSeconds() + 5);        
        console.log('  ' + match.local.name + ' - ' + match.visitor.name + ' -> ' + time);
        
        // Schedule Match
        setTimeSchedule(time, match);
      });
    });
  };

  // Set time schedule & set follow
  function setTimeSchedule (time, match) {
    console.log('\n' + '-> Scheduling match -> ' + match.local.name + ' - ' + match.visitor.name + ' -> ' + match.time);
    var job = new CronJob(time, function(){
        // Follow match
        console.log('\n' + '-> Following match -> ' + match.local.name + ' - ' + match.visitor.name + ' -> ' + match.time);
        followMatch(match.numId);
      
      }, function () {
        // This function is executed when the job stops
        console.log('STOP - Match played');
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
          console.log('  ' + matchState.live_minute + ' -> ' + matchState.result);
          // Chack is match finished
          if (!matchFinished(matchState.status)) {
            // Find Match in DB
            matches.findByNumId(matchNumId,function(matchDb){
              // Chack if have New Events
              if (haveNewGoals(matchDb.events.goals, matchState.events) || 
                  haveNewChanges(matchDb.events.changes, matchState.events) || 
                  haveNewCards(matchDb.events.cards, matchState.events)){
                // Update macth, new events and send match to front
                updateMatchAndAddEvents(matchDb, matchState);
                // If New goals, send goals to front popup
                if (haveNewGoals(matchDb.events.goals, matchState.events)) emitGoal(match, matchState);
              }                                               
            });
          } else {
            // Update macth and new events
            matches.findByNumId(match.numId,function(matchDb){
              updateMatchAndAddEvents(matchDb, matchState);
              job.stop();
            });
          }
        })
      }, function () {
        // This function is executed when the job stops
        console.log('STOP - Match finished -> ' + match.local.name + ' - ' + match.visitor.name);
      },
      true /* Start the job right now */,
      "America/Argentina/Buenos_Aires" /* Time zone of this job. */
    );
  }
}

// Update macth and new events
function updateMatchAndAddEvents(matchToUpdate, newMatchState){
  matchToUpdate.events = newMatchState.events;
  matchToUpdate.local.goals = newMatchState.local_goals;
  matchToUpdate.visitor.goals = newMatchState.visitor_goals; 
  matchToUpdate.live_minute = newMatchState.live_minute; 
  matchToUpdate.status = newMatchState.status;
  matches.updateMatch(matchToUpdate);
  io.sockets.emit("actualizeMatch", {match: matchToUpdate});
}

// Send goals to front popup
function emitGoal(match, matchState){
  if (parseInt(match.local.goals) < parseInt(matchState.local_goals) ) {
    match.local.goals = matchState.local_goals;
    io.sockets.emit("newMatchEvents", {event: 'Gooool de ' + match.local.name});
    console.log('     Goooooool de ' + match.local.nameId);
  }
  if (parseInt(match.visitor.goals) < parseInt(matchState.visitor_goals)) {
    match.visitor.goals = matchState.visitor_goals;
    io.sockets.emit("newMatchEvents", {event: 'Gooool de ' + match.visitor.name});
    console.log('     Goooooool de ' + match.visitor.nameId);
  }
}

// Chack is match finished
function matchFinished(status){
  var auxMatchFinished = (status != 0)
  if (auxMatchFinished) console.log('  Match Finished');
  return auxMatchFinished;
}

// Chack if have new goals
function haveNewGoals(goals, events){
  var auxHaveNewGoals = false;
  if (events.goals != undefined){
    if (events.goals.length != goals.length) {
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
    if (events.changes.length != changes.length) {
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
    if (events.cards.length != cards.length) {
      console.log('     New Events -> Cards');
      auxHaveNewCards = true;
    }
  }
  return auxHaveNewCards;
};






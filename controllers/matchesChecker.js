var CronJob = require('cron').CronJob;
var matches = require('./matchesServicesRoute');


exports.start = function(io) {
  
  // All days at 00:00 get day matches
  var job = new CronJob('0 0 0 * * *', function(){
//  var job = new CronJob('0/13 * * * * *', function(){
      setTimeForTodaysMatches();
    }, function () {
      // This function is executed when the job stops
      console.log('STOP1');
    },
    true /* Start the job right now */,
    "America/Argentina/Buenos_Aires" /* Time zone of this job. */
  );

  // Get all matches and set time schedule
  function setTimeForTodaysMatches () {
    matches.matchesToday(function(data){
      console.log("/////// Today's Matchs ///////");
      data.forEach(function(match){
        var time = new Date(match.date + ' ' + match.time) ;
        time.setSeconds(time.getSeconds() + 5);
        
        console.log('   ' + match.local.name + ' - ' + match.visitor.name);
        console.log('      ' + time);
    
        setTimeSchedule(time, match);
        
      });
    });
  };

  // Set time schedule & set follow
  function setTimeSchedule (time, match) {
    console.log('Scheduling match');
    var job = new CronJob(time, function(){
        // Follow match
        followMatch(match);
      
      }, function () {
        // This function is executed when the job stops
        console.log('STOP2');
      },
      true /* Start the job right now */,
      "America/Argentina/Buenos_Aires" /* Time zone of this job. */
    );
  }

  // Follow match result
  function followMatch (match) {
    console.log('Following match');
    match.local.goals = 0;
    match.visitor.goals = 0;
    var job = new CronJob('*/10 * * * * *', function(){
        // Go to results server and check
//        matches.getMatchState('28645', function(matchState){
        matches.getMatchState(match.numId, function(matchState){
          if (parseInt(match.local.goals) < parseInt(matchState.local_goals) ) {
            match.local.goals = matchState.local_goals;
            io.sockets.emit("newMatchEvents", {match: match, event: 'Goooooool de ' + match.local.name});
            console.log('Goooooool de ' + match.local.nameId);
          }
          if (parseInt(match.visitor.goals) < parseInt(matchState.visitor_goals)) {
            match.visitor.goals = matchState.visitor_goals;
            io.sockets.emit("newMatchEvents", {match: match, event: 'Goooooool de ' + match.visitor.name});
            console.log('Goooooool de ' + match.visitor.nameId);
          }
        })
      }, function () {
        // This function is executed when the job stops
        console.log('STOP3');
      },
      true /* Start the job right now */,
      "America/Argentina/Buenos_Aires" /* Time zone of this job. */
    );
  }
}






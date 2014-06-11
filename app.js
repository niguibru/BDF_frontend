var express = require('express');
var app = express();

// DB CONNECTION >>
var connection = require('./models/connection');
// << DB CONNECTION

// START SERVER >>
var port = process.env.PORT || 3000;
var server = require('http').createServer(app).listen(port, function(){
  console.log('Express server listening on port 3000');
});
// << START SERVER

// SOCKET.IO AND TWITTER >>
var socketService = require('./controllers/socketService');
var io = socketService.start(server);
// << SOCKET.IO AND TWITTER

// MATCHES CHECKER >>
var matchesChecker = require('./controllers/matchesChecker');
matchesChecker.start(io);
// << MATCHES CHECKER


app.use(express.static(__dirname + '/front'));
// ROUTES >>
// Front
var frontController = require('./controllers/frontRoute');
app.get('/', frontController.index);
// Tweeter Service
var twitterServicesRoute = require('./controllers/twitterServicesRoute');
app.get('/getTweets', twitterServicesRoute.getTweetsWeb);
// Instagram Service
var instagramServicesRoute = require('./controllers/instagramServiceRoute');
app.get('/getExample', instagramServicesRoute.getExample);
// Team Service
var teamServicesRoute = require('./controllers/teamsServicesRoute');
app.get('/teamsComplete', teamServicesRoute.teamsComplete);
app.get('/teams', teamServicesRoute.teams);
app.get('/teamsByNameId', teamServicesRoute.teamsByNameId);
app.get('/teams_abrs', teamServicesRoute.teams_abrs);
app.get('/teams_abrsComplete', teamServicesRoute.teams_abrsComplete);
// Matches Service
var matchesServicesRoute = require('./controllers/matchesServicesRoute');
app.get('/matchesComplete', matchesServicesRoute.matchesComplete);
app.get('/matches', matchesServicesRoute.matches);
// << ROUTES 







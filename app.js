var express = require('express');
var app = express();

app.use(express.static(__dirname + '/front'));

// ROUTES >>
// Front
var frontController = require('./controllers/frontRoute');
app.get('/', frontController.index);
// Team Service
var teamServicesRoute = require('./controllers/teamsServicesRoute');
app.get('/teamsComplete', teamServicesRoute.teamsComplete);
app.get('/teams', teamServicesRoute.teams);
app.get('/teams_abrs', teamServicesRoute.teams_abrs);
app.get('/teams_abrsComplete', teamServicesRoute.teams_abrsComplete);
// Matches Service
var matchesServicesRoute = require('./controllers/matchesServicesRoute');
app.get('/matchesComplete', matchesServicesRoute.matchesComplete);
app.get('/matches', matchesServicesRoute.matches);
// << ROUTES 

// DB CONNECTION >>
var connection = require('./models/connection');
// << DB CONNECTION

// START SERVER >>
var port = process.env.PORT || 3000;
var server = require('http').createServer(app).listen(port, function(){
  console.log('Express server listening on port 3000');
});
// << START SERVER

// SOCKET & TWITTER >>
var io = require('socket.io').listen(server);
var Twit = require('twit')
var T = new Twit({
    consumer_key:         'cQTwqywDuhQsHrOjbWdiYGar2',
    consumer_secret:      'JsxuV1lFB6HD6ksBbmyZPKGpWB90VfOwA42V8qNXv8b8JIdzcw',
    access_token:         '2523990062-azO2SqkEPUz0FgO5AwZ14L7pwENZWqvcdBgKVJg',
    access_token_secret:  'y7cW1M14jMK0gAgvaRaafrAx0nRaAkXj0295U2gLKGlGz'
})
var stream = T.stream('statuses/filter', { track: 'bochadefutbol' });
var streamBdf = T.stream('user', { track : 'bochadefutbol' });
io.sockets.on('connection', function (socket) {
  stream.on('tweet', function (tweet) {
    if (tweet.user.screen_name != 'bochadefutbol') {
      console.log(tweet.user.screen_name);
      socket.emit('news', { name: tweet.user.screen_name, twt: tweet.text });
    }
  })
  streamBdf.on('tweet', function (tweet) {
    console.log(tweet.user.screen_name);
    socket.emit('news', { name: tweet.user.screen_name, twt: tweet.text });
  })
});
// << SOCKET & TWITTER

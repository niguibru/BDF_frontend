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
// Get Socket IO variable
var io = require('socket.io').listen(server);
// Get Twitter IO variable
var Twit = require('twit')
// Fill the Twitter Keys
var T = new Twit({
    consumer_key:         'cQTwqywDuhQsHrOjbWdiYGar2',
    consumer_secret:      'JsxuV1lFB6HD6ksBbmyZPKGpWB90VfOwA42V8qNXv8b8JIdzcw',
    access_token:         '2523990062-azO2SqkEPUz0FgO5AwZ14L7pwENZWqvcdBgKVJg',
    access_token_secret:  'y7cW1M14jMK0gAgvaRaafrAx0nRaAkXj0295U2gLKGlGz'
})

// Make stream watches
var stream = T.stream('statuses/filter', { track: 'bochadefutbol' });
var streamBdf = T.stream('user', { track : 'bochadefutbol' });

  
// Wait for connection
io.sockets.on('connection', function (socket) {
  // Reading in the last 5 tweets when bochadefutbol is mentioned
  T.get('search/tweets', { q: 'bochadefutbol', count: 5 }, function(err, reply) {
    if (err) {
      console.dir(err);
    } else {
      for (var i = 0; i < reply.statuses.length; i++) {
        var status = reply.statuses[i];
        socket.emit('prevTwits', { 
          name: status.user.screen_name, 
          twt: status.text,
          avatar: status.user.profile_image_url_https
        });
      }
    }
  })
  
  // Stream when bochadefutbol is mentioned
  stream.on('tweet', function (tweet) {
    //console.log(tweet.user.screen_name);
    if ((tweet.user.screen_name != 'bochadefutbol') && (tweet.text.indexOf('@bochadefutbol') > -1)) {
      socket.emit('newTwits', { 
          name: tweet.user.screen_name, 
          twt: tweet.text,
          avatar: tweet.user.profile_image_url_https
        });
    }
  })
  // Stream when @bochadefutbol twit
  streamBdf.on('tweet', function (tweet) {
    //console.log(tweet.user.screen_name);
    socket.emit('newTwits',  { 
          name: tweet.user.screen_name, 
          twt: tweet.text,
          avatar: tweet.user.profile_image_url_https
        });
  })  
});
// << SOCKET & TWITTER

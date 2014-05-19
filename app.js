var express = require('express');
var connection = require('./models/connection');
var app = express();

app.use(express.static(__dirname + '/front'));

var frontController = require('./controllers/frontRoute');
app.get('/', frontController.index);
var teamServicesRoute = require('./controllers/teamsServicesRoute');
app.get('/teamsComplete', teamServicesRoute.teamsComplete);
app.get('/teams', teamServicesRoute.teams);
app.get('/teams_abrs', teamServicesRoute.teams_abrs);
app.get('/teams_abrsComplete', teamServicesRoute.teams_abrsComplete);
var matchesServicesRoute = require('./controllers/matchesServicesRoute');
app.get('/matchesComplete', matchesServicesRoute.matchesComplete);
app.get('/matches', matchesServicesRoute.matches);


app.listen(process.env.PORT || 3000, function(){
  console.log('Server started on port 3000')
  console.log('http://localhost:3000/')
});

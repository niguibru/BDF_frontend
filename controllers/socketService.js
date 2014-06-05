// SOCKET & TWITTER >>
var logModel = require('../models/logModel');
var twitter = require('./twitterServicesRoute');

exports.start = function(server) {
  // Get Socket IO variable
  var io = require('socket.io').listen(server);

  // Wait for connection
  //io.set('log level', 1)
  io.sockets.on('connection', function (socket) {

    // TO LOG USER ACTIVITY >>
    logModel.insert({
      'soId': socket.id, 
      'datetime': nowInArgentina(), 
      'page': 'CONNECT'
    });
    socket.on('disconnect', function(){
      console.log('disconected')
    })
    //<< TO LOG USER ACTIVITY
    
    // @bochadefutbol TWITS >>
    // get the last 5 tweets when bochadefutbol is mentioned
    twitter.getTweets('bochadefutbol', 5, function(reply) {
      for (var i = 0; i < reply.statuses.length; i++) {
        var status = reply.statuses[i];
        socket.emit('prevTwits', { 
          tweet_id: status.id_str,
          created_at: status.created_at,
          name: status.user.screen_name, 
          twt: status.text,
          avatar: status.user.profile_image_url_https
        });
      }
    })
    // Stream when bochadefutbol is mentioned
    twitter.streamTweets('bochadefutbol', function(tweet) {
      if ((tweet.user.screen_name != 'bochadefutbol') && (tweet.text.indexOf('@bochadefutbol') > -1)) {
        socket.emit('newTwits', { 
          tweet_id: tweet.id_str,
          created_at: tweet.created_at,
          name: tweet.user.screen_name, 
          twt: tweet.text,
          avatar: tweet.user.profile_image_url_https
        });
      }
    })
    // Stream when @bochadefutbol twit
    twitter.streamUsers('bochadefutbol', function(tweet) {
      socket.emit('newTwits',  { 
        tweet_id: tweet.id_str,
        created_at: tweet.created_at,
        name: tweet.user.screen_name, 
        twt: tweet.text,
        avatar: tweet.user.profile_image_url_https
      });
    })
    // << @bochadefutbol TWITS 
    
  });

  // Get current time at Argentina
  var moment = require('moment-timezone');
  function nowInArgentina() {
    var format = 'YYYY/MM/DD HH:mm:ss ZZ';
    return moment().tz("America/Argentina/Buenos_Aires").format();
  }
  
}
// Get Twitter IO variable
var Twit = require('twit')

// Fill the Twitter Keys
var T = new Twit({
    consumer_key:         'cQTwqywDuhQsHrOjbWdiYGar2',
    consumer_secret:      'JsxuV1lFB6HD6ksBbmyZPKGpWB90VfOwA42V8qNXv8b8JIdzcw',
    access_token:         '2523990062-azO2SqkEPUz0FgO5AwZ14L7pwENZWqvcdBgKVJg',
    access_token_secret:  'y7cW1M14jMK0gAgvaRaafrAx0nRaAkXj0295U2gLKGlGz'
})

module.exports = exports = {

  // Web Services
  getTweetsWeb: function(req, res) {
    var search = req.query.search;
    var count = req.query.count;
    T.get('search/tweets', { q: search, count: count }, function(err, reply) {
      if (err) {
        console.dir(err);
      } else {
        var twts = [];
        for (var i = 0; i < reply.statuses.length; i++) {
          var status = reply.statuses[i];
          var twt = { 
            tweet_id: status.id_str,
            created_at: status.created_at,
            name: status.user.screen_name, 
            twt: status.text,
            avatar: status.user.profile_image_url_https
          };
          twts.push(twt);
        }
        res.json(twts);
      }
    })
  },
  
  // Node Services
  getTweets: function(search, count, cb) {  
    T.get('search/tweets', { q: search, count: count }, function(err, reply) {
      if (err) {
        console.dir(err);
      } else {
        cb(reply);
      }
    })
  },
  
  streamTweets: function(search, cb) {  
    var streamTweets = T.stream('statuses/filter', { track: search });
    streamTweets.on('tweet', function (tweet) {
      cb(tweet);
    })  
  },
  
  streamUsers: function(search, cb) {  
    var streamUser = T.stream('user', { track : search });
    streamUser.on('tweet', function (tweet) {
      cb(tweet);
    })  
  }
  
}


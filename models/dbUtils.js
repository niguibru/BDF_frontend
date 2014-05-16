var mongoClient = require('mongodb').MongoClient;

var dbUrl = 'mongodb://bdfadmin:bdfargenta@oceanic.mongohq.com:10004/bochadefutbol';
//var dbUrl = process.env.DB_URL;

exports.connectToDb = function(fnc) {
  mongoClient.connect(dbUrl, fnc)
}
var MongoClient = require('mongodb').MongoClient

var state = {
  client: null,
  db: null,
}

exports.connect = function(url,dbName, done) {
  console.log("connecting to database: " + url + " db: " + dbName);
  if (state.db) return done();

  MongoClient.connect(url, function(err, client) {
    console.log(err)
    if (err) return done(err);
    state.client = client;
    var db=client.db(dbName);
    state.db = db;
    done();
  })
}

exports.get = function() {
  return state.db;
}

exports.status = function() {
  return state.db.serverConfig.isConnected();
}

exports.close = function(done) {
  if (state.db) {
    state.client.close(function(err, result) {
      state.db = null;
      state.client = null;
      done(err);
    });
  }
}
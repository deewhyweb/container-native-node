var express = require('express')
  , router = express.Router()

var db = require('./db')

router.get('/', function(req, res) {
  console.log('Getting reviews');
  console.log(req.headers);
  var collection = db.get().collection('reviews')

  collection.find().toArray(function(err, docs) {
    res.json(docs);
  })
});


module.exports = router
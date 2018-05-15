var express = require('express')
  , router = express.Router()

var db = require('./db')

router.get('/', function(req, res) {
  console.log('Getting cart contents');
  var collection = db.get().collection('cart')

  collection.find().toArray(function(err, docs) {
    res.json(docs);
  })
});


module.exports = router
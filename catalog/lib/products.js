var express = require('express')
  , router = express.Router()

var db = require('./db')

router.get('/', function(req, res) {
  console.log('Getting products');
  console.log(req.headers);
  var collection = db.get().collection('products')

  collection.find().toArray(function(err, docs) {
    res.json(docs);
  })
});


module.exports = router
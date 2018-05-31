const express = require('express')
  , router = express.Router();
const request = require('request');
const REVIEWS_SERVICE = process.env["REVIEWS_SERVICE"] ? process.env["REVIEWS_SERVICE"] : "http://reviews:8080";

const db = require('./db');

/**
   * @swagger
   * /products:
   *   get:
   *     description: Returns products
   *     tags:
   *      - Products
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: products
   */
router.get('/', function(req, res) {
  console.log('Getting products');
  var collection = db.get().collection('products')

  collection.find().toArray(function(err, docs) {
    request({
      headers: {
        'x-request-id': req.headers['x-request-id'],
        'x-b3-traceid': req.headers['x-b3-traceid'],
        'x-b3-spanid': req.headers['x-b3-spanid'],
        'x-b3-parentspanid': req.headers['x-b3-parentspanid'],
        'x-b3-sampled': req.headers['x-b3-sampled'],
        'x-b3-flags': req.headers['x-b3-flags'],
        'x-ot-span-context': req.headers['x-ot-span-context']
        
      },
      uri: REVIEWS_SERVICE + "/reviews",
      method: 'GET'
    }, function (err, response, body) {
      console.log('Response received from reviews service ' + body);
      console.log(err);
      docs[0].reviews = body;
      res.json(docs);
    });
  })
});


module.exports = router
const express = require('express')
  , router = express.Router()
  , request = require('request')
  , bodyParser = require('body-parser');
const GRYFFINDOR_HOUSE = process.env["GRYFFINDOR"] ? process.env["GRYFFINDOR"] : "http://gryffindor:8080";
const SLYTHERIN_HOUSE = process.env["SLYTHERIN_HOUSE"] ? process.env["SLYTHERIN_HOUSE"] : "http://slytherin:8080";
const HUFFLEPUFF_HOUSE = process.env["HUFFLEPUFF_HOUSE"] ? process.env["HUFFLEPUFF_HOUSE"] : "http://hufflepuff:8080";
const RAVENCLAW_HOUSE = process.env["RAVENCLAW_HOUSE"] ? process.env["RAVENCLAW_HOUSE"] : "http://ravenclaw:8080";


router.use(bodyParser());

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
router.use('/sort', (req, res) => {

  var student = req.body;
  var uri;
  if (req.body.bravery >= 8) {
    student.house = 'gryffendor';
    uri = GRYFFINDOR_HOUSE + "/register";
  } else if (req.body.cunning >= 8) {
    student.house = 'slytherin';
    uri = SLYTHERIN_HOUSE + "/register";
  } else if (req.body.loyalty >= 8) {
    student.house = 'hufflepuff';
    uri = HUFFLEPUFF_HOUSE + "/register";
  } else if (req.body.wit >= 8) {
    student.house = 'ravenclaw'
    uri = RAVENCLAW_HOUSE + "/register";
  }
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
    uri: uri,
    method: 'GET'
  }, function (err, response, body) {
    if (err) {
      console.log(err);
      res.json(err)
    } else {
      setTimeout(function(){
        res.json(student);
      }, 1000);
      
    }
  });
});

module.exports = router;
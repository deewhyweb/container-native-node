const express = require('express')
  , router = express.Router()
  , request = require('request');
const CATALOG_SERVICE = process.env["CATALOG_SERVICE"] ? process.env["CATALOG_SERVICE"] : "http://catalog:8080";
const REVIEWS_SERVICE = process.env["REVIEWS_SERVICE"] ? process.env["REVIEWS_SERVICE"] : "http://reviews:8080";
const CART_SERVICE = process.env["CART_SERVICE"] ? process.env["CART_SERVICE"] : "http://cart:8080";
  
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
router.use('/products', (req, res) => {
    console.log('Calling catalog service ' + CATALOG_SERVICE);
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
        uri: CATALOG_SERVICE + "/products",
        method: 'GET'
      }, function (err, response, body) {
        console.log('Response received from catalog service ' + body);
        console.log(err);
        res.json(body);
      });
});

/**
   * @swagger
   * /review:
   *   get:
   *     description: Returns reviews
   *     tags:
   *      - Reviews
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: reviews
   */
router.use('/reviews', (req, res) => {
    console.log('Calling reviews service ' + REVIEWS_SERVICE);
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
        res.json(body);
      });
});

/**
   * @swagger
   * /cart:
   *   get:
   *     description: Returns cart
   *     tags:
   *      - Cart
   *     produces:
   *      - application/json
   *     responses:
   *       200:
   *         description: cart
   */

router.use('/cart', (req, res) => {
    console.log('Calling cart service ' + REVIEWS_SERVICE);
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
        uri: CART_SERVICE + "/cart",
        method: 'GET'
      }, function (err, response, body) {
        console.log('Response received from cart service ' + body);
        console.log(err);
        res.json(body);
      });
});

module.exports = router;
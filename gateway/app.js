const express = require('express');
const app = express();
const health = express();
const request = require('request');
const probe = require('kube-probe');
const state = { isReady: false };
const PORT = process.env["PORT"] ? process.env("PORT") : 8080;
const CATALOG_SERVICE = process.env["CATALOG_SERVICE"] ? process.env["CATALOG_SERVICE"] : "http://catalog:8080";
const REVIEWS_SERVICE = process.env["REVIEWS_SERVICE"] ? process.env["REVIEWS_SERVICE"] : "http://reviews:8080";
const CART_SERVICE = process.env["CART_SERVICE"] ? process.env["CART_SERVICE"] : "http://cart:8080";

let readinessCallback = (req, res) => {
    if (state.isReady !== true) {
        console.log('readiness not ok');
        res.writeHead(500)
        res.end('not ok')
      } else{
        res.writeHead(200)
        res.end('OK')
      }
};

let livenessCallback = (req, res) => {
    if (state.isReady == true) {
        res.writeHead(200)
        res.end('OK');
    } else {
        console.log('liveness not ok');
        res.writeHead(500)
        res.end('not ok');
    }
};
var probeOptions = {
    readinessCallback: readinessCallback,
    livenessCallback: livenessCallback
};
probe(health, probeOptions);
app.use('/products', (req, res) => {
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

app.use('/reviews', (req, res) => {
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

app.use('/cart', (req, res) => {
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


process.on('SIGTERM', function onSigterm () {
    console.info('Got SIGTERM. Graceful shutdown start now', new Date().toISOString())
    state.isReady = false;

});

app.listen(PORT, function() {
    console.log('Listening on port ' + PORT + '...')
    health.listen(3000, function(){
        state.isReady = true;
        console.log('App ready, probes listening on port 3000');
    })
});

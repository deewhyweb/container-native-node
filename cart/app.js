const express = require('express');
const app = express();
const health = express();
const state = { isReady: false };
const probe = require('kube-probe');
let db = require('./lib/db');
const PORT = process.env["PORT"] ? process.env("PORT") : 8080;
const MONGO_CONNECTION_STRING = process.env['MONGO_CONNECTION_STRING'];
const MONGO_DBNAME = process.env['MONGO_DBNAME'];

if (!MONGO_CONNECTION_STRING || !MONGO_DBNAME ){
    console.log("Environment variables not set. MONGO_CONNECTION_STRING and MONGO_DBNAME");
    process.exit(1)
}

app.use('/cart', require("./lib/cart"));

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
    if (state.isReady == true && db.status()) {
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

process.on('SIGTERM', function onSigterm () {
    console.info('Got SIGTERM. Graceful shutdown start now', new Date().toISOString())
    state.isReady = false;
    db.close(err => {
        console.log('DB closed, exiting');
    });
});
db.connect(MONGO_CONNECTION_STRING, MONGO_DBNAME, function(err) {
    if (err) {
        console.log('Unable to connect to Mongo.')
        process.exit(1)
    } else {
        app.listen(PORT, function() {
            console.log('Listening on port ' + PORT + '...')
            health.listen(3000, function(){
                state.isReady = true;
                console.log('App ready, probes listening on port 3000');
            })
        });
    }
});
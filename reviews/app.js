const express = require('express');
const app = express();
const health = express();
const state = { isReady: false };
let db = require('./lib/db');
const PORT = process.env["PORT"] ? process.env("PORT") : 8080;
const MONGO_CONNECTION_STRING = process.env['MONGO_CONNECTION_STRING'];
const MONGO_DBNAME = process.env['MONGO_DBNAME'];

if (!MONGO_CONNECTION_STRING || !MONGO_DBNAME ){
    console.log("Environment variables not set. MONGO_CONNECTION_STRING and MONGO_DBNAME");
    process.exit(1)
}
app.use(function(req, res, next){
    console.log(req);
    next();
})
app.use('/reviews', require("./lib/reviews"));

health.get('/ready',(req, res) => {
    if (state.isReady !== true) {
        res.writeHead(500)
        return res.end('not ok')
      } else{
        res.writeHead(200)
        return res.end('ok')
      }
});

health.get('/health',(req, res) => {
    if (state.isReady == true && db.status()) {
        res.writeHead(200)
        return res.end('ok');
    } else {
        res.writeHead(500)
        return res.end('not ok');
    }
});

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
                console.log('App is ready, probes listening on port 3000');
            })
        });
    }
});
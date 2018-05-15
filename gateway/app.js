const express = require('express');
const httpProxy = require('express-http-proxy')
const app = express();
const health = express();
const state = { isReady: false };
const PORT = process.env["PORT"] ? process.env("PORT") : 8080;
const CATALOG_SERVICE = process.env["CATALOG_SERVICE"] ? process.env["CATALOG_SERVICE"] : "catalog";
const userServiceProxy = httpProxy(CATALOG_SERVICE)

app.use((req, res, next) => {
    userServiceProxy(req, res, next)
});

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
    //check other services
    if (state.isReady == true) {
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

});

app.listen(PORT, function() {
    console.log('Listening on port ' + PORT + '...')
    health.listen(3000, function(){
        state.isReady = true;
        console.log('App ready, probes listening on port 3000');
    })
});

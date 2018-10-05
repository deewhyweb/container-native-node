const express = require('express');
const app = express();
const health = express();
const request = require('request');
const probe = require('kube-probe');
const state = { isReady: false };
const PORT = process.env["PORT"] ? process.env("PORT") : 8080;
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const cors = require('cors');
app.use(cors());

var swaggerDefinition = {
    info: { // API informations (required)
      title: 'Gateway', // Title (required)
      version: '1.0.0', // Version (required)
      description: 'A sample e-commerce gateway API', // Description (optional)
    },
    basePath: '/', // Base path (optional)
};
  
// Options for the swagger docs
var options = {
// Import swaggerDefinitions
swaggerDefinition: swaggerDefinition,
// Path to the API docs
apis: ['./lib/routes.js'],
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.use('/api/v1/', require("./lib/routes"));


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

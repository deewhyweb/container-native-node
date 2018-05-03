const express = require('express');
const app = express();
const state = { isShutdown: false };

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/health',(req, res) => {
    if (state.isShutdown) {
        res.writeHead(500)
        return res.end('not ok')
      } else{
        res.writeHead(200)
        return res.end('ok')
      }
});

process.on('SIGTERM', function onSigterm () {
    console.info('Got SIGTERM. Graceful shutdown start', new Date().toISOString())
    state.isShutdown = true;
    // start graceul shutdown here
  })
app.listen(3000, () => console.log('Example app listening on port 3000!'))
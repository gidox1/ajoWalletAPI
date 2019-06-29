'use strict';

const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT;
const bodyParser = require('body-parser');
const route = require('./app/routes/route');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', route);

app.get('/', (req, res) => {
    return res.send({
        status: 200,
        message: 'Healthy'
    })
})


const server = http.createServer(app);

server.listen(port, (err, res) => {
    if(err) {console.log('Could not start server'); return false;}
    console.log(`server running on....${port}`);
})
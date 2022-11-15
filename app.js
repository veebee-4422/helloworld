const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const responseTime = require('response-time')

var app = express();

app.set('trust proxy', true);
app.use(responseTime((req, res, time) => {
    let url = req.protocol + '://' + req.get('host') + req.originalUrl;
    let userip = req.socket.remoteAddress;
    let date = new Date();
    let timestamp = date.getFullYear()+"/"+(date.getMonth()+1) +"/"+ date.getDate() +"/"+ date.getHours() +":"+ date.getMinutes() +":"+ date.getSeconds() +":"+ date.getMilliseconds();
    let latency = Number(time.toFixed(3));
    log_file.write(`{${url} , ${userip}, ${timestamp}, ${latency}}\n`);
  }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
var fs = require('fs');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});

app.get('/url1', (req, res)=>{
    res.status(200).send('hello ' +  req.query.query + ' world');
})
app.get('/url2', (req, res)=>{
    res.status(200).send('hello ' +  req.query.query + ' world');
})
app.get('/url3', (req, res)=>{

    res.status(200).send('hello ' +  req.query.query + ' world');
})
app.get('/logs', (req, res)=>{
    let readStream = fs.createReadStream(__dirname + '/debug.log');
    readStream.on('open', ()=>readStream.pipe(res));
})
app.use((req, res)=>{
    res.status(404).send('Not found');
});

app.listen(3000);
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const responseTime = require('response-time')

var app = express();

app.set('trust proxy', true);
app.use((req, res, next) => {
    req.time = Date.now();
    next();
});
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
var fs = require('fs');
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});

function logger(req) {
    let url = req.protocol + '://' + req.get('host') + req.originalUrl;
    let userip = req.headers['x-forwarded-for'];
    let timestamp = new Date();
    let latency = Number((Date.now() - req.time).toFixed(3));
    log_file.write(`{URL: ${url}, IP: ${userip}, DATE: ${timestamp}, LATENCY: ${latency}ms}\n`);
}
app.get('/url1', (req, res)=>{
    res.status(200).send('hello ' +  req.query.query + ' world');
    logger(req);
})
app.get('/url2', (req, res)=>{
    res.status(200).send('hello ' +  req.query.query + ' world');
    logger(req);
})
app.get('/url3', (req, res)=>{
    res.status(200).send('hello ' +  req.query.query + ' world');
    logger(req);
})
app.get('/logs', (req, res)=>{
    let readStream = fs.createReadStream(__dirname + '/debug.log');
    readStream.on('open', ()=>readStream.pipe(res));
    logger(req);
})
app.use((req, res)=>{
    res.status(404).send('Not found');
    logger(req);
});

app.listen(3000);
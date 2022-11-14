const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

var app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan('dev'));
app.get('/', (req, res)=>{
    res.status(200).send('hello ' +  req.query.query + ' world');
})
app.use((req, res)=>{
    res.status(404).send('Not found');
});

app.listen(process.env.PORT || 3000);
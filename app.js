'use strict'

import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 8080

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', express.static(process.cwd() + '/public'))
app.use('/Emoticon-Rumble', express.static(process.cwd() + '/Emoticon-Rumble/public'))

app.route('/')
    .get(function(req, res) {
        res.sendFile(process.cwd() + '/views/index.html')
    });

app.route('/Emoticon-Rumble')
    .post(function(req, res) {
        res.sendFile(process.cwd() + '/Emoticon-Rumble/index.html')
    })

app.use(function(req, res, next) {
    res.status(404)
        .type('text')
        .send('Not Found')
})

const listener = app.listen(port, function() {
    console.log('Your app is listening on port ' + listener.address().port)
})
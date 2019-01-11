// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var port = 3012;

// Andmebaasi osa
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/voistlus');

var Schema = mongoose.Schema;

var voistlusScheme = new Schema({
    gameID: {
        type: String,
    },
    player1: {
        type: String,
    },
    player2: {
        type: String,
    },
    winner: {
        type: String,
    },
    score: {
        type: String,
    }
})

var voistlusDB = mongoose.model('voistlusDB', voistlusScheme);


// SERVER

app.set('port', 3012);
app.use(express.static('.'));

// Routing
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});
// Starts the server.
server.listen(port, function () {
    console.log(`Server is up and running: http://localhost:${port}`);
});


// SOCKET
io.on('connection', function (socket) {
    // send games list
    socket.on('updateList', function () {
        voistlusDB.find({}, function (err, list) {

            // console log err tee siia

            // Updates list for new client
            // console.log(list);
            socket.emit('listUpdate', list);

        });
    });

    // Add new value to db
    socket.on('newItem', function (data) {
        try {
            voistlusDB.create({
                gameID: data.gameID,
                player1: data.player1,
                player2: data.player2,
                winner: data.winner,
                score: data.score
            });
            console.log('Lisasin rea baasi');
            io.emit('refreshList');
        } catch (e) {
            console.log(e);
        };
    });

    // Delete value from db
    socket.on('deleteItem', function (data) {
        try {
            // console.log(data.id);
            voistlusDB.findByIdAndRemove(data.id, function (err, res) {
                if (err) {
                    console.log(err);
                }
                console.log('Kustutasime rea')
                io.emit('refreshList');
            });
        } catch (e) {
            console.log(e);
        };
    });

    // Get value from db
    socket.on('getChangeRow', function (data) {
        try {
            // console.log(data.id);
            voistlusDB.findById(data.id, function (err, res) {
                if (err) {
                    console.log(err);
                }
                console.log('Võtame rea info DB-st')
                socket.emit('updateForm', res);
            });
        } catch (e) {
            console.log(e);
        };
    });

    socket.on('updateRow', function (data) {
        try {
            // console.log(data.id);
            voistlusDB.findByIdAndUpdate(data.id, {
                gameID: data.gameID,
                player1: data.player1,
                player2: data.player2,
                winner: data.winner,
                score: data.score
            }, function (err, res) {
                if (err) {
                    console.log(err);
                }
                console.log('Uuendasime rida DB-st')
                socket.emit('updateForm', res);
            });
        } catch (e) {
            console.log(e);
        };

    });


});
// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var mongoose = require('mongoose');


// Server variables info
var port = 3012;


// Mongoose connect to MongoDB
mongoose.connect('mongodb://localhost:27017/voistlus');


// Defining schema for MongoDB
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


// Defining mongoose Model
var voistlusDB = mongoose.model('voistlusDB', voistlusScheme);


// SERVER

app.set('port', 3012);
app.use(express.static('.'));

// Routes HTTP GET requests to the specified path with the specified callback functions.
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

            // If error occours, then display it
            if (err) {
                console.log(err);
            }

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

            // Display message when new info added to db
            console.log('Lisasin rea baasi');

            // refresh the list from db
            io.emit('refreshList');

        } catch (e) {
            // If error occours, then display it
            console.log(e);
        };
    });

    // Delete value from db
    socket.on('deleteItem', function (data) {

        try {
            // console.log(data.id);
            voistlusDB.findByIdAndRemove(data.id, function (err, res) {

                // If error occours, then display it
                if (err) {
                    console.log(err);
                }

                // Display message when new info deleted from db
                console.log('Kustutasime rea')

                // refresh the list from db
                io.emit('refreshList');
            });

        } catch (e) {
            // If error occours, then display it
            console.log(e);
        };
    });

    // Get value from db
    socket.on('getChangeRow', function (data) {

        try {
            // console.log(data.id);
            voistlusDB.findById(data.id, function (err, res) {

                // If error occours, then display it
                if (err) {
                    console.log(err);
                }

                // Display message
                console.log('Võtame rea info DB-st')

                // Clear the form
                socket.emit('updateForm', res);
            });

        } catch (e) {
            // If error occours, then display it
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
                // If error occours, then display it
                if (err) {
                    console.log(err);
                }

                // Display message
                console.log('Uuendasime rida DB-st')

                // get info from db and update it
                socket.emit('updateForm', res);
                // refresh the list from db
                io.emit('refreshList');

            });

        } catch (e) {
            // If error occours, then display it
            console.log(e);
        };

    });

});
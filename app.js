/***
 * SERVER CLASS
 *
 * SETS UP EXPRESS, MONGO (MONGOOSE ) , NODE
 * @type {createApplication}
 */
const express = require('express');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


//socket.io instantiation
/***
const io = require("socket.io")(server);
 **/
/***
var http = require('http').Server(app);
 ***/
/***
var io = require('socket.io')(http);

 ***/
var totalMessages = 0;
var totalConnections = 0;


app.use(express.static('public'));

/**
 * CREATE A COUPLE OF MONGODB SCHEMAS(DBS) one for messages on for connections
 * @type {Mongoose}
 */


/***

const MongoClient = require('mongodb').MongoClient;


const uri = "mongodb+srv://seanwayland:<Oberheim1$>@cluster0-7msf5.gcp.mongodb.net/test?retryWrites=true&w=majority";

 ***/
/***
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("pianogame").collection("messages");



    ***/

/**
 * CREATE A COUPLE OF MONGODB SCHEMAS(DBS) one for messages on for connections
 * @type {Mongoose}
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');

// Define schema
var chatSchema = mongoose.Schema({
    message: String,
    nickname: String,
    roomNumber: String,
    created: {type: Date, default: Date.now}

});

var connectionsSchema = mongoose.Schema({
    roomNumber: String,
    created: {type: Date, default: Date.now}
});

// Compile model from schema
var Chat = mongoose.model('Message', chatSchema);
var Connections = mongoose.model('connection', connectionsSchema);

/***

var mongoose = require('mongoose');


//mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true });
mongoose.connect(uri, { useNewUrlParser: true });

 

 ***/

exports.getOldMsgs = function (limit, Messages) {


    var query = Chat.find({});
    totalMessages = query.length;
    query.sort('-created').limit(limit).exec(function (err, docs) {
        Chat(err, docs);
    });
    for (var i = query.length - 1; i >= 0; i--) {
        console.log(query[i].message);
        console.log(query[i].nickname);
    }

}


/** serve main mage from server
 *
 */

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

/** serve analytices page
 *
 */
app.get('/analytics', function (req, res) {
    res.sendfile('analytics.html');
});


/** get request to server connection data to analytics page
 *
 */

app.get('/connectionData', function (req, res) {
    var c = totalConnections;
    var m = totalMessages;
    res.send({connects: c, messages: m});

});

/**
 * unused
 */
app.get('/messages', function (req, res) {
    res.send(totalMessages);

});


var roomno = 1;
var playerno = 1;
io.on('connection', function (socket) {


    /**Increase roomno 2 clients are present in a room.
     * each new player is assigned to a room on connection
     * 2 players per room
     */
    if (io.nsps['/'].adapter.rooms["room-" + roomno] && io.nsps['/'].adapter.rooms["room-" + roomno].length > 1) roomno++;
    console.log('userconnected');

    //collection.find().toArray(function(err, items) {});

    var newConnections = new Connections({roomNumber: roomno});

    newConnections.save(function (err, Connections) {
        if (err) {
            console.log(err);
        } else {
            console.log('connection recorded');
        }
    });

    /***
     * get number of connections
     * @type {void|Query|number|bigint|T|T}
     */
    var query1 = Connections.find(function (err, response) {
        if (err) {
            console.log(err)
        } else {
            totalConnections = response.length;
            console.log("cons in mongo" + totalConnections);
        }

    });

    /**
     get old messages
     */
    Chat.find(function (err, response) {

        totalMessages = response.length;


        for (i in response) {

            if (response[i].roomNumber == roomno) {

                console.log('server' + response[i].message);

                io.sockets.in("room-" + roomno).emit('oldMsg', {
                    name: response[i].nickname,
                    message: response[i].message
                });

            }
        }
    });

    /**
     * use socket to connect users to room
     */
    socket.join("room-" + roomno);

    //Send this event to everyone in the room.
    io.sockets.in("room-" + roomno).emit('connectToRoom', {roomnum: roomno, playerNum: playerno});
    if (playerno == 1) {
        playerno++
    } else {
        playerno = 1;
    }


    socket.on('msg', function (data) {
        //Send message to everyone
        console.log('message received');
        console.log(data.roomnum);
        console.log(data.user);
        console.log(data.message);
        io.sockets.in("room-" + data.roomnum).emit('newmsg', data);


        /// SAVE in DB
        var newMsg = new Chat({message: data.message, nickname: data.user, roomNumber: data.roomnum});

        newMsg.save(function (err, Chat) {
            if (err) {
                console.log(err);
            } else {
                console.log('message saved');
                console.log(data.message);
                console.log(data.user);
                console.log(data.roomnum);
            }
        });


    })

    /***
     * various socket events relaying messages around
     */


    socket.on('ShotMsg', function (data) {
        //Send message to everyone
        console.log('shot message received');
        console.log(data.user);

        console.log(data.message);
        io.sockets.in("room-" + data.roomnum).emit('newShotMsg', data);

    })

    socket.on('NameMsg', function (data) {
        //Send message to everyone
        console.log('name message received');
        console.log(data.playerName);
        io.sockets.in("room-" + data.roomnum).emit('newNameMsg', data);

    })

    socket.on('CodeMsg', function (data) {
        //Send message to everyone
        console.log('code message received');
        console.log(data.playerNum);

        console.log(data.message);
        io.sockets.in("room-" + data.roomnum).emit('newCodeMsg', data);

    })

    socket.on('GuessMsg', function (data) {
        //Send message to everyone
        console.log('guess message received');

        console.log(data.message);
        io.sockets.in("room-" + data.roomnum).emit('newGuessMsg', data);

    })

    socket.on('WinMsg', function (data) {
        //Send message to everyone
        console.log('win message received');

        console.log(data.amount);
        io.sockets.in("room-" + data.roomnum).emit('newWinMsg', data);

    })

    socket.on('LoseMsg', function (data) {
        //Send message to everyone
        console.log('Lose message received');

        console.log(data.amount);
        io.sockets.in("room-" + data.roomnum).emit('newLoseMsg', data);

    })

    socket.on('gameWinMsg', function (data) {
        //Send message to everyone
        console.log('win message received');

        console.log(data.amount);
        io.sockets.in("room-" + data.roomnum).emit('newWinMsg', data);

    })

    socket.on('gameLoseMsg', function (data) {
        //Send message to everyone
        console.log('Lose message received');

        console.log(data.amount);
        io.sockets.in("room-" + data.roomnum).emit('newLoseMsg', data);

    })

});


/**
 * listen on port 4001
 */

/**

http.listen(4001, function () {
    console.log('listening on localhost:4001');
});

 **/
http.listen(4001, function() {
    console.log('listening on localhost:4001');
});

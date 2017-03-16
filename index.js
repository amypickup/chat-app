/**
* Use Express to create HTTP server
* Use Socket.io with HTTP server passed to it
* Define route handler
* Make http server listen
*/

// import express, http, io modules, mongoose to connect to mongodb

var express = require('express');
var app 	= express();
var http 	= require('http').Server(app);
var io 		= require('socket.io')(http);
var router 	= require('./app/routes');
var Message = require('./models/message');

var mongoose = require('mongoose');
mongoose.connect('mongodb://root:root@ds155028.mlab.com:55028/chat-app');

// set router file
app.use('/', router);

// set static files (css and images)
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {

	var user;
	socket.emit('chat message', "*** Please enter your name in the input box below to chat ***");

	/* emit chat message when one is submitted
	* if we know the user name, assume its a message
	* if we dont have a user name, assign it to this socket
	*/
	socket.on('chat message', function(msg) {
		if(user) {
			var datetime = new Date();
			io.emit('chat message', user + ': ' + msg);

			// create new message object
			var message = new Message();

			message.username = user;
			message.text = msg;

			message.save(function (err) {
				if (err) { console.log(err); }
				console.log('A new message is created');
			});
		} else {
			user = msg;

			// assign random user name if user doesn't enter one
			if(user == '') {
				user = 'Anon';
			}

			console.log(user + ' connected');
			socket.emit('chat message', 'Welcome ' + user);
			socket.broadcast.emit('chat message', user + ' is here!');
		}
	});

	// alert users when a user disconnects
	socket.on('disconnect', function() {
		if(user) {
			console.log(user + ' disconnected');
			io.emit('disconnect', user + ' left the chat');
		} else {
			console.log('user disconnected');
			io.emit('disconnect', 'anon user left the chat');
		}
	});
});

http.listen(3000, function() {
	console.log('listening on *.3000');
});
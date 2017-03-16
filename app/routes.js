/*
* routes for messages in chat app
*/

// require express
var express = require('express');
var path = require('path');
var Message = require('../models/message');

// create router object
var router = express.Router();

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/../index.html'));
});

router.route('/messages')

.post(function(req, res) {
	var message = new Message();

	message.username = req.body.username;
	message.text = req.body.text;

	message.save(function (err) {
		if (err) { res.send(err); }

		res.json({message: 'A new message is created'});
	});
})

.get(function(req, res) {
	Message.find(function(err, messages) {
		if (err) { res.send(err); }

		res.json(messages);
	});
})

router.route('/messages/:message_id')

.get(function(req, res) {
	Message.findById(req.params.message_id, function(err, messages) {
		if (err) { res.send(err); }

		res.json(messages);
	});
})

.put(function(req, res) {
	Message.findbyId(req.params.message_id, function(err, message) {
		if (err) { res.send(err); }

		message.username = req.body.user.username;
		message.text = req.body.text;

		message.save(function (err) {
			if (err) { res.send(err); }

			res.json({message: 'A message is updated'});
		});

	});
})

.delete(function(req, res){
    Message.remove({_id:req.params.message_id}, function(err, message){
        if (err){ res.send(err); }

        res.json({ message: 'A message is removed' });
    });
})

// export router
module.exports = router;
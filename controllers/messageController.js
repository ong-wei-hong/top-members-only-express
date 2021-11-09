const Message = require('../models/message')

const { body, validationResult } = require('express-validator');

exports.index = async function(req, res, next) {
	const success = await req.consumeFlash('success')
	const error = await req.consumeFlash('error');

	Message.find().sort({ datetime: -1 }).populate('user').exec((err, messages) => {
		if(err) { return next(err); }
		res.render('index', { title: 'Board', user: req.user, alert: error[0], notice: success[0], messages: messages })
	})
}

exports.create = [
	body('text', 'Message cannot be blank').trim().isLength({ min: 1}).escape(),
	async function(req, res, next) {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			await req.flash('error', 'Message cannot be blank')
			res.redirect('/message')
			return;
		}
		const message = new Message({
			text: req.body.text,
			user: req.user,
			datetime: new Date()
		}).save( async(err) => {
			if(err) { return next(err); }
			await req.flash('success', 'Message saved')
			res.redirect('/message')
		})
	}
]

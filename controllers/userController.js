const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs')
const passport = require('passport')

exports.signup = async function(req, res, next) {
	if (req.user) {
		await req.flash('error', 'You are already signed in')
		res.redirect('/message')
		return;
	}
	res.render('signup', {
		title: 'Signup'
	})
}

exports.create = [
	body('username', 'Username required').trim().isLength({ min: 1 }).escape(),
	body('password', 'Password required').trim().isLength({ min: 1}),
	body('confirm', 'Passwords do not match').trim().custom((value, { req }) => {
		if(value !== req.body.password) {
			throw new Error('Passwords do not match')
		}
		return true;
	}),
	function(req, res, next) {
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			res.render('signup', {
				title: 'Sign Up',
				errors: errors.array(),
				alert: 'Unable to sign up. Please check the errors below',
				prev_username: req.body.username
			})
			return;
		}
		User.findOne({ username: req.body.username }).exec(function(err, found_user){
			if(found_user != null) {
				res.render('signup', {
					title: 'Signup',
					alert: 'Username taken. Please choose another username'
				})
				return;
			}
			bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
				if (err) { return next(err); }
				const user = new User({
					username: req.body.username,
					password: hashedPassword,
					club: false
				}).save( async (err) => {
					if(err) { return next(err); }
					await req.flash('success', 'Created user successfully');
					res.redirect('/user/login');
				})
			});
		});
	}
]

exports.login_get = async function(req, res, next) {
	const error = await req.consumeFlash('error')
	const success = await req.consumeFlash('success')

	if(req.user) {
		await req.flash('error', 'You are already logged in')
		res.redirect('/message')
	}

	res.render('login', { title: 'Login', alert: error[0], notice: success[0], user: req.user });
}

exports.login_post = passport.authenticate("local", {
	successRedirect: "/message",
	failureRedirect: "/user/login",
	failureFlash: true,
	successFlash: true
})

exports.logout = async(req, res, next) => {
	req.logout();
	await req.flash('success', 'Log out successful')
	res.redirect('/message')
}

exports.join_get = async(req, res, next) => {
	const error = await req.consumeFlash('error');

	if(!req.user) {
		await req.flash('error', 'You need to login first');
		res.redirect('/user/login');
		return;
	}
	if(req.user.club) {
		await req.flash('error', 'You have already joined the club');
		res.redirect('/message');
		return;
	}
	res.render('join', { title: 'Join the club', user: req.user, alert: error[0] });
}

exports.join_post = async(req, res, next) => {
	if(req.body.code === 'jointheclub') {
		console.log(req.user._id)
		User.findByIdAndUpdate(req.user._id, { club: true }).exec( async(err, user) => {
			if(err) { return next(err); }
			await req.flash('success', 'You have joined the club')
			res.redirect('/message')
			return;
		});
	}else {
		await req.flash('error', 'Wrong code, maybe check the source code?')
		res.redirect('/user/join')
	}
}

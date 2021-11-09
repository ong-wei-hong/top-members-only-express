const createError = require('http-errors');
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

require('dotenv').config();

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const indexRouter = require('./routes/index')
const userRouter = require('./routes/user');
const messageRouter = require('./routes/message');

const User = require('./models/user');
const bcrypt = require('bcryptjs')

const expressSession = require('express-session');
const { flash } = require('express-flash-message');

const mongoose = require('mongoose');

// mongodb setup
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MONGODB connection error: '));

const app = express();

app.use(helmet());
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// flash setup
app.use(expressSession({
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}))

app.use(flash({ sessionKeyName: 'flashMessage' }));

// passport setup
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
passport.use(
	new LocalStrategy({
		passReqToCallback: true
	}, function(req, username, password, done) {
		User.findOne({ username: username }, function(err, user) {
			if(err) { return done(err); }
			if(!user) { return done(null, false, { message: 'User not found' }); }
			bcrypt.compare(password, user.password, function(err, res) {
				if(res) { return done(null, user, {message: 'Login successful'}); }
				return done(null, false, { message: 'Incorrect password' });
			})
		})
	})
)
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/message', messageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

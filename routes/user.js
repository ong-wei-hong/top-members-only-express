const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');

router.get('/signup', user_controller.signup)

router.post('/create', user_controller.create)

router.get('/login', user_controller.login_get)

router.post('/login', user_controller.login_post);

router.get('/logout', user_controller.logout);

router.get('/join', user_controller.join_get);

router.post('/join', user_controller.join_post);

module.exports = router;

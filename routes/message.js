const express = require('express');
const router = express.Router();

const message_controller = require('../controllers/messageController');

router.get('/', message_controller.index)

router.post('/create', message_controller.create)

module.exports = router;

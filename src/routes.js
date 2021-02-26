const express = require('express');
const router = express.Router();
const { processAndSendReply} = require('./send-message');

router.post('/rates', processAndSendReply);

module.exports = { router };
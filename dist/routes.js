"use strict";

var express = require('express');

var router = express.Router();

var {
  processAndSendReply
} = require('./send-message');

router.get('/', (req, res) => res.send('Twilio-Whatsapp automated messaging.'));
router.post('/rates', processAndSendReply);
module.exports = {
  router
};
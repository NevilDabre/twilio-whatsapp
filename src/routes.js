const express = require('express');
const router = express.Router();
const { processAndSendReply} = require('./send-message');

router.get('/',(req,res)=> res.send('Twilio-Whatsapp automated messaging.'))
router.post('/rates', processAndSendReply);

module.exports = { router };
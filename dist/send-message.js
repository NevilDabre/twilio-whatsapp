"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var http = require('http');

var _ = require('lodash');

var accountSid = process.env.TWILIO_ACCOUNT_SID;
var authToken = process.env.TWILIO_AUTH_TOKEN;
var apiUrl = process.env.REMITBEE_API_URL;

var MessagingResponse = require('twilio').twiml.MessagingResponse;

var welcomeMessage = "Hi welcome to Remitbee customer support. Choose below options to get the exchange rates. \n1) India(INR) \n2) Sri lanka(LKR) \n3) Philippines(PHP)";
/* \n4) USA \n5) Euro \n6)UK \n7) Switzerland \n8) Australia \n9) Singapore \n10) United States \n11) Malaysia \n12) Norway \n13) Czech Republic \n14) Denmark \n15) Hungary \n16) Poland \n17) Sweden \n18) New Zealand \n19) United Arab Emirates \n20) Hong Kong \n21) Japan \n22) Mexico \n23) Saudi Arabia \n24) South Africa \n25) Thailand \n26) Turkey
27) Qatar 28) China`
*/

var apiArguments = ['1', '2', '3', 'in', 'lk', 'ph', 'india', 'philippines', 'sri_lanka'];
var indiaArguments = ['1', 'in', 'inr', 'india'];
var philippinesArguments = ['3', 'ph', 'php', 'philippines'];
var sriLankaArguments = ['2', 'lk', 'lkr', 'sri_lanka'];

var getRatesUsingApi = () => {
  return new Promise((resolve, reject) => {
    http.get(apiUrl, resp => {
      var data = ''; // A chunk of data has been received.

      resp.on('data', chunk => {
        data += chunk;
      }); // The whole response has been received. Print out the result.

      resp.on('end', () => {
        resolve(JSON.parse(data).rates);
      });
    }).on("error", err => {
      reject("Error: " + err.message);
    });
  }); // callback = function(response) {
  //   var str = '';
  //   console.log('response ', response)
  //   return response;
  //   //another chunk of data has been received, so append it to `str`
  // //   response.on('data', function (chunk) {
  // //     str += chunk;
  // //   });
  // //   //the whole response has been received, so we just print it out here
  // //   response.on('end', function () {
  // //     console.log(str);
  // //   });
  // }
  // return http.request(options, callback).end();
};

var buildCountryRateMessage = requestMessage => {
  var requestCurrencyCode = indiaArguments.indexOf(requestMessage) > -1 ? 'INR' : philippinesArguments.indexOf(requestMessage) > -1 ? 'PHP' : sriLankaArguments.indexOf(requestMessage) > -1 ? 'LKR' : 'NA';
  return getRatesUsingApi().then(rates => {
    if (rates && rates.length) {
      var requestCurrencyResult = _.find(rates, {
        currency_code: requestCurrencyCode
      });

      if (requestCurrencyResult) {
        var {
          country_name,
          currency_name,
          rate
        } = requestCurrencyResult;
        return "Remitbee's current rate to ".concat(country_name, " is ").concat(currency_name, ": ").concat(rate, ", please note our rates are subject to change anytime. FREE service fee when sending amount more than $500.00. Please visit https://www.remitbee.com for signup.");
      }
    }

    return welcomeMessage;
  }).catch(err => {
    console.log('buildCountryRateMessage Error', err);
    return welcomeMessage;
  });
};

var buildAndSendWhatsappMessage = (message, res) => {
  var twiml = new MessagingResponse();
  twiml.message(message);
  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(twiml.toString());
};

var processAndSendReply = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (req, res, next) {
    if (req.body) {
      var message = welcomeMessage;
      var _args = req.body;

      var requestMessage = _args.Body.toLowerCase().split(' ').join('_');

      if (_args && _args.Body && apiArguments.indexOf(requestMessage) > -1) {
        //Fetch from API
        message = yield buildCountryRateMessage(requestMessage);
      }

      buildAndSendWhatsappMessage(message, res);
    }
  });

  return function processAndSendReply(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

module.exports = {
  processAndSendReply
};
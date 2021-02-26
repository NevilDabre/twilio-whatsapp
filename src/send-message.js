const http = require('http');
const _ = require('lodash')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiUrl = process.env.REMITBEE_API_URL;
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const welcomeMessage = `Hi welcome to Remitbee customer support. Choose below options to get the exchange rates. 
1) India(INR) \n2) Sri lanka(LKR) \n3) Philippines(PHP)`;

/* \n4) USA \n5) Euro \n6)UK \n7) Switzerland \n8) Australia \n9) Singapore \n10) United States \n11) Malaysia \n12) Norway \n13) Czech Republic \n14) Denmark \n15) Hungary \n16) Poland \n17) Sweden \n18) New Zealand \n19) United Arab Emirates \n20) Hong Kong \n21) Japan \n22) Mexico \n23) Saudi Arabia \n24) South Africa \n25) Thailand \n26) Turkey
27) Qatar 28) China`
*/

const apiArguments = ['1', '2', '3', 'in', 'lk', 'ph', 'india', 'philippines', 'sri_lanka']
const indiaArguments = ['1', 'in', 'inr', 'india'];
const philippinesArguments = ['3', 'ph', 'php', 'philippines'];
const sriLankaArguments = ['2', 'lk', 'lkr', 'sri_lanka']

const getRatesUsingApi = () => {
    return new Promise((resolve, reject) => {
        http.get(apiUrl, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                resolve(JSON.parse(data).rates)
            });

        }).on("error", (err) => {
            reject("Error: " + err.message);
        });
    })


    // callback = function(response) {
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
}

const buildCountryRateMessage = (requestMessage) => {
    const requestCurrencyCode = indiaArguments.indexOf(requestMessage) > -1 ? 'INR' : philippinesArguments.indexOf(requestMessage) > -1 ? 'PHP' : sriLankaArguments.indexOf(requestMessage) > -1 ? 'LKR' : 'NA'
    return getRatesUsingApi().then(rates => {
        if (rates && rates.length) {
            const requestCurrencyResult = _.find(rates, { currency_code: requestCurrencyCode });
            if (requestCurrencyResult) {
                const { country_name, currency_name, rate } = requestCurrencyResult;
                return `Remitbee's current rate to ${country_name} is ${currency_name}: ${rate}, please note our rates are subject to change anytime. FREE service fee when sending amount more than $500.00. Please visit https://www.remitbee.com for signup.`
            }
        }
        return welcomeMessage;
    }).catch(err => {
        console.log('buildCountryRateMessage Error', err)
        return welcomeMessage;
    })
}

const buildAndSendWhatsappMessage = (message, res) => {
    const twiml = new MessagingResponse();

    twiml.message(message);
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
}



const processAndSendReply = async (req, res, next) => {
    if (req.body) {
        let message = welcomeMessage;
        const _args = req.body;
        const requestMessage = _args.Body.toLowerCase().split(' ').join('_')

        if (_args && _args.Body && apiArguments.indexOf(requestMessage) > -1) {
            //Fetch from API
            message = await buildCountryRateMessage(requestMessage)
        }
        buildAndSendWhatsappMessage(message, res)
    }
}

module.exports = {
    processAndSendReply
}

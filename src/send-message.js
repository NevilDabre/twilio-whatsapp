const https = require('https');
const _ = require('lodash')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiUrl = process.env.REMITBEE_API_URL;
const MessagingResponse = require('twilio').twiml.MessagingResponse;

const welcomeMessage = `Hi welcome to Remitbee customer support. Choose below options to get the exchange rates. 
1) India(INR) \n2) Sri lanka(LKR) \n3) Philippines(PHP) \n4) Euro(EUR) \n5) USA(USD) \n6) UK(GBP) \n7) Switzerland(CHF) \n8) Australia(AUD) \n9) Singapore(SGD) \n10) Malaysia (MYR) \n11) Norway(NOK) \n12) Czech(CZK) \n13) Denmark(DKK) \n14) Hungary (HUF) \n15) Poland (PLN) \n16) Sweden(SEK) \n17) New Zealand(NZD) \n18) UAE(AED) \n19) Hong Kong(HKD) \n20) Japan(JPY) \n21) Mexico(MXN) \n22) Saudi Arabia(SAR)  \n23) South Africa(ZAR) \n24) Thailand(THB) \n25) Turkey(TRY) \n26) Qatar(QAR) \n27) China(CNY) \n28) Pakistan(PKR)
`;



const apiArguments = ['1', 'in', 'inr', 'india', '2', 'lk', 'lkr', 'sri_lanka', 'srilanka', 'Sri Lanka', 'Ceylon', 'Jaffna', 'Colombo', 'vavuniya', 'Sri Lanka rate', 'srilankarate', 'CMB', 'all', 'SLR', 'SL rupee', '3', 'ph', 'php', 'philippines', '4', 'eur', 'euro', 'europe', 'France', 'Germany', 'Spain', 'Netherlands', 'Luxembourg','Andorra','Belgium', 'Austria', 'Cyprus', 'Estonia', 'Finland', 'Greece', 'Ireland', 'Italy', 'Malta', 'Monaco', 'Montenegro', 'Portugal', 'San Marino', 'Slovakia', 'Slovenia', '5', 'usd', 'us', 'usa', 'united_states', '6', 'pound', 'pound sterling', 'uk', 'united_kingdom', '7', 'swiss', 'Switzerland', 'chf', '8', 'aud', 'aus', 'australia', 'australian dollar', 'aud', '9', 'singapore', 'sgd', 'sgd', '10', 'malaysia', 'Malaysian Ringgit', 'Ringgit', 'myr', '11', 'norway', 'Norwegian Krone', 'Norwegian', 'nok', '12', 'czech', 'Czech Koruna', 'koruna', 'czk', '13', 'denmark', 'Danish Krone', 'danish', 'dkk','14', 'Hungary', 'forint', 'huf','15', 'Poland', 'Polish Zloty', 'Zloty', 'pln','16', 'sweden', 'Swedish Krona', 'swedish', 'sek','17', 'nzd', 'new_zealand', 'newzealand', 'nzd','18', 'uae', 'dubai', 'dirham', 'aed','19', 'hong_kong', 'hkd','20', 'japan', 'japanese_yen', 'yen', 'jpy', '21', 'mexican_peso', 'mexico', 'mxn', '22', 'Saudi_Arabia', 'saudi', 'riyal', 'sar', '23', 'south_africa', 'south african rand', 'rand', 'zar', '24', 'thailand', 'thai_baht', 'thb', '25', 'turkey', 'turkish_lira', 'turkish', 'try', '26', 'qatar', 'qatari_rial', 'qar']

const currencyWithIntents = [{
    currency_name: 'INR',
    intents: ['1', 'in', 'inr', 'india']
},{
    currency_name: 'LKR',
    intents: ['2', 'lk', 'lkr', 'sri_lanka', 'srilanka', 'Sri Lanka', 'Ceylon', 'Jaffna', 'Colombo', 'vavuniya', 'Sri Lanka rate', 'srilankarate', 'CMB', 'all', 'SLR', 'SL rupee']
},{
    currency_name: 'PHP',
    intents: ['3', 'ph', 'php', 'philippines']
},{
    currency_name: 'EUR',
    intents: ['4', 'eur', 'euro', 'europe', 'France', 'Germany', 'Spain', 'Netherlands', 'Luxembourg','Andorra','Belgium', 'Austria', 'Cyprus', 'Estonia', 'Finland', 'Greece', 'Ireland', 'Italy', 'Malta', 'Monaco', 'Montenegro', 'Portugal', 'San Marino', 'Slovakia', 'Slovenia']
},{
    currency_name: 'USD',
    intents: ['5', 'usd', 'us', 'usa', 'united_states']
},{
    currency_name: 'GBP',
    intents: ['6', 'pound', 'pound sterling', 'uk', 'united_kingdom', 'gbp']
},{
    currency_name: 'CHF',
    intents: ['7', 'swiss', 'Switzerland', 'chf']
},{
    currency_name: 'AUD',
    intents: ['8', 'aud', 'aus', 'australia', 'australian dollar', 'aud']
},{
    currency_name: 'SGD',
    intents: ['9', 'singapore', 'sgd', 'sgd']
},{
    currency_name: 'MYR',
    intents: ['10', 'malaysia', 'Malaysian Ringgit', 'Ringgit', 'myr']
},{
    currency_name: 'NOK',
    intents: ['11', 'norway', 'Norwegian Krone', 'Norwegian', 'nok']
},{
    currency_name: 'CZK',
    intents: ['12', 'czech', 'Czech Koruna', 'koruna', 'czk']
},{
    currency_name: 'DKK',
    intents: ['13', 'denmark', 'Danish Krone', 'danish', 'dkk']
},{
    currency_name: 'HUF',
    intents: ['14', 'Hungary', 'forint', 'huf']
},{
    currency_name: 'PLN',
    intents: ['15', 'Poland', 'Polish Zloty', 'Zloty', 'pln']
},{
    currency_name: 'SEK',
    intents: ['16', 'sweden', 'Swedish Krona', 'swedish', 'sek']
},{
    currency_name: 'NZD',
    intents: ['17', 'nzd', 'new_zealand', 'newzealand', 'nzd']
},{
    currency_name: 'AED',
    intents: ['18', 'uae', 'dubai', 'dirham', 'aed']
},{
    currency_name: 'HKD',
    intents: ['19', 'hong_kong', 'hkd']
},{
    currency_name: 'JPY',
    intents: ['20', 'japan', 'japanese_yen', 'yen', 'jpy']
},{
    currency_name: 'MXN',
    intents: ['21', 'mexican_peso', 'mexico', 'mxn']
},{
    currency_name: 'SAR',
    intents: ['22', 'Saudi_Arabia', 'saudi', 'riyal', 'sar']
},
{
    currency_name: 'ZAR',
    intents: ['23', 'south_africa', 'south african rand', 'rand', 'zar']
},
{
    currency_name: 'THB',
    intents: ['24', 'thailand', 'thai_baht', 'thb']
},
{
    currency_name: 'TRY',
    intents: ['25', 'turkey', 'turkish_lira', 'turkish', 'try']
},
{
    currency_name: 'QAR',
    intents: ['26', 'qatar', 'qatari_rial', 'qar']
},
{
    currency_name: 'CNY',
    intents: ['27', 'china', 'Yuan Renminbi', 'chinese', 'yuan', 'renminbi', 'cny']
},
{
    currency_name: 'PKR',
    intents: ['28', 'pakistan', 'pakistani', 'pakistani_rupee','pkr']
}]

//const japanArguments = ['20', 'japan', 'japanese_yen', 'yen', 'jpy']
// const mexicoArguments = 
// const saudiArguments = 
// const southafricaArguments = 
// const thailandArguments = 
// const turkeyArguments = 
// const qatarArguments = 
// const chinaArguments = 
// const pakistanArguments = 


//     currency_name: 'INR',
//     intents: ['1', 'in', 'inr', 'india']
// },{
//     currency_name: 'INR',
//     intents: ['1', 'in', 'inr', 'india']
// },{
//     currency_name: 'INR',
//     intents: ['20', 'japan', 'japanese_yen', 'yen', 'jpy']
// },{
//     currency_name: 'INR',
//     intents: ['1', 'in', 'inr', 'india']
// },{
//     currency_name: 'INR',
//     intents: ['1', 'in', 'inr', 'india']
// },{
//     currency_name: 'INR',
//     intents: ['20', 'japan', 'japanese_yen', 'yen', 'jpy']
// },{
//     currency_name: 'INR',
//     intents: ['1', 'in', 'inr', 'india']
// },{
//     currency_name: 'INR',
//     intents: ['1', 'in', 'inr', 'india']
// },{
//     currency_name: 'INR',
//     intents: ['20', 'japan', 'japanese_yen', 'yen', 'jpy']
// },{
//     currency_name: 'INR',
//     intents: ['1', 'in', 'inr', 'india']
// },{
//     currency_name: 'INR',
//     intents: ['1', 'in', 'inr', 'india']
// }]

const getRatesUsingApi = () => {
    return new Promise((resolve, reject) => {
        https.get(apiUrl, (resp) => {
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
    const requestCurrencyCode = currencyWithIntents.filter(currencyIntent=>{
        console.log('currencyIntent ', currencyIntent);
        return currencyIntent.intents.indexOf(requestMessage) >-1
    });
    return getRatesUsingApi().then(rates => {
        if (rates && rates.length) {
            const requestCurrencyResult = _.find(rates, { currency_code: requestCurrencyCode && requestCurrencyCode.length && requestCurrencyCode[0].currency_name  });
            if (requestCurrencyResult) {
                const { country_name, currency_name, rate } = requestCurrencyResult;
                return `Remitbee's current rate to ${country_name} is ${rate} ${currency_name}s, please note our rates are subject to change anytime. FREE service fee when sending amount more than $500.00. Please visit https://www.remitbee.com for signup.`
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
        const requestMessage = _args && _args.Body && String(_args.Body).toLowerCase().split(' ').join('_')
        console.log('requestMessage', requestMessage, _args);
        console.log('_args ', _args);

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

const configuration = require('../configuration/configuration');
const asyncHandler = require('express-async-handler');
const axios = require('axios');

const { plan_id, token_sinch, region, test_number } = configuration;

if (!plan_id || !token_sinch || !region || !test_number) {
    throw new Error(`Plan ID, Sinch's Token, Region and Number required`);
}

const headers={'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token_sinch};
const sinchUrl = 'https://sms.api.sinch.com/xms/v1/' + plan_id + '/batches'
//const sinchUrl = 'https://'+ region +'.sms.api.sinch.com/xms/v1/' + plan_id + '/batches'

function formatMessage(name, comment) {
    const formattedName = name.toUpperCase();
    const formattedComment = comment.charAt(0).toUpperCase() + comment.slice(1).toLowerCase();

    const formattedMessage = `${formattedName}\n\n${formattedComment}`;

    return formattedMessage;
}

const sendSms = asyncHandler(async (data) => {
    try {
        const toNumber = data.user.phone;
        const messageDate = data.date ? new Date(data.date).toISOString() : new Date().toISOString();
        console.log(messageDate);
        const payload = JSON.stringify({
            from: test_number,
            to: [`${toNumber}`],
            body: formatMessage(data.name, data.comment),
            send_at: messageDate
        });

        console.log(payload);
        const response = await axios.post(sinchUrl, payload, { headers });
        console.log(response.data);
        return response.data;
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

const cancelSms = asyncHandler(async (data) => {

});

module.exports = { sendSms, cancelSms }
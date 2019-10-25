const transport = require("../config/mail/connection");

const sendMail = async (message) => {
    return await transport.sendMail(message);
};

module.exports = sendMail;

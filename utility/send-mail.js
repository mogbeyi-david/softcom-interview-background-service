const transport = require("../config/mail/connection");

const sendMail = async ({from = process.env.APP_EMAIL, to, subject, message = null, html = null}) => {
    const message = {
        from,
        to,
        subject,
        message,
        html
    };
    await transport.sendMail(message);
};

module.exports = sendMail;

require("dotenv").config();

const constructResetPasswordEmail = (email) => {
    const link = `${process.env.APP_URL}/api-docs/#/Users/reset-password`;
    return [{
        from: process.env.APP_EMAIL,
        to: email,
        subject: "Reset Your Password",
        html: `Please click <a href=${link}>Here</a> to reset your password`
    }];
};

module.exports = constructResetPasswordEmail;

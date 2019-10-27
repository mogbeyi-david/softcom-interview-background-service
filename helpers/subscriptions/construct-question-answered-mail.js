const constructQuestionAnsweredMail = (subscribers) => {
    let mails = [];
    for (let subscriber of subscribers) {
        let mail = {
            from: process.env.APP_EMAIL,
            to: subscriber.user.email,
            subject: "A question you subscribed to has been answered",
            html: `A new answer has been provided to the question: ${subscriber.question.question}`
        };
        mails.push(mail);
    }
    return mails
};

module.exports = constructQuestionAnsweredMail;

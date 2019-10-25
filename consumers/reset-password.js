require("dotenv").config();
const Database = require("../config/database/Database");
const databaseConnectionString = require("../config/database/connection");
new Database(databaseConnectionString).connect();
const connectionString = require("../config/rabbitmq/connection");
const open = require('amqplib').connect(connectionString);
const queue = process.env.RESET_PASSWORD_QUEUE;
const rabbitMqService = require("../services/rabbitmq");
const constructResetPasswordEmail = require("../helpers/reset-password/construct-reset-password-email");
console.log(`Waiting for data in`, queue);

open.then(function (conn) {
    return conn.createChannel();
}).then(function (ch) {
    return ch.assertQueue(queue).then(function (ok) {
        return ch.consume(queue, async (message) => {
            if (message !== null) {
                try {
                    const messageObject = JSON.parse(message.content.toString());
                    let {email} = messageObject;
                    let mails = constructResetPasswordEmail(email);
                    rabbitMqService.publish("mailer", mails);
                } catch (e) {
                    console.log(`An error occurred while consuming ${queue}`, e)
                }
                ch.ack(message);
            }
        });
    });
}).catch(console.warn);

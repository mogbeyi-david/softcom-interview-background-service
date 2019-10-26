require("dotenv").config();
const Database = require("../config/database/Database");
const databaseConnectionString = require("../config/database/connection");
new Database(databaseConnectionString).connect();
const connectionString = require("../config/rabbitmq/connection");
const sendMail = require("../utility/send-mail");
const open = require('amqplib').connect(connectionString);
const queue = process.env.MAILER_QUEUE;
console.log(`Waiting for data in`, queue);
open.then(function (conn) {
    return conn.createChannel();
}).then(function (ch) {
    return ch.assertQueue(queue).then(function (ok) {
        return ch.consume(queue, async (message) => {
            if (message !== null) {
                try {
                    const messages = JSON.parse(message.content.toString());
                    console.log("Messages", messages);
                    for (let message of messages) {
                        await sendMail(message)
                    }
                } catch (e) {
                    console.log(`An error occurred while consuming ${queue}`, e)
                }
                ch.ack(message);
            }
        });
    });
}).catch(console.warn);

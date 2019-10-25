require("dotenv").config();
const mongoose = require('mongoose');
const Database = require("../../config/database/Database");
const databaseConnectionString = require("../../config/database/connection");
new Database(databaseConnectionString).connect();
const connectionString = require("../../config/rabbitmq/connection");
const open = require('amqplib').connect(connectionString);
const queue = process.env.NOTIFY_SUBSCRIBERS_TO_QUESTION_QUEUE;
const SubscriptionRepository = require("../../repositories/SubscriptionRepository");
console.log(`Waiting for data in`, queue);

open.then(function (conn) {
    return conn.createChannel();
}).then(function (ch) {
    return ch.assertQueue(queue).then(function (ok) {
        return ch.consume(queue, async (message) => {
            if (message !== null) {
                try {
                    const messageObject = JSON.parse(message.content.toString());
                    let question = messageObject.question;
                    question = mongoose.Types.ObjectId(question);
                    const subscribers = await SubscriptionRepository.getAllForQuestion(question);
                    console.log("Subscribers", subscribers);
                } catch (e) {
                    console.log(`An error occurred while consuming ${queue}`, e)
                }
                ch.ack(message);
            }
        });
    });
}).catch(console.warn);

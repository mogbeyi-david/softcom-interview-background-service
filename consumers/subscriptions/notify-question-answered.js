require("dotenv").config();
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
                    const messageObject = JSON.parse(message);
                    const question = messageObject.question;
                    const subscribers = await SubscriptionRepository.getAllForQuestion(question);
                    console.log("Subscribers", subscribers);
                } catch (e) {
                    console.log(`An error occurred while consuming ${queue}`, e)
                }
                ch.ack(msg);
            }
        });
    });
}).catch(console.warn);

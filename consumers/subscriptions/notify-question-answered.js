require("dotenv").config();
const connectionString = require("../../config/rabbitmq/connection");
const open = require('amqplib').connect(connectionString);
const queue = process.env.NOTIFY_SUBSCRIBERS_TO_QUESTION_QUEUE;

console.log(`Waiting for data in`, queue);

open.then(function (conn) {
    return conn.createChannel();
}).then(function (ch) {
    return ch.assertQueue(queue).then(function (ok) {
        return ch.consume(queue, function (msg) {
            if (msg !== null) {
                console.log(msg.content.toString());
                ch.ack(msg);
            }
        });
    });
}).catch(console.warn);

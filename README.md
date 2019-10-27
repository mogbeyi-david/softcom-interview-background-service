# stack-overflow-lite-api background service
> API that implements the basic features of stack overflow


| PROJECT FEATURE | STATUS   |
| :---         |     :---:         | 
| RabbitMQ consumers     | :white_check_mark:| 
| Running processes concurrently     | :white_check_mark:| 
| Notify subscribers of answered questions     | :white_check_mark:| 
| Send out emails     | :white_check_mark:| 
| Reset password     | :white_check_mark:|  


- Asynchronous and background operations via [RabbitMQ](https://www.rabbitmq.com/uri-spec.html). You can find the RabbitMQ Management [Here](http://178.128.153.181:15672/#/). Please contact the Developer for login credentials
- Uses [MongoDB](https://www.mongodb.com) as database.
- [Mongoose](https://mongoosejs.com) as object document model
- Environments for `development`, `testing`, and `production`
- Linting via [eslint](https://github.com/eslint/eslint)
- Built with [npm scripts](#npm-scripts)
- [Digital Ocean](https://digitalocean.com) for deployment. Please find the link to the health check [Here](http://206.189.227.235/health-check) and API documentation [here](http://206.189.227.235/api-docs)
- example for User model and User controller, with jwt authentication, simply type `npm i` and `npm start`

## Table of Contents

- [Install & Use](#install-and-use)
- [Folder Structure](#folder-structure)
- [Consumers](#consumers)
  - [Run the consumers](#run-the-consumers)
- [npm Scripts](#npm-scripts)

## Install and Use

Start by cloning this repository

```sh
# HTTPS
$ git clone https://github.com/mogbeyi-david/softcom-interview-background-service.git
```

then

```sh
# cd into project root
$ npm install
$ npm start
```

## Folder Structure

This codebase has the following directories:

- config - Settings for any external services or resources.
- helper - Contains functions perform formatting of data
- models - Database schema definitions, plugins and model creation
- repositories - Wrappers for database functions (Similar to DAO)
- services - Wrapper classes and methods for external services
- Utility - Functions used often in codebase and tests


# Consumers
## Consumers

### Run the consumers

Consumers are the subscribers to data published in RabbitMQ.
Sample consumer

```js
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


```

## npm scripts

There are no automation tool or task runner like [grunt](https://gruntjs.com/) or [gulp](http://gulpjs.com/) used for this project. This project only uses npm scripts for automation.

### npm start

This is command to run all consumers concurrently with a command to kill others if one fails
Before running the application, please set the following environment variables

```dotenv
NODE_ENV=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
TEST_DB_NAME=
DB_FOR_LOGS=
PORT=
JWT_SECRET_KEY=
APP_URL=
MAILTRAP_HOST=
MAILTRAP_PORT=
MAILTRAP_USERNAME=
MAILTRAP_PASSWORD=
APP_EMAIL=
APP_EMAIL_PASSWORD=
EMAIL_HOST=
RABBITMQ_USERNAME=
RABBITMQ_PASSWORD=
RABBITMQ_HOST=
RABBITMQ_PORT=
ELASTIC_SEARCH_PORT=
RESET_PASSWORD_QUEUE=

```

## LICENSE

MIT © Stack Overflow Lite Background Service

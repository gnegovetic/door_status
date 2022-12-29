'use strict';

const Mailer = require('nodemailer');
require('dotenv').config();

class Emailer {

    constructor() {
        this.transport = Mailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
            user: process.env.EMAIL_FROM,
            pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    Send(message, channel = 'prod') {

        return new Promise((resolve, reject) => {

            const email = {
                from: process.env.EMAIL_FROM,
                to: process.env.EMAIL_TO,
                subject: 'Garage Door',
                text: message
            };

            if (channel == 'test') {
                let str = JSON.stringify(email);
                console.log("Email sent: " + str);
                resolve();
            } else {
                this.transport.sendMail(email, function(err, info) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(info);
                        resolve();
                    }
                });
            }
        });
    }
}

module.exports = Emailer;

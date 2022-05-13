'use strict';

const AWS = require('aws-sdk');

class AwsNotificationSend {

    constructor() {
        this.credentials = new AWS.SharedIniFileCredentials({profile: 'personal-account'});
        if (!this.credentials.accessKeyId) {
            throw Error('AWS credentials not found.');
        }
    }

    Send(message, channel = 'prod') {

        return new Promise((resolve, reject) => {
      
            // topic 0 is produciton, 1 is debug (TODO: use topic names not index)
            let topicIdx = 0;
            if (channel === 'prod') {
                topicIdx = 0;
            }
            else if (channel === 'debug') {
                topicIdx = 1;
            }
            else {
                throw Error('Unknown message channel');
            }

            AWS.config.credentials = this.credentials;

            // Set region
            AWS.config.update({region: 'us-west-2'});

            // Get topics
            // Create promise and SNS service object
            var listTopicsPromise = new AWS.SNS({apiVersion: '2010-03-31'}).listTopics({}).promise();

            // Handle promise's fulfilled/rejected states
            listTopicsPromise.then(
                function(data) {
                    const topic = data.Topics[topicIdx].TopicArn;
                    var params = {
                        Message: message, /* text to send */
                        TopicArn: topic
                    };

                    console.log(`Message ${params.Message} send sent to the topic ${params.TopicArn}`);
                
                    // Create promise and SNS service object
                    var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();

                    // Handle promise's fulfilled/rejected states
                    publishTextPromise.then(
                        function(data) {        
                            console.log("MessageID is " + data.MessageId);
                            resolve();
                        }).catch(
                            function(err) {
                                console.log(err);
                                reject(err);
                        }
                    );

                }).catch(
                    function(err) {
                        console.log(err);
                        reject(err);
                }
            );

        });
    }

}

module.exports = AwsNotificationSend;

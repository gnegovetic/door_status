// This class tracks when the 'inputVal' change has occurred
'use strict';

const Logger = require('./logger');

class ChangeTrancker {

    constructor(sensor, app) {
        this.sensor = sensor;
        this.app = app;

        let now = new Date();
        this.lastUpdate = now;
        this.lastChange = now;
        this.startTime = now;
        this.notificationDelayMinutes = 5; // Defualt notification delay

        // Counter that counts down to next notification
        this.secondsToNextNotification = this.notificationDelayMinutes * 60;

        // read initial sensor value
        this.inputVal = sensor.ReadInput();
        if (this.inputVal < 0 || this.inputVal > 1) {
            throw new Error("Invalid sensor value read.");
        }

        this.notificationAlreadySent = false;

        this.logger = new Logger();
    }

    set NotificationDelayMinutes(val) {
        this.notificationDelayMinutes = val;
    }

    RunPollLoop(interval_ms = 1000) {
        var _this = this;
        this.interval = setInterval(function() {

            _this.UpdateStatus();

        }, interval_ms);
    }

    StopPollLoop() {
        if (this.interval !== undefined) {
            clearInterval(this.interval);
        }
    }

    // Logic to decide when to send notificaton, called every time status is updated
    UpdateStatus() {

        var date = new Date();
        this.lastUpdate = date;

        // Read input and update if changed
        let inputValue = this.sensor.ReadInput();
        let isClosed = inputValue == 0 ? true : false;

        if (inputValue != this.inputVal) {
            this.inputVal = inputValue; // remember for next time
            this.lastChange = date;

            this.logger.Log(isClosed);  // Log the change
        }

        // Count down to notification and sent notification if expired
        if (isClosed == true) {

            if (this.notificationAlreadySent) {
                var now = new Date();
                let msg = `Door closed at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                this.app.SendMessage(msg);
            }

            this.notificationAlreadySent = false;
            this.secondsToNextNotification = this.notificationDelayMinutes * 60; // reset the countdown
        }
        else {
            // door is open and notification is not yet sent
            if (!this.notificationAlreadySent) {
                // has enough time elapsed?
                var now = new Date();
                var timespanFromChange = now - new Date(this.lastChange); // ms

                // remaining time before notification
                let secondsSinceChange = timespanFromChange / 1000;
                let sendNotificationInSeconds = (this.notificationDelayMinutes * 60) - secondsSinceChange;
                this.secondsToNextNotification = Math.floor(sendNotificationInSeconds); // round down to integer

                if (this.secondsToNextNotification <= 0) {
                    // Delay had expired, send notification
                    let msg = `Door open for over ${this.notificationDelayMinutes} mins at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
                    this.app.SendMessage(msg);

                    this.notificationAlreadySent = true;
                    console.log("Notification sent." + msg);
                    this.secondsToNextNotification = 0;
                }
            }
        }

        // Return status
        return {
            lastUpdate: this.lastUpdate,
            lastChange: this.lastChange,
            inputValue: this.inputVal,
            serviceStarted: this.startTime,
            secondsToNextNotification: this.secondsToNextNotification
        };    
    }


}

module.exports = ChangeTrancker;

'use strict';

class App {

    /* 
    Env variables expected:
        - API_KEY: Api key required for some REST calls 
        - MODE: mode is 'prod', 'debug' or 'test' (test=simulation/no hardware)
    */
    constructor() {

        // Check we have the API key
        require('dotenv').config();
        if (!(process.env.API_KEY)) {
            throw Error("API Key not specified.");
        }
        let mode = process.env.MODE;
        if (!mode) {
            throw Error("Mode specified. Expected prod, debug, or test");
        }

        // Create sensor object (real hardware or simulation) 
        const Sensor = require('./sensor.js');
        this.sensor = new Sensor((mode === 'test') ? true : false);

        // Create notification object
        const Notifier = require('./emailer');
        this.notifier = new Notifier();

        // Init the time keeper
        const ChangeTrancker = require('./changeTracker.js');
        this.ct = new ChangeTrancker(this.sensor, this);
        console.log('Started service');

        this.mode = mode;

        // Start update polling loop
        this.ct.RunPollLoop(1000);

    }

    Stop() {
        this.ct.StopPollLoop();
    }

    get Mode() {
        return this.mode;
    }

    SendMessage(message) {

        return new Promise((resolve, reject) => {
            console.log("Message to send: " + message);

            this.notifier.Send(message, this.mode).then(() => {
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    }

    SetTestInputValue(val) {
        this.sensor.SetSimulationValue(val);
    }

    GetStatus() {

        // Read input and update status
        let status = this.ct.UpdateStatus();
        let isClosed = status.inputValue == 0 ? true : false;

        status.doorClosed = isClosed;
        return status;
    }

    SetDelayTime(delay_mins) {
        this.ct.NotificationDelayMinutes = delay_mins;
    }

}

module.exports = App;

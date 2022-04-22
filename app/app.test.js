'use strict';

const App = require('./app');

test('create app object', () => {
    let app = new App();
    expect(app).toBeDefined();
    app.Stop();
});

test('check open/close status', () => {
    let app = new App();

    try {
        let stat = app.GetStatus();
        expect(stat.doorClosed).toBe(false);

        app.SetTestInputValue(0);
        stat = app.GetStatus();
        expect(stat.doorClosed).toBe(true);

        app.SetTestInputValue(1);
        stat = app.GetStatus();
        expect(stat.doorClosed).toBe(false);
    }
    finally {
        app.Stop();
    }
});

test('send notification', () => {
    let app = new App();

    try {
        const logSpy = jest.spyOn(console, 'log');
        const msg = "Test Notification";
        app.SendMessage(msg);
        expect(logSpy).toHaveBeenCalledWith("Message to send: " + msg);
    }
    finally {
        app.Stop();
    }
});

// Extend the default timeout
jest.setTimeout(10000);

test('check open/close timing', async() => {
    let app = new App();

    try {
        let stat = app.GetStatus();
        expect(stat.doorClosed).toBe(false);
        // Should be within 100ms
        expect(stat.lastUpdate.getTime() / 100).toBeCloseTo(stat.serviceStarted.getTime() / 100, 1.0);
        expect(stat.lastUpdate.getTime() / 100).toBeCloseTo(stat.lastChange.getTime() / 100, 1.0);

        // make a change
        app.SetTestInputValue(0);
        await new Promise((r) => setTimeout(r, 2100));
        stat = app.GetStatus();
        let timeDiff = stat.lastUpdate.getTime() - stat.lastChange.getTime();
        expect(timeDiff).toBeGreaterThan(1000);
        expect(timeDiff).toBeLessThan(2000);

    }
    finally {
        app.Stop();
    }
});

test('time to notification', async() => {
    let app = new App();

    try {
        app.SetTestInputValue(0); // close the door
        let stat = app.GetStatus();
        expect(stat.doorClosed).toBe(true);
        expect(stat.secondsToNextNotification).toBe(5*60);

        app.SetTestInputValue(1);
        await new Promise((r) => setTimeout(r, 1500));
        stat = app.GetStatus();
        expect(stat.doorClosed).toBe(false);
        //console.log('sec to notification: ' + stat.secondsToNextNotification);
        let secondsLeft = stat.secondsToNextNotification;
        expect(secondsLeft).toBeLessThan(5*60);
        expect(secondsLeft).toBeGreaterThan(5*60 - 5);

        // verify it's counting down
        await new Promise((r) => setTimeout(r, 1500));
        stat = app.GetStatus();
        expect(stat.secondsToNextNotification - secondsLeft).toBeLessThan(0);

        // change timer
        app.SetDelayTime(1/60);
        await new Promise((r) => setTimeout(r, 1500));
        stat = app.GetStatus();
        expect(stat.secondsToNextNotification).toBe(0); // notificaiton sent

    }
    finally {
        app.Stop();
    }
});
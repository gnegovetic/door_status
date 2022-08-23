'use strict';

const Logger = require('./Logger');

test('log event string test', async() => {
    let logger = new Logger();
    expect(logger).toBeDefined();

    let logItem = await logger.CreateLogString(true);
    let arr = logItem.split(',');
    expect(arr.length).toBe(6);
    expect(arr[1]).toBe('true');

    logItem = await logger.CreateLogString(false);
    arr = logItem.split(',');
    expect(arr.length).toBe(6);
    expect(arr[1]).toBe('false');
});

test('log append to file', async() => {
    let logger = new Logger();
    expect(logger).toBeDefined();

    await logger.Log(true);

});

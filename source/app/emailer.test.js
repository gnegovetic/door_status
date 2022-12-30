'use strict';

const Emailer = require('./emailer');

test('send email test', () => {
    const logSpy = jest.spyOn(console, 'log');
    let emailer = new Emailer();
    emailer.Send("Test Message", 'test');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("Email sent:"));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("@gmail.com"));
});
'use strict';

const App = require('../app/app.js')
let app = new App();

/**
 * Delay notification by specified time in minutes
 *
 * body Delay_body 
 * no response value expected for this operation
 **/
exports.delayPUT = function(body) {
  return new Promise(function(resolve, reject) {

    try {
      app.SetDelayTime(parseInt(body.minutes));

      resolve();
    }
    catch(e) {
      reject(e.message);
    }
  });
}


/**
 * Set sensor value for debugging. Not available in production
 *
 * body Input_value_body 
 * no response value expected for this operation
 **/
exports.input_valuePUT = function(body) {
  return new Promise(function(resolve, reject) {

    try {
      let value = body.value;
      let val = parseInt(value);
      if (val !==0 && val !== 1)
        throw Error("Invalid value.");

      app.SetTestInputValue(val);

      resolve();
    }
    catch (e) {
      reject(e.message);
    }
  });
}


/**
 * Test message
 *
 * body Notification_body 
 * no response value expected for this operation
 **/
exports.notificationPUT = function(body) {
  return new Promise(function(resolve, reject) {

      app.SendMessage(body.test_message).then(() => {
        resolve();
      }).catch(error => {
        reject(error.message);
      });

  });
}


/**
 * Get door status
 * Get door status information
 *
 * returns Status
 **/
exports.statusGET = function() {
  return new Promise(function(resolve, reject) {

    let status = app.GetStatus();

    const response = {
      "last_read" : status.lastUpdate.toLocaleString(),
      "status_closed" : status.doorClosed,
      "mode" : app.Mode,
      "last_change" : status.lastChange.toLocaleString(),
      "service_started" : status.serviceStarted.toLocaleString(),
      "notification_time" : status.secondsToNextNotification
    };
    
    resolve(response);

  });
}


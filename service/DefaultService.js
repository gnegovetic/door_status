'use strict';


/**
 * Delay notification by specified time in minutes
 *
 * body Delay_body 
 * no response value expected for this operation
 **/
exports.delayPUT = function(body) {
  return new Promise(function(resolve, reject) {
    resolve();
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
    resolve();
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
    var examples = {};
    examples['application/json'] = {
  "last_read" : "2019-12-16T18:44:55.000Z",
  "status_closed" : true,
  "last_change" : "2019-12-15T17:55:32.000Z",
  "service_started" : "2019-12-10T11:55:20.000Z",
  "notification_time" : "2019-12-10T11:59:33.000Z"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


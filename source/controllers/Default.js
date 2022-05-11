'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/DefaultService');

module.exports.delayPUT = function delayPUT (req, res, next, body) {

  // Check API Key 
  if (req.header('x-api-key') !== process.env.API_KEY) {
    let rp = new Promise(function(resolve, reject) {
      resolve("Invalid key");
    });
    rp.then(function (response) {
      utils.writeJson(res, response, 401);
    });
  }
  else { // key is OK
    
    Default.delayPUT(body)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });

  }
};

module.exports.input_valuePUT = function input_valuePUT (req, res, next, body) {

  // Check API Key 
  if (req.header('x-api-key') !== process.env.API_KEY) {
    let rp = new Promise(function(resolve, reject) {
      resolve("Invalid key");
    });
    rp.then(function (response) {
      utils.writeJson(res, response, 401);
    });
  }
  else { // key is OK 
    Default.input_valuePUT(body)
      .then(function (response) {
        utils.writeJson(res, response);
      })
      .catch(function (response) {
        utils.writeJson(res, response);
      });
    }
};

module.exports.notificationPUT = function notificationPUT (req, res, next, body) {
  Default.notificationPUT(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response, 440);
    });
};

module.exports.statusGET = function statusGET (req, res, next) {
  Default.statusGET()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

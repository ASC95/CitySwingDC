'use strict';
const https = require('https');

/**
* Constructs an object that should have the same properties as the options
* for Node's https.request().
* @param { object | string | url } - See https://nodejs.org/api/http.html#http_http_request_options_callback 
* for the available options.
* @constructor
*/
let HttpsService = function(httpsOptions) {
  if (typeof httpsOptions !== 'object') {
    throw new TypeError('The httpsOptions argument must be an object');
  }
  this.httpsOptions = httpsOptions;
};

/**
* A function that wraps the Node https.get() in a promise and invokes it. 
* @returns {string} - Returns the data from the response
*/
HttpsService.prototype.get = function() {
  return new Promise((resolve, reject) => {
    const request = https.get(this.httpsOptions);
    request.on('response', resolve);
    request.on('error', reject);
  })
  .then(msg => {
    return new Promise((resolve, reject) => {
      let rawData = '';
      msg.on('data', chunk => { rawData += chunk });
      msg.on('end', () => {
        resolve(rawData);
      });
      msg.on('error', reject);
    });
  });
};

module.exports = HttpsService;

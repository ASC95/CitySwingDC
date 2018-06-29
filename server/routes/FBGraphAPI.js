'use strict';
const https = require('https');
const HttpsService = require('./HttpsService');
//const { logger } = root_require('./server/logger.js');

/*
Using process.env. doesn't work.
exporting the env does work?
*/

let FBGraphAPI = function(path) {
  if (typeof path !== 'string') {
    throw new TypeError('FBGraphAPI path argument should be a string');
  }
  if (/\s/.test(path)) {
    throw new SyntaxError('the path argument must be a valid url path');
  }
  const httpsOptions = {
    protocol: 'https:',
    hostname: 'graph.facebook.com',
    path: path,
    method: 'GET',
    headers: {
      'accept': 'application/json'
    }
  };
  this.service = new HttpsService(httpsOptions);
}

FBGraphAPI.prototype.getJSON = function() {
  return this.service.get()
  .then(json => {
    JSON.parse(json);
    return json;
  });
};

module.exports = FBGraphAPI;

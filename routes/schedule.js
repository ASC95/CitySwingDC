const express = require('express');
const router = express.Router();
const https = require('https');
const urls = require('./urls');

router.get('/', function(req, res) {
  res.render('schedule', urls);
});

const access_token = process.env.FACEBOOK_TOKEN;
const url_parts = {
  base : 'https://graph.facebook.com',
  version : '/v2.11',
  node : '/472901119585727',
  edge : '/feed',
  query : '?limit=10&fields=story%2Cupdated_time%2Cmessage%2Cfrom%7Bname%2Cid%2Cpicture%7D',
  access_token : '&access_token=' + access_token
};
const url = Object.values(url_parts).join('');
console.log(url);

/* This is the route to get the FB posts. The FB API requires an auth token, to the server has to make the request
in order to protect the auth token. I can't just do an AJAX request from the client to FB */
router.get('/announcements', function(req, res, next) {
  /* This code was taken from: https://nodejs.org/api/http.html#http_http_get_options_callback
  The fb_req object is an http.ClientRequest that is returned by get() (its a WritableStream)
  The fb_res object is an http.IncomingMessage (which is a ReadableStream) */
  const fb_req = https.get(url);
  fb_req.on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
  fb_req.on('response', fb_res => {
    const { statusCode } = fb_res;
    // https://nodejs.org/api/http.html#http_message_headers
    const contentType = fb_res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
      //RegExp.prototype.test()
    } else if (!/^text\/javascript/.test(contentType)) {
      error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // Must consume response data to free up memory. Now end() can be called
      fb_res.resume();
      res.write('<p> There was an error </p>');
      res.end();
      /* I don't know where this returns to, but I must return to prevent calling res.send() since
      I called res.end() already */
      return;
    }

    fb_res.setEncoding('utf8');
    // Must consume the response data
    let rawData = '';
    fb_res.on('data', chunk => { rawData += chunk; });
    fb_res.on('end', () => {
      try {
        // Construct a JS object from the string to make it easier to access key-value pairs
        prepare_data(rawData);
        const parsedData = JSON.parse(rawData);
        res.send(parsedData);
      } catch (e) {
        console.error('Error during \'end\' event: ' + e.message);
      }
    });
  });
});

module.exports = router;

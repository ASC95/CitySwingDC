'use strict';
const https = require('https');
const { logger } = root_require('./server/logger.js');

const access_token = process.env.FACEBOOK_TOKEN;
const url_parts = {
  api_version : '/v2.11',
  node : '/472901119585727',
  edge : '/feed',
  query : '?limit=10&fields=story%2Cupdated_time%2Cmessage%2Cfrom%7Bname%2Cid%2Cpicture%7D',
  access_token : '&access_token=' + access_token
};
//const url = Object.values(url_parts).join('');
//console.log(url);

const options = {
  protocol: 'https:',
  hostname: 'graph.facebook.com',
  path: Object.values(url_parts).join(''),
  method: 'GET',
  headers: {
    'accept': 'application/json'
  }
};

// This code was influenced by: https://nodejs.org/api/http.html#http_http_get_options_callback.
// fb_req is an http.ClientRequest
function send_fb_data(express_res) {
  let fb_req;
  try {
    fb_req = https.get(options);
  } catch (e) {
    logger.error(`${e}`);
    return;
  }
  if (fb_req) {
    fb_req.on('error', (e) => {
      //log to sever
      console.error(`Got error: ${e.message}`);
    });
  /* 
  I need express to send the facebook data back to the client. Therefore, I need to call 
  express_res.send(facebook_data) inside of the 'response' event listener callback.
  There are two ways I can make express_res accessible within the scope of the 'response' event listener
  1) Add express_res as a property to fb_req. This way, I preserve access to the http.ClientRequest
  inside of handle_response through 'this'. However, I am non-transparently modifying an important 
  built-in object...
  2) handle_response.bind(express_res). Now I'm NOT modifying the http.ClientRequest,
  but I lose access to it inside of handle_response.
  Which approach is better? I cannot pass in express_res as an argument to the event listener callback.
  The way to avoid all of this is to declare the callback inside of the 'response' event listener, but this
  makes the callback impossible (or at least really hard) to test.
  -2nd way is better because the node API could change and http.ClientRequest.express_res could be a real
  property in the future. If I wanted to modify the built-in object, I should make a new class
  3) Just do handle_response.bind({express_res: express_res, fb_req: fb_req}); to keep everything
  */
    fb_req.on('response', handle_response.bind({express_res: express_res, fb_req: fb_req}));
  }
}

/**
* Does stuff.
* @param {IncomingMessage} msg - the returned http response
*/
function handle_response(msg) {
  if (validate_message(msg)) {
    msg.setEncoding('utf8');
    // Must consume the response data
    let raw_data = '';
    msg.on('data', chunk => { raw_data += chunk; });
    msg.on('end', () => {
      try {
        if(validate_json(raw_data)) {
          this.express_res.send(raw_data);
        } else {
          this.express_res.write('<p>Error parsing the json</p>');
          this.express_res.end();
        }
        /* Perhaps I should only make the announcments section visible if my server received a displayable respone from FB.
        That way, the posts will display correctly if they are there and nothing will display if something happens
        (such as facebook's api changing). That way, there is no weird looking error messages or anything on the page*/
      } catch (e) {
        // log to server
        console.error('Error during \'end\' event: ' + e.message);
      }
    });
  } else {
    // Must consume response data to free up memory. Now end() can be called
    msg.resume();
    this.express_res.send('Server error!');
    this.express_res.end();
  }
}

/**
* Verifies that the https response returned...
* @param {IncomingMessage} msg - the returned http response
*/
function validate_message(msg) {
  const {statusCode} = msg;
  // https://nodejs.org/api/http.html#http_message_headers
  const contentType = msg.headers['content-type'];
  //console.log(msg);
  //console.log(contentType);
  
  let error;
  if (statusCode < 200 || statusCode >= 300) {
    //log to server
    error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
    //RegExp.prototype.test()
  } else if (!/^application\/json/.test(contentType)) {
    //log to server
    error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message); 
    return false;
  }
  return true;
}

/**
* See: https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
* Checks if the argument is an object, but excludes functions (even though they are objects).
* @param {Object} obj - An object to check.
* @returns {boolean} - Returns true if the argument is an object. Returns false for functions.
*/
function is_non_function_object(obj) {
  return obj !== null && typeof obj === 'object';
}

/** 
* Validates that facebook returned meaningful data from the Graph API request.
* @param {string} json - json retrieved from Facebook.
* @returns {boolean} - returns false if the json was invalid, returns true otherwise.
*/
function validate_json(json) {
  let posts_container; 
  try {
    posts_container = JSON.parse(json);
  } catch (e) {
    //log to server?
    return false;
  }
  if (!is_non_function_object(posts_container) || !posts_container.data || posts_container.data.length === 0) { 
    //log to server 
    return false; 
  }
  return true;
}

// does the post (remember it could be anything!) have the necessary fields?
function filter_posts(posts_container) {
  const posts = JSON.parse(posts_container).data;

}

function validate_post(post) {

}


/** Takes an array of Facebook posts from the Facebook Graph API and outputs a subset of those posts according to the filters.
@param { object } filters - contains key-value pairs, where each pair is a filter. E.g. { author : "David Alan" }.
@param { string } fb_posts - contains the data from the Facebook Graph API
*/
function filter_fb_posts(filters, fb_posts) {
  let post_obj;
  try {
    post_obj = JSON.parse(fb_posts);
  } catch (e) {
    console.error(e.message);
  }
  return JSON.stringify(post_obj); 
}

module.exports = {
  send_fb_data: send_fb_data,
  validate_json: validate_json,
  is_non_function_object: is_non_function_object,
  validate_message: validate_message
}

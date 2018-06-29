const https = require('https');

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

// There's lots of ways we can define this service -- let's just keep it simple for now
const FacebookGraph = {
	getCityswingFeed: getCityswingFeed
};

/*
There is no guarantee that a 'response' event will be emitted. But if it is emitted,
then the first promise should resolve. So, I should spy on request.on() to force a resolve
because I want to test the behavior of this function, GIVEN that it resolves.

However, I can't seem to spy on request.on(), so I have to break this function into multiple
pieces so that I can resolve/reject this promise as desired during testing.
*/
function getCityswingFeed() {
  return new Promise((resolve, reject) => {
    const request = https.get(options);
    request.on('response', resolve);
  })
  .then(msg => {
    let raw_data = '';
    msg.on('data', chunk => { raw_data += chunk; });
    msg.on('end', () => {
      resolve(raw_data);
    });
  })
  .then(json => {

  });  
}


FacebookGraph.getCityswingFeed();

module.exports = FacebookGraph;

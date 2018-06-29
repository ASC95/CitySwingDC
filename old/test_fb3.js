const http = require('http');
const https = require('https');
const FacebookGraph = root_require('/server/routes/schedule/fb_API_request3.js');

/*
The entire purpose for the httpsPromise is to be able to manually simulate a resolved
promise 100% of the time. A promise can resolve or reject, but I want to consistently
unit test its behavior GIVEN that it resolves. Same thing for rejection. I want to test
that it does what is expected GIVEN that it rejects. Testing what makes it reject or resolve
is a separate matter.

spyOn().and.returnValue() targets the unpredictable network element (which is the fetch API in 
the tutorial) and forces it do something (resolve or reject) in order to remove unpredictability in testing.
*/

describe('getCityswingFeed()', function() {
  let facebookPromise;
  let promiseHelper;

	beforeEach(function() {
    const httpsPromise = new Promise(function(resolve, reject) {
      /*
      promiseHelper allows me to resolve this promise whenever I want to.
      Now, httpsPromise can be resolved at an arbitrary time
      */
      promiseHelper = {
        resolve: resolve,
        reject: reject
      };
    });
    /*
    All calls to https.get() now return httpsPromise. 
    */
		//spyOn(https, 'get').and.returnValue(httpsPromise);
    //spyOn(FacebookGraph, 'getCityswingFeed').and.returnValue(httpsPromise);
    spyOn(https, 'get').and.callFake(function() {
      
    }
    facebookPromise = FacebookGraph.getCityswingFeed();
	});

	//it('should call https.get(options) with a specific set of options', function() {
  //  const access_token = process.env.FACEBOOK_TOKEN;
  //  const url_parts = {
  //    api_version : '/v2.11',
  //    node : '/472901119585727',
  //    edge : '/feed',
  //    query : '?limit=10&fields=story%2Cupdated_time%2Cmessage%2Cfrom%7Bname%2Cid%2Cpicture%7D',
  //    access_token : '&access_token=' + access_token
  //  };
  //  const options = {
  //    protocol: 'https:',
  //    hostname: 'graph.facebook.com',
  //    path: Object.values(url_parts).join(''),
  //    method: 'GET',
  //    headers: {
  //      'accept': 'application/json'
  //    }
  //  };
	//	expect(https.get).toHaveBeenCalledWith(options);
	//});

  it('returns a promise', function() {
    expect(facebookPromise).toEqual(jasmine.any(Promise));
  });

	describe('on successful https request', function() {
    /*
    Simulates a successful network response beforehand. I need this because the network will
    not produce identical results 100% of the time, and I need 100% consistency in unit tests.
    */
		beforeEach(function() {
      /*
      This is what should return when the promise resolves
      */
      const response = new http.IncomingMessage();
      /*
      I'm manually resolving the httpsPromise with the promiseHelper
      */
      promiseHelper.resolve(response);
		});

    /*
    Did the returned promise (i.e. the promise returned from facebookPromise, which is actually
    httpsPromise) pass along the IncomingMessage?
    */
		it('resolves its promise with an instance of http.IncomingMessage', function() {
      facebookPromise.then(function(msg) {
        expect(msg).toEqual(jasmine.any(http.IncomingMessage));
        done();
      });
		});
	});

  describe('on unsuccessful https request', function() {
    var errorObj = { msg: 'Wow, this really failed!' };

    beforeEach(function() {
      promiseHelper.reject(errorObj);
    });

    it('resolves its promise with the current temperature', function(done) {
      temperaturePromise.catch(function(error) {
        expect(error).toEqual(errorObj);
        done();
      });
    });

  });

});

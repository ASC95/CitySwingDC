'use strict';
/*
Nock non-transparently intercepts requests made by the node https module.
Interceptors are removed after a single call to https.whatever() unless persist() is used,
that's why I must call nock in the beforeEach() section
Tutorial: https://javascriptplayground.com/mocking-web-requests/
*/
const nock = require('nock');
const https = require('https');
const HttpsService = root_require('server/routes/HttpsService');

describe('HttpsService,', () => {

  describe('constructor(httpsOptions),', () => {
    
    it('throws TypeError if 1st argument is not an object', () => {
      expect(() => {
        new HttpsService('invalid');
      }).toThrowError();
    });

  });

  describe('get(),', () => {

    describe('when https.get() is being intercepted by nock,', () => {

      describe('on sucessful nock response,', () => {

        beforeEach(() => {
          // Intercept all https.get() requests to all domains
          nock('https://arbitrary-fake-url.com', {
            filteringScope: scope => {
              return true;
            }
          })
          .filteringPath(function(path) {
            return '/';
          })
          .get('/')
          .reply('200', 'nock');
        });

        it('should have its internal https.get() call be intercepted by nock during unit testing', (done) => {
          const service = new HttpsService({});
          service.get().then(data => {
            expect(data).toEqual('nock');
            done();
          });
        })

        it('should return a resolved promise', (done) => {
          const service = new HttpsService({});
          service.get().then(data => {
            expect(data).toEqual('nock');
            done(); 
          }, err => {
            done(new Error('promise should not reject'));
          });
        });

      });

      describe('when nock emits an error', () => {
    
        beforeEach(() => {
          nock('https://arbitrary-fake-url.com', {
            filteringScope: scope => {
              return true;
            }
          })
          .filteringPath(function(path) {
            return '/';
          })
          .get('/')
          .replyWithError("nock error");
        });

        it('should return a rejected promise', (done) => {
          const service = new HttpsService({});
          const promise = service.get();
          promise.then(data => {
            done(new Error('Promise should not be resolved'));
          }, err => {
            expect(err.message).toEqual('nock error');
            done();
          });
        });

      }); 

    });

  });

});

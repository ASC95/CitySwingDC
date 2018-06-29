const http = require('http');
const FBGraphAPI = root_require('server/routes/FBGraphAPI.js');
const HttpsService = root_require('server/routes/HttpsService');

/*
It seems nearly impossible to spyOn() event emitters in node. 
It seems nearly impossible to spyOn() the Promise constructor so I could fake it.
How do I unit test this code?
*/
describe('FBGraphAPI(path)', () => {

  it('should throw error if no path argument is given', () => {
    expect(() => {
      new FBGraphAPI();
    }).toThrowError();
  });

  it('should throw error if path argument contains spaces', () => {
    expect(() => {
      new FBGraphAPI('invalid path');
    }).toThrowError();
  });

  it('should not throw error if path argument is a string without spaces', () => {
    new FBGraphAPI('valid_path');
    expect(() => {
      new FBGraphAPI('valid_path');
    }).not.toThrowError();
  });

});

describe('getJSON()', () => {

  describe('internal HttpsService GET request succeeds,', () => {

    describe('response contains json,', () => {

      const json = '{ "valid_prop": "valid_value" }';

      beforeEach(() => {
        spyOn(HttpsService.prototype, 'get').and.returnValue(
          Promise.resolve(json)
        );
      });

      it('should return a resolved promise containing JSON', (done) => {
        const graph = new FBGraphAPI('path');
        graph.getJSON().then(data => {
          expect(HttpsService.prototype.get).toHaveBeenCalled();
          expect(data).toEqual(json);
          done();
        });
      });

    });

    describe('response does not contain json,', () => {

      beforeEach(() => {
        spyOn(HttpsService.prototype, 'get').and.returnValue(
          Promise.resolve('<http></http>')
        );
      });

      it('should return a rejected promise', (done) => {
        const graph = new FBGraphAPI('path');
        graph.getJSON().then(_ => {
          done(new Error('Promise should not be resolved'));
        }, err => {
          expect(HttpsService.prototype.get).toHaveBeenCalled();
          done(); 
        });
      });
      
    });
  
  });

});



//describe('validateJSON(json)', () => {
//  // JSON.parse() always expects a string
//
//  it('returns false if posts_container is null', () => {
//    expect(validateJSON(null)).toEqual(false);
//  });
//
//  it('returns false if there is no json', () => {
//    const empty = "";
//    expect(validateJSON(empty)).toEqual(false);
//  });
//
//  it('returns false if the json does not contain the data property', () => {
//    const json = "{}";
//    expect(validateJSON(json)).toEqual(false);
//  });
//
//  it('returns false if the json data array is empty', () => {
//    const json = '{ "data" : [] }';
//    expect(validateJSON(json)).toEqual(false);
//  });
//});

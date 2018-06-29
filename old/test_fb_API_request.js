'use strict';
//const http = require('http');
const fb_API_request = root_require('server/routes/schedule/fb_API_request');
import_all(fb_API_request);

/* 1) Write alpha-code to determine function parameters and expected behavior.
  2) Write test code 
  3) Refactor alpha code
  If it's hard to write a test for a function, then that function is doing too much!
*/
describe('is_non_function_object(obj)', () => {

  it('should return false if argument is a null', () => {
    expect(is_non_function_object(null)).toEqual(false);
  });

  it('should return false if argument is a function', () => {
    expect(is_non_function_object((function(){}))).toEqual(false);
  });

  it('should return true if the argument is an array', () => {
    expect(is_non_function_object([])).toEqual(true);
  });

  it('should return true if the argument is an object', () => {
    expect(is_non_function_object({})).toEqual(true);
  });
});

describe('validate_json(json)', () => {
  // JSON.parse() always expects a string

  it('returns false if posts_container is null', () => {
    expect(validate_json(null)).toEqual(false);
  });

  it('returns false if there is no json', () => {
    const empty = "";
    expect(validate_json(empty)).toEqual(false);
  });

  it('returns false if the json does not contain the data property', () => {
    const json = "{}";
    expect(validate_json(json)).toEqual(false);
  });

  it('returns false if the json data array is empty', () => {
    const json = '{ "data" : [] }';
    expect(validate_json(json)).toEqual(false);
  });
});

describe('validate_message(msg)', () => {
  
  it('should return false if statusCode < 200', () => {
    const msg = {
      statusCode: 199
    }
    //validate_message(msg); 
  });

});

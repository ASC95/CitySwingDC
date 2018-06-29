/* I need to test my fb.js code. One of the post objects didn't have a message field, so the word "undefined"
was displayed on the webpage. I would have never known this was going to happen if it hadn't been for the
format of that particular post. I need to test my code to protect against predicted and unpredicted problems!
*/
function jasmine() {

describe('display_post()', () => {

  beforeEach(function() {
    document.getElementsByClassName('fixture')[0].innerHTML = window.__html__['compiled_fixtures/schedule.html'];
  });

  afterEach(function() {
    document.getElementsByClassName('fixture')[0].innerHTML = "";
  });

  xit('should return if a post has no author', () => {
    //stub a post object with no author?
    display_post(); 
  });
});

describe('FB_request', () => {

  beforeEach(function() {
    document.getElementsByClassName('fixture')[0].innerHTML = window.__html__['compiled_fixtures/schedule.html'];
  });

  afterEach(function() {
    document.getElementsByClassName('fixture')[0].innerHTML = "";
  });

  xit('should have a defined onreadystatechange handler function', () => {
    FB_request();
    // the spied upon method now calls the real function
    //spyOn(XMLHttpRequest.prototype, 'open').and.callThrough(); 
    //FB_request();
    //expect(XMLHttpRequest.prototype.open).toHaveBeenCalled();
    //spyOn(XMLHttpRequest.prototype, 'onreadystatechange').and.callThrough(); //problem
    //FB_request();
    //expect(XMLHttpRequest.prototype.onreadystatechange).toHaveBeenCalled();
  });
});

describe(
}

module.exports = { 
  test_target : "../client/src/javascripts/fb.js",
  test_code : jasmine
};

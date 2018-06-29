(function() {
(factory => {
  window.FB_request = factory();
})(() => {
  'use strict';
  function FB_request() {
    // Taken from https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started
    const httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      alert('Giving up. Cannot create an XMLHTTP instance');
      return false;
    }
    httpRequest.onreadystatechange = () => {  
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          //alert(httpRequest.responseText);
          //document.getElementsByClassName('fb_post__text')[0].innerHTML = httpRequest.responseText;
          append_posts(httpRequest.responseText);
        } else {
          alert('There was a problem with the request. HTTP status: ' + 
          httpRequest.status + ' HTTP readyState: ' + httpRequest.readyState);
        }
      }
    };
    httpRequest.open('GET', 'http://localhost:5000/schedule/announcements');
    httpRequest.send();
  }

  function append_posts(json) {
    const post_container = JSON.parse(json);
    //console.log(post_container);
    // Iterating over an array of objects
    for (let post of post_container.data) {
      display_post(post);
    }
  }

  function display_post(post_data) {
    const author = document.createElement('p');
    author.className = 'fb_post__author';
    author.appendChild(document.createTextNode(post_data.from.name));
    const text = document.createElement('p');
    text.className = 'fb_post__text';
    text.appendChild(document.createTextNode(post_data.message));
    const post = document.createElement('article'); 
    post.className = 'fb_post';
    post.appendChild(author);
    post.appendChild(text);
    document.getElementsByClassName('fb_feed')[0].appendChild(post);     
  }
  return FB_request;
});
FB_request();


describe('display_post()', () => {

  beforeEach(function() {
    document.getElementsByClassName('fixture')[0].innerHTML = window.__html__['compiled_fixtures/schedule.html'];
  });

  afterEach(function() {
    document.getElementsByClassName('fixture')[0].innerHTML = "";
  });

  it('should return if a post has no author', () => {
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

  it('should have a defined onreadystatechange handler function', () => {
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
})();
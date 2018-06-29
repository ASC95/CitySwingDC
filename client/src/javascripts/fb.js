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
          alert(httpRequest.responseText);
        }
      }
    };
    httpRequest.open('GET', 'http://localhost:5000/schedule/announcements');
    httpRequest.send();
  }

  // See: https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try/3710226
  function tryParseJSON (jsonString){
    try {
      var o = JSON.parse(jsonString);
      if (o && typeof o === "object") {
        return o;
      }
    }
    catch (e) { }
    return undefined;
  };

  function append_posts(json) {
    document.getElementsByClassName('fb_feed')[0].style.display = 'block';
    try {
      const post_container = JSON.parse(json);
      //console.log(post_container);
      // Iterating over an array of objects
      for (let post of post_container.data) {
        display_post(post);
      }
    } catch (e) {
      
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
    document.getElementsByClassName('fb_feed__content')[0].appendChild(post);     
  }
  return FB_request;
});
FB_request();

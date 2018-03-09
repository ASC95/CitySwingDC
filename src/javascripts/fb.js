/* 
1. Send the Ajax request
2. Processed data is returned
  2a. Data consists of David's most recent 5 posts.
  2b. Each datum will be an object with keys equal to components of the post
    { 
      name : 'David Alan',
      datetime : ... ,
      post : 'this is a post',
      image_url : http//... , 
    }
3. Append the data to the document
*/

// Code taken from https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started
(function() {
  //let httpRequest;
  //document.getElementById("ajaxButton").addEventListener('click', makeRequest);

  function makeRequest() {
    let httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      alert('Giving up :( Cannot create an XMLHTTP instance');
      return false;
    }
    httpRequest.onreadystatechange = append_fb_posts(httpRequest);
    httpRequest.open('GET', 'localhost:5000/schedule/announcements');
    httpRequest.send();
  }

  function append_fb_posts(httpRequest) {
    try {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          alert(httpRequest.responseText);
        } else {
          alert('There was a problem with the request.');
        }
      }
    } catch(e) {
      console.log('Caught Exception: ' + e.description);
    }
  }
})();

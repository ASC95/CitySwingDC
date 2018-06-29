'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (factory) {
  window.FB_request = factory();
})(function () {
  'use strict';

  function FB_request() {
    // Taken from https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started
    var httpRequest = new XMLHttpRequest();
    if (!httpRequest) {
      alert('Giving up. Cannot create an XMLHTTP instance');
      return false;
    }
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          //alert(httpRequest.responseText);
          //document.getElementsByClassName('fb_post__text')[0].innerHTML = httpRequest.responseText;
          append_posts(httpRequest.responseText);
        } else {
          alert('There was a problem with the request. HTTP status: ' + httpRequest.status + ' HTTP readyState: ' + httpRequest.readyState);
          alert(httpRequest.responseText);
        }
      }
    };
    httpRequest.open('GET', 'http://localhost:5000/schedule/announcements');
    httpRequest.send();
  }

  // See: https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try/3710226
  function tryParseJSON(jsonString) {
    try {
      var o = JSON.parse(jsonString);
      if (o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === "object") {
        return o;
      }
    } catch (e) {}
    return undefined;
  };

  function append_posts(json) {
    document.getElementsByClassName('fb_feed')[0].style.display = 'block';
    try {
      var post_container = JSON.parse(json);
      //console.log(post_container);
      // Iterating over an array of objects
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = post_container.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var post = _step.value;

          display_post(post);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } catch (e) {}
  }

  function display_post(post_data) {
    var author = document.createElement('p');
    author.className = 'fb_post__author';
    author.appendChild(document.createTextNode(post_data.from.name));
    var text = document.createElement('p');
    text.className = 'fb_post__text';
    text.appendChild(document.createTextNode(post_data.message));
    var post = document.createElement('article');
    post.className = 'fb_post';
    post.appendChild(author);
    post.appendChild(text);
    document.getElementsByClassName('fb_feed__content')[0].appendChild(post);
  }
  return FB_request;
});
FB_request();
//# sourceMappingURL=fb.js.map

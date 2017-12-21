// Using jsdoc documentation style
'use strict';

(function (root, factory) {
    // requireJS
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    // Node
    } else if (typeof exports === 'object') {
        module.exports = factory();
    // browser
    } else {
        root.Slideshow = factory();
    }
}(this, function () {

  let active_button;

/*
The load_globals() function is necessary because karma loads and parses this file into the browser before any test files are run. Therefore, no fixtures are loaded when this file is parsed, so any attempts to access DOM aspects of the fixture result in undefined variables. The load_globals() function reloads these variables AFTER the fixture has been loaded because the function is called in the Slideshow constructor.
*/
  let load_globals = function () {
    active_button = document.getElementsByClassName('slideshow__button--active')[0];
  }

  function set_active_item() {
    //console.log('button was clicked');
    //console.log(this);
    //console.log('active button was');
    //console.log(active_button);

    active_button.className = 'slideshow__button';
    active_button.slideshow_item.className = 'slideshow__item';
    active_button = this;
    this.className += ' slideshow__button--active'; 
    this.slideshow_item.className += ' slideshow__item--active';
  }

  /**Creates a Slideshow
  @constructor
  */
  let Slideshow = function() {
    load_globals();
    this.buttons = document.getElementsByClassName('slideshow__button');
    this.slideshow_items = document.getElementsByClassName('slideshow__item');
    let length = this.buttons.length;
    if (length !== this.slideshow_items.length) {
      throw new Error('The number of buttons and items should match');
    }
    for (let i = 0; i < length; i++) {
      this.buttons[i].slideshow_item = this.slideshow_items[i]; 
      // I am adding a SINGLE event listener to all of the buttons! If there was an anonymous function inside of addEventListener, then that anonymous function would form a closure with the Slideshow constructor
      this.buttons[i].addEventListener('click', set_active_item);
    }
  }
  return Slideshow;
}));

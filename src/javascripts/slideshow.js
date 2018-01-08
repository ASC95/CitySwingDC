"use strict";

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
  
  /** Resets the classes of the previously active button and slideshow item, then makes the current
  button and its associated item active.
  @param {Slideshow} slideshow - The Slideshow object's context
  */
  function set_active_item(slideshow) {
    slideshow.active_button.className = 'slideshow__button';
    slideshow.active_button.slideshow_item.className = 'slideshow__item';
    slideshow.active_button = this;
    this.className += ' slideshow__button--active'; 
    this.slideshow_item.className += ' slideshow__item--active';
  }

  /**Creates a Slideshow
  @constructor
  */
  let Slideshow = function() {
    let slideshow_scope = this;
    this.active_button = document.getElementsByClassName('slideshow__button--active')[0];
    this.buttons = document.getElementsByClassName('slideshow__button');
    this.slideshow_items = document.getElementsByClassName('slideshow__item');
    let length = this.buttons.length;
    if (length !== this.slideshow_items.length) {
      throw new Error('The number of buttons and items should match');
    }
    for (let i = 0; i < length; i++) {
      this.buttons[i].slideshow_item = this.slideshow_items[i]; 
      this.buttons[i].addEventListener('click', function() {
        set_active_item.bind(this)(slideshow_scope);
      });
    }
  }
  return Slideshow;
}));

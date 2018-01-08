'use strict';

function Nav_menu_controller() {
  let menu = document.getElementsByClassName('nav__menu')[0];
  let body = document.body;

  this.toggle_menu_display = function() {
    /*if (menu.style.display === 'none') {
      menu.style.display = 'block';
      body.style.overflow = 'hidden'; 
    } else {
      menu.style.display = 'none';
      body.style.overflow = 'visible';
    }*/
    if (menu.className === 'nav__menu nav__menu--hidden') {
      menu.className = 'nav__menu nav__menu--visible'; 
      body.className = 'body--hidden';
    } else {
      menu.className = 'nav__menu nav__menu--hidden';
      body.className = '';
    }
  };

  document.getElementsByClassName('fa-bars')[0].addEventListener('click', this.toggle_menu_display);
}

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

'use strict';

console.log(this);
new Nav_menu_controller();
new Slideshow();

//# sourceMappingURL=all.js.map

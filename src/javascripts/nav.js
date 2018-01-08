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

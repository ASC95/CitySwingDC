(factory => {
  window.Nav_controller = factory();
})(() => {
  'use strict';
  function Nav_controller() {
    const nav_context = this;
    this.menu = document.getElementsByClassName('nav__menu')[0];
    this.body = document.body;
    this.toggle_menu_visibility = function() {
      if (this.menu.dataset.display === 'hidden') {
        this.menu.dataset.display = ''; 
        this.body.dataset.display = 'hidden';
      } else {
        this.menu.dataset.display = 'hidden';
        this.body.dataset.display = '';
      }
    }
    document.getElementsByClassName('fa-bars')[0].addEventListener(
      'click',
      nav_context.toggle_menu_visibility.bind(nav_context)
    );
  }
  
  return Nav_controller;
});

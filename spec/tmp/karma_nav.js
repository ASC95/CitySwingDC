(function() {
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

describe('Nav_controller()', function() {
  
  beforeEach(function() {
    // The path is relative to karma.conf.js
    document.getElementsByClassName('fixture')[0].innerHTML = window.__html__['compiled_fixtures/includes/nav.html'];
  });

  afterEach(function() {
    document.getElementsByClassName('fixture')[0].innerHTML = "";
  });

  describe('toggle_menu_visibility()', function() {
    
    it('should make menu visible when menu is hidden', function() {
      const controller = new Nav_controller();
      const menu = document.getElementsByClassName('nav__menu')[0];
      expect(menu.dataset.display).toEqual('hidden');
      controller.toggle_menu_visibility();
      expect(menu.dataset.display).toEqual('');
    });

    it('should make menu hidden when menu is visible', function() {
      const controller = new Nav_controller();
      const menu = document.getElementsByClassName('nav__menu')[0];
      menu.dataset.display = '';
      controller.toggle_menu_visibility();
      expect(menu.dataset.display).toEqual('hidden');
    });
  });
})
})();
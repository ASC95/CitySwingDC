'use strict';

describe('setup_nav_menu()', function() {

  beforeAll(function() {
    fixture.setBase('spec/compiled_fixtures')
  });

  beforeEach(function() {
    let element_array = fixture.load('layout.html'); 
  });

  describe('toggle_menu()', function() {
    
    it('should make menu visible when menu is hidden', function() {
      let controller = new Nav_menu_controller();
      let menu = document.getElementsByClassName('nav__menu nav__menu--hidden')[0];
      expect(menu.className).toEqual('nav__menu nav__menu--hidden');
      controller.toggle_menu_display();
      expect(menu.className).toEqual('nav__menu nav__menu--visible');
    });

    it('should make menu hidden when menu is visible', function() {
      let controller = new Nav_menu_controller();
      let menu = document.getElementsByClassName('nav__menu nav__menu--hidden')[0];
      menu.className = 'nav__menu nav__menu--visible';
      controller.toggle_menu_display();
      expect(menu.className).toEqual('nav__menu nav__menu--hidden');
    });

  });

});

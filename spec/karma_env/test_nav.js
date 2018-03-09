describe('Nav_controller()', function() {
  
  beforeEach(function() {
    load_fixture(); 
  });

  afterEach(function() {
    unload_fixture(); 
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

});

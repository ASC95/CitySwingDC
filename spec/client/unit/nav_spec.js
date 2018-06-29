function jasmine() {
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
}

module.exports = { 
  test_target : "../client/src/javascripts/nav.js",
  test_code : jasmine
};

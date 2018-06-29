function jasmine() {
describe('Slideshow', function() {

  beforeEach(function() {
    // The path is relative to karma.conf.js
    document.getElementsByClassName('fixture')[0].innerHTML = window.__html__['compiled_fixtures/includes/slideshow.html'];
  });

  afterEach(function() {
    document.getElementsByClassName('fixture')[0].innerHTML = "";
  });

  describe('constructor', function() {

    it('should throw error if the number of buttons and number of items don\'t match', function() {
      expect(function() { new Slideshow(); }).not.toThrowError();
      let extra_button = "<button class='slideshow__button'>3</button>";
      document.body.insertAdjacentHTML('beforeend', extra_button); 
      expect(function() { new Slideshow(); }).toThrowError(); 
      document.body.removeChild(document.body.lastChild);
    });

  });

  describe('set_active_item()', function() {

    it('should append to button class name', function() {
      let slideshow = new Slideshow();
      let inactive_button = document.getElementsByClassName('slideshow__button')[1];
      expect(inactive_button.className).toEqual('slideshow__button');
      inactive_button.click();
      expect(inactive_button.className).toEqual('slideshow__button slideshow__button--active');
    });

    it('should not append to button class name if button is already active', function() {
      let slideshow = new Slideshow();
      let active_button = document.getElementsByClassName('slideshow__button--active')[0];
      expect(active_button.className).toEqual('slideshow__button slideshow__button--active');
      active_button.click();
      expect(active_button.className).toEqual('slideshow__button slideshow__button--active');
    });

    it('should only set one active button at a time', function() {
      let slideshow = new Slideshow();
      let buttons = document.getElementsByClassName('slideshow__button');
      let active_button_count = document.getElementsByClassName('slideshow__button--active').length;
      expect(active_button_count).toEqual(1);
      for(let btn of buttons) {
        btn.click();
      }
      let new_count = document.getElementsByClassName('slideshow__button--active').length;
      expect(new_count).toEqual(active_button_count);
    });

    it('should append to slideshow item class name', function() {
      let slideshow = new Slideshow();
      let inactive_button = document.getElementsByClassName('slideshow__button')[1];
      let inactive_item = document.getElementsByClassName('slideshow__item')[1];
      expect(inactive_item.className).toEqual('slideshow__item');
      inactive_button.click();
      expect(inactive_item.className).toEqual('slideshow__item slideshow__item--active');
    });

    it('should not append to slideshow item class name if item is already active', function() {
      let slideshow = new Slideshow();
      let active_button = document.getElementsByClassName('slideshow__button--active')[0];
      let active_item = document.getElementsByClassName('slideshow__item--active')[0]; 
      expect(active_item.className).toEqual('slideshow__item slideshow__item--active');
      active_button.click();
      expect(active_item.className).toEqual('slideshow__item slideshow__item--active');
    });

    it('should only set one active item at a time', function() {
      let slideshow = new Slideshow();
      let buttons = document.getElementsByClassName('slideshow__button'); 
      let slideshow_items = document.getElementsByClassName('slideshow__item');
      let active_item_count = document.getElementsByClassName('slideshow__item--active').length;
      expect(active_item_count).toEqual(1);
      for(let btn of buttons) {
        btn.click();
      }
      let new_count = document.getElementsByClassName('slideshow__item--active').length;
      expect(new_count).toEqual(active_item_count);
    });

    it('should update the slideshow item and button with the same relative position in the DOM', function() {
      let slideshow = new Slideshow();
      let inactive_button = document.getElementsByClassName('slideshow__button')[1];
      expect(inactive_button.className).toEqual('slideshow__button');
      let inactive_item = document.getElementsByClassName('slideshow__item')[1];
      expect(inactive_item.className).toEqual('slideshow__item');
      inactive_button.click();
      expect(inactive_button.className).toEqual('slideshow__button slideshow__button--active');
      expect(inactive_item.className).toEqual('slideshow__item slideshow__item--active');
    });
  });
});
}

/* It's okay to have this code here because this file is never run in the browser. 
It's imported into my test generator which creates a tmp file for the browser
*/
module.exports = {
  test_target : '../client/src/javascripts/slideshow.js',
  test_code : jasmine
}

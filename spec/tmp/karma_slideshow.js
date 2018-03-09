(function() {
function load_fixture() {
  document.getElementsByClassName('fixture')[0].innerHTML = window.__html__['spec/compiled_fixtures/includes/slideshow.html'];
}

function unload_fixture() {
  document.getElementsByClassName('fixture')[0].innerHTML = "";
}

(factory => {
  window.Slideshow = factory();
})(() => {
  'use strict';

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

  /**Creates a Slideshow. Apparently if a Slideshow is garbage collected, then the event listeners
  * on its buttons are also garbage collected.
  @constructor
  */
  let Slideshow = function() {
    const slideshow_scope = this;
    this.active_button = document.getElementsByClassName('slideshow__button--active')[0];
    if (this.active_button) {
      this.buttons = document.getElementsByClassName('slideshow__button');
      this.slideshow_items = document.getElementsByClassName('slideshow__item');
      const length = this.buttons.length;
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
  }

  return Slideshow;
});
describe('Slideshow', function() {

  beforeEach(function() {
    load_fixture(); 
  });

  afterEach(function() {
    unload_fixture(); 
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
})();
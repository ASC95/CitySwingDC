"use strict";window.Nav_controller=function(){this.menu=document.getElementsByClassName("nav__menu")[0],this.body=document.body,this.toggle_menu_visibility=function(){"hidden"===this.menu.dataset.display?(this.menu.dataset.display="",this.body.dataset.display="hidden"):(this.menu.dataset.display="hidden",this.body.dataset.display="")},document.getElementsByClassName("fa-bars")[0].addEventListener("click",this.toggle_menu_visibility.bind(this))},window.Slideshow=function(){function t(t){t.active_button.className="slideshow__button",t.active_button.slideshow_item.className="slideshow__item",t.active_button=this,this.className+=" slideshow__button--active",this.slideshow_item.className+=" slideshow__item--active"}return function(){var s=this;if(this.active_button=document.getElementsByClassName("slideshow__button--active")[0],this.active_button){this.buttons=document.getElementsByClassName("slideshow__button"),this.slideshow_items=document.getElementsByClassName("slideshow__item");var e=this.buttons.length;if(e!==this.slideshow_items.length)throw new Error("The number of buttons and items should match");for(var i=0;i<e;i++)this.buttons[i].slideshow_item=this.slideshow_items[i],this.buttons[i].addEventListener("click",function(){t.bind(this)(s)})}}}(),new Nav_controller,new Slideshow;
//# sourceMappingURL=all.js.map
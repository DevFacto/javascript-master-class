var Slideshow = (function(){
  'use strict';
  
  function next() {
    if (current < allEls.length - 1 ){
      current++;
    }
    allEls[current].scrollIntoView();
  }

  function prev() {
    if (current > 0) {
      current--;
    }
    allEls[current].scrollIntoView();
  }

  window.onkeydown = function(event) {
    if (event.which === 37) {
      //LEFT
      prev();
    } else if (event.which === 39) {
      //RIGHT
      next();
    }
  };

  var current, allEls = [];

	return {
		init: function() {
      var contentSection = document.body.getElementsByTagName('section')[0];
      contentSection.style.opacity = '0.2';
			allEls = contentSection.querySelectorAll('h1,h2,h3,h4,h5,h6');
      current = 0;
      allEls[0].scrollIntoView();
		},
    next: next,
    prev: prev
  }
})();
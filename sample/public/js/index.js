'use strict';
document.addEventListener("DOMContentLoaded", function() {
  window.beatSlider = new window.BeatSlider({
    classNames: {
      init: 'beat-js-slider',
      image: 'bs-image',
    },
    scroll: {
      interval: 3000,
      direction: 'left',
      use: true,
    },
  });

  window.beatSlider.init();
});

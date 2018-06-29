var express = require('express');
var router = express.Router();

/* GET test page. */
router.get('/', function(req, res, next) {
  let slideshow_images = ['cat.jpg', 'download.png', 'entrance_desktop.png', 'entrance_mobile.png', 'RedApple.jpg'];
  res.render('venue', {
    title: 'Express',
    images: slideshow_images
  });
});

module.exports = router;

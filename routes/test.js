var express = require('express');
var router = express.Router();
let slideshow_images = ['cat.jpg', 'download.png', 'entrance_desktop.png', 'entrance_mobile.png', 'RedApple.jpg'];
/* GET test page. */
router.get('/', function(req, res, next) {
  res.render('slideshow', {
    title: 'Express',
    images: slideshow_images
  });
});

module.exports = router;

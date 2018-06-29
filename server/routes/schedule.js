'use strict';
const express = require('express');
const FBGraphAPI = require('./FBGraphAPI');
const urls = require('./urls');

const accessToken = process.env.FACEBOOK_TOKEN;
const router = express.Router();

router.get('/', function(req, res) {
  res.render('schedule', urls);
});

//router.get('/announcements', wrapAsync(renderAnnouncements));
async function renderAnnouncements(req, res, next) {
  const path = Object.values({
    apiVersion : '/v2.11',
    node : '/472901119585727',
    edge : '/feed',
    query : '?limit=10&fields=story%2Cupdated_time%2Cmessage%2Cfrom%7Bname%2Cid%2Cpicture%7D',
    accessToken : '&access_token=' + accessToken
  }).join('');
  console.log(path);
  const graph = new FBGraphAPI(path);
  const json = await graph.getJSON(); 
  res.send(json);
}

router.use(function(err, req, res, next) {
  console.log('hello from error middleware');
  console.error(err.stack)
  //next(err)
  res.end();
});

function wrapAsync(fn) {
  return function(req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next);
  };
}


module.exports = {
  router: router,
  renderAnnouncements: renderAnnouncements
}

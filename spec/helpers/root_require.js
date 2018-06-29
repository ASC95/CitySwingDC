// Allows importing from where app.js is located in the directory structure
global.root_require = function(name) {
  return require('../../' + name);
}

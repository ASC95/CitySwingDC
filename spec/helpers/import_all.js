global.import_all = function(module) {
  for (let key in module) {
    global[key] = module[key];
    //console.log(global[key]);
  }
}

// Karma loads all of the scripts one after another into the browser. Once ALL the scripts have ALREADY been loaded, then the testing framework (jasmine in my case) runs its "describe" and "it" tests. This is why I need to wrap the loading and unloading code inside functions that are CALLED once all the scripts have already been LOADED
// Also, the loading and unloading functions cannot be in the global scope. If they are, then the last script loaded overwrites the load_fixture() function with it's own function, and all the rest of the load_fixture() functions are lost! Global scope sucks! That's why I wrap each script in its own IIFE
// Removing the fixture element just detaches the element from the DOM. The element is not destroyed. Therefore, when I re-append to the fixture element I am adding html markup to existing markup from previous appends which is not what I want!

const fs = require('fs');
const path = require('path');

// All paths are relative to THIS file, which should be in the same directory as karma.conf.js
const fixture_dirs = ['compiled_fixtures/', 'compiled_fixtures/includes/'];
const test_dir = 'client/';
const src_dirs = ['../client/src/javascripts/'];//, 'src/javascripts/concat/'];
const output_dir = 'tmp/';
const fixture_const_file = 'declare_const_fixture.js';

/* Writes a small script to the file that is first loaded by Karma into the browser.
Only writes the file if it doesn't exist
*/
fs.writeFile(
  output_dir + fixture_const_file, 
  "const fixture = document.createElement('div');\n" +
  "fixture.className = 'fixture';\n" +
  "document.body.insertAdjacentElement('afterbegin', fixture);",
  err => {
    if(err) throw err;
  }
);

/** Reads all files in fixture_dirs and begins the process of
* creating a tmp testing file for each fixture and its 
* associated src .js file. Each tmp file is loaded into the browser by Karma.
* This function does way too much.
*/
for (let fixture_dir of fixture_dirs) {
  fs.readdir(fixture_dir, (err, files) => {
    if (err) throw err; 
    for (let fixture_file of files) {
      const fixture_name = fixture_file.slice(0, fixture_file.indexOf('.'));
      for (let src_dir of src_dirs) {
        const src_file = src_dir + fixture_name + '.js';
        fs.access(src_file, err => {
          if (err) {
            //console.log(err);
            console.log('no src file inside ' + src_dir + ' for ' + fixture_file + '. No output file written'); 
          } else {
            const test_file = test_dir + 'test_' + fixture_name + '.js';
            const output_file = output_dir + 'karma_' + fixture_name + '.js';
            console.log('writing ' + output_file + ' for fixture ' + fixture_file + ' from src ' + src_file);
            write_loader_to_output({
              fixture_dir: fixture_dir,
              fixture_file: fixture_file,
              src_file: src_file,
              test_file: test_file,
              output_file: output_file
            });
          }
        });
      }
    }
  }); 
}



/** Writes a script which will load and unload the html fixture (stored in a special browser object provided
* by Karma) into the actual document body so that the src .js files work as intended.
* @param {string} fixture_file - The html fixture file which should be loaded by this script.
* @param {string} src_file - The .js file containing code to be run along with the html fixture
* @param {string} test_file - The .js file that tests the corresponding src .js file
* @param {string} output_file - The tmp testing file to be loaded into the browser by Karma
*/
function write_loader_to_output({ fixture_dir, fixture_file, src_file, test_file, output_file } = {}) { 
  const fixture_loader_script = 
    "(function() {\n" +
    "function load_fixture() {\n" +
    "  document.getElementsByClassName('fixture')[0].innerHTML = window.__html__[\'" + fixture_dir + fixture_file + "\'];\n" +
    "}\n" +

    "function load_custom_fixture(fixture_file) {\n" +
    "  document.getElementsByClassName('fixture')[0].innerHTML = window.__html__[\'fixture_file\'];\n" +
    "}\n" +

    "\nfunction unload_fixture() {\n" +
    "  document.getElementsByClassName('fixture')[0].innerHTML = \"\";\n" +
    "}\n\n";
  const ws = fs.createWriteStream(output_file);
  ws.on('error', err => {
    throw err;
  });
  ws.write(fixture_loader_script);
  ws.end();
  ws.on('finish', () => {
    write_src_to_output({
      src_file: src_file,
      test_file: test_file,
      output_file: output_file,
    });
  });
}

/** Writes src_file file to output_file
* @param {string} src_file - The .js file containing code to be run along with the html fixture
* @param {string} test_file - The .js file that tests the corresponding src .js file
* @param {string} output_file - The tmp testing file to be loaded into the browser by Karma
*/
function write_src_to_output({ test_file, output_file, src_file } = {}) {
  const rs = fs.createReadStream(src_file);
  rs.on('error', err => {
    throw err; 
  });
  const ws = fs.createWriteStream(output_file, { flags: 'a' });
  ws.on('error', err => {
    throw err;
  });
  rs.pipe(ws).on('finish', () => {
    write_test_to_output(test_file, output_file);
  });
}

/** Writes test_file file to output_file
* @param {string} test_file - The .js file that tests the corresponding src .js file
* @param {string} output_file - The tmp testing file to be loaded into the browser by Karma
*/
function write_test_to_output(test_file, output_file) {
  const rs = fs.createReadStream(test_file);
  rs.on('error', err => {
    throw err;
  });
  const ws = fs.createWriteStream(output_file, { flags: 'a' });
  ws.on('error', err => {
    throw err;
  });
  rs.pipe(ws).on('finish', () => {
    write_close_IIFE(output_file);
  });
}

/** Writes the closing bracket and parenthesis for the IIFE at the top of the script, then invokes the script
* @param {string} output_file - The tmp testing file to be loaded into the browser by Karma
*/
function write_close_IIFE(output_file) {
  const fixture_unloader_string = 
    "})();";
  const ws = fs.createWriteStream(output_file, { flags: 'a' });
  ws.on('error', err => {
    throw err;
  });
  ws.write(fixture_unloader_string);
  ws.end();
}

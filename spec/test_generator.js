const fs = require('fs');
const path = require('path');

const test_container = require('./client');

//Try using Promises? They are honestly complicated after I've watched Udacity videos.

/** Writes a string to the file that is first loaded by Karma into the browser.
Only writes the file if it doesn't exist 
*/
fs.writeFile(
  'tmp/fixture_setup.js',
  "const fixture = document.createElement('div');\n" +
  "fixture.className = 'fixture';\n" +
  "document.body.insertAdjacentElement('afterbegin', fixture);",
  err => { if(err) throw err; }
);

create_tmp_testing_files(test_container);

/** For each test in the test container, an output file is named and the process
for creating a temporary testing file is initiated.
*/
function create_tmp_testing_files(test_container) {
  for (let test_key in test_container) {
    const output_file = 'tmp/karma_' + test_key + '.js';
    write_loader_to_output(output_file, test_container[test_key]);
  }
};

/** Writes the start of an IIFE to the top of the output file. This is done
to ensure that each output file (i.e. temporarty testing file) executes 
in a private scope. Seems like a good place to use Promises.
*/
function write_loader_to_output(output_file, test) {
  const IIFE_opening = "(function() {\n";
  const ws = fs.createWriteStream(output_file);
  ws.on('error', err => { throw err; });
  ws.write(IIFE_opening);
  ws.end();
  ws.on('finish', () => {
    write_src_to_output(output_file, test)
  });
}

/** Writes the code in the src file as a string to the output file. 
*/
function write_src_to_output(output_file, test) {
  const rs = fs.createReadStream(test.test_target);
  rs.on('error', err => { throw err; });
  const ws = fs.createWriteStream(output_file, { flags: 'a' });
  ws.on('error', err => { throw err; });
  rs.pipe(ws).on('finish', () => {
    write_test_to_output(output_file, test);
  });
}

/** Writes the code in the test file as a string to the output file.
*/
function write_test_to_output(output_file, test) {
  const ws = fs.createWriteStream(output_file, { flags : 'a' });
  ws.on('error', err => { throw err; });
  const whole_function = test.test_code.toString(); 
  const function_body = whole_function.slice(whole_function.indexOf("{") + 1, whole_function.lastIndexOf("}"));
  ws.write(function_body);
  ws.end();
  ws.on('finish', () => {
    write_close_IIFE(output_file);
  });
}

/** Writes the closing bracket and parenthesis for the IIFE at the top of the script, then invokes the script
* @param {string} output_file - The tmp testing file to be loaded into the browser by Karma
*/
function write_close_IIFE(output_file) {
  const IIFE_close = "})();";
  const ws = fs.createWriteStream(output_file, { flags: 'a' });
  ws.on('error', err => { throw err; });
  ws.write(IIFE_close);
  ws.end();
}

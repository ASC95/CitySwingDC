'use strict';

const gulp = require('gulp');

gulp.task('compile_pug', function () {
  const pug = require('gulp-pug'); 
  return gulp.src('views/**/*.pug')
    .pipe(pug({
      pretty: true,
      locals: {
        error : { status : "I'm the status of the error message" }, 
        title : "Gulpfile title" 
      }
    }))
    .pipe(gulp.dest('spec/compiled_fixtures'));
});

gulp.task('generate_tests', function() {
  const { spawn } = require('child_process');
  return spawn('node karma_test_generator.js', { stdio : 'inherit', shell : true });
});

gulp.task('test_browser', ['compile_pug', 'generate_tests'], function () {
  const { spawn } = require('child_process');
  return spawn('npm run karma start', { stdio : 'inherit', shell : true });
});

gulp.task('set_env', () => {
  const keys = require('./config/keys');
  process.env.FACEBOOK_TOKEN = keys.facebook_token;
});

/*gulp.task('test_node', function() {
  const { spawn } = require('child_process');
  return spawn('npm run jasmine', { stdio: 'inherit', shell : true });
});*/

/*gulp.task('test', ['test_node', 'test_browser'], function() {
  return
});*/

/* Start the server with nodemon so it automatically restarts with changes.
Wrap the server in browser-sync so changes automatically prompt a browser refresh
*/
/*gulp.task('run_server', function () {
  const nodemon = require('gulp-nodemon');
  const browserSync = require('browser-sync');
  const { reload } = browserSync;
  let flag = false;
  return nodemon({
    script: 'bin/www',
    ext: 'js html pug css',
    env: { 'NODE_ENV': 'development' }
  })
  .on('start', function() {
    if (flag === false) {
      flag = true;
      setTimeout(function() {
        browserSync.init({
          proxy: 'localhost:3000',
          notify: false,
          injectChanges: false
        });
      }, 1000);
    } else {
      setTimeout(function() {
        reload(); 
      }, 1000);
    }
  });
});*/

const browserSync = require('browser-sync');

gulp.task('browser-sync', ['nodemon'], function() {
  return browserSync.init({
    proxy: "localhost:3000",  // local node app address
    port: 5000,  // use *different* port than above
    notify: false,
    injectChanges: false
  });
});

gulp.task('nodemon', function (cb) {
  const nodemon = require('gulp-nodemon');
  const { reload } = browserSync;
  let called = false;
  return nodemon({
    script: 'bin/www',
    ext: 'js pug css',
    env: { 'NODE_ENV': 'development' },
    ignore: [
      'gulpfile.js',
      'node_modules/'
    ]
  })
  .on('start', function () {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', function () {
    setTimeout(function () {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('sass', function() {
  const sass = require('gulp-sass'); 
  const sourcemaps = require('gulp-sourcemaps');
  const postcss = require('gulp-postcss');
  const autoprefixer = require('autoprefixer');
  return gulp
    .src('src/stylesheets/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public/stylesheets')); 
});

// Need babel to transpile before using uglify. Github pages automatically gzips so pre-compressing my assets isn't needed
gulp.task("package_all_js", function() {
  const pump = require('pump');
  const expect = require('gulp-expect-file');
  const sourcemaps = require("gulp-sourcemaps");
  const babel = require("gulp-babel");
  const concat = require("gulp-concat");
  const uglify = require('gulp-uglify');
  //const gzip = require('gulp-gzip');
  const files = [
    'src/javascripts/nav.js',
    'src/javascripts/slideshow.js',
    //'src/javascripts/fb.js',
    'src/javascripts/execute.js'
  ];
  pump(
    gulp.src(files),
    expect(files),
    sourcemaps.init(),
    concat("all.js"),
    babel(),
    uglify(),
    //gzip(),
    sourcemaps.write('.'),
    gulp.dest("public/javascripts"),
    function(err) {
      if(err) console.log(err);
    }
  )
});

//gulp.task("package_js", ['package_all_js'], function() {
//  const pump = require('pump');
//  //const expect = require('gulp-expect-file');
//  const sourcemaps = require("gulp-sourcemaps");
//  const babel = require("gulp-babel");
//  const concat = require("gulp-concat");
//  const uglify = require('gulp-uglify');
//  //const gzip = require('gulp-gzip');
//  //const files = ['src/javascripts/concat/nav.js', 'src/javascripts/concat/slideshow.js'];
//  pump(
//    gulp.src('src/javascripts/lib/*.js'),
//    sourcemaps.init(),
//    babel(),
//    uglify(),
//    //gzip(),
//    sourcemaps.write('.'),
//    gulp.dest("public/javascripts"),
//    function(err) {
//      if(err) console.log(err);
//    }
//  )
//});

gulp.task('default', ['set_env', 'browser-sync'], function () {
  console.log('Don"t forget to turn on cache killer or use Dev tools to disable caching');
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.js', ['package_all_js']);
  return 
});

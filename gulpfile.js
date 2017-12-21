'use strict';

const gulp = require('gulp');
const {spawn} = require('child_process');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
// Reloads the browser
const browserSync = require('browser-sync');
const { reload } = browserSync;
const {Server } = require('karma');
// Restarts the server
const nodemon = require('gulp-nodemon');

gulp.task('compile_pug', function () {
  return gulp.src('views/*.pug')
    .pipe(pug({
      pretty: true,
      locals: {
        error : { status : "I'm the status of the error message" }, 
        title : "Gulpfile title" 
      }
    }))
    .pipe(gulp.dest('spec/compiled_fixtures'));
});

gulp.task('test_browser', ['compile_pug'], function () {
  return spawn('karma run', { stdio : 'inherit', shell : true });
});

gulp.task('test_node', function() {
  return spawn('jasmine', { stdio: 'inherit', shell : true });
});

gulp.task('test', ['test_node', 'test_browser'], function() {
  return
});

/* Start the server with nodemon so it automatically restarts with changes.
Wrap the server in browser-sync so changes automatically prompt a browser refresh
*/
gulp.task('run_server', function () {
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
          notify: true,
          injectChanges: false
        });
      }, 300);
    } else {
      setTimeout(function() {
        reload(); 
      }, 800);
    }
  });
});

gulp.task('sass', function() {
  return gulp.src('sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public/stylesheets'))
});

gulp.task('default', ['run_server'], function () {
  console.log('Don"t forget to turn on cache killer or use Dev tools to disable caching');
  return gulp.watch('sass/**/*', ['sass']);
});

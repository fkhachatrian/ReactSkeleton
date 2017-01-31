var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var server = require('gulp-server-livereload');
var runSequence = require('run-sequence');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var uglifycss = require('gulp-uglifycss');
var htmlmin = require('gulp-htmlmin');

/**
* Transpile .jsx files, add them into one .js file past into the distribution
*/
gulp.task('browserify', function () {
  return browserify({entries: './src/js/index.js'})
    .transform('babelify', {presets: ['es2015', 'react'], sourceMaps: false})
    .bundle()
    .pipe(source('bundle.js'))
    //.pipe(uglify())
    .pipe(gulp.dest('./public/dist'));
});

/**
* Add config files into distribution folder
*/
gulp.task('configs', function () {
  return gulp.src('./src/js/config/**/*.js')
    .pipe(concat('Config.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist/config'));
});

/**
* Add image files into distribution folder
*/
gulp.task('images', function () {
  return gulp.src('./src/images/**.*')
    .pipe(gulp.dest('./public/dist/images'));
});

/**
* Add .html files into the distribution folder
*/
gulp.task('html', function () {
  return gulp.src('./src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./public'));
});

/**
* Traspile .less files into .css and add them into the distribution folder
*/
gulp.task('less', function () {
  var l = less({paths: ['./public/dist/css']});

  return gulp.src('./src/less/app.less')
    .pipe(l)
    .pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
    .pipe(gulp.dest('./public/dist/css'));
});


/* 
* Create a task that ensures the all necessary tasks are complete before
* reloading browsers
*/
gulp.task('watch', ['browserify', 'html', 'configs', 'less', 'images'], function (done) {
    browserSync.reload();
    done();
});

/**
* Build source files into distribution
*/
gulp.task('build', function () {
  runSequence('browserify', 'html', 'configs', 'less', 'images');
});

/**
* Start webserver
*/
gulp.task('webserver', ['browserify', 'html', 'configs', 'less', 'images'], function() {
  // Serve files from the root of this project
  browserSync.init({
      server: {
          baseDir: "./public"
      }
  });

  // add browserSync.reload to the tasks array to make
  // all browsers reload after tasks are complete.
  gulp.watch("./src/**/*.*", ['watch']);
});

gulp.task('default', ['webserver']);

/**
 * Gulp configuration file
 * For convenience all the Gulp tasks are aliased in Npm
 * Tasks : bundle, minify, lint, test, doc
 */

const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cssnano = require('gulp-cssnano')

// Linter
const stylelint = require('gulp-stylelint')
const formatter = require('stylelint-formatter-pretty')
const stylefmt = require('gulp-stylefmt');

// Utilities
const sequence = require('gulp-sequence')
const rename = require('gulp-rename')
const gutil = require('gulp-util')

// SASS Linting
gulp.task('lint-sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(stylelint({
      reporters: [
        {formatter: formatter, console: true}
      ]
    }));
});

// SASS APP Compilation
gulp.task('sass-app', function () {
  return gulp.src('src/sass/delivery-app/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 1 version']}))
    .pipe(rename("css/runmyprocess-delivery-app.css"))
    .pipe(gulp.dest('./dist'));
});

// SASS HOME Compilation
gulp.task('sass-home', function () {
  return gulp.src('src/sass/homepage/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 1 version']}))
    .pipe(rename("css/runmyprocess-delivery-home.css"))
    .pipe(gulp.dest('./dist'));
});

/*
gulp.task('sass:mobile', function () {
  return gulp.src('src/sass/mobile/mobile.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});
*/

// CSS Linting
gulp.task('lint-css', function () {
  return gulp.src('dist/css/*.css')
    .pipe(stylefmt())
    .pipe(stylelint({
      failAfterError: false,
      reporters: [
        {formatter: formatter, console: true}
      ]
    }));
});

// CSS Minification
gulp.task('minify', function () {
  return gulp.src('dist/css/*.css')
    .pipe(cssnano())
    .pipe(rename(function (path) {
      path.dirname = 'css/min'
      path.basename += '.min'
    }))
    .pipe(gulp.dest('./dist'));
});

// BUILD Process
gulp.task('default', sequence('lint-sass', ['sass-app', 'sass-home'], 'lint-css', 'minify'))

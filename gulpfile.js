/**
 * Gulp configuration file
 * For convenience all the Gulp tasks are aliased in Npm
 * Tasks : bundle, minify, lint, test, doc
 */

const gulp = require('gulp')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const stylelint = require('stylelint')
const stylelintConfigStandard = require('stylelint-config-standard')
const sass = require('gulp-sass');

// Utilities
const rename = require('gulp-rename')
const gutil = require('gulp-util')


gulp.task('sass:delivery', function () {
  // return gulp.src('src/sass/**/*.scss')
  return gulp.src('src/sass/delivery/delivery.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass:homepage', function () {
  return gulp.src('src/sass/homepage/home.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass:mobile', function () {
  // return gulp.src('src/sass/**/*.scss')
  return gulp.src('src/sass/delivery.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass:watch', function () {
  gulp.watch('src/sass/**/*.scss', ['sass']);
});

// CSS Building
gulp.task('build', function () {
  var plugins = [
    autoprefixer({browsers: ['last 1 version']}),
    cssnano()
  ]
  return gulp.src('src/css/*.css')
  .pipe(postcss(plugins))
  .pipe(rename(function (path) {
    path.basename += '.min'
  }))
  .pipe(gulp.dest('./dist'));
 })

// CSS Linting
gulp.task('lint', function () {
  var plugins = [
    stylelint()
  ]
  return gulp.src('src/css/*.css')
  .pipe(postcss(plugins))
})

gulp.task('default', ['build'], function () {
  // This will only run if the lint task is successful...
})

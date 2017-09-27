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
const version = require('gulp-ver')
const template = require('gulp-template')
const inject = require('gulp-inject')
const rename = require('gulp-rename')
const gutil = require('gulp-util')

// BUILD Process
gulp.task('default', sequence('lint-sass', 'sass', 'lint-css', 'minify', 'doc'))

// SASS Linting
gulp.task('lint-sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(stylelint({
      failAfterError: false,
      reporters: [
        {formatter: formatter, console: true}
      ]
    }));
});

// SASS Compilation
gulp.task('sass', function () {
  return gulp.src('src/sass/**/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 1 version']}))
    .pipe(rename(function (path) {
      path.basename = 'runmyprocess-delivery-' + path.dirname
      path.extname = ".css"
      path.dirname = ''
    }))
    .pipe(version())
    .pipe(gulp.dest('./dist/css'))
});

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
    .pipe(gulp.dest('./dist'))
});

// Documentation
gulp.task('doc', () =>
  gulp.src('src/doc.html')
    .pipe(inject(
      gulp.src('dist/css/min/*app*.min.css', {read: false}), {
        starttag: '<!-- inject:app-min:{{ext}} -->',
        removeTags: true,
        relative: true,
        transform: function (filepath) {return filepath}
      }
    ))
    .pipe(inject(
      gulp.src('dist/css/*app*.css', {read: false}), {
        starttag: '<!-- inject:app:{{ext}} -->',
        removeTags: true,
        relative: true,
        transform: function (filepath) {return filepath}
      }
    ))
    .pipe(inject(
      gulp.src('dist/css/min/*home*.min.css', {read: false}), {
        starttag: '<!-- inject:home-min:{{ext}} -->',
        removeTags: true,
        relative: true,
        transform: function (filepath) {return filepath}
      }
    ))
    .pipe(inject(
      gulp.src('dist/css/*home*.css', {read: false}), {
        starttag: '<!-- inject:home:{{ext}} -->',
        removeTags: true,
        relative: true,
        transform: function (filepath) {return filepath}
      }
    ))
    .pipe(inject(
      gulp.src('dist/css/**/*.css', {read: false}), {
        relative: true,
        transform: function (filepath) {
            return '<li><a href="' + filepath + '" download>' + filepath + '</a></li>';
        }
      }
    ))
    .pipe(template({
      version: '1.4.3'
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(''))
)

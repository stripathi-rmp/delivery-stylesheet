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
const stylefmt = require('gulp-stylefmt')

// Documentation
const template = require('gulp-template')
const inject = require('gulp-inject')

// Utilities
const sequence = require('gulp-sequence')
const rename = require('gulp-rename')
const gutil = require('gulp-util')
const del = require('del')

// Data
const packageJSON = require('./package.json')

// BUILD Process
gulp.task('default', sequence('lint-sass', 'sass', 'lint-css', 'minify', 'backup', 'doc'))

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
  del(['dist/css/*.css', 'dist/css/tmp/*.css', '!dist/css/archive/*.css'])
  return gulp.src('src/sass/**/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 1 version']}))
    .pipe(rename(function (path) {
      path.basename = 'runmyprocess-delivery-' + path.dirname + '-' + packageJSON.version
      path.extname = ".css"
      path.dirname = ''
    }))
    .pipe(gulp.dest('./dist/css/tmp'))
});

// CSS Linting
gulp.task('lint-css', function () {
  return gulp.src('dist/css/tmp/*.css')
    .pipe(stylefmt())
    .pipe(stylelint({
      failAfterError: false,
      reporters: [
        {formatter: formatter, console: true}
      ]
    }))
    .pipe(gulp.dest('./dist/css'))
})

// CSS Minification
gulp.task('minify', function () {
  return gulp.src('dist/css/*.css')
    .pipe(cssnano())
    .pipe(rename(function (path) {
      path.basename += '.min'
    }))
    .pipe(gulp.dest('./dist/css'))
});

// BACKUP
gulp.task('backup', () =>
  gulp.src('dist/css/*.css')
  .pipe(gulp.dest('./dist/css/archive'))
  .pipe(gulp.dest('./backup'))
)

// Documentation
gulp.task('doc', () =>
  gulp.src('src/doc.html')
    .pipe(inject(
      gulp.src('dist/css/*app-' + packageJSON.version + '.min.css', {read: false}), {
        starttag: '<!-- inject:app-min:{{ext}} -->',
        removeTags: true,
        relative: true,
        transform: function (filepath) {return filepath}
      }
    ))
    .pipe(inject(
      gulp.src('dist/css/*app-' + packageJSON.version + '.css', {read: false}), {
        starttag: '<!-- inject:app:{{ext}} -->',
        removeTags: true,
        relative: true,
        transform: function (filepath) {return filepath}
      }
    ))
    .pipe(inject(
      gulp.src('dist/css/*home-' + packageJSON.version + '.min.css', {read: false}), {
        starttag: '<!-- inject:home-min:{{ext}} -->',
        removeTags: true,
        relative: true,
        transform: function (filepath) {return filepath}
      }
    ))
    .pipe(inject(
      gulp.src('dist/css/*home-' + packageJSON.version + '.css', {read: false}), {
        starttag: '<!-- inject:home:{{ext}} -->',
        removeTags: true,
        relative: true,
        transform: function (filepath) {return filepath}
      }
    ))
    .pipe(inject(
      gulp.src('dist/css/archive/*.css', {read: false}), {
        relative: true,
        transform: function (filepath) {
            return '<li><a href="' + filepath + '" download>' + filepath + '</a></li>';
        }
      }
    ))
    .pipe(template({
      description: packageJSON.description,
      version: packageJSON.version,
      contributors: packageJSON.contributors,
      homepage: packageJSON.homepage,
      bugs: packageJSON.bugs
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(''))
)

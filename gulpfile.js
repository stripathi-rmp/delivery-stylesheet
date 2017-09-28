/**
 * Gulp configuration file
 * For convenience all the Gulp tasks are aliased in Npm
 * Tasks : lint-sass, sass, lint-css, minify, backup, doc
 */

// Main
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
const fs = require('fs')

// Utilities
const sequence = require('gulp-sequence')
const rename = require('gulp-rename')
const gutil = require('gulp-util')
const del = require('del')

// Data
const packageJSON = require('./package.json')
const prefix = 'runmyprocess-delivery'

// BUILD
gulp.task('default', sequence('lint-sass', 'sass', 'lint-css', 'minify', 'backup', 'doc'))

// SASS LINTING
gulp.task('lint-sass', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(stylelint({
      failAfterError: false,
      reporters: [
        {formatter: formatter, console: true}
      ]
    }));
});

// SASS COMPILATION
gulp.task('sass', function () {
  del(['dist/css/*.css', 'dist/css/tmp/*.css', '!dist/css/archive/*.css'])
  return gulp.src('src/sass/**/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 1 version']}))
    .pipe(rename(function (path) {
      path.basename = prefix + '-' + path.dirname + '-' + packageJSON.version
      path.extname = ".css"
      path.dirname = ''
    }))
    .pipe(gulp.dest('./dist/css/tmp'))
});

// CSS LINTING
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

// CSS MINIFICATION
gulp.task('minify', function () {
  return gulp.src('dist/css/*.css')
    .pipe(cssnano())
    .pipe(rename(function (path) {
      path.basename += '.min'
    }))
    .pipe(gulp.dest('./dist/css'))
});

// CSS BACKUP
gulp.task('backup', () =>
  gulp.src('dist/css/*.css')
  .pipe(gulp.dest('./dist/css/archive'))
  .pipe(gulp.dest('./backup'))
)

// CSS DOCUMENTATION
gulp.task('doc', () =>
  gulp.src('src/doc.html')
    .pipe(template({
      description: packageJSON.description,
      version: packageJSON.version,
      contributors: packageJSON.contributors,
      homepage: packageJSON.homepage,
      bugs: packageJSON.bugs,
      archives: fs.readdirSync('dist/css/archive/'),
      prefix: prefix
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(''))
)

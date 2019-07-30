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

gulp.task('sass-home', function () {
  del(['dist/css/tmp/*-home-*.css'])
  console.log("Home css removed")
  return gulp.src('src/sass/home/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 1 version']}))
    .pipe(rename(function (path) {
      path.basename = prefix + '-home-' + packageJSON.versionHomepage
      path.extname = ".css"
      path.dirname = ''
      console.log("Generation -> ", path.basename)
    }))
    .pipe(gulp.dest('dist/css/tmp'))

});

gulp.task('sass-app', function () {
  del(['dist/css/tmp/*-app-*.css'])
  console.log("App css removed")
  return gulp.src('src/sass/app/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 1 version']}))
    .pipe(rename(function (path) {
      path.basename = prefix + '-app-' + packageJSON.versionApp
      path.extname = ".css"
      path.dirname = ''
      console.log("Generation -> ", path.basename)
    }))
    .pipe(gulp.dest('dist/css/tmp'))
});

gulp.task('sass-mobile', function () {
  console.log("Mobile css removed")
  del(['dist/css/tmp/*-mobile-*.css'])
  return gulp.src('src/sass/mobile/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({browsers: ['last 1 version']}))
    .pipe(rename(function (path) {
      path.basename = prefix + '-mobile-' + packageJSON.versionMobile
      path.extname = ".css"
      path.dirname = ''
      console.log("Generation -> ", path.basename)
    }))
    .pipe(gulp.dest('dist/css/tmp'))
});

gulp.task('sass', gulp.series('sass-home','sass-app','sass-mobile'));

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
  return gulp.src('dist/css/tmp/*.css')
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
      versionApp: packageJSON.versionApp,
      versionHomepage: packageJSON.versionHomepage,
      versionMobile: packageJSON.versionMobile,
      contributors: packageJSON.contributors,
      homepage: packageJSON.homepage,
      bugs: packageJSON.bugs,
      archives: fs.readdirSync('dist/css/archive/'),
      prefix: prefix
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(''))
)

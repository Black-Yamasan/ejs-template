var gulp = require('gulp');
var sass = require('gulp-sass');
var ejs = require('gulp-ejs');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var cache = require('gulp-cached');
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var destDir = './dist/';

gulp.task('browser-sync', function(){
	browserSync.init({
		server: {
			baseDir: destDir
		}
	});
});

gulp.task('sass', function() {
  return gulp.src(['src/styles/**/*.scss', '!src/styles/mixin/*.scss'])
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass( {
      outputStyle: 'expanded'
    }))
		.pipe(rename(function (path) {
			path.dirname = 'css'
		}))
    .pipe(gulp.dest(destDir))
});

gulp.task('js', function() {
  return gulp.src(['src/js/**/*.js'])
    .pipe(changed('./dist/js/'))
    .pipe(gulp.dest('./dist/js/'))
});

gulp.task('ejs', function() {
	return gulp.src(['src/templates/pages/**/*.ejs', '!src/templates/**/_*.ejs'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(changed('./dist/'))
		.pipe(ejs({}, {ext: '.html'}))
		.pipe(gulp.dest(destDir))
})

gulp.task('bs-reload', function(){
	browserSync.reload();
});

gulp.task('default', ['browser-sync', 'sass', 'js', 'ejs'], function() {
  watch(['src/styles/**/*.scss'], function() {
    gulp.start(['sass','bs-reload']);
  });
  watch(['src/js/**/*.js'], function() {
    gulp.start(['js', 'bs-reload']);
  });
  watch(['src/**/*.ejs'], function() {
    gulp.start(['ejs', 'bs-reload']);
  });
});

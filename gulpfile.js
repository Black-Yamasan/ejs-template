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
  return gulp.src(['src/pc/styles/**/*.scss', '!src/pc/styles/mixin/*.scss'])
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

gulp.task('sass-sp', function() {
  return gulp.src(['src/sp/styles/**/*.scss', '!src/sp/styles/mixin/*.scss'])
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass( {
      outputStyle: 'expanded'
    }))
		.pipe(rename(function (path) {
			path.dirname = 'css'
		}))
    .pipe(gulp.dest(destDir + 'sp/'))
});


gulp.task('js', function() {
  return gulp.src(['src/pc/js/**/*.js'])
    .pipe(changed('./dist/js/'))
    .pipe(gulp.dest('./dist/js/'))
});

gulp.task('js-sp', function() {
  return gulp.src(['src/sp/js/**/*.js'])
    .pipe(changed('./dist/sp/js/'))
    .pipe(gulp.dest('./dist/sp/js/'))
});


gulp.task('ejs', function() {
	return gulp.src(['src/pc/templates/pages/**/*.ejs', '!src/pc/templates/**/_*.ejs'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(changed('./dist/'))
		.pipe(ejs({}, {ext: '.html'}))
		.pipe(gulp.dest(destDir))
})

gulp.task('ejs-sp', function() {
	return gulp.src(['src/sp/templates/pages/**/*.ejs', '!src/sp/templates/**/_*.ejs'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(changed('./dist/sp/'))
		.pipe(ejs({}, {ext: '.html'}))
		.pipe(gulp.dest(destDir + 'sp/'))
})


gulp.task('bs-reload', function(){
	browserSync.reload();
});

gulp.task('default', ['browser-sync', 'sass', 'js', 'ejs'], function() {
  watch(['src/pc/styles/**/*.scss'], function() {
    gulp.start(['sass','bs-reload']);
  });
  watch(['src/pc/js/**/*.js'], function() {
    gulp.start(['js', 'bs-reload']);
  });
  watch(['src/pc/**/*.ejs'], function() {
    gulp.start(['ejs', 'bs-reload']);
  });
});

gulp.task('sp', ['browser-sync', 'sass-sp', 'js-sp', 'ejs-sp'], function() {
  watch(['src/sp/styles/**/*.scss'], function() {
    gulp.start(['sass-sp','bs-reload']);
  });
  watch(['src/sp/js/**/*.js'], function() {
    gulp.start(['js-sp', 'bs-reload']);
  });
  watch(['src/sp/**/*.ejs'], function() {
    gulp.start(['ejs-sp', 'bs-reload']);
  });
});

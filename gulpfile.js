var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
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

gulp.task('coffee', function() {
	return gulp.src(['src/pc/js/**/*.coffee'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(coffee())
		.pipe(gulp.dest('./dist/js'))
});

gulp.task('coffee-sp', function() {
	return gulp.src(['src/sp/js/**/*.coffee'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(coffee())
		.pipe(gulp.dest('./dist/sp/js'))
})


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

gulp.task('images', function() {
	return gulp.src(['src/pc/images/**/'])
	.pipe(changed('./dist/images/'))
	.pipe(gulp.dest('./dist/images/'))
});

gulp.task('images-sp', function() {
	return gulp.src(['src/sp/images/**/'])
	.pipe(changed('./dist/sp/images/'))
	.pipe(gulp.dest('./dist/sp/images/'))
});


gulp.task('bs-reload', function(){
	browserSync.reload();
});

gulp.task('default', ['browser-sync', 'sass', 'js', 'coffee', 'ejs', 'images'], function() {
  watch(['src/pc/styles/**/*.scss'], function() {
    gulp.start(['sass','bs-reload']);
  });
  watch(['src/pc/js/**/*.js'], function() {
    gulp.start(['js', 'bs-reload']);
  });
	watch(['src/pc/js/**/*.coffee'], function() {
    gulp.start(['coffee', 'bs-reload']);
  });
  watch(['src/pc/**/*.ejs'], function() {
    gulp.start(['ejs', 'bs-reload']);
  });
	watch(['src/pc/images/**/*'], function() {
    gulp.start(['images', 'bs-reload']);
  });
});

gulp.task('sp', ['browser-sync', 'sass-sp', 'js-sp', 'coffee-sp', 'ejs-sp', 'images-sp'], function() {
  watch(['src/sp/styles/**/*.scss'], function() {
    gulp.start(['sass-sp','bs-reload']);
  });
  watch(['src/sp/js/**/*.js'], function() {
    gulp.start(['js-sp', 'bs-reload']);
  });
	watch(['src/sp/js/**/*.coffee'], function() {
    gulp.start(['coffee-sp', 'bs-reload']);
  });
  watch(['src/sp/**/*.ejs'], function() {
    gulp.start(['ejs-sp', 'bs-reload']);
  });
	watch(['src/sp/images/**/*'], function() {
    gulp.start(['images-sp', 'bs-reload']);
  });
});

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const ejs = require('gulp-ejs');
const cleanCss = require('gulp-clean-css');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const changed = require('gulp-changed');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const minimist = require('minimist');
const del = require('del');
const browserSync = require('browser-sync').create();
const runSequence = require('gulp4-run-sequence');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const destDir = './dist/';
const prodDir = './htdocs/';
const config = {
	string: 'env',
	default: { env: process.env.NODE_ENV || 'dev'}
}
const options = minimist(process.argv.slice(2), config);
let isProd = (options.env === 'prod') ? true : false;
console.log('[build env]', options.env, '[isProd]', isProd);

const webpackConfig = require('./webpack.config');

gulp.task('browser-sync', function(){
	browserSync.init({
		server: {
			baseDir: destDir
		}
	});
});

gulp.task('sass', function() {
  return gulp.src(['src/pc/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass( {
      outputStyle: 'expanded'
    }))
		.pipe(rename(function (path) {
			path.dirname = 'css'
		}))
		.pipe(autoprefixer({
      browsers: ['last 2 version', 'iOS >= 9', 'Android >= 4.6'],
      cascade: false
    }))
		.pipe(gulpif(isProd, cleanCss()))
    .pipe(gulpif(!isProd, gulp.dest(destDir)))
		.pipe(gulpif(isProd, gulp.dest(prodDir)))
});

gulp.task('sass-sp', function() {
  return gulp.src(['src/sp/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass( {
      outputStyle: 'expanded'
    }))
		.pipe(rename(function (path) {
			path.dirname = 'css'
		}))
		.pipe(autoprefixer({
      browsers: ['last 2 version', 'iOS >= 9', 'Android >= 4.6'],
      cascade: false
    }))
		.pipe(gulpif(isProd, cleanCss()))
    .pipe(gulpif(!isProd, gulp.dest(destDir + 'sp/')))
		.pipe(gulpif(isProd, gulp.dest(prodDir + 'sp/')))
});


gulp.task('webpack', function() {
	return webpackStream(webpackConfig, webpack)
	.on('error', function handleError() {
		this.emit('end');
	})
	.pipe(gulpif(!isProd, gulp.dest(destDir)))
	.pipe(gulpif(isProd, gulp.dest(prodDir)))
});

gulp.task('ejs', function() {
	return gulp.src(['src/pc/templates/pages/**/*.ejs', '!src/pc/templates/**/_*.ejs'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(ejs({}, {}, {ext: '.html'}))
		.pipe(gulpif(!isProd, gulp.dest(destDir)))
		.pipe(gulpif(isProd, gulp.dest(prodDir)))
})

gulp.task('ejs-sp', function() {
	return gulp.src(['src/sp/templates/pages/**/*.ejs', '!src/sp/templates/**/_*.ejs'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(ejs({}, {}, {ext: '.html'}))
		.pipe(gulpif(!isProd, gulp.dest(destDir + 'sp/')))
		.pipe(gulpif(isProd, gulp.dest(prodDir + 'sp/')))
})

gulp.task('images', function() {
	return gulp.src(['src/pc/images/**/'])
	.pipe(gulpif(!isProd, gulp.dest(destDir + 'images/')))
	.pipe(gulpif(isProd, gulp.dest(prodDir + 'images/')))
});

gulp.task('images-sp', function() {
	return gulp.src(['src/sp/images/**/'])
	.pipe(gulpif(!isProd, gulp.dest(destDir + 'sp/images/')))
	.pipe(gulpif(isProd, gulp.dest(prodDir + 'sp/images/')))
});


gulp.task('bs-reload', function(){
	browserSync.reload();
});

gulp.task('clean', del.bind(null, prodDir));

gulp.task('build', gulp.series(
  gulp.parallel('sass', 'webpack', 'ejs', 'images', 'sass-sp', 'ejs-sp', 'images-sp')
));


gulp.task('default', gulp.series(
  gulp.parallel('browser-sync', 'sass', 'webpack', 'ejs', 'images', function() {
    watch(['src/pc/styles/**/*.scss'], function() {
  		return runSequence(
  			'sass',
  			'bs-reload'
  		);
  	});
  	watch(['src/common/js/**/*.js', 'src/pc/js/**/*.js'], function() {
  		return runSequence(
  			'webpack',
  			'bs-reload'
  		)
  	});
  	watch(['src/pc/**/*.ejs'], function() {
  		return runSequence(
  			'ejs',
  			'bs-reload'
  		);
  	});
  	watch(['src/pc/images/**/*'], function() {
  		return runSequence(
  			'images',
  			'bs-reload'
  		);
  	});
  })
));


gulp.task('sp', gulp.series(
  gulp.parallel('browser-sync', 'sass-sp', 'webpack', 'ejs-sp', 'images-sp', function() {
    watch(['src/sp/styles/**/*.scss'], function() {
  		return runSequence(
  			'sass-sp',
  			'bs-reload'
  		);
  	});
  	watch(['src/common/js/**/*.js', 'src/sp/js/**/*.js'], function() {
  		return runSequence(
  			'webpack',
  			'bs-reload'
  		)
  	});
  	watch(['src/sp/**/*.ejs'], function() {
  		return runSequence(
  			'ejs-sp',
  			'bs-reload'
  		);
  	});
  	watch(['src/sp/images/**/*'], function() {
  		return runSequence(
  			'images-sp',
  			'bs-reload'
  		);
  	});
  })
));

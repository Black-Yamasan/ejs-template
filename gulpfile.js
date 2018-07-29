var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var coffee = require('gulp-coffee');
var ejs = require('gulp-ejs');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var cache = require('gulp-cached');
var changed = require('gulp-changed');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var minimist = require('minimist');
var del = require('del');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var destDir = './dist/';
var prodDir = './htdocs/';
var options = minimist(process.argv.slice(2), config);
var config = {
	string: 'env',
	default: { env: process.env.NODE_ENV || 'dev'}
}
var isProd = (options.env === 'prod') ? true : false;
console.log('[build env]', options.env, '[isProd]', isProd);

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


gulp.task('js', function() {
  return gulp.src(['src/pc/js/**/*.js'])
		.pipe(gulpif(!isProd, changed(destDir + 'js/')))
		.pipe(gulpif(isProd, changed(prodDir + 'js/')))
		.pipe(gulpif(isProd, uglify({
        output:{
          comments: /^\/* /
        }
      })))
		.pipe(gulpif(!isProd, gulp.dest(destDir + 'js/')))
		.pipe(gulpif(isProd, gulp.dest(prodDir + 'js/')))
});

gulp.task('js-sp', function() {
  return gulp.src(['src/sp/js/**/*.js'])
		.pipe(gulpif(!isProd, changed(destDir + 'sp/js/')))
		.pipe(gulpif(isProd, changed(prodDir + 'sp/js/')))
		.pipe(gulpif(isProd, uglify({
        output:{
          comments: /^\/* /
        }
      })))
		.pipe(gulpif(!isProd, gulp.dest(destDir + 'sp/js/')))
		.pipe(gulpif(isProd, gulp.dest(prodDir + 'sp/js/')))
});


gulp.task('js-concat', function() {
	return gulp.src(['src/common/js/plugins/*.js'])
		.pipe(concat('plugins.js'))
		.pipe(gulpif(!isProd, changed(destDir + 'js/libs/')))
		.pipe(gulpif(isProd, changed(prodDir + 'js/libs/')))
		.pipe(gulpif(isProd, uglify({
        output:{
          comments: /^\/* /
        }
      })))
		.pipe(gulpif(!isProd, gulp.dest(destDir + 'js/libs/')))
		.pipe(gulpif(isProd, gulp.dest(prodDir + 'js/libs/')))
});


gulp.task('coffee', function() {
	return gulp.src(['src/pc/js/**/*.coffee'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(coffee())
		.pipe(gulpif(!isProd, changed(destDir + 'js/')))
		.pipe(gulpif(isProd, changed(prodDir + 'js/')))
		.pipe(gulpif(isProd, uglify()))
		.pipe(gulpif(!isProd, gulp.dest(destDir + 'js/')))
		.pipe(gulpif(isProd, gulp.dest(prodDir + 'js/')))
});

gulp.task('coffee-sp', function() {
	return gulp.src(['src/sp/js/**/*.coffee'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(coffee())
		.pipe(gulpif(!isProd, changed(destDir + 'sp/js/')))
		.pipe(gulpif(isProd, changed(prodDir + 'sp/js/')))
		.pipe(gulpif(isProd, uglify()))
		.pipe(gulpif(!isProd, gulp.dest(destDir + 'sp/js/')))
		.pipe(gulpif(isProd, gulp.dest(prodDir + 'sp/js/')))
})


gulp.task('ejs', function() {
	return gulp.src(['src/pc/templates/pages/**/*.ejs', '!src/pc/templates/**/_*.ejs'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(ejs({}, {}, {ext: '.html'}))
		.pipe(changed('./dist/'))
		.pipe(gulpif(!isProd, gulp.dest(destDir)))
		.pipe(gulpif(isProd, gulp.dest(prodDir)))
})

gulp.task('ejs-sp', function() {
	return gulp.src(['src/sp/templates/pages/**/*.ejs', '!src/sp/templates/**/_*.ejs'])
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(ejs({}, {}, {ext: '.html'}))
		.pipe(changed('./dist/sp/'))
		.pipe(gulpif(!isProd, gulp.dest(destDir + 'sp/')))
		.pipe(gulpif(isProd, gulp.dest(prodDir + 'sp/')))
})

gulp.task('images', function() {
	return gulp.src(['src/pc/images/**/'])
	.pipe(changed(destDir + 'images/'))
	.pipe(gulpif(!isProd, gulp.dest(destDir + 'images/')))
	.pipe(gulpif(isProd, gulp.dest(prodDir + 'images/')))
});

gulp.task('images-sp', function() {
	return gulp.src(['src/sp/images/**/'])
	.pipe(changed(destDir + 'sp/images/'))
	.pipe(gulpif(!isProd, gulp.dest(destDir + 'sp/images/')))
	.pipe(gulpif(isProd, gulp.dest(prodDir + 'sp/images/')))
});


gulp.task('bs-reload', function(){
	browserSync.reload();
});

gulp.task('clean', del.bind(null, prodDir));

gulp.task('build', ['sass', 'js', 'js-concat', 'coffee', 'ejs', 'images', 'sass-sp', 'js-sp', 'coffee-sp', 'ejs-sp', 'images-sp'], function() {
});


gulp.task('default', ['browser-sync', 'sass', 'js', 'js-concat',  'coffee', 'ejs', 'images'], function() {
	watch(['src/pc/styles/**/*.scss'], function() {
		return runSequence(
			'sass',
			'bs-reload'
		);
	});
	watch(['src/pc/js/**/*.js'], function() {
		return runSequence(
			'js',
			'bs-reload'
		)
	});
	watch(['src/common/js/plugins/*.js'], function() {
		return runSequence(
			'js-concat',
			'bs-reload'
		)
	});
	watch(['src/pc/**/*.ejs'], function() {
		return runSequence(
			'ejs',
			'bs-reload'
		);
	});
	watch(['src/pc/js/*.coffee'], function() {
		return runSequence(
			'coffee',
			'bs-reload'
		);
	});
	watch(['src/pc/images/**/*'], function() {
		return runSequence(
			'images',
			'bs-reload'
		);
	});
});


gulp.task('sp', ['browser-sync', 'sass-sp', 'js-sp', 'js-concat', 'coffee-sp', 'ejs-sp', 'images-sp'], function() {
	watch(['src/sp/styles/**/*.scss'], function() {
		return runSequence(
			'sass-sp',
			'bs-reload'
		);
	});
	watch(['src/sp/js/**/*.js'], function() {
		return runSequence(
			'js-sp',
			'bs-reload'
		)
	});
	watch(['src/common/js/plugins/*.js'], function() {
		return runSequence(
			'js-concat',
			'bs-reload'
		)
	});
	watch(['src/sp/**/*.ejs'], function() {
		return runSequence(
			'ejs-sp',
			'bs-reload'
		);
	});
	watch(['src/sp/js/*.coffee'], function() {
		return runSequence(
			'coffee-sp',
			'bs-reload'
		);
	});
	watch(['src/sp/images/**/*'], function() {
		return runSequence(
			'images-sp',
			'bs-reload'
		);
	});
});

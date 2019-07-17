const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const ejs = require('gulp-ejs');
const cleanCss = require('gulp-clean-css');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const minimist = require('minimist');
const del = require('del');
const browserSync = require('browser-sync').create();
const runSequence = require('gulp4-run-sequence');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const svgstore = require('gulp-svgstore');
const cheerio = require('gulp-cheerio');
const svgmin = require('gulp-svgmin');
const path = require('path');
const destDir = './dist/';
const prodDir = './htdocs/';
const config = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'dev'
  }
}
const options = minimist(process.argv.slice(2), config);
let isProd = (options.env === 'prod') ? true : false;
console.log('[build env]', options.env, '[isProd]', isProd);

const webpackConfig = require('./webpack.config');

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: destDir
    }
  });
});

gulp.task('sass', () => {
  return gulp.src(['src/pc/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass({
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

gulp.task('sass-sp', () => {
  return gulp.src(['src/sp/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(sass({
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

gulp.task('webpack', () => {
  return webpackStream(webpackConfig, webpack)
    .on('error', function handleError() {
      this.emit('end');
    })
    .pipe(gulpif(!isProd, gulp.dest(destDir)))
    .pipe(gulpif(isProd, gulp.dest(prodDir)))
});

gulp.task('ejs', () => {
  return gulp.src(['src/pc/templates/pages/**/*.ejs', '!src/pc/templates/**/_*.ejs'])
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(ejs())
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulpif(!isProd, gulp.dest(destDir)))
    .pipe(gulpif(isProd, gulp.dest(prodDir)))
})

gulp.task('ejs-sp', () => {
  return gulp.src(['src/sp/templates/pages/**/*.ejs', '!src/sp/templates/**/_*.ejs'])
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>')
    }))
    .pipe(ejs({}, {}, {
      ext: '.html'
    }))
    .pipe(gulpif(!isProd, gulp.dest(destDir + 'sp/')))
    .pipe(gulpif(isProd, gulp.dest(prodDir + 'sp/')))
})

gulp.task('images', () => {
  return gulp.src(['src/pc/images/**/'])
    .pipe(gulpif(!isProd, gulp.dest(destDir + 'images/')))
    .pipe(gulpif(isProd, gulp.dest(prodDir + 'images/')))
});

gulp.task('images-sp', () => {
  return gulp.src(['src/sp/images/**/'])
    .pipe(gulpif(!isProd, gulp.dest(destDir + 'sp/images/')))
    .pipe(gulpif(isProd, gulp.dest(prodDir + 'sp/images/')))
});

gulp.task('svgstore', () => {
  return gulp.src(['src/common/svg/**/*.svg'])
  .pipe(svgmin((file) => {
    let prefix = path.basename(file.relative, path.extname(file.relative))
    return {
      plugins: [{
        cleanupIDs: {
          prefix: prefix + '-',
          minify: true
        }
      }]
    }
  }))
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(cheerio({
    run: function($) {
      $('[fill]').removeAttr('fill');
      $('[stroke]').removeAttr('stroke')
      $('svg').attr({
        'display': 'none',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink'
      });
    },
    parserOptions: { xmlMode: true }
  }))
  .pipe(rename(path => {
    path.basename = 'icons'
  }))
  .pipe(gulpif(!isProd, gulp.dest(destDir + 'svg/')))
  .pipe(gulpif(isProd, gulp.dest(prodDir + 'svg/')))
});

gulp.task('bs-reload', () => {
  browserSync.reload();
});

gulp.task('clean', del.bind(null, prodDir));

gulp.task('build', gulp.series(
  gulp.parallel('sass', 'webpack', 'ejs', 'images', 'sass-sp', 'ejs-sp', 'images-sp', 'svgstore')
));

gulp.task('default', gulp.series(
  gulp.parallel('browser-sync', 'sass', 'webpack', 'ejs', 'images', 'svgstore', () => {
    watch(['src/pc/styles/**/*.scss'], () => {
      return runSequence(
        'sass',
        'bs-reload'
      );
    });
    watch(['src/common/js/**/*.js', 'src/pc/js/**/*.js'], () => {
      return runSequence(
        'webpack',
        'bs-reload'
      )
    });
    watch(['src/pc/**/*.ejs'], () => {
      return runSequence(
        'ejs',
        'bs-reload'
      );
    });
    watch(['src/pc/images/**/*'], () => {
      return runSequence(
        'images',
        'bs-reload'
      );
    });
    watch(['src/common/svg/**/*.svg'], () => {
      return runSequence(
        'svgstore',
        'bs-reload'
      );
    });
  })
));

gulp.task('sp', gulp.series(
  gulp.parallel('browser-sync', 'sass-sp', 'webpack', 'ejs-sp', 'images-sp', () => {
    watch(['src/sp/styles/**/*.scss'], () => {
      return runSequence(
        'sass-sp',
        'bs-reload'
      );
    });
    watch(['src/common/js/**/*.js', 'src/sp/js/**/*.js'], () => {
      return runSequence(
        'webpack',
        'bs-reload'
      )
    });
    watch(['src/sp/**/*.ejs'], () => {
      return runSequence(
        'ejs-sp',
        'bs-reload'
      );
    });
    watch(['src/sp/images/**/*'], () => {
      return runSequence(
        'images-sp',
        'bs-reload'
      );
    });
  })
));

const gulp = require('gulp')
const ejs = require('gulp-ejs')
const watch = require('gulp-watch')
const plumber = require('gulp-plumber')
const notify = require('gulp-notify')
const rename = require('gulp-rename')
const gulpif = require('gulp-if')
const minimist = require('minimist')
const del = require('del')
const browserSync = require('browser-sync').create()
const runSequence = require('gulp4-run-sequence')
const webpackStream = require('webpack-stream')
const webpack = require('webpack')
const destDir = './dist/'
const prodDir = './htdocs/'
const config = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'dev'
  }
}
const options = minimist(process.argv.slice(2), config)
const isProd = options.env === 'prod'
console.log('[build env]', options.env, '[isProd]', isProd)

const webpackConfig = require('./webpack.config')

gulp.task('browser-sync', () => {
  browserSync.init({
    server: {
      baseDir: destDir
    }
  })
})

gulp.task('webpack', () => {
  return webpackStream(webpackConfig, webpack)
    .on('error', function handleError() {
      this.emit('end')
    })
    .pipe(gulpif(!isProd, gulp.dest(destDir)))
    .pipe(gulpif(isProd, gulp.dest(prodDir)))
})

gulp.task('ejs', () => {
  return gulp.src(['src/templates/pages/**/*.ejs', '!src/templates/**/_*.ejs'])
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

gulp.task('bs-reload', () => {
  browserSync.reload()
})

gulp.task('clean', del.bind(null, prodDir))

gulp.task('build', gulp.series(
  gulp.parallel('webpack', 'ejs')
))

gulp.task('default', gulp.series(
  gulp.parallel('browser-sync', 'webpack', 'ejs', () => {
    watch(['src/scripts/**/*.js'], () => {
      return runSequence(
        'webpack',
        'bs-reload'
      )
    })
    watch(['src/styles/**/*.scss'], () => {
      return runSequence(
        'webpack',
        'bs-reload'
      )
    })
    watch(['src/templates/**/*.ejs'], () => {
      return runSequence(
        'ejs',
        'bs-reload'
      )
    })
    watch(['src/images/**/*'], () => {
      return runSequence(
        'webpack',
        'bs-reload'
      )
    })
  })
))

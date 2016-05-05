'use strict'

import gulp from 'gulp'
import rename from 'gulp-rename'
const browserSync = require('browser-sync').create()

// ES6
import eslint from 'gulp-eslint'

// SASS
import sass from 'gulp-sass'
import cssnano from 'gulp-cssnano'

// Unit test
import karma from 'gulp-karma'

import plumber from 'gulp-plumber'
import del from 'del'
import shell from 'shelljs'

const destDir = './public'
const assetsDir = `${destDir}/assets`
const srcEs6Dir = './src'
const srcEs6Files = `${srcEs6Dir}/**/*.js`
const destJsDevDir = `${destDir}/jsdev`
const srcSassFiles = './src/**/*.scss'
const srcTestFiles = './test/**/*.spec.js'

const lint = (glob) => {
  return gulp.src(glob)
    .pipe(plumber())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError())
}

const buildWhenModified = (glob, buildFunc) => {
  return gulp.watch(glob, (obj) => {
    if (obj.type === 'changed')
      buildFunc(obj.path)
  })
}

gulp.task('default', ['watch'])

const kWatchDeps = ['build',
                    'watch-sass',
                    'watch-lint', 'watch-test']
gulp.task('watch', kWatchDeps)

gulp.task('build', ['sass'])

gulp.task('lint', () => {
  return lint(['gulpfile.babel.js',
               srcEs6Files,
               srcTestFiles,
               'tools/**/*.js',
               '!src/assets/**/*.js',
               '!src/config*.js'])
})

gulp.task('watch-lint', [], () => {
  return buildWhenModified([srcEs6Files,
                            srcTestFiles,
                            'gulpfile.babel.js'],
                           lint)
})

gulp.task('sass', () => {
  return gulp.src(srcSassFiles)
    .pipe(plumber())
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest(`${SRC_DIR}/assets`))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('watch-sass', [], () => {
  gulp.watch(srcSassFiles, ['sass'])
})

const devServer = (_port) => {
  shell.exec('bundle exec ruby server/dev_server.rb',
             {async: true},
             () => {
               console.log('SERVER DONE')
             })
}

gulp.task('dev-server', () => {
  const port = 4567
  devServer(port)
})

// Unit test.
const testFiles = [
  'assets/lib/lodash.min.js',
  'assets/lib/bind-polyfill.js',
  'assets/lib/angular.min.js',
  'assets/lib/angular-route.min.js',
  srcTestFiles,
]
gulp.task('test', () => {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
    }))
    .on('error', err => console.log('Error : ' + err.message))
})
gulp.task('watch-test', () => {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'watch',
    }))
})

gulp.task('clean', del.bind(null, [
  `${destDir}/index.html`,
  `${assetsDir}`,
  `${destJsDevDir}`,
]))

const SRC_DIR = './src'
const DIST_DIR = './dist'
const SERVER_DIR = './server'

gulp.task('release', () => {
  gulp.src([`${SRC_DIR}/index.html`,
           ],
           {base: SRC_DIR})
    .pipe(gulp.dest(DIST_DIR))

  gulp.src([`${SRC_DIR}/assets/**/*`],
           {base: SRC_DIR})
    .pipe(gulp.dest(DIST_DIR))

  gulp.src([`${SRC_DIR}/config.release.js`,
           ],
           {base: SRC_DIR})
    .pipe(rename('config.js'))
    .pipe(gulp.dest(DIST_DIR))

  gulp.src([`${SERVER_DIR}/**/*`,
            `!${SERVER_DIR}/,config.example.rb`],
           {base: SERVER_DIR})
    .pipe(gulp.dest(DIST_DIR))
})

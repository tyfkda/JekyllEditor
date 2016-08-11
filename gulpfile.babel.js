'use strict'

import gulp from 'gulp'
import rename from 'gulp-rename'
const browserSync = require('browser-sync').create()

// ES6
import tslint from 'gulp-tslint'

// SASS
import sass from 'gulp-sass'
import cssnano from 'gulp-cssnano'

// Unit test
import karma from 'gulp-karma'

import plumber from 'gulp-plumber'
import del from 'del'
import shell from 'shelljs'

const ROOT_DIR = `${__dirname}/.`
const DEST_DIR = `${ROOT_DIR}/public`
const ASSETS_DIR = `${DEST_DIR}/assets`
const SRC_TS_DIR = `${ROOT_DIR}/src`
const SRC_TS_FILES = `${SRC_TS_DIR}/**/*.ts`
const SRC_SASS_FILES = `${ROOT_DIR}/src/**/*.scss`
const SRC_TEST_FILES = `${ROOT_DIR}/test/**/*.spec.ts`

function lint(glob) {
  return gulp.src(glob)
    .pipe(tslint({
      configuration: 'tslint.json',
      formatter: 'prose',
    }))
    .pipe(tslint.report({
      emitError: false,
      summarizeFailureOutput: true
    }))
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
  return lint([SRC_TS_FILES,
               SRC_TEST_FILES,
               '!src/assets/**/*.js',
               '!src/config*.js'])
})

gulp.task('watch-lint', [], () => {
  return buildWhenModified(['gulpfile.babel.js',
                            SRC_TS_FILES,
                            SRC_TEST_FILES,
                            '!src/assets/**/*.js',
                            '!src/config*.js'],
                           lint)
})

gulp.task('sass', () => {
  return gulp.src(SRC_SASS_FILES)
    .pipe(plumber())
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest(`${SRC_DIR}/assets`))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('watch-sass', [], () => {
  gulp.watch(SRC_SASS_FILES, ['sass'])
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
  SRC_TEST_FILES,
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
  `${DEST_DIR}/index.html`,
  `${ASSETS_DIR}`,
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

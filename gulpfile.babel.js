'use strict'

import gulp from 'gulp'
const browserSync = require('browser-sync').create()

// ES6
import clone from 'clone'
import webpack from 'webpack-stream'
import webpackConfig from './webpack.config.babel'
import eslint from 'gulp-eslint'

// HTML
import ejs from 'gulp-ejs'
import htmlmin from 'gulp-htmlmin'

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
const srcHtmlDir = './src'
const srcHtmlFiles = `${srcHtmlDir}/*.html`  // */
const srcSassFiles = './src/**/*.scss'
const srcTestFiles = './test/**/*.spec.js'
const releaseDir = './release'
const releaseAssetsDir = `${releaseDir}/assets`

const convertHtml = (buildTarget, dest) => {
  return gulp.src([srcHtmlFiles,
            '!' + srcHtmlDir + '/**/_*.html'])
    .pipe(plumber())
    .pipe(ejs({buildTarget: buildTarget}))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      removeAttributeQuotes: true,
    }))
    .pipe(gulp.dest(dest))
    .pipe(browserSync.reload({stream: true}))
}

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

const kWatchDeps = ['build', 'server',
                   'watch-html', 'watch-es6', 'watch-sass',
                   'watch-lint', 'watch-test']
gulp.task('watch', kWatchDeps)

gulp.task('build', ['html', 'es6', 'sass', 'copy-res'])

gulp.task('html', () => {
  return convertHtml('debug', destDir)
})

gulp.task('watch-html', [], () => {
  gulp.watch(srcHtmlFiles, ['html'])
})

gulp.task('es6', () => {
  const config = clone(webpackConfig)
  config.devtool = '#cheap-module-source-map'
  return gulp.src(`${srcEs6Dir}/main.js`)
    .pipe(webpack(config))
    .pipe(gulp.dest(assetsDir))
})

gulp.task('watch-es6', [], () => {
  const config = clone(webpackConfig)
  config.watch = true
  config.devtool = '#cheap-module-source-map'
  return gulp.src(srcEs6Files, {base: srcEs6Dir})
    .pipe(webpack(config))
    .pipe(gulp.dest(assetsDir))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('lint', () => {
  return lint(['gulpfile.babel.js',
               srcEs6Files,
               srcTestFiles,
               'tools/**/*.js',
               '!src/es6/patches.js'])
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
    .pipe(gulp.dest(assetsDir))
    .pipe(browserSync.reload({stream: true}))
})

gulp.task('watch-sass', [], () => {
  gulp.watch(srcSassFiles, ['sass'])
})

gulp.task('copy-res', () => {
  return gulp.src([`assets/**/*.*`],
                  {base: 'assets'})
    .pipe(gulp.dest(assetsDir))
})

const devServer = (_port) => {
  shell.exec(`bundle exec ruby server/dev_server.rb`,
             {async: true},
             () => {
               console.log('SERVER DONE')
             })
}

gulp.task('server', () => {
  const port = 4567
  devServer(port)
  browserSync.init({
    proxy: `localhost:${port}`,
  })
})

// Unit test.
const testFiles = [
  'assets/lib/lodash.min.js',
  'assets/lib/bind-polyfill.js',
  'assets/lib/angular.min.js',
  'assets/lib/angular-route.min.js',
  'assets/lib/ui-bootstrap-tpls-1.3.2.min.js',
  'node_modules/angular-mocks/angular-mocks.js',
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

gulp.task('release', ['build'], () => {
  // Copy resources.
  gulp.src([`${destDir}/**/*.*`,
            `!${destDir}/index.html`,
            `!${destJsDevDir}/**/*.*`,
            `!${destDir}/**/*.map`,
           ],
           {base: destDir})
    .pipe(gulp.dest(releaseDir))

  // Build HTML for release.
  convertHtml('release', releaseDir)

  // Concatenate es6 into single 'assets/main.js' file.
  const webpackRaw = require('webpack')
  const config = clone(webpackConfig)
  config.plugins = config.plugin || []
  config.plugins.push(new webpackRaw.optimize.UglifyJsPlugin())
  gulp.src(`${srcEs6Dir}/main.js`)
    .pipe(webpack(config))
    .pipe(gulp.dest(releaseAssetsDir))
})

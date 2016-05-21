"use strict";

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const merge = require('merge-stream');
const path = require('path');

const cache = new $.fileCache;

gulp.task('compile', function () {
  return gulp.src('server/**/*.js') // your ES2015 code
    .pipe(cache.filter()) // remember files
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      plugins: [
        require('babel-plugin-transform-es2015-modules-commonjs'),
      ],
    }))
    .pipe(cache.cache()) // cache them
    .pipe($.sourcemaps.write('./sourcemaps'))
    .pipe(gulp.dest('build/server')); // write them
});

gulp.task('clean', _ => {
  return gulp.src('build/public', {read: false})
  .pipe($.clean());
});

gulp.task('build:server', ['compile']);

gulp.task('build:public', ['clean'], _ => {
  const assetStream = gulp.src('public/*.html')
    .pipe($.useref({searchPath: 'public'}));

  const templateCacheStream = gulp.src('public/app/**/*.html')
    .pipe($.angularTemplatecache({
      module : 'App',
      root: 'app'
    }));

  return merge(assetStream, templateCacheStream)
    .pipe($.order([
      'app.js',
      'template.js'
    ]))
    .pipe($.if( file => {
      return file.relative === 'templates.js' || file.relative  === 'app.js'? true: false;
    }, $.concat('app.js')))
    .pipe($.if('*.js', $.sourcemaps.init()))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cleanCss()))
    .pipe($.if(['*.js','*.css'], $.rev()))
    .pipe($.if('*.js', $.sourcemaps.write('./')))
    .pipe($.revReplace())
    .pipe(gulp.dest('build/public'));
});

gulp.task('build', ['clean', 'build:public', 'build:server']);

gulp.task('inject', _=> {
  return gulp.src('public/index.html')
    .pipe($.inject(gulp.src(['public/app/**/*.js', 'public/app/**/*.css'], {read: false}),{ignorePath: 'public'}))
    .pipe(gulp.dest('public'));
});

gulp.task('watch', ['compile', 'inject'], function () {
  return $.nodemon({
    script: 'build/server/server.js',
    watch: 'server/',
    env: {
      DEBUG: 'app*',
      STATIC_ROOT: path.join(__dirname,'public')
    },
    tasks: ['compile']
  });
});

gulp.task('default', ['watch']);
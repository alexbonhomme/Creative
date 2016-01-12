'use strict';

var argv = require('yargs').argv,
    gulp = require('gulp'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    gulpif = require('gulp-if');

gulp.task('connect', function() {
    connect.server({
        root: 'src/',
        livereload: true
    });
});

gulp.task('livereload', function() {
    watch([
        'src/css/*.css',
        'src/js/*.js',
        'src/assets/**/*',
        'src/**/*.html'
    ])
    .pipe(connect.reload());
});

gulp.task('sass', function () {
    gulp.src('src/scss/**/*.scss')
        .pipe(gulpif(!argv.production, sourcemaps.init()))
        .pipe(sass({
            outputStyle: argv.production ? 'compressed' : 'expanded'
        }).on('error', sass.logError))
        .pipe(gulpif(!argv.production, sourcemaps.write()))
        .pipe(gulp.dest('src/css'));
});

gulp.task('browserify', function () {
    gulp.src('src/js/app.js')
        .pipe(browserify({
            insertGlobals: true,
            debug: !argv.production
        }))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('src/js'));
});

gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['browserify']);
});


/**
 * Usable tasks
 */

gulp.task('serve', [
    'sass',
    'browserify',
    'connect',
    'livereload',
    'watch'
]);

gulp.task('build', [
    'sass',
    'browserify'
], function () {
    gulp.src('dist/', {
        read: false
    }).pipe(clean({
        force: true
    }));

    gulp.src([
        'src/js/bundle.js',
        'src/css/main.css',
        'src/assets/**/*',
        'src/index.html'
    ], {
        base: 'src/'
    }).pipe(gulp.dest('dist/'));
});
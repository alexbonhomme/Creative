'use strict';

var argv = require('yargs').argv,
    del = require('del'),

    gulp = require('gulp'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    gulpif = require('gulp-if');

/**
 * Server/livereload tasks
 */

gulp.task('connect', function() {
    connect.server({
        root: '.tmp/',
        livereload: true
    });
});

gulp.task('livereload', function() {
    watch([
        '.tmp/css/styles.css',
        '.tmp/js/bundle.js',
        '.tmp/assets/**/*',
        '.tmp/**/*.html'
    ])
    .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['browserify']);
    gulp.watch([
        'src/assets/**/*',
        'src/**/*.html'
    ], ['copy:tmp']);
});

/**
 * Compilation tasks
 */

gulp.task('sass', function () {
    gulp.src('src/scss/**/*.scss')
        .pipe(gulpif(!argv.production, sourcemaps.init()))
        .pipe(sass({
            outputStyle: argv.production ? 'compressed' : 'expanded'
        }).on('error', sass.logError))
        .pipe(gulpif(!argv.production, sourcemaps.write()))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('.tmp/css'));
});

gulp.task('browserify', function () {
    gulp.src('src/js/app.js')
        .pipe(browserify({
            insertGlobals: true,
            debug: !argv.production
        }))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('.tmp/js'));
});

/**
 * Copy/clean tasks
 */

gulp.task('clean:tmp', function () {
    // WARNING: async function
    return del([
        '.tmp/assets/**/*',
        '.tmp/**/*.html'
    ]);
});

gulp.task('copy:tmp', ['clean:tmp'], function () {
    gulp.src([
        'src/assets/**/*',
        'src/**/*.html'
    ], {
        base: 'src/'
    }).pipe(gulp.dest('.tmp/'));
});

gulp.task('clean:dist', function () {
    // WARNING: async function
    return del(['dist/']);
});

gulp.task('copy:dist', ['clean:dist'], function () {
    gulp.src([
        '.tmp/js/bundle.js',
        '.tmp/css/styles.css',
    ], {
        base: '.tmp/'
    }).pipe(gulp.dest('dist/'));

    gulp.src([
        'src/assets/**/*',
        'src/**/*.html'
    ], {
        base: 'src/'
    }).pipe(gulp.dest('dist/'));
});


/**
 * Publics tasks
 */

gulp.task('serve', [
    'copy:tmp',
    'sass',
    'browserify',
    'connect',
    'livereload',
    'watch'
]);

gulp.task('build', [
    'sass',
    'browserify',
    'copy:dist'
]);
'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename');

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
        'src/img/**/*',
        'src/**/*.html'
    ])
    .pipe(connect.reload());
});

gulp.task('sass', function () {
    gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./src/css'));
});

gulp.task('browserify', function () {
    gulp.src('src/js/app.js')
        .pipe(browserify({
            insertGlobals: true,
            // debug: !gulp.env.production
            debug: true
        }))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest('./src/js'));
});

gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['browserify']);
});

gulp.task('copy', function () {
    gulp.src([
        'src/js/**/*',
        'src/css/**/*',
        'src/assets/**/*',
        'src/index.html'
    ], {
        base: 'src/'
    }).pipe(gulp.dest('dist/'));
});


// Usable tasks

gulp.task('serve', [
    'sass',
    'browserify',
    'connect',
    'livereload',
    'watch'
]);
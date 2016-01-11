'use strict';

var gulp = require('gulp'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('connect', function() {
    connect.server({
        livereload: true
    });
});

gulp.task('livereload', function() {
    watch([
        'css/*.css',
        'js/**/*.js',
        'img/**/*',
        '**/*.html'
    ])
    .pipe(connect.reload());
});

gulp.task('sass', function () {
    gulp.src('scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css/'));
});

gulp.task('watch', function () {
    gulp.watch('scss/**/*.scss', ['sass']);
});

// Usable tasks

gulp.task('serve', [
    'sass',
    'connect',
    'livereload',
    'watch'
]);
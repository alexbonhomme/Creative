'use strict';

var config = require('./config.json'),
    argv = require('yargs').argv,
    del = require('del'),
    merge = require('merge-stream'),
    ftp = require('vinyl-ftp'),

    gulp = require('gulp'),
    connect = require('gulp-connect'),
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    browserify = require('gulp-browserify'),
    rename = require('gulp-rename'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util');

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
        '.tmp/assets/**',
        '.tmp/**/*.html'
    ])
    .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/js/**/*.js', ['browserify']);
    gulp.watch([
        'src/assets/**',
        'src/**/*.html'
    ], ['copy:tmp']);
});

/**
 * Compilation tasks
 */

gulp.task('sass', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(gulpif(!argv.production, sourcemaps.init()))
        .pipe(sass({
            outputStyle: argv.production ? 'compressed' : 'expanded'
        }).on('error', sass.logError))
        .pipe(gulpif(!argv.production, sourcemaps.write()))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest('.tmp/css'));
});

gulp.task('browserify', function () {
    return gulp.src('src/js/app.js')
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
        '.tmp/assets/**',
        '.tmp/**/*.html'
    ]);
});

gulp.task('copy:tmp', ['clean:tmp'], function () {
    return gulp.src([
        'src/assets/**',
        'src/**/*.html'
    ], {
        base: 'src/'
    }).pipe(gulp.dest('.tmp/'));
});

gulp.task('clean:dist', function () {
    // WARNING: async function
    return del(['dist/**']);
});

gulp.task('copy:dist', ['sass', 'browserify','clean:dist'], function () {
    var copyTmp = gulp.src([
        '.tmp/js/bundle.js',
        '.tmp/css/styles.css',
    ], {
        base: '.tmp/'
    }).pipe(gulp.dest('dist/'));

    var copySrc = gulp.src([
        'src/assets/**',
        'src/**/*.html'
    ], {
        base: 'src/'
    }).pipe(gulp.dest('dist/'));

    return merge(copyTmp, copySrc);
});

gulp.task('ftp:dist', ['build'], function () {
    var conn = ftp.create({
        host: config.ftp.host,
        user: config.ftp.user,
        password: config.ftp.password,
        parallel: 10,
        log: gutil.log
    });

    // turn off buffering in gulp.src for best performance
    return gulp.src('dist/**', {
        base: 'dist/',
        buffer: false
    })
    .pipe(conn.newer(config.ftp.path))
    .pipe(conn.dest(config.ftp.path));

} );


/**
 * Publics tasks
 */

gulp.task('serve', [
    'clean:tmp',
    'copy:tmp',
    'sass',
    'browserify',
    'connect',
    'livereload',
    'watch'
]);

gulp.task('build', [
    'clean:dist',
    'sass',
    'browserify',
    'copy:dist'
]);

gulp.task('deploy', [
    'build',
    'ftp:dist'
]);
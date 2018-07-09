var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var prefix = require('gulp-autoprefixer'); // will be implement in build task
var livereload = require('gulp-livereload');
var connect = require('gulp-connect');
var wiredep = require('wiredep').stream;
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var clean = require('gulp-clean');
var sftp = require('gulp-sftp');
var runSequence = require('run-sequence');

// Error notification
var onError = function(err) {
  notify.onError({
    message: 'Error: <%= error.message %>'
  })(err);

  this.emit('end');
};

gulp.task('less', function() {
  return gulp.src('assets/less/style.less')
           .pipe(plumber({errorHandler: onError}))
           .pipe(less())
           .pipe(prefix(['last 15 version', '>1%', 'ie 9']))
           .pipe(gulp.dest('./assets/css'))
           .pipe(connect.reload());
});

gulp.task('php', function() {
  gulp.src('index.php')
    .pipe(connect.reload());
});

// web server configuration for livereloading
gulp.task('connect', function() {
  connect.server({
    port: 8888,
    root: './',
    livereload: true
  });
});

gulp.task('clean', function() {
    return gulp.src('dist', {read: false})
            .pipe(clean());
});

gulp.task('build-main', function() {
    return gulp.src('app/*.php')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:resource', function() {
  gulp.src('app/bower_components/font-awesome/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
  gulp.src('app/bower_components/bootstrap/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
  gulp.src('app/img/**/*')
    .pipe(gulp.dest('dist/img'));
  gulp.src('app/php/**/*.php')
    .pipe(gulp.dest('dist/php'));
});

gulp.task('build', function(callback) {
  runSequence('clean',
              'build-main',
              'copy:resource',
              callback);
});

gulp.task('watch', function() {
  gulp.watch('./assets/less/**/*.less', ['less']);
});

gulp.task('default', ['connect', 'php', 'less', 'watch']);

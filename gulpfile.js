var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    cfg = require('./config')();

console.log(cfg);

gulp.task('test', function() {
  return gulp.src(cfg.testpage)
    .pipe($.qunit())
    .pipe($.notify('JavaScript test finished!'));
});

gulp.task('js', function() {

  return gulp.src(cfg.source)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(cfg.destination))
    .pipe($.uglify())
    .pipe($.rename(cfg.rename))
    .pipe(gulp.dest(cfg.destination))
    .pipe($.notify('JavaScript build finished!'));
});

gulp.task('watch', function() {
  gulp.watch(cfg.source, ['js']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch']);

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var stripDebug = require('gulp-strip-debug');
var notify = require('gulp-notify');
var qunit = require('gulp-qunit');

var jsPath = {jsSrc:['./libs/jquery/jquery.min.js','./src/**/*.js'], jsDest:'./dist'};

gulp.task('clean', function() {
  return gulp.src('dist/*.js',{read:false})
	.pipe(clean());
});


gulp.task('test', function() {
  return gulp.src('dist/*.js','./test/tally.html')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'))
	.pipe(qunit())
    .pipe(notify('JavaScript test finished!'));	
});


gulp.task('js',['clean','test'], function() {

  return gulp.src(jsPath.jsSrc)
    .pipe(stripDebug())
    .pipe(gulp.dest(jsPath.jsDest))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(jsPath.jsDest))
    .pipe(notify('JavaScript build finished!'));
});

gulp.task('watch', function() {
  gulp.watch(jsPath.jsSrc, ['js']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['js','watch']);
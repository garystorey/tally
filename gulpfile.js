"use strict";

var gulp = require( "gulp" ),
    use = require( "gulp-load-plugins" )(),
    cfg = require( "./config" )();

gulp.task( "test", function() {
  return gulp.src( cfg.testpage )
    .pipe( use.plumber() )
    .pipe( use.qunit() )
    .pipe( use.notify( "JavaScript test finished!" ) );
} );

gulp.task( "js", function() {

  return gulp.src( cfg.source )
    .pipe( use.plumber() )
    .pipe( use.jshint() )
    .pipe( use.jshint.reporter( "jshint-stylish" ) )
    .pipe( gulp.dest( cfg.destination ) )
    .pipe( use.uglify() )
    .pipe( use.rename( cfg.rename ) )
    .pipe( gulp.dest( cfg.destination ) )
    .pipe( use.notify( "JavaScript build finished!" ) );
} );

gulp.task( "watch", function() {
  gulp.watch( cfg.source, [ "test", "js" ] );
} );

// The default task (called when you run `gulp` from cli)
gulp.task( "default", [ "watch" ] );

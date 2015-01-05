/*jshint node: true, globalstrict: true */
'use strict';


// Imports
// -------------------------------------------------------------------------------------------------

var gulp = require('gulp');
var to5 = require('gulp-6to5');




// Tasks
// =================================================================================================


// `gulp`
// -------------------------------------------------------------------------------------------------

gulp.task('default', ['scripts']);


// `gulp scripts`
// -------------------------------------------------------------------------------------------------

gulp.task('scripts', ['scripts:es6', 'scripts:es5']);

gulp.task('scripts:es6', function () {
    return gulp.src('source/**/*.js')
        .pipe(gulp.dest('dist'))
        ;
});

gulp.task('scripts:es5', function () {
    return gulp.src('source/n.js')
        .pipe(to5({modules: '6-to-library'}))
        .pipe(gulp.dest('dist.es5'))
        ;
});

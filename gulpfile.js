/*jshint node: true, globalstrict: true, esnext: false */
"use strict";


// Imports
// -------

var gulp = require("gulp");
var to5 = require("gulp-6to5");


// `gulp build` or `gulp`
// ----------------------

gulp.task("default", ["build"]);
gulp.task("build", ["scripts"]);


// `gulp scripts`
// --------------

var source = "source/n.js";

gulp.task("scripts", ["scripts:es6", "scripts:es5"]);

gulp.task("scripts:es6", function () {
  return gulp
    .src(source)
    .pipe(gulp.dest("dist"))
    ;
  });

gulp.task("scripts:es5", function () {
  return gulp
    .src(source)
    .pipe(to5({modules: "6-to-library"}))
    .pipe(gulp.dest("dist.es5"))
    ;
  });

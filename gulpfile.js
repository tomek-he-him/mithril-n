/*jshint node: true, globalstrict: true, esnext: false */
"use strict";


// Imports
// -------

var gulp = require("gulp-help")(require("gulp"));
var to5 = require("gulp-6to5");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");


// `gulp build`
// ------------

gulp.task("build"
  , "Built the lot."
  , ["scripts"]
  );


// `gulp scripts`
// --------------

var scripts =
  { source: "source/n.js"
  };

gulp.task("scripts"
  , "Build ES5 and ES6 dist scripts."
  , ["scripts:es6", "scripts:es5"]
  );

gulp.task("scripts:es6", false, function () {
  return gulp
    .src(scripts.source)
    .pipe(gulp.dest("dist"))
    ;
  });

gulp.task("scripts:es5", false, function () {
  return gulp
    .src(scripts.source)
    .pipe(to5({modules: "6-to-library"}))
    .pipe(gulp.dest("dist.es5"))
    .pipe(uglify())
    .pipe(rename({extname: ".min.js"}))
    .pipe(gulp.dest("dist.es5"))
    ;
  });

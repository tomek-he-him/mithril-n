/*jshint node: true, globalstrict: true, esnext: false */
"use strict";


// Imports
// -------

var spawnSync = require("child_process").spawnSync;

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


// `gulp gh-pages`
// ---------=-----

gulp.task("gh-pages"
  , "Build gh-pages in their branch."
  , function (done) {
    var dirty;
    try {
      dirty = !!spawnSync("git", ["status", "--porcelain"]).output[1].toString();
      if (dirty) spawnSync("git", ["stash", "save", "--include-untracked"]);
      spawnSync("git" ["checkout", "gh-pages"]);
      spawnSync("git" ["checkout", "master", scripts.source]);
      spawnSync("git" ["reset"]);
      spawnSync("./node_modules/.bin/docco", ["source/**.js"]);
      spawnSync("rm", ["-rf", "source"]);
      spawnSync("mv", ["docs/*", "."]);
      spawnSync("mv", ["*.html", "index.html"]);
      spawnSync("git", ["add", "--all", "."]);
      spawnSync("git", ["commit", "--message", "Automatic docs update"]);
      spawnSync("git", ["checkout", "master"]);
      if (dirty) spawnSync("git", ["stash", "pop"]);
      }
    catch (error) {done(error);}
    done();
    }
  );

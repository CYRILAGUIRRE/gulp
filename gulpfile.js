let gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const { series } = require("gulp");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");

gulp.task("concat", () => {
  return gulp
    .src("src/assets/scripts/**/*.js")
    .pipe(concat("all.js"))
    .pipe(gulp.dest("dist/assets/script"));
});

gulp.task("image", () => {
  return gulp
    .src("src/images/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 20, progressive: false }),
      ])
    )
    .pipe(gulp.dest("dist/images"));
});

gulp.task("sass", () => {
  return gulp
    .src("./src/assets/sass/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./src/assets/css"));
});

gulp.task("sass:watch", () => {
  gulp.watch("./src/assets/sass/**/*.scss", gulp.series("sass"));
});

gulp.task("postcss", () => {
  return gulp
    .src("./src/assets/css/*.css")
    .pipe(postcss([autoprefixer(), cssnano]))
    .pipe(gulp.dest("./dist/assets/css"));
});

gulp.task("html", () => {
  return gulp.src("./src/**/*.html").pipe(gulp.dest("./dist/"));
});

gulp.task("build", gulp.parallel("html", "postcss", "image"));

gulp.task("serve", () => {
  browserSync.init({
    server: {
      baseDir: "./src",
    },
  });
  gulp.watch("src/**/*.html").on("change", browserSync.reload);

  gulp
    .watch("src/assets/sass/**/*.scss", gulp.series("sass"))
    .on("change", browserSync.reload);
});

// gulp.task("postcss:min", () => {
//   return gulp
//     .src("./src/assets/css/*.css")
//     .pipe(postcss([cssnano]))
//     .pipe(gulp.dest("./dist/assets/css"));
// });

// gulp.task("build", gulp.series("postcss:prefix", "postcss:min"));

const gulp = require("gulp");
const { series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const cssbeautify = require("gulp-cssbeautify");
const fileinclude = require("gulp-file-include");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();  

function style(){
	return gulp
		.src("./src/assets/sass/style.scss")
		.pipe(sourcemaps.init())
		.pipe(sass().on("error", sass.logError))
		.pipe(sass())
		.pipe(sourcemaps.write("."))
		.pipe(cssbeautify())
		.pipe(gulp.dest("./src/assets/css"))
		.pipe(browserSync.stream());
}

function htmlfileinclude() {   
	return gulp
		.src("./src/*.html")   
		.pipe(
			fileinclude({
				prefix: "@@",
				basepath: "@file",
			})
		)
		.pipe(gulp.dest("./dist"))
		.pipe(browserSync.stream());
}    

function moveAssets(){
	return gulp.src('./src/assets/**/*')
		.pipe(gulp.dest('./dist/assets'))
		.pipe(browserSync.stream());
}  

function watch() {  
	browserSync.init({
		server: {
			baseDir: "./dist",
		},
	});  
	gulp.watch(
		[
		  "./src/partial-html/*.html",
		  "./src/*.html",               
		  "./src/assets/sass/**/*.scss" 
		],
		gulp.series(htmlfileinclude,style, moveAssets) // Run these tasks when any of the files change
	);

	// gulp.watch("./src/img/**/*", moveImages);
	gulp.watch("./src/partial-html/*.html").on("change", browserSync.reload);
	gulp.watch("./src/*.html").on("change", browserSync.reload);
	gulp.watch("./src/assets/sass/**/*.scss").on("change", browserSync.reload);
}

exports.watch = watch;
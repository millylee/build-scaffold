// 引入gulp
var gulp = require('gulp');

// 引入组件
// var jshint = require('gulp-jshint');//检查js
var sass   = require('gulp-sass');  //编译Sass
// var concat = require('gulp-concat');//合并
// var uglify = require('gulp-uglify');//压缩 JS
// var rename = require('gulp-rename');//重命名
var minifyCSS  = require('gulp-minify-css');

var autoprefixer = require('gulp-autoprefixer'); //自动添加前缀
var sourcemaps = require('gulp-sourcemaps');

var browserSync = require('browser-sync').create();

var coffee = require('gulp-coffee');

gulp.task('coffee', function() {
    gulp.src('src/coffee/*.coffee')
        .pipe(sourcemaps.init())
        .pipe(coffee())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js/'));
});

// 检查js脚本的任务
// gulp.task('lint', function() {
//     gulp.src('./js/*.js') //可配置你需要检查脚本的具体名字。
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

// 编译Sass
gulp.task('sass', function() {
    gulp.src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('serve', ['sass'], function() {
    browserSync.init({
        server: "./",
        port: "80"
    });

    gulp.watch("src/scss/*.scss", ['sass']);
    gulp.watch("src/coffee/*.coffee", ['coffee']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

 
gulp.task('prefix', function () {
    return gulp.src('dist/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('dist/css'));
});

// 合并，压缩js文件
// 找到 js/ 目录下的所有 js 文件，压缩，重命名，最后将处理完成的js存放在 dist/js/ 目录下
// gulp.task('scripts', function() {
//     gulp.src('./js/*.js')
//         .pipe(concat('all.js'))
//         .pipe(gulp.dest('./dist'))
//         .pipe(rename('all.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('./dist'));

//         console.log('gulp task is done');//自定义提醒信息
// });

// // 定义默认任务,执行gulp会自动执行的任务
// gulp.task('default', function(){
//     gulp.run('lint', 'sass', 'scripts');
//     // 监听js文件变化，当文件发生变化后会自动执行任务
//     gulp.watch('./js/*.js', function(){
//         gulp.run('lint','scripts');
//     });
// });
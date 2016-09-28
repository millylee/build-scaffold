'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const ssi = require('gulp-ssi');
const rename = require('gulp-rename');
const header = require('gulp-header');
const watch = require('gulp-watch');
const filter = require('gulp-filter');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const bs = require('browser-sync').create();
const del = require('del');
const config = require('./config');

const pkg = require('./package.json');
const moment = require('moment');
pkg.date = moment().format('YYYY-MM-DD');

// header 信息
var banner = ['/*!',
    ' * <%= pkg.name %>',
    ' * @author <%= pkg.author %>',
    ' * @date <%= pkg.date %>',
    ' */',
    ''].join('\n');

// 实时刷新
const reloadHandler = function () {
    gulp.watch(config.src.shtml, compileSHTML);
    gulp.watch(config.src.js, compileJS);
    gulp.watch(config.src.scss, compileSass);
};

// 清除构建目录
function cleanDev() {
    return del([config.dest.dir]);
}

// compile shtml
function compileSHTML() {
    return gulp.src(config.src.shtml)
        .pipe(ssi())
        .pipe(rename({
            extname: '.html'
        }))
        .pipe(gulp.dest(config.dest.dir))
        .pipe(bs.stream())
        .on('data', function () {
        })
        .on('end', reloadHandler);
}

// compile javascript
function compileJS() {
    return gulp.src(config.src.js)
        .pipe(babel())
        .pipe(header(banner, {pkg : pkg}))
        .pipe(uglify({preserveComments: 'license'}))
        .pipe(gulp.dest(config.dest.dir))
        .pipe(bs.stream())
        .on('data', function () {
        })
        .on('end', reloadHandler);
}

// compile sass
function compileSass() {
    return gulp.src(config.src.scss)
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(autoprefixer(config.autoprefixer.browsers))
        .pipe(header(banner, {pkg : pkg}))
        .pipe(cssnano())
        .pipe(gulp.dest(config.dest.dir))
        .pipe(bs.stream())
        .on('data', function () {
        })
        .on('end', reloadHandler);
}

// 启动服务
function startServer() {
    bs.init({
        server: config.dest.dir,
        port: config.domain.port,
        startPath: './',
        open: true,
    });
}

// 注册 build dev 任务
gulp.task('default', gulp.series(
    cleanDev,
    gulp.parallel(
        compileSHTML,
        compileJS,
        compileSass
    ),
    startServer
));

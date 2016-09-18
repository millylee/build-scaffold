'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const ssi = require('gulp-ssi');
const rename = require('gulp-rename');
const header = require('gulp-header');
const bs = require('browser-sync');
const del = require('del');
const config = require('./config');

const pkg = require('./package.json');
const moment = require('moment');
pkg.date = moment().format('YYYY-MM-DD');

// header 信息
var banner = ['/**',
    ' * @fileoverview <%= pkg.name %>',
    ' * @author <%= pkg.author %>',
    ' * @date <%= pkg.date %>',
    ' */',
    ''].join('\n');

// 实时刷新
const reloadHandler = function () {
    bs.create().reload();
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
        .on('data', function () {
        })
        .on('end', reloadHandler)
}

// compile javascript
function compileJS() {
    return gulp.src(config.src.js)
        .pipe(babel())
        .pipe(header(banner, {pkg : pkg}))
        .pipe(gulp.dest(config.dest.dir))
        .on('data', function () {
        })
        .on('end', reloadHandler)
}

// compile sass
function compileSass() {
    return gulp.src(config.src.scss)
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(header(banner, {pkg : pkg}))
        .pipe(gulp.dest(config.dest.dir))
        .on('data', function () {
        })
        .on('end', reloadHandler)
}

// 实时刷新
function startServer() {
    bs.init({
        server: config.dest.dir,
        port: 8080,
        startPath: './',
        reloadDelay: 0,
        notify: {
            styles: [
                "margin: 0",
                "padding: 5px",
                "position: fixed",
                "font-size: 10px",
                "z-index: 9999",
                "bottom: 0px",
                "right: 0px",
                "border-radius: 0",
                "border-top-left-radius: 5px",
                "background-color: rgba(60,197,31,0.5)",
                "color: white",
                "text-align: center"
            ]
        }
    });
}


//注册 build_dev 任务
gulp.task('default', gulp.series(
    cleanDev,
    gulp.parallel(
        compileSHTML,
        compileJS,
        compileSass
    ),
    startServer
));

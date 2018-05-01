var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;
var less 		= require('gulp-less');

// 静态服务器 + 监听 scss/html 文件
gulp.task('zdsx', function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("*.html").on('change', reload);
});

// Less 自动转换 css
gulp.task('reloadLess', ['less'], function() {

    browserSync.init({
        server: "./2048/"
    });

    gulp.watch("./2048/*.less", ['less']);
    gulp.watch("./2048/*.html").on('change', reload);
    gulp.watch("./2048/*.js").on('change', reload);
    gulp.watch("./2048/*.css").on('change', reload);
});

// less编译后的css将注入到浏览器里实现更新
gulp.task('less', function() {
    return gulp.src("./2048/*.less")
        .pipe(less())
        .pipe(gulp.dest("./2048/"))
        .pipe(reload({stream: true}));
});
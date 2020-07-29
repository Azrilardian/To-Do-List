var gulp = require('gulp');
var gulpConnect = require('gulp-connect');

gulp.task('server', async function() {
    gulpConnect.server({
        root: 'App',
        livereload: true
    })
})
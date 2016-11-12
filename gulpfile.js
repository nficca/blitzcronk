var gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    nodemon = require('gulp-nodemon');

var paths = {
    scripts: ['src/**/*.js']
};

gulp.task('default', ['start']);

gulp.task('scripts', () => {
    return gulp.src(paths.scripts)
        .pipe(babel({presets: ['es2015']})) // must use babel to convert to es2015 for uglifying
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('start', () => {
   nodemon({
       script: 'dist/bot.js',
       watch: paths.scripts,
       tasks: ['scripts']
   });
});
var gulp    = require('gulp'),
    babel   = require('gulp-babel'),
    uglify  = require('gulp-uglify'),
    nodemon = require('gulp-nodemon');

var paths = {
    scripts: ['src/**/*.js'],
    commands: ['src/functions/**/*.js']
};

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('start', function() {
   nodemon({
       script: 'dist/bot.js',
       watch: paths.scripts,
       tasks: ['scripts']
   });
});
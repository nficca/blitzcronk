const gulp = require('gulp'),
        babel = require('gulp-babel'),
        uglify = require('gulp-uglify'),
        nodemon = require('gulp-nodemon'),
        jsdoc = require('gulp-jsdoc-json');

const paths = {
    scripts: ['src/**/*.js'],
    commands: ['src/commands/**/*.js']
};

gulp.task('default', ['scripts', 'docs', 'start']);

gulp.task('scripts', () => {
    return gulp.src(paths.scripts)
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/'));
});

gulp.task('docs', () => {
    return gulp.src(paths.commands)
        .pipe(jsdoc({output: 'docs.json'}))
        .pipe(gulp.dest('dist/docs/'));
});

gulp.task('start', () => {
   nodemon({
       script: 'dist/bot.js',
       watch: paths.scripts,
       tasks: ['scripts', 'docs']
   });
});
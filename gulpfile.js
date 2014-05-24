var gulp    = require('gulp'),
    beep    = require('beepbeep'),
    plumber = require('gulp-plumber'),
    sass    = require('gulp-ruby-sass'),
    prefix  = require('gulp-autoprefixer'),
    rimraf  = require('gulp-rimraf'),
    colors  = require('colors');

// Compile Sass with Source Maps
gulp.task('sass-dev', ['clean-css'], function () {

    console.log('[sass]'.bold.magenta + ' Compiling Sass');

    return gulp.src('_jekyll/scss/main.scss')
        .pipe(plumber(function () {
            beep();
            console.log('[sass]'.bold.magenta + ' There was an issue compiling Sass\n'.bold.red);
            this.emit('end');
        }))
        .pipe(sass({
            sourcemap : true,
            style     : 'compact',
            precision : 4,
        }))
        .pipe(prefix())
        .pipe(gulp.dest('_jekyll/css'));

});

// Compile Sass for production
gulp.task('sass-prod', ['clean-css'], function () {

    console.log('[sass]'.bold.magenta + ' Compiling Sass');

    return gulp.src('_jekyll/scss/main.scss')
        .pipe(sass({
            sourcemap: true,
            style: 'compressed',
            precision: 4,
        }))
        .on('error', function () {
            console.log('There was an issue compiling Sass'.red);
        })
        .pipe(prefix())
        .on('error', function () {
            console.log('There was an issue running Autoprefixer'.red);
        })
        .pipe(gulp.dest('_jekyll/css'));

});

// Delete compiled CSS
gulp.task('clean-css', function () {

    console.log('[clean-css]'.bold.magenta + ' Deleting compiled CSS files');

    return gulp.src(['_jekyll/css/**/*.css', '_jekyll/css/**/*.css.map'], { read: false })
        .pipe(rimraf());

});

// Watch files for changes
gulp.task('watch', function () {

    console.log('[watch]'.bold.magenta + ' Watching Sass files for changes');

    // gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('_jekyll/scss/**/*.scss', ['sass-dev']);

});


gulp.task('dev', ['sass-dev', 'watch'], function () {
    return console.log('\n[dev]'.bold.magenta + ' Ready for you to start doing things\n'.bold.green);
});

gulp.task('build', ['sass-prod']);

// Default Task
gulp.task('default', ['sass-dev', 'watch']);

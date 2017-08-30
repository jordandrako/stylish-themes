// Define gulp before we start
const gulp = require('gulp');
// Define Sass and the autoprefixer
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
// This is an object which defines paths for the styles.
// Can add paths for javascript or images for example
// The folder, files to look for and destination are all required for sass
const paths = {
  styles: {
    src: './src',
    files: './src/**/*.scss',
    dest: './dist',
  },
};
// A display error function, to format and make custom errors more uniform
// Could be combined with gulp-util or npm colors for nicer output
const displayError = (error) => {
  // Initial building up of the error
  let errorString = `[${error.plugin}]`;
  errorString += ` ${error.message.replace('\n', '')}`; // Removes new line at the end
  // If the error contains the filename or line number add it to the string
  if (error.fileName) errorString += ` in ${error.fileName}`;
  if (error.lineNumber) errorString += ` on line ${error.lineNumber}`;
  // This will output an error like the following:
  // [gulp-sass] error message in file_name on line 1
  console.error(errorString); // eslint-disable-line no-console
};
// Setting up the sass task
gulp.task('sass', () => {
  // Taking the path from the above object
  gulp
    .src(paths.styles.files)
    // Sass options - make the output compressed and add the source map
    // Also pull the include path from the paths object
    .pipe(
      sass({
        includePaths: [paths.styles.src],
      }),
    )
    // If there is an error, don't stop compiling but use the custom displayError function
    .on('error', (err) => {
      displayError(err);
    })
    // Pass the compiled sass through the prefixer with defined
    .pipe(prefix('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    // Funally put the compiled sass into a css file
    .pipe(gulp.dest(paths.styles.dest));
});
// This is the default task - which is run when `gulp` is run
// The tasks passed in as an array are run before the tasks within the function
gulp.task('default', ['sass'], () => {
  // Watch the files in the paths object, and when there is a change, fun the functions in the array
  gulp
    .watch(paths.styles.files, ['sass'])
    // Also when there is a change, display what file was changed,
    // only showing the path after the 'sass folder'
    .on('change', (evt) => {
      // eslint-disable-next-line no-console
      console.log(
        `[watcher] File ${evt.path.replace(/.*(?=sass)/, '')} was ${evt.type}, compiling...`,
      );
    });
});

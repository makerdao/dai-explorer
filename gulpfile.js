var exec     = require('child_process').exec
var fs       = require('fs');

var gulp     = require('gulp');
var gulpsync = require('gulp-sync')(gulp)
var gutil    = require('gulp-util');

var LIB_PATH = 'lib/sai/';
var LIB_OUT  = LIB_PATH + 'out/';
var OUT      = 'src/config/';

var files = ['Tub', 'DSToken', 'DSValue', 'DSRoles', 'SaiLPC'];

gulp.task('default', gulpsync.sync(['update', 'build', 'generate']));

gulp.task('update', (cb) => {
  exec('git pull', {cwd: LIB_PATH}, (err, res, failed) => {
    if (err) {
      console.log(err);
    } else if (failed) {
      process.stdout.write(failed);
    } else {
      //process.stdout.write('Updated sai...\n');
    }
    cb(err);
  });
});

gulp.task('build', (cb) => {
  exec('export SOLC_FLAGS=--optimize && make all', {cwd: LIB_PATH}, (err, res, failed) => {
    if (err) {
      console.log(err);
    } else if (failed) {
      process.stdout.write(failed);
    } else {
      process.stdout.write('Compiled sai...\n');
    }
    cb(err);
  });
});

gulp.task('generate', (cb) => {
  files.forEach((file) => {
    var path = `${LIB_OUT}${file}`;
    var content = fs.readFileSync(`${path}.abi`, "utf8");
    var abi = JSON.parse(content);
    var bytecode = '0x'+fs.readFileSync(`${path}.bin`, "utf8");

    var out = {
      abi,
      bytecode
    };

    fs.writeFileSync(`${OUT}${file.toLowerCase()}.json`, JSON.stringify(out, null, 2));
    gutil.log(`Wrote to ${OUT}${file.toLowerCase()}.json`);
  });
})

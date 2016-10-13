var through = require('through2'),
    path = require('path'),
    exec = require('child_process').exec;

module.exports = function (dest) {
    var paths = [];
    dest = path.resolve(process.cwd(), dest);

    return through.obj(function (file, enc, cb) {
        if (file.isStream()) {
            cb();
            return;
        }
        paths.push(file.path);

        cb();
    }, function (cb) {
        var jsdocPath = path.resolve(__dirname, './node_modules/jsdoc/jsdoc.js'),
            confPath = path.resolve(__dirname, './node_modules/angular-jsdoc/common/conf.json'),
            templatePath = path.resolve(__dirname, './node_modules/angular-jsdoc/angular-template/');
        var command = [
            jsdocPath,
            '-c',
            confPath,
            '-t',
            templatePath,
            '-d',
            dest
        ].concat(paths);

        command = command.join(' ');
        exec(command, {
            cwd: __dirname
        }, function (e) {
            if (e) {
                console.log(e);
            }
            cb();
        });
    });
};

var path            = require('path');
var fs              = require('fs');


module.exports = function UrlPrefixStrategy(pathname, option) {
    var extname     = path.extname(pathname);
    var basename    = path.posix.basename(pathname, extname);
    var stat        = fs.statSync(pathname);

    var prefix = basename;

    if( basename.indexOf(option.preservePrefix) === 0 ) {
        prefix = basename.slice(option.preservePrefix.length);
    }
    else if( stat.isFile() && basename === 'index' ) {
        prefix = '';
    }
    else if( basename.indexOf(option.paramPrefix) === 0 ) {
        prefix = ':'+basename.slice(option.paramPrefix.length);
    }

    return prefix;
}

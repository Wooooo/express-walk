var fs              = require('fs');
var glob            = require('glob');
var path            = require('path');
var express         = require('express');

var option, routes;

module.exports = function(app, rootPath, opt) {
    option = opt;
    routes = [];

    walk(app, rootPath, '');

    return routes;
};

function walk(app, currentPath, currentUrl) {
    var controllers = glob.sync(path.join(currentPath, '*'));

    controllers.forEach(function(controller) {
        var extname = path.extname(controller);
        var stat = fs.statSync(controller);

        if( stat.isFile() && extname === '.js' ) {
            var router = require(controller);

            if( !router ) {
                return;
            }

            var urlPrefix = option.urlPrefixStrategy(controller, option);

            app.use(currentUrl+'/'+urlPrefix, router);

            router.stack.forEach(function(r) {
                var url = currentUrl;
                if( urlPrefix !== '' ) url += '/';
                url += urlPrefix;
                url += r.route.path;

                Object.keys(r.route.methods).forEach(function(method) {
                    routes.push(method.toUpperCase()+' '+url);
                })
            });

        }
        else if ( stat.isDirectory() ) { // if directory
            var urlPrefix = option.urlPrefixStrategy(controller, option);

            walk(app, controller, currentUrl+'/'+urlPrefix);
        }
        else {
            return;
        }
    })
}

var walk                = require('./walk');
var basenameStrategy    = require('./basenameStrategy');
var objectAssign        = require('object-assign');
var fs                  = require('fs');

module.exports = function() {
    var opt, rootPath;

    var app = require('express')();

    /**
     When calling function with 'option' argument only

     func({...}) // option
     func('...') // rootPath
     */
    if( arguments.length === 1 ) {
        if( typeof(arguments[0]) === 'object' ) { // option
            opt = arguments[0];
        }
        else if( typeof(arguments[0]) === 'string' ) { // rootPath
            rootPath = arguments[0];
        }
        else {
            throw new Error('The param should be an option object or a rooPath string.');
        }
    }

    /**
     When calling function with 'rootPath' and 'option'

     func(rootPath, {...})
     */
    else if( arguments.length === 2 ) {
        rootPath = arguments[0];
        opt = arguments[1];
    }

    opt = objectAssign({
        preservePrefix: '_',
        paramPrefix: '$',
        urlPrefixStrategy: basenameStrategy
    }, (opt || {}));

    rootPath = rootPath || opt.rootPath;

    if( rootPath === undefined || typeof(rootPath) !== 'string' ) {
        throw new Error('\'rootPath\' parameter should be passed.');
    }

    fs.statSync(rootPath);

    var routes = walk(app, rootPath, opt);

    app.locals.routeList = routes;

    return app;
}
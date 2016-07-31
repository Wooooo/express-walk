var walk                = require('./walk');
var basenameStrategy    = require('./basenameStrategy');
var objectAssign        = require('object-assign');


module.exports = function(app) {
    if( !app || !app.get || !app.get('env') ) { // check whether app is express app instance or not by app.get
        throw new Error('\'app\' parameter(express instance) should be passed.');
    }

    return function() {
        var opt, rootPath;

        /**
        When calling function with 'option' argument only

        func({...}) // option
        func('...') // rootPath
        */
        if( arguments.length === 1 ) {
            if( typeof(arguments[0]) === 'object' ) { // option
                option = arguments[0];
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

        func(app, rootPath, {...})
        */
        else if( arguments.length === 2 ) {
            rootPath = arguments[0];
            option = arguments[1];
        }

        opt = objectAssign({
            preservePrefix: '_',
            paramPrefix: '$',
            urlPrefixStrategy: basenameStrategy
        }, (opt || {}));

        rootPath = rootPath || opt.rootPath;

        if( rootPath === undefined || typeof(rootPath) !== 'string' ) {
            throw new Error('\'rootPath\' parmaeter should be passed.');
        }

        return walk(app, rootPath, opt);
    }
}

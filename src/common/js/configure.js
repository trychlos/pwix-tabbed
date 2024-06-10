/*
 * pwix:tabbed/src/common/js/configure.js
 */

import _ from 'lodash';

Tabbed._conf = {};

Tabbed._defaults = {
    verbosity: Tabbed.C.Verbose.CONFIGURE
};

/**
 * @summary Get/set the package configuration
 *  Should be called *in same terms* both by the client and the server.
 * @param {Object} o configuration options
 * @returns {Object} the package configuration
 */
Tabbed.configure = function( o ){
    if( o && _.isObject( o )){
        _.merge( Tabbed._conf, Tabbed._defaults, o );
        // be verbose if asked for
        if( Tabbed._conf.verbosity & Tabbed.C.Verbose.CONFIGURE ){
            //console.log( 'pwix:tabbed configure() with', o, 'building', Tabbed._conf );
            console.log( 'pwix:tabbed configure() with', o );
        }
    }
    // also acts as a getter
    return Tabbed._conf;
}

_.merge( Tabbed._conf, Tabbed._defaults );

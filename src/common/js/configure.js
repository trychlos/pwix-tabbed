/*
 * pwix:tabbed/src/common/js/configure.js
 */

import _ from 'lodash';

import { ReactiveVar } from 'meteor/reactive-var';

let _conf = {};
Tabbed._conf = new ReactiveVar( _conf );

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
        // check that keys exist
        let built_conf = {};
        Object.keys( o ).forEach(( it ) => {
            if( Object.keys( Tabbed._defaults ).includes( it )){
                built_conf[it] = o[it];
            } else {
                console.warn( 'pwix:tabbed configure() ignore unmanaged key \''+it+'\'' );
            }
        });
        if( Object.keys( built_conf ).length ){
            _conf = _.merge( Tabbed._defaults, _conf, built_conf );
            Tabbed._conf.set( _conf );
            _verbose( Tabbed.C.Verbose.CONFIGURE, 'pwix:tabbed configure() with', built_conf );
        }
    }
    // also acts as a getter
    return Tabbed._conf.get();
}

_conf = _.merge( {}, Tabbed._defaults );
Tabbed._conf.set( _conf );

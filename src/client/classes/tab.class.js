/*
 * pwix:tabbed/src/client/classes/instance.class.js
 *
 * This class manages a Tabbed Blaze component.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

export class Tab {

    // static data

    // private data

    #name = null;
    #args = null;

    // private methods

    /**
     * @summary
     *  Most of needed parameters can be specified at instanciation time.
     * @constructor
     * @returns {Tab} this instance
     */
    constructor( name, o ){
        assert( name && _.isString( name ), 'pwix:tabbed.Instance() expects a string argument, got '+name );
        assert( !o || _.isObject( o ), 'pwix:tabbed.Instance() expects an object argument when set, got '+o );

        this.#args = o;
        const self = this;

        // register this name in the global client repository
        Tabbed.instanceNames = Tabbed.instanceNames || {};
        Tabbed.instanceNames[name] = this;

        return this;
    }
}

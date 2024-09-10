/*
 * pwix:tabbed/src/client/classes/instance.class.js
 *
 * This class manages a Tabbed Blaze component.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';

export class Instance {

    // static data

    // private data

    #view = null;
    #args = null;

    #id = null;
    #name = new ReactiveVar( null );
    #navPosition = new ReactiveVar( null );

    // private methods

    /**
     * @constructor
     * @param {Blaze.TemplateInstance} view
     * @param {Object} o
     * @returns {Instance} this instance
     */
    constructor( view, o={} ){
        assert( view && view instanceof Blaze.TemplateInstance, 'pwix:tabbed.Instance() expects a Blaze.TemplateInstance argument, got '+view );
        assert( !o || _.isObject( o ), 'pwix:tabbed.Instance() expects an object argument when set, got '+o );

        this.#view = view;
        this.#args = o;
        const self = this;

        // register this name in the global client repository
        Tabbed.instanceNames[name] = this;

        // get the name from arguments
        Tracker.autorun(() => {
            self.name( o.name || 'tabbed-'+Random.id());
        });

        // get the nav position from arguments
        Tracker.autorun(() => {
            self.navPosition( o.navPosition || Tabbed.C.Position.TOP );
        });

        // allocates a unique id for this Tabbed component
        this.#id = 'tabbed-'+Random.id();

        return this;
    }

    /**
     * @returns {Any} the unique id of this Tabbed component
     */
    id(){
        return this.#id;
    }

    /**
     * Getter/Setter
     * @param {Any} name a name
     * @returns {Any} the Tabbed component name
     *  A reactive data source
     */
    name( name ){
        if( name ){
            name = _.toString( _.isFunction( name ) ? name() : name );
            this.#name.set( name );
        }
        return this.#name.get();
    }

    /**
     * Getter/Setter
     * @param {Any} pos a position
     * @returns {Any} the navPosition as a Tabbed.C.Position constant
     *  A reactive data source
     */
    navPosition( pos ){
        if( pos ){
            assert( Object.values( Tabbed.C.Position ).includes( pos ), 'expects a Tabbed.C.Position const, got '+pos );
            this.#navPosition.set( pos );
        }
        return this.#navPosition.get();
    }
}

/*
 * pwix:tabbed/src/client/classes/instance.class.js
 *
 * This class manages a Tabbed Blaze component.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';

export class Tab {

    // static data

    // private data

    // instanciation time
    #tabbed = null;
    #args = null;

    // runtime
    #id = null;
    #enabled = new ReactiveVar( null );
    #shown = new ReactiveVar( null );

    // private methods

    /**
     * @param {Tabbed.Instance} tabbed the attached Tabbed.Instance
     * @param {Object} it the provided tab definition
     * @returns {Tab} this instance
     */
    constructor( tabbed, o ){
        this.#tabbed = tabbed;
        this.#args = o;
        const self = this;

        this.#id = Random.id();

        if( Object.keys( o ).includes( 'enabled' )){
            this.enabled( o.enabled );
        } else {
            this.enabled( true );
        }

        if( Object.keys( o ).includes( 'shown' )){
            this.shown( o.shown );
        } else {
            this.shown( true );
        }

        //console.debug( tabbed.name(), 'instanciating tab', o, this.#id );
        return this;
    }

    /**
     * @returns {String} the tab internal identifier
     */
    id(){
        return this.#id;
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} value
     * @returns {Boolean} whether the tab is enabled
     *  A reactive data source
     */
    enabled( value ){
        if( value !== undefined ){
            this.#enabled.set( value );
        }
        value = this.#enabled.get();
        return Boolean( _.isFunction( value ) ? value() : value );
    }

    /**
     * @returns {String} the tab name, defaulting to tab template
     */
    name(){
        let value = this.#args.name || this.paneTemplate();
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * @returns {Object} the nav element attributes
     */
    navAttributes(){
        let value = this.#args.navAttributes || {};
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * @returns {Object} the nav element data context
     */
    navData(){
        let value = this.#args.navData || null;
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * @returns {String} the nav internal identifier
     */
    navId(){
        return 'nav-'+this.#id;
    }

    /**
     * @returns {String} the classes to be added to this nav-item element
     */
    navItemClasses(){
        let value = this.#args.navItemClasses || '';
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * @returns {Object} the nav element attributes
     */
    navLabel(){
        let value = this.#args.navLabel || '';
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * @returns {String} the classes to be added to this nav-link element
     */
    navLinkClasses(){
        let value = this.#args.navLinkClasses || '';
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * @returns {String} the nav template
     */
    navTemplate(){
        let value = this.#args.navTemplate || null;
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * @returns {Object} the nav element data context
     */
    paneData(){
        let value = this.#args.paneData || null;
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * @returns {String} the pane internal identifier
     */
    paneId(){
        return 'pane-'+this.#id;
    }

    /**
     * @returns {String} the tab template
     */
    paneTemplate(){
        let value = this.#args.paneTemplate || '';
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * Getter/Setter
     * @param {Boolean|Function} value
     * @returns {Boolean} whether the tab is shown
     *  A reactive data source
     */
    shown( value ){
        if( value !== undefined ){
            this.#shown.set( value );
        }
        value = this.#shown.get();
        return Boolean( _.isFunction( value ) ? value() : value );
    }

    /**
     * @returns {Tabbed.Instance} the attached Tabbed.Instance class instance
     */
    tabbed(){
        return this.#tabbed;
    }
}

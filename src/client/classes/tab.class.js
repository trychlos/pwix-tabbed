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
    
        return this;
    }

    /**
     * @returns {String} the tab internal identifier
     */
    id(){
        return this.#id;
    }

    /**
     * @returns {String} the tab name, defaulting to tab template
     */
    enabled(){
        let value = Object.keys( this.#args ).includes( 'enabled' ) ? this.#args.enabled : true;
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
        let value = this.#args.navData || this.tabbed().dataContext();
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
        let value = this.#args.navLabel || {};
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
        let value = this.#args.paneData || this.tabbed().dataContext();
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
     * @returns {Tabbed.Instance} the attached Tabbed.Instance class instance
     */
    tabbed(){
        return this.#tabbed;
    }
}

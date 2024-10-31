/*
 * pwix:tabbed/src/client/classes/instance.class.js
 *
 * This class manages a Tabbed Blaze component.
 */

import _ from 'lodash';
const assert = require( 'assert' ).strict;

import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';

import { Tab } from './tab.class.js';

export class Instance {

    // static data

    // private data

    // instanciation time
    #view = null;
    #args = null;

    // runtime arguments
    #id = null;
    #name = new ReactiveVar( null );
    #activateLastTab = new ReactiveVar( null );
    #activateTab = new ReactiveVar( null );
    #dataContext = new ReactiveVar( null );
    #navClasses = new ReactiveVar( null );
    #navItemClasses = new ReactiveVar( null );
    #navLinkClasses = new ReactiveVar( null );
    #navPosition = new ReactiveVar( null );
    #paneClasses = new ReactiveVar( null );
    #paneSubData = new ReactiveVar( null );
    #paneSubTemplate = new ReactiveVar( null );
    #tabs = new ReactiveVar( null );
    #prevParms = null;

    // private methods

    _setParms( parms ){
        if( !_.isEqual( this.#prevParms, parms )){
            //console.debug( 'setParms', parms );
            this.#prevParms = parms;
            if( Object.keys( parms ).includes( 'activateLastTab' )){
                this.activateLastTab( parms.activateLastTab );
            }
            if( Object.keys( parms ).includes( 'activateTab' )){
                this.activateTab( parms.activateTab );
            }
            this.dataContext( parms.dataContext );
            this.navClasses( parms.navClasses || '' );
            this.navItemClasses( parms.navItemClasses || '' );
            this.navLinkClasses( parms.navLinkClasses || '' );
            this.navPosition( parms.navPosition || Tabbed.C.Position.TOP );
            this.paneClasses( parms.paneClasses || '' );
            this.paneSubData( parms.paneSubData );
            this.paneSubTemplate( parms.paneSubTemplate );
            this.tabs( parms.tabs || [] );
        }
    }

    /**
     * @constructor
     * @param {Blaze.TemplateInstance} view
     * @param {Object} opts
     * @returns {Tabbed.Instance} this instance
     */
    constructor( view, opts ){
        assert( view && view instanceof Blaze.TemplateInstance, 'pwix:tabbed.Instance() expects a Blaze.TemplateInstance argument, got '+view );
        assert( opts && _.isObject( opts ), 'pwix:tabbed.Instance() expects a plain Javascript object, got '+opts );
        assert( opts.name && ( _.isString( opts.name ) || _.isFunction( opts.name )), 'pwix:tabbed.Instance() expects a name option, got '+opts.name );

        this.#view = view;
        this.#args = opts;
        const self = this;

        // non reactively get the name from arguments
        this.name( opts.name );

        // register this name in the global client repository
        Tabbed.instanceNames[this.name()] = this;

        // allocates a unique id for this Tabbed component
        this.#id = 'tabbed-'+Random.id();
        //console.debug( 'instanciating', this.name(), this.id());

        // setup the parms if they are provided here
        if( Object.keys( opts ) > 1 ){
            this._setParms( opts );
        }

        return this;
    }

    /**
     * Getter/Setter
     * @param {Any} value a data object
     * @returns {Any} whether to keep last activated pane
     *  A reactive data source
     */
    activateLastTab( value ){
        if( value !== undefined ){
            this.#activateLastTab.set( value );
        } else {
            value = this.#activateLastTab.get();
        }
        if( value === null ){
            value = true;
        }
        return Boolean( _.isFunction( value ) ? value() : value );
    }

    /**
     * Getter/Setter
     * @param {Any} value a data object
     * @returns {Any} the tab to activate at startup
     *  A reactive data source
     */
    activateTab( value ){
        if( value !== undefined ){
            this.#activateTab.set( parseInt( value ));
        } else {
            value = this.#activateTab.get();
        }
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * Getter/Setter
     * @param {Any} value a data object
     * @returns {Any} the panes datacontext
     *  A reactive data source
     */
    dataContext( value ){
        if( value ){
            this.#dataContext.set( value );
        } else {
            value = this.#dataContext.get();
        }
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * @param {String} the parameter name as a dotted string
     * @returns {Any} the asked parameter
     *  A reactive data source
     */
    get( name ){
        const words = name.split( '.' );
        if( words.length === 1 ){
            if( _.isFunction( this[words[0]] )){
                return this[words[0]]();
            }
        } else if( words.length === 3 && words[0] === 'tab' ){
            const tab = this.tabByName( words[1] );
            if( tab && _.isFunction( tab.TABBED.tab[words[2]] )){
                return tab.TABBED.tab[words[2]]();
            }
        }
        console.warn( 'pwix:tabbed.Instance() unable to get', name );
        return null;
    }

    /**
     * @returns {Any} the unique id of this Tabbed component
     */
    id(){
        return this.#id;
    }

    /**
     * Getter/Setter
     * @param {Any} value a name
     * @returns {Any} the Tabbed component name
     *  A reactive data source
     */
    name( value ){
        if( value ){
            this.#name.set( value );
        } else {
            value = this.#name.get();
        }
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * Getter/Setter
     * @param {Any} value the classes
     * @returns {Any} the navClasses
     *  A reactive data source
     */
    navClasses( value ){
        if( value !== undefined ){
            this.#navClasses.set( value );
        } else {
            value = this.#navClasses.get();
        }
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * Getter/Setter
     * @param {Any} value the classes
     * @returns {Any} the navClasses
     *  A reactive data source
     */
    navItemClasses( value ){
        if( value !== undefined ){
            this.#navItemClasses.set( value );
        } else {
            value = this.#navItemClasses.get();
        }
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * Getter/Setter
     * @param {Any} value the classes
     * @returns {Any} the navClasses
     *  A reactive data source
     */
    navLinkClasses( value ){
        if( value !== undefined ){
            this.#navLinkClasses.set( value );
        } else {
            value = this.#navLinkClasses.get();
        }
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * Getter/Setter
     * @param {Any} value a position
     * @returns {Any} the navPosition as a Tabbed.C.Position constant
     *  A reactive data source
     */
    navPosition( value ){
        if( value ){
            this.#navPosition.set( value );
        } else {
            value = this.#navPosition.get();
        }
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * @param {Integer} index the index of a to-be-activated tab
     * @returns {Integer} the index of the closest activable tab, which may be
     *  - either the very same index than the one asked, if the tab is shown and enabled
     *  - else we test the previous tabs
     *  - else we test the next tabs
     *  - at then end, and in the worst case or all panes are either hidden or disabled, the initial asked index
     */
    nextActivable( index ){
        const self = this;
        const _activable = function( tab ){
            //console.debug( self.name(), 'index', tab.TABBED.index, 'shown', tab.TABBED.tab.shown(), 'enabled', tab.TABBED.tab.enabled());
            return tab.TABBED.tab.shown() && tab.TABBED.tab.enabled();
        };
        const tabs = this.tabs();
        //console.debug( 'tabs', tabs );
        // protect against a configuration change
        if( index >= tabs.length ){
            index = tabs.length - 1;
        }
        // test the asked index
        if( index >= 0 ){
            if( _activable( tabs[index] )){
                return index;
            }
        }
        // test the previous indexes
        if( index > 0 ){
            for( let i=index-1 ; i>=0 ; --i ){
                if( _activable( tabs[i] )){
                    return i;
                }
            }
        }
        // test the next indexes
        for( let i=index+1 ; i<tabs.length ; ++i ){
            if( _activable( tabs[i] )){
                return i;
            }
        }
        // at last, unfortunately return the requested index
        console.warn( 'pwix:tabbed unable to find an activable tab starting from', index );
        return index;
    }

    /**
     * Getter/Setter
     * @param {Any} value the classes
     * @returns {Any} the paneClasses
     *  A reactive data source
     */
    paneClasses( value ){
        if( value !== undefined ){
            this.#paneClasses.set( value );
        } else {
            value = this.#paneClasses.get();
        }
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * Getter/Setter
     * @param {Any} value a data object
     * @returns {Any} the pane sub-template data context
     *  A reactive data source
     */
    paneSubData( value ){
        if( value ){
            this.#paneSubData.set( value );
        } else {
            value = this.#paneSubData.get();
        }
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * Getter/Setter
     * @param {Any} value a template
     * @returns {Any} the pane sub-template name
     *  A reactive data source
     */
    paneSubTemplate( value ){
        if( value ){
            this.#paneSubTemplate.set( value );
        } else {
            value = this.#paneSubTemplate.get();
        }
        return _.isFunction( value ) ? value() : value;
    }

    /**
     * @param {String} name the parameter as a dotted string
     * @param {Any} value the value to be set
     */
    set( name, value ){
        const words = name.split( '.' );
        if( words.length === 1 ){
            if( _.isFunction( this[words[0]] )){
                return this[words[0]]( value );
            }
        } else if( words.length === 3 && words[0] === 'tab' ){
            const tab = this.tabByName( words[1] );
            if( tab && _.isFunction( tab.TABBED.tab[words[2]] )){
                return tab.TABBED.tab[words[2]]( value );
            }
        }
        console.warn( 'pwix:tabbed.Instance() unable to set', name, value );
        return null;
    }

    /**
     * @summary Setup the Tabbed.Instance parameters (reactively called from Tabbed.js)
     * @param {Object} dc the current data context
     */
    setTabbedParms( dc ){
        this._setParms( dc );
    }

    /**
     * @param {String} id
     * @returns {Object} the identified tab
     *  A reactive data source
     */
    tabById( id ){
        let found = null;
        this.tabs().every(( it ) => {
            if( it.TABBED.tab.id() === id ){
                found = it;
            }
            return !found;
        });
        return found;
    }

    /**
     * @param {Integer} index
     * @returns {Object} the identified tab
     *  A reactive data source
     */
    tabByIndex( index ){
        let found = null;
        const tabs = this.tabs();
        if( index >= 0 && index < tabs.length ){
            found = tabs[index];
        }
        return found;
    }

    /**
     * @param {String} name
     * @returns {Object} the named tab
     *  A reactive data source
     */
    tabByName( name ){
        let found = null;
        this.tabs().every(( it ) => {
            if( it.TABBED.tab.name() === name ){
                found = it;
            }
            return !found;
        });
        return found;
    }

    /**
     * Getter/Setter
     * @param {Any} value the tabs
     * @returns {Any} the tabs
     *  A reactive data source
     */
    tabs( value ){
        if( value ){
            value = _.isFunction( value ) ? value() : value;
            assert( _.isArray( value ), 'pwix:tabbed.Instance() expects an array, got '+value );
            // make sure each provided tab object has a TABBED definition with a Tab instance
            //console.debug( this.name(), 'tabs.count', value.length );
            for( let i=0 ; i<value.length ; ++i ){
                let it = value[i];
                it.TABBED = it.TABBED || {};
                it.TABBED.tab = it.TABBED.tab || new Tab( this, it );
                it.TABBED.index = i;
            };
            this.#tabs.set( value );
        } else {
            value = this.#tabs.get();
        }
        return value;
    }

    /**
     * Getter
     * @returns {Blaze.TemplateInstance} the attached Blaze view
     */
    view(){
        return this.#view;
    }
}

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
    #dataContext = new ReactiveVar( null );
    #navClasses = new ReactiveVar( null );
    #navItemClasses = new ReactiveVar( null );
    #navLinkClasses = new ReactiveVar( null );
    #navPosition = new ReactiveVar( null );
    #paneClasses = new ReactiveVar( null );
    #paneSubData = new ReactiveVar( null );
    #paneSubTemplate = new ReactiveVar( null );
    #tabs = new ReactiveVar( null );

    // private methods

    /**
     * @constructor
     * @param {Blaze.TemplateInstance} view
     * @param {ReactiveVar} o
     * @returns {Instance} this instance
     */
    constructor( view, o ){
        assert( view && view instanceof Blaze.TemplateInstance, 'pwix:tabbed.Instance() expects a Blaze.TemplateInstance argument, got '+view );
        assert( o && o instanceof ReactiveVar, 'pwix:tabbed.Instance() expects a ReactiveVar argument, got '+o );
        assert( o.get().name && ( _.isString( o.get().name ) || _.isFunction( o.get().name )), 'pwix:tabbed.Instance() expects a name option, got '+o.get().name );

        this.#view = view;
        this.#args = o;
        const self = this;

        // non reactively get the name from arguments
        this.name( o.get().name );

        // register this name in the global client repository
        Tabbed.instanceNames[this.name()] = this;

        // set up individual parameters for this Tabbed instance
        view.autorun(() => {
            const opts = o.get();
            if( Object.keys( opts ).includes( 'activateLastTab' )){
                self.activateLastTab( opts.activateLastTab );
            }
            self.dataContext( opts.dataContext );
            self.navClasses( opts.navClasses || '' );
            self.navItemClasses( opts.navItemClasses || '' );
            self.navLinkClasses( opts.navLinkClasses || '' );
            self.navPosition( opts.navPosition || Tabbed.C.Position.TOP );
            self.paneClasses( opts.paneClasses || '' );
            self.paneSubData( opts.paneSubData );
            self.paneSubTemplate( opts.paneSubTemplate );
            self.tabs( opts.tabs || [] );
        });

        // allocates a unique id for this Tabbed component
        this.#id = 'tabbed-'+Random.id();
        //console.debug( 'instanciating', this.name(), this.id());

        return this;
    }

    /**
     * Getter/Setter
     * @param {Any} value a data object
     * @returns {Any} whether tpo keep last activated pane
     *  A reactive data source
     */
    activateLastTab( value ){
        if( value !== undefined ){
            this.#activateLastTab.set( value );
        }
        value = this.#activateLastTab.get();
        if( value === null ){
            value = true;
        }
        return Boolean( _.isFunction( value ) ? value() : value );
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
        }
        value = this.#dataContext.get();
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
        }
        value = this.#name.get();
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
        }
        value = this.#navClasses.get();
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
        }
        value = this.#navItemClasses.get();
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
        }
        value = this.#navLinkClasses.get();
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
        }
        value = this.#navPosition.get();
        return _.isFunction( value ) ? value() : value;
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
        }
        value = this.#paneClasses.get();
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
        }
        value = this.#paneSubData.get();
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
        }
        value = this.#paneSubTemplate.get();
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
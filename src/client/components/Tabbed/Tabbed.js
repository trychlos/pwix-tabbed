/*
 * pwix:tabbed/src/client/components/Tabbed/Tabbed.js
 *
 * see README
 */

import _ from 'lodash';

import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';

import '../navs/navs.js';
import '../panes/panes.js';

import './Tabbed.html';
import './Tabbed.less';

Template.Tabbed.onCreated( function(){
    const self = this;

    self.TABBED = {
        // the Tabbed.Instance
        instance: new ReactiveVar( null ),
        // the current active tab index
        activeTab: new ReactiveVar( 0 ),

        // activate a tab by a nav attribute specified as { name: value }
        activateByAttribute( attribute ){
            const key = Object.keys( attribute )[0];
            const value = attribute[key];
            const index = self.$( '.tabbed-navs[data-tabbed-id="'+self.TABBED.instance.get().id()+'"] .nav-link['+key+'="'+value+'"]' ).data( 'tabbed-index' );
            self.TABBED.activateByIndex( index );
        },

        // activate a tab by its index
        activateByIndex( index ){
            //console.debug( 'activateByIndex', index, self.$( '.tabbed-navs[data-tabbed-id="'+self.TABBED.instance.get().id()+'"] .nav-link[data-tabbed-index="'+index+'"]' ));
            self.$( '.tabbed-navs[data-tabbed-id="'+self.TABBED.instance.get().id()+'"] .nav-link[data-tabbed-index="'+index+'"]' ).trigger( 'click' );
        },

        // activate a tab by its current nav label
        activateByLabel( label ){
            const index = self.$( '.tabbed-navs[data-tabbed-id="'+self.TABBED.instance.get().id()+'"] .nav-link :contains("'+label+'")' ).data( 'tabbed-index' );
            self.TABBED.activateByIndex( index );
        },

        // activate a tab by its name
        activateByName( name ){
            const found = self.TABBED.byName( name );
            if( found ){
                self.TABBED.activateByIndex( found.TABBED.index );
            }
        },

        // return the tab definition by its name, or null
        byName( name ){
            let found = null;
            self.TABBED.instance.get().tabs().every(( it ) => {
                if( it.TABBED.tab.name() === name ){
                    found = it;
                }
                return found === null;
            });
            return found;
        },

        // return the tab definition by its nav-id, or null
        byNavId( id ){
            return self.TABBED.byTabId( id.substr( 4 ));
        },

        // return the tab definition by its tab-id, or null
        byTabId( id ){
            let found = null;
            self.TABBED.instance.get().tabs().every(( it ) => {
                if( it.TABBED.tab.id() === id ){
                    found = it;
                }
                return found === null;
            });
            return found;
        },

        // enable/disable a tab by a nav attribute specified as { name: value }
        enableByAttribute( attribute, enabled ){
            const key = Object.keys( attribute )[0];
            const value = attribute[key];
            const index = self.$( '.tabbed-navs[data-tabbed-id="'+self.TABBED.instance.get().id()+'"] .nav-link['+key+'="'+value+'"]' ).data( 'tabbed-index' );
            self.TABBED.enableByIndex( index, enabled );
        },

        // enable/disable a tab by its index
        enableByIndex( index, enabled ){
            const $nav = self.$( '.tabbed-navs[data-tabbed-id="'+self.TABBED.instance.get().id()+'"] .nav-link[data-tabbed-index="'+index+'"]' )
            if( enabled ){
                $nav.removeClass( 'disabled' );
            } else {
                $nav.addClass( 'disabled' );
            }
        },

        // enable/disable a tab by its current nav label
        enableByLabel( label, enabled ){
            const index = self.$( '.tabbed-navs[data-tabbed-id="'+self.TABBED.instance.get().id()+'"] .nav-link :contains("'+label+'")' ).data( 'tabbed-index' );
            self.TABBED.enableByIndex( index, enabled );
        },

        // enable/disable a tab by its name
        enableByName( name, enabled ){
            const found = self.TABBED.byName( name );
            if( found ){
                self.TABBED.enableByIndex( found.TABBED.index, enabled );
            }
        },

        // returns the jQuery objects which correspond to the first child of each pane
        //  (which is expected to be the application component for the pane)
        firstPaneChildren(){
            return self.$( '.Tabbed[data-tabbed-id="'+self.TABBED.instance.get().id()+'"] > * > * > * > * > .tab-pane > :first-child' );
        },

        // whether navs are horizontally oriented ?
        isHorizontal(){
            const pos = self.TABBED.instance.get().navPosition();
            return pos === Tabbed.C.Position.TOP || pos === Tabbed.C.Position.BOTTOM;
        },

        // returns the tab label
        navLabel( tab ){
            return _.toString( _.isFunction( tab.navLabel ) ? tab.navLabel() : tab.navLabel );
        },

        // advertize the child panes of a tab transition
        //  it is expected the event will bubble up to here and to our parents
        tabTransition( event, $targets, current, field, related ){
            const myid = self.$( current ).closest( '.tabbed-navs' ).data( 'tabbed-id' );
            if( myid === self.TABBED.instance.get().id() ){
                const navid = self.$( current ).prop( 'id' );
                const found = self.TABBED.byNavId( navid );
                if( found ){
                    // update the active tab for next reload and HMR
                    self.TABBED.activeTab.set( found.TABBED.index );
                    // advertize all direct .tab-pane's children
                    const data = {
                        tabbedId: myid,
                        tabbedName: self.TABBED.instance.get().name(),
                        tab: { ...found }
                    };
                    // search the related tab if any
                    if( field && related ){
                        const relatedTab = self.TABBED.byNavId( self.$( related ).prop( 'id' ));
                        data[field] = { ...relatedTab };
                    }
                    //console.debug( 'trigerring', event, data, $targets );
                    $targets.trigger( event, data );
                } else {
                    console.warn( 'myId', myid, 'navid not found', navid );
                }
            }
        }
    };

    // non reactively get the component name, maybe generating a random one
    // get the named instance, maybe allocating one if not yet exist
    let name = this.data.name;
    const isNamed = Boolean( name );
    name = _.toString( name ? ( _.isFunction( name ) ? name() : name ) : 'name-'+Random.id());
    this.data.name = this.data.name || name;
    let instance = Tabbed.instanceNames[name];
    const previouslyExisted = Boolean( instance );
    let dataContext = null;
    if( !previouslyExisted ){
        dataContext = new ReactiveVar( this.data, _.isEqual );
    }
    instance = instance || new Tabbed.Instance( self, dataContext );
    self.TABBED.instance.set( instance );

    // track data context changes if not previously existed
    // i.e. if we have created the Tabbed.Instance from the data context to get upward compatibility
    self.autorun(() => {
        if( !previouslyExisted ){
            dataContext.set( Template.currentData());
        }
    });

    // track last active tab from session storage
    //  requires the Tabbed be explicitely named and the behaviour allowed
    self.autorun(() => {
        if( isNamed && self.TABBED.instance.get().activateLastTab()){
            self.TABBED.activeTab.set( parseInt( sessionStorage.getItem( name+':activeTab' )) || 0 );
        }
    });

    // make sure session storage is updated each time the active tab changes
    self.autorun(() => {
        if( isNamed && self.TABBED.instance.get().activateLastTab()){
            const activeTab = self.TABBED.activeTab.get();
            const name = self.TABBED.instance.get().name();
            if( _.isFinite( activeTab )){
                sessionStorage.setItem( name+':activeTab', activeTab );
            }
        }
    });
});

Template.Tabbed.onRendered( function(){
    const self = this;

    // advertize of our creation
    self.$( '.Tabbed' ).trigger( 'tabbed-rendered', {
        tabbedId: self.TABBED.instance.get().id(),
        tabbedName: self.TABBED.instance.get().name(),
        $tabbed: self.$( '.Tabbed[data-tabbed-id="'+self.TABBED.instance.get().id()+'"]' )
    });

    // set the attributes on nav-link's if asked for
    self.autorun(() => {
        self.TABBED.instance.get().tabs().forEach(( it ) => {
            const attributes = it.TABBED.tab.navAttributes();
            Object.keys( attributes ).forEach(( key ) => {
                self.$( '.Tabbed .nav-link#'+it.TABBED.tab.id()).attr( key, attributes[key] );
            });
        });
    });

    // activate the designated tab
    //  this also triggers the first 'shown.bs.tab' event which is good
    self.TABBED.activateByIndex( self.TABBED.activeTab.get());

    // track the tabs changes and trigger an event
    self.autorun(() => {
        const tabs = self.TABBED.instance.get().tabs();
        self.$( '.Tabbed' ).trigger( 'tabbed-changed', {
            tabbedId: self.TABBED.instance.get().id(),
            tabbedName: self.TABBED.instance.get().name(),
            $tabbed: self.$( '.Tabbed[data-tabbed-id="'+self.TABBED.instance.get().id()+'"]' )
        });
    });

    // track the count of tabs
    //  a debug message when working on dynamically removable tabs
    self.autorun(() => {
        if( false ){
            const tabs = self.TABBED.instance.get().tabs();
            if( Object.keys( self.TABBED ).includes( 'prevCount' )){
                if( self.TABBED.prevCount !== tabs.length ){
                    console.debug( 'tabs count change from', self.TABBED.prevCount, 'to', tabs.length );
                } else {
                    console.debug( 'autorun WITHOUT tabs count change' );
                }
            }
            self.TABBED.prevCount = tabs.length;
        }
    });
});

Template.Tabbed.helpers({
    // make the div height 100% when position is horizontal
    classes(){
        return Template.instance().TABBED.isHorizontal() ? '' : 'tabbed-h100';
    },
    // whether we have a sub-pane ?
    haveSubPane(){
        return Boolean( Template.instance().TABBED.instance.get().paneSubTemplate());
    },
    // additional classes for the .tabbed-navs-encloser element
    navPosition(){
        return 'nav-'+Template.instance().TABBED.instance.get().navPosition();
    },
    // provide dynamic data context
    parmsSubData(){
        //console.debug( 'paneSubData', Template.instance().TABBED.instance.get().paneSubData());
        //console.debug( 'dataContext', Template.instance().TABBED.instance.get().dataContext());
        //console.debug( 'this', this );
        return Template.instance().TABBED.instance.get().paneSubData() || Template.instance().TABBED.instance.get().dataContext() || this;
    },
    // have a dynamic template
    parmsSubPane(){
        return Template.instance().TABBED.instance.get().paneSubTemplate();
    },
    // provides a data context to each nav and pane component
    parmsSubs(){
        return {
            TABBED: Template.instance().TABBED,
            dataContext: this
        };
    },
    posHorizontal(){
        return Template.instance().TABBED.isHorizontal();
    },
    posLeft(){
        return Template.instance().TABBED.instance.get().navPosition() === Tabbed.C.Position.LEFT;
    },
    posTop(){
        return Template.instance().TABBED.instance.get().navPosition() === Tabbed.C.Position.TOP;
    },
    // the identifier of this tabbed template
    tabbedId(){
        return Template.instance().TABBED.instance.get().id();
    },
    // the name of this tabbed template
    tabbedName(){
        return Template.instance().TABBED.instance.get().name();
    }
});

Template.Tabbed.events({
    // note that several Tabbed may be imbricated - we must only deal with ours and not with those bubbling from lower Tabbed's
    // hide.bs.tab is the first event triggered during the tab transition
    //  event.target and event.relatedTarget target the current active tab and the new-to-be-activated tab (if available) respectively
    'hide.bs.tab .Tabbed'( event, instance ){
        instance.TABBED.tabTransition( 'tabbed-pane-to-hide', instance.TABBED.firstPaneChildren(), event.target, 'next', event.relatedTarget );
    },

    // show.bs.tab is the second event triggered during the tab transition
    //  event.target and event.relatedTarget target the active tab and the previously active tab (if available) respectively
    'show.bs.tab .Tabbed'( event, instance ){
        instance.TABBED.tabTransition( 'tabbed-pane-to-show', instance.TABBED.firstPaneChildren(), event.target, 'prev', event.relatedTarget );
    },

    // hidden.bs.tab is the last-but-one event triggered during the tab transition
    //  event.target and event.relatedTarget target the just hidden tab and the new-to-be-activated tab (if available) respectively
    'hidden.bs.tab .Tabbed'( event, instance ){
        instance.TABBED.tabTransition( 'tabbed-pane-hidden', instance.TABBED.firstPaneChildren(), event.target, 'next', event.relatedTarget );
    },

    // shown.bs.tab is the last event triggered during the tab transition
    //  event.target and event.relatedTarget target the active tab and the previously active tab (if available) respectively
    'shown.bs.tab .Tabbed'( event, instance ){
        instance.TABBED.tabTransition( 'tabbed-pane-shown', instance.TABBED.firstPaneChildren(), event.target, 'prev', event.relatedTarget );
    },

    // a request to activate a tab
    'tabbed-do-activate .Tabbed'( event, instance, data ){
        //console.debug( event.type, instance, data );
        if( data.tabbedId === instance.TABBED.instance.get().id()){
            if( _.isNumber( data.index )){
                instance.TABBED.activateByIndex( data.index );
            } else if( data.label ){
                instance.TABBED.activateByLabel( data.label );
            } else if( data.name ){
                instance.TABBED.activateByName( data.name );
            } else if( data.attribute ){
                instance.TABBED.activateByAttribute( data.attribute );
            } else {
                console.warn( 'doesn\'t know what to activate', data );
            }
        //} else {
        //    console.debug( 'data.tabbedId', data.tabbedId );
        //    console.debug( 'instance.TABBED.instance.get().id()', instance.TABBED.instance.get().id() );
        }
    },

    // a request to re-send the same activation event
    'tabbed-do-activate-same .Tabbed'( event, instance, data ){
        if( data.tabbedId === instance.TABBED.instance.get().id()){
            console.debug( 'tabbed-do-activate-same' );
            instance.TABBED.activateByIndex( instance.TABBED.activeTab.get());
        }
    },

    // a request to enable/disable a tab
    'tabbed-do-enable .Tabbed'( event, instance, data ){
        if( data.tabbedId === instance.TABBED.instance.get().id()){
            if( _.isNumber( data.index )){
                instance.TABBED.enableByIndex( data.index, data.enabled );
            } else if( data.label ){
                instance.TABBED.enableByLabel( data.label, data.enabled );
            } else if( data.name ){
                instance.TABBED.enableByName( data.name, data.enabled );
            } else if( data.attribute ){
                instance.TABBED.enableByAttribute( data.attribute, data.enabled );
            }
        }
    }
});

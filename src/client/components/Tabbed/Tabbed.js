/*
 * pwix:tabbed/src/client/components/Tabbed/Tabbed.js
 *
 * Parms:
 *  - tabs, an array of the tabs, or a function which returns such an array, each item being an object
 *      > navLabel: if set, the HTML nav label, or a function which returns such a string
 *      > navAttributes: if set, an object, or a function which returns such an object, which define attributes to be added to the nav-link element
 *          where each attribute is expected to be defined as { name: value }
 *      > navTemplate: if set, a template to be attached as the nav content (besides of the label if one is specified)
 *      > navData: if set, the data to be attached to the navTemplate, or a function which returns such a thing
 *      > paneTemplate: if set, the pane template name, or a function which returns such a name
 *      > paneData: if set, the data to be passed to the paneTemplate, or a function which returns such a thing
 *      > tabName: if set, the name of the tab, or a function which returns such a name
 *  - name: if set, the name used to read/write active tab into/from local storage, or a function which returns such a name
 *  - navPosition: may be 'bottom', 'top', 'left' or 'right'
 *      defaulting to 'top'
 *  - navClasses: classes to be added to each ul.nav element
 *  - navLinkClasses: classes to be added to each button.nav-link element
 *  - paneSubTemplate: if set, the name of a template to add below the panes
 *  - paneSubData: if set, the data context to be passed to this sub-template, defaulting to this Tabbed data context
 * 
 * Data context:
 * 'Tabbed' component increases the data context passed to navTemplate's and paneTemplate's with datas:
 * - tabbedId: the identifier of the 'Tabbed' component
 * - tabbedTabId: the identifier of each tab, same whether we display a nav-link or a tab-pane
 * 
 * Handled events:
 *  - tabbed-do-activate, data={ tabbedId, index } ask to activate the tab by its index
 *  - tabbed-do-activate, data={ tabbedId, label } ask to activate the tab by its current nav label
 *  - tabbed-do-activate, data={ tabbedId, name } ask to activate the tab by its name
 *  - tabbed-do-activate, data={ tabbedId, attribute } ask to activate the tab by the specified nav attribute
 *  - tabbed-do-enable, data={ tabbedId, index, enabled } ask to enable/disable the tab by its index
 *  - tabbed-do-enable, data={ tabbedId, label, enabled } ask to enable/disable the tab by its current nav label
 *  - tabbed-do-enable, data={ tabbedId, name, enabled } ask to enable/disable the tab by its name
 *  - tabbed-do-enable, data={ tabbedId, attribute, enabled } ask to enable/disable the tab by the specified nav attribute
 *  where 'tabbed' is expected to be the internal identifier of this tabbed template
 * 
 * Triggered events:
 *  > on itself (and bubble up to the parents)
 *    - tabbed-rendered, data={ tabbedId, tabbedName, $tabbed }  when the Tabbed component is rendered
 *    - tabbed-changed, data={ tabbedId, tabbedName, $tabbed }   when the tabs population has changed
 *  > on every .tab-pane first child
 *    - tabbed-pane-to-hide, data={ tabbedId, tabbedName, tab:<tab_object>, next:<tab_object> } when about to leave a tab
 *    - tabbed-pane-to-show, data={ tabbedId, tabbedName, tab:<tab_object>, prev:<tab_object> } when a new tab is about to be shown
 *    - tabbed-pane-hidden, data={ tabbedId, tabbedName, tab:<tab_object>, next:<tab_object> } when a tab has left
 *    - tabbed-pane-shown, data={ tabbedId, tabbedName, tab:<tab_object>, prev:<tab_object> } when a tab has been shown
 * 
 * Identifiers management:
 * We dynamically allocate random identifiers for:
 *  - the Tabbed component, advertized as 'data-tabbed-id' in the DOM, and as 'tabbedId' in children data contexts
 *  - each tab, advertized as 'data-tabbed-tab-id' in the DOM, and as 'tabbedTabId' in children data contexts
 */

import _ from 'lodash';

import { Random } from 'meteor/random';
import { ReactiveVar } from 'meteor/reactive-var';

import './Tabbed.html';
import './Tabbed.less';

Template.Tabbed.onCreated( function(){
    const self = this;

    self.APP = {
        myId: 'tabbed-'+Random.id(),
        tabs: new ReactiveVar( [], _.isEqual ),
        navPosition: new ReactiveVar( null ),
        activeTab: new ReactiveVar( 0 ),

        // activate a tab by a nav attribute specified as { name: value }
        activateByAttribute( attribute ){
            const key = Object.keys( attribute )[0];
            const value = attribute[key];
            const index = self.$( '.tabbed-navs[data-tabbed-id="'+self.APP.myId+'"] .nav-link['+key+'="'+value+'"]' ).data( 'tabbed-index' );
            self.APP.activateByIndex( index );
        },

        // activate a tab by its index
        activateByIndex( index ){
            //console.debug( 'activateByIndex', index, self.$( '.tabbed-navs[data-tabbed-id="'+self.APP.myId+'"] .nav-link[data-tabbed-index="'+index+'"]' ));
            self.$( '.tabbed-navs[data-tabbed-id="'+self.APP.myId+'"] .nav-link[data-tabbed-index="'+index+'"]' ).trigger( 'click' );
        },

        // activate a tab by its current nav label
        activateByLabel( label ){
            const index = self.$( '.tabbed-navs[data-tabbed-id="'+self.APP.myId+'"] .nav-link :contains("'+label+'")' ).data( 'tabbed-index' );
            self.APP.activateByIndex( index );
        },

        // activate a tab by its name
        activateByName( name ){
            const found = self.APP.byName( name );
            if( found ){
                self.APP.activateByIndex( found.TABBED.index );
            }
        },

        // return the tab definition by its name, or null
        byName( name ){
            let found = null;
            self.APP.tabs().every(( tab ) => {
                if( tab.name === name ){
                    found = tab;
                }
                return found === null;
            });
            return found;
        },

        // return the tab definition by its tab-id, or null
        byTabId( id ){
            let found = null;
            self.APP.tabs.get().every(( tab ) => {
                if( tab.TABBED.tabid === id ){
                    found = tab;
                }
                return found === null;
            });
            return found;
        },

        // dump the tabs array, returning this same tabs array to allow chaining
        dump( orig, tabs ){
            if( 0 ){
                tabs.every(( t ) => {
                    console.debug( orig, t.TABBED );
                    return true;
                });
            }
            return tabs;
        },

        // enable/disable a tab by a nav attribute specified as { name: value }
        enableByAttribute( attribute, enabled ){
            const key = Object.keys( attribute )[0];
            const value = attribute[key];
            const index = self.$( '.tabbed-navs[data-tabbed-id="'+self.APP.myId+'"] .nav-link['+key+'="'+value+'"]' ).data( 'tabbed-index' );
            self.APP.enableByIndex( index, enabled );
        },

        // enable/disable a tab by its index
        enableByIndex( index, enabled ){
            const $nav = self.$( '.tabbed-navs[data-tabbed-id="'+self.APP.myId+'"] .nav-link[data-tabbed-index="'+index+'"]' )
            if( enabled ){
                $nav.removeClass( 'disabled' );
            } else {
                $nav.addClass( 'disabled' );
            }
        },

        // enable/disable a tab by its current nav label
        enableByLabel( label, enabled ){
            const index = self.$( '.tabbed-navs[data-tabbed-id="'+self.APP.myId+'"] .nav-link :contains("'+label+'")' ).data( 'tabbed-index' );
            self.APP.enableByIndex( index, enabled );
        },

        // enable/disable a tab by its name
        enableByName( name, enabled ){
            const found = self.APP.byName( name );
            if( found ){
                self.APP.enableByIndex( found.TABBED.index, enabled );
            }
        },

        // returns the jQuery objects which correspond to the first child of each pane
        //  (which is expected to be the application component for the pane)
        firstPaneChildren(){
            return self.$( '.tabbed-template[data-tabbed-id="'+self.APP.myId+'"] > * > * > * > * > .tab-pane > :first-child' );
        },

        // returns the list of tabs
        //  we only regenerate an identifier if the tab was not already present
        getTabs( dataContext ){
            const o = ( dataContext || Template.currentData()).tabs;
            const tabs = _.isFunction( o ) ? o() : o;
            // index and identify each tab
            for( let i=0 ; i<tabs.length ; ++i ){
                if( !tabs[i].TABBED ){
                    const id = Random.id();
                    tabs[i].TABBED = {
                        id: id,
                        tabid: 'tabbed-t-'+id,
                        paneid: 'tabbed-p-'+id,
                        name: self.APP.tabName( tabs[i] )
                    };
                }
                tabs[i].TABBED.index = i;
            }
            return( tabs );
        },

        // whether tabs are vertical ?
        isVertical(){
            const pos = self.APP.navPosition.get();
            return pos === 'top' || pos === 'bottom';
        },

        // returns the tab label
        navLabel( tab ){
            return _.toString( _.isFunction( tab.navLabel ) ? tab.navLabel() : tab.navLabel );
        },

        // returns the pane template
        paneTemplate( tab ){
            return _.toString( _.isFunction( tab.paneTemplate ) ? tab.paneTemplate() : tab.paneTemplate );
        },

        // returns the tab name
        tabName( tab ){
            return _.toString( _.isFunction( tab.tabName ) ? tab.name() : tab.tabName );
        },

        // returns the name associated with this tabbed template
        tabbedName(){
            const a = Template.currentData().name;
            return _.toString( _.isFunction( a ) ? a() : a );
        },

        // advertize the child panes of a tab transition
        //  it is expected the event will bubble up to here and to our parents
        tabTransition( event, $targets, current, field, related ){
            const myid = self.$( current ).closest( '.tabbed-navs' ).data( 'tabbed-id' );
            if( myid === self.APP.myId ){
                const tabid = self.$( current ).prop( 'id' );
                const found = self.APP.byTabId( tabid );
                if( found ){
                    // update the active tab for next reload and HMR
                    self.APP.activeTab.set( found.TABBED.index );
                    // advertize all direct .tab-pane's children
                    const data = {
                        tabbedId: myid,
                        tabbedName: self.APP.tabbedName(),
                        tab: { ...found }
                    };
                    // search the related tab if any
                    const relatedTab = self.APP.byTabId( self.$( related ).prop( 'id' ));
                    if( field && related ){
                        data[field] = { ...relatedTab };
                    }
                    //console.debug( 'trigerring', event, data, $targets );
                    $targets.trigger( event, data );
                } else {
                    console.warn( 'myId', myid, 'tabid not found', tabid );
                }
            }
        }
    };

    // compute the nav position
    self.autorun(() => {
        self.APP.navPosition.set( Template.currentData().navPosition || 'top' );
    });

    // track last active tab from session storage
    self.autorun(() => {
        const name = self.APP.tabbedName();
        if( name && name.length ){
            self.APP.activeTab.set( parseInt( sessionStorage.getItem( name+':activeTab' )) || 0 );
        }
    });

    // make sure session storage is updated each time the active tab changes
    self.autorun(() => {
        const activeTab = self.APP.activeTab.get();
        const name = self.APP.tabbedName();
        if(name && name.length && _.isFinite( activeTab )){
            sessionStorage.setItem( name+':activeTab', activeTab );
        }
    });

    // reactively build the tabs
    self.autorun(() => {
        self.APP.tabs.set( self.APP.dump( 'build', self.APP.getTabs()));
    });
});

Template.Tabbed.onRendered( function(){
    const self = this;

    // advertize of our creation
    self.$( '.tabbed-template' ).trigger( 'tabbed-rendered', {
        tabbedId: self.APP.myId,
        tabbedName: self.APP.tabbedName(),
        $tabbed: self.$( '.tabbed-template[data-tabbed-id="'+self.APP.myId+'"]' )
    });

    // set the attributes on nav-link's if asked for
    self.autorun(() => {
        self.APP.tabs.get().every(( tab ) => {
            if( tab.navAttributes ){
                const o = tab.navAttributes;
                const oo = _.isFunction( o ) ? o() : o;
                if( oo ){
                    Object.keys( oo ).every(( key ) => {
                        self.$( '.tabbed-template .nav-link#'+tab.TABBED.tabid ).attr( key, oo[key] );
                        return true;
                    });
                }
            }
            return true;
        });
    });

    // activate the designated tab
    //  this also triggers the first 'shown.bs.tab' event which is good
    self.APP.activateByIndex( self.APP.activeTab.get());

    // track the tabs changes and trigger an event
    self.autorun(() => {
        if( self.APP.tabs.get()){
            self.$( '.tabbed-template' ).trigger( 'tabbed-changed', {
                tabbedId: self.APP.myId,
                tabbedName: self.APP.tabbedName(),
                $tabbed: self.$( '.tabbed-template[data-tabbed-id="'+self.APP.myId+'"]' )
            });
        }
    });
});

Template.Tabbed.helpers({
    // make the div height 100% when position is horizontal
    classes(){
        return Template.instance().APP.isVertical() ? '' : 'tabbed-h100';
    },
    // whether we have a sub-pane ?
    haveSubPane(){
        return this.paneSubTemplate?.length > 0;
    },
    // an identifier of this tabbed template
    myId(){
        return Template.instance().APP.myId;
    },
    // provide dynamic data context
    parmsSubData(){
        //return this.paneSubData || this;
        let o = null;
        if( this.paneSubData ){
            o = _.isFunction( this.paneSubData ) ? this.paneSubData() : this.paneSubData;
        } else {
            o = this;
        }
        return o;
    },
    // have a dynamic template
    parmsSubPane(){
        return this.paneSubTemplate;
    },
    // provides the tabs list
    parmsSubs(){
        return {
            APP: Template.instance().APP,
            dataContext: this
        };
    },
    posLeft(){
        return Template.instance().APP.navPosition.get() === 'left';
    },
    posTop(){
        return Template.instance().APP.navPosition.get() === 'top';
    },
    posVertical(){
        return Template.instance().APP.isVertical();
    }
});

Template.coreTabbedTemplate_nav.helpers({
    // whether this tab defaults to be visible at loading time ?
    ariaSelected( it ){
        return it.TABBED.index === this.APP.activeTab.get() ? 'true' : 'false';
    },
    // additional classes for the .nav element
    classes(){
        let str = 'nav-'+this.APP.navPosition.get();
        if( this.dataContext.navClasses ){
            str += ' '+this.dataContext.navClasses;
        }
        return str;
    },
    // whether we have something to display in this nav tab ?
    hasLabel( it ){
        return this.APP.navLabel( it ).length > 0;
    },
    // whether we have something to display in this nav tab ?
    hasTemplate( it ){
        return it.navTemplate;
    },
    // add some classes to the nav-link's
    linkClasses( it ){
        return this.dataContext.navLinkClasses || '';
    },
    // an identifier of this tabbed template
    myId(){
        return this.APP.myId;
    },
    // provides the data (if any) associated with the template for this tab
    navData( it ){
        const o = _.isFunction( it.navData ) ? it.navData() : it.navData;
        return {
            ...o,
            tabbedId: this.APP.myId,
            tabbedTabId: it.TABBED.id
        };
    },
    // provides the label (if an) associated with this tab
    navLabel( it ){
        return this.APP.navLabel( it ) || '';
    },
    // provides the template (if any) associated with this tab
    navTemplate( it ){
        return _.isFunction( it.navTemplate ) ? it.navTemplate() : it.navTemplate;
    },
    // returns the tabs list
    tabs(){
        return this.APP.tabs.get();
    }
});

Template.coreTabbedTemplate_pane.helpers({
    // whether we have something to display in this pane ?
    hasTemplate( it ){
        return this.APP.paneTemplate( it ).length > 0;
    },
    // an identifier of this tabbed template
    myId(){
        return this.APP.myId;
    },
    // provides the data associated to this template
    paneData( it ){
        const o = _.isFunction( it.paneData ) ? it.paneData() : it.paneData;
        return {
            ...o,
            tabbedId: this.APP.myId,
            tabbedTabId: it.TABBED.id
        };
    },
    // provides the template associated with this pane
    paneTemplate( it ){
        return this.APP.paneTemplate( it );
    },
    // returns the tabs list
    tabs(){
        return this.APP.tabs.get();
    }
});

Template.Tabbed.events({
    // note that several tabbed-template may be imbricated - we must only deal with ours and not with those bubbling from lower tabbed-template's
    // hide.bs.tab is the first event triggered during the tab transition
    //  event.target and event.relatedTarget target the current active tab and the new-to-be-activated tab (if available) respectively
    'hide.bs.tab .tabbed-template'( event, instance ){
        instance.APP.tabTransition( 'tabbed-pane-to-hide', instance.APP.firstPaneChildren(), event.target, 'next', event.relatedTarget );
    },

    // show.bs.tab is the second event triggered during the tab transition
    //  event.target and event.relatedTarget target the active tab and the previously active tab (if available) respectively
    'show.bs.tab .tabbed-template'( event, instance ){
        instance.APP.tabTransition( 'tabbed-pane-to-show', instance.APP.firstPaneChildren(), event.target, 'prev', event.relatedTarget );
    },

    // hidden.bs.tab is the last-but-one event triggered during the tab transition
    //  event.target and event.relatedTarget target the just hidden tab and the new-to-be-activated tab (if available) respectively
    'hidden.bs.tab .tabbed-template'( event, instance ){
        instance.APP.tabTransition( 'tabbed-pane-hidden', instance.APP.firstPaneChildren(), event.target, 'next', event.relatedTarget );
    },

    // shown.bs.tab is the last event triggered during the tab transition
    //  event.target and event.relatedTarget target the active tab and the previously active tab (if available) respectively
    'shown.bs.tab .tabbed-template'( event, instance ){
        instance.APP.tabTransition( 'tabbed-pane-shown', instance.APP.firstPaneChildren(), event.target, 'prev', event.relatedTarget );
    },

    // a request to activate a tab
    'tabbed-do-activate .tabbed-template'( event, instance, data ){
        if( data.tabbedId === instance.APP.myId ){
            if( _.isNumber( data.index )){
                instance.APP.activateByIndex( data.index );
            } else if( data.label ){
                instance.APP.activateByLabel( data.label );
            } else if( data.name ){
                instance.APP.activateByName( data.name );
            } else if( data.attribute ){
                instance.APP.activateByAttribute( data.attribute );
            }
        }
        return false;
    },

    // a request to enable/disable a tab
    'tabbed-do-enable .tabbed-template'( event, instance, data ){
        if( data.tabbedId === instance.APP.myId ){
            if( _.isNumber( data.index )){
                instance.APP.enableByIndex( data.index, data.enabled );
            } else if( data.label ){
                instance.APP.enableByLabel( data.label, data.enabled );
            } else if( data.name ){
                instance.APP.enableByName( data.name, data.enabled );
            } else if( data.attribute ){
                instance.APP.enableByAttribute( data.attribute, data.enabled );
            }
        }
        return false;
    }
});

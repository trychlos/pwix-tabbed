/*
 * pwix:tabbed/src/client/components/panes/panes.js
 *
 * see README
 */

import _ from 'lodash';

import './panes.html';

Template.panes.helpers({
    // whether we have something to display in this pane ?
    hasTemplate( it ){
        return this.TABBED.paneTemplate( it ).length > 0;
    },
    // reming to panes how are navs oriented
    navClasses(){
        let str = 'nav-'+this.TABBED.instance.get().navPosition();
        return str;
    },
    // provides the data associated to this template
    paneData( it ){
        const o = _.isFunction( it.paneData ) ? it.paneData() : it.paneData;
        return {
            ...o,
            tabbedId: this.TABBED.instance.get().id(),
            tabbedTabId: it.TABBED.id
        };
    },
    // provides the template associated with this pane
    paneTemplate( it ){
        return this.TABBED.paneTemplate( it );
    },
    // the identifier of this tabbed template
    tabbedId(){
        return this.TABBED.instance.get().id();
    },
    // the name of this tabbed template
    tabbedName(){
        return this.TABBED.instance.get().name();
    },
    // returns the tabs list
    tabs(){
        return this.TABBED.tabs.get();
    }
});

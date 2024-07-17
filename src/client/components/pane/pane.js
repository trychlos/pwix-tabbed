/*
 * pwix:tabbed/src/client/components/pane/pane.js
 *
 * see README
 */

import _ from 'lodash';

import './pane.html';

Template.pane.helpers({
    // whether we have something to display in this pane ?
    hasTemplate( it ){
        return this.TABBED.paneTemplate( it ).length > 0;
    },
    // an identifier of this tabbed template
    myId(){
        return this.TABBED.myId;
    },
    // reming to panes how are navs oriented
    navClasses(){
        let str = 'nav-'+this.TABBED.navPosition.get();
        return str;
    },
    // provides the data associated to this template
    paneData( it ){
        const o = _.isFunction( it.paneData ) ? it.paneData() : it.paneData;
        return {
            ...o,
            tabbedId: this.TABBED.myId,
            tabbedTabId: it.TABBED.id
        };
    },
    // provides the template associated with this pane
    paneTemplate( it ){
        return this.TABBED.paneTemplate( it );
    },
    // returns the tabs list
    tabs(){
        return this.TABBED.tabs.get();
    }
});

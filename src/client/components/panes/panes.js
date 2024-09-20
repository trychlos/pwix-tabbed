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
        return Boolean( it.TABBED.tab.paneTemplate());
    },
    // provides the data associated to this template
    paneData( it ){
        let dc = it.TABBED.tab.paneData() || this.TABBED.instance.get().dataContext() || this.dataContext;
        _.merge( dc, {
            tabbedId: this.TABBED.instance.get().id(),
            tabbedTabId: it.TABBED.tab.id()
        });
        return dc;
    },
    // the pane-identifier of this tab
    paneId( it ){
        return it.TABBED.tab.paneId();
    },
    // provides the template associated with this pane
    paneTemplate( it ){
        return it.TABBED.tab.paneTemplate();
    },
    // the identifier of this tab
    tabId( it ){
        return it.TABBED.tab.id();
    },
    // the name of this tab
    tabName( it ){
        return it.TABBED.tab.name();
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
        return this.TABBED.instance.get().tabs();
    }
});

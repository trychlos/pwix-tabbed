/*
 * pwix:tabbed/src/client/components/navs/navs.js
 *
 * see README
 */

import _ from 'lodash';

import './navs.html';

Template.navs.helpers({
    // whether this tab defaults to be visible at loading time ?
    ariaSelected( it ){
        return it.TABBED.index === this.TABBED.activeTab.get() ? 'true' : 'false';
    },
    // whether we have something to display in this nav tab ?
    hasLabel( it ){
        return Boolean( it.TABBED.tab.navLabel());
    },
    // whether we have something to display in this nav tab ?
    hasTemplate( it ){
        return Boolean( it.TABBED.tab.navTemplate());
    },
    // add some classes to the nav-item's
    // wants the hidden tabs be still initialized
    // actually the pane is hidden (i.e. still initialized) but the nav is not displayed to prevent a hole in the line
    itemClasses( it ){
        let classes = [];
        classes.push( this.TABBED.instance.get().navItemClasses());
        classes.push( it.TABBED.tab.navItemClasses());
        if( !it.TABBED.tab.shown()){
            classes.push( 'ui-dnone' );
        }
        return classes.join( ' ' );
    },
    // add some classes to the nav-link's
    linkClasses( it ){
        let classes = [];
        classes.push( this.TABBED.instance.get().navLinkClasses());
        classes.push( it.TABBED.tab.navLinkClasses());
        if( !it.TABBED.tab.enabled()){
            classes.push( 'disabled' );
        }
        return classes.join( ' ' );
    },
    // additional classes for the .nav element
    navClasses(){
        let classes = [];
        classes.push( 'nav-'+this.TABBED.instance.get().navPosition());
        classes.push( this.TABBED.instance.get().navClasses());
        return classes.join( ' ' );
    },
    // provides the data (if any) associated with the template for this tab
    navData( it ){
        let dc = it.TABBED.tab.navData() || it.TABBED.tab.paneData() || this.TABBED.instance.get().dataContext() || this.dataContext;
        _.merge( dc, {
            tabbedId: this.TABBED.instance.get().id(),
            tabbedTabId: it.TABBED.tab.id()
        });
        return dc;
    },
    // the nav-identifier of this tab
    navId( it ){
        return it.TABBED.tab.navId();
    },
    // provides the label (if any) associated with this tab
    navLabel( it ){
        return this.TABBED.navLabel( it ) || '';
    },
    // provides the template (if any) associated with this tab
    navTemplate( it ){
        return it.TABBED.tab.navTemplate();
    },
    // the pane-identifier of this tab
    paneId( it ){
        return it.TABBED.tab.paneId();
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

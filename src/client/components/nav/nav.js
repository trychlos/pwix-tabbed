/*
 * pwix:tabbed/src/client/components/nav/nav.js
 *
 * see README
 */

import _ from 'lodash';

import './nav.html';

Template.nav.helpers({
    // whether this tab defaults to be visible at loading time ?
    ariaSelected( it ){
        return it.TABBED.index === this.TABBED.activeTab.get() ? 'true' : 'false';
    },
    // whether we have something to display in this nav tab ?
    hasLabel( it ){
        return this.TABBED.navLabel( it ).length > 0;
    },
    // whether we have something to display in this nav tab ?
    hasTemplate( it ){
        return it.navTemplate;
    },
    // add some classes to the nav-item's
    itemClasses( it ){
        let classes = [];
        if( this.dataContext.navItemClasses ){
            classes.push( this.dataContext.navItemClasses );
        }
        if( it.navItemClasses ){
            classes.push( it.navItemClasses );
        }
        return classes.join( ' ' );
    },
    // add some classes to the nav-link's
    linkClasses( it ){
        let classes = [];
        if( this.dataContext.navLinkClasses ){
            classes.push( this.dataContext.navLinkClasses );
        }
        if( it.navLinkClasses ){
            classes.push( it.navLinkClasses );
        }
        return classes.join( ' ' );
    },
    // an identifier of this tabbed template
    myId(){
        return this.TABBED.myId;
    },
    // additional classes for the .nav element
    navClasses(){
        let str = 'nav-'+this.TABBED.navPosition.get();
        if( this.dataContext.navClasses ){
            str += ' '+this.dataContext.navClasses;
        }
        return str;
    },
    // provides the data (if any) associated with the template for this tab
    navData( it ){
        const o = _.isFunction( it.navData ) ? it.navData() : it.navData;
        return {
            ...o,
            tabbedId: this.TABBED.myId,
            tabbedTabId: it.TABBED.id
        };
    },
    // provides the label (if an) associated with this tab
    navLabel( it ){
        return this.TABBED.navLabel( it ) || '';
    },
    // provides the template (if any) associated with this tab
    navTemplate( it ){
        return _.isFunction( it.navTemplate ) ? it.navTemplate() : it.navTemplate;
    },
    // returns the tabs list
    tabs(){
        return this.TABBED.tabs.get();
    }
});

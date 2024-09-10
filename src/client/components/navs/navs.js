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
    // additional classes for the .nav element
    navClasses(){
        let str = 'nav-'+this.TABBED.instance.get().navPosition();
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
            tabbedId: this.TABBED.instance.get().id(),
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

# pwix:tabbed

## ChangeLog

### 1.5.1-rc

    Release date: 

    - Fix the visibility of the hidden tabs
    - Minor spelling fixes
    - Store the active tab in localStorage instead of sessionStorage

### 1.5.0

    Release date: 2024-10- 4

    - Add shown parameter to the tab definition, thus bumping minor candidate version number
    - Fix tab-pane margin top to not be added to tabbed-navs margin bottom
    - package.js refactoring
    - Fix next tab activating computing
    - Unshown tabs are initialized
    - Define new 'activateTab' parameter
    - Fix configuration overrides
    - Define new 'tabbed-do-show' event
    - Change the default nav data context to the same than the pane

### 1.4.0

    Release date: 2024- 9-20

    - No more use a ReactiveVar as an instanciation argument
    - Fix re-use bug (izIAM #113)
    - Introduce Tabbed.Instance.setTabbedParms() method to let the callers reactively updates the Tabbed parameters, thus bumping minor candidate version number
    - Fix data context transmission
    - Fix first tab activation when it is disabled

### 1.3.0

    Release date: 2024- 9-13

    - Make the stylesheet more precise to not override over links
    - Introduce Tabbed.Instance class, thus bumping minor candidate version number
    - Introduce Tabbed.C.Position constants
    - Rename tabbed-template topmost class to Tabbed
    - Improve disabled links stylesheet
    - Make tab enabled() a reactive data source

### 1.2.2

    Release date: 2024- 8-14

    - Have a debug helper
    - Fix vertical tabbed stylesheet

### 1.2.1

    Release date: 2024- 7-18

    - Split nav and pane components on their own source files
    - Remove unused data context parameter when initializing the tabs

### 1.2.0

    Release date: 2024- 7-11

    - Introduce trace module
    - Define navItemClasses attribute, bumping minor candidate version number
    - Have distinct (and cumulative) classes per nav-item and for all the nav-tabs
    - Define tabbed-do-activate-same new event

### 1.1.0

    Release date: 2024- 7- 1

    - Review tabs layout to get panes of 100% height
    - Update README
    - Update TODO
    - Remove (unused) DOM code
    - Tabbed.configure() becomes a reactive data source, bumping minor candidate version number

### 1.0.0

    Release date: 2024- 6-10

    - Initial release

---
P. Wieser
- Last updated on 2024, Oct. 4th

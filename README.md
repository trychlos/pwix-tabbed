# pwix:tabbed

## What is it ?

A Blaze component which provides a consistent tabbed display.

The tabbed navs and panes are Bootstrap-based.

Here, 'consistent' means that all panes will have the same height (respectively the same width) regarding of their content.

## Installation

This Meteor package is installable with the usual command:

```sh
    meteor add pwix:tabbed
```

## Usage

In your `.html` template:

```html
    {{> Tabbed name="myInstance" }}
```

In your `.js` code:

```js
    Template.my_template.onRendered( function(){
        const tabbed = new Tabbed.Instance( 'myName', {
            ...
        });
    });
```

## Provides

### `Tabbed`

The exported `Tabbed` global object provides following items:

#### Classes

##### `Tabbed.Instance()`

A class to be instanciated for each displayed `Tabbed` component.

Each instance must be uniquely named, and will be used to define and interact with the corresponding `Tabbed` Blaze component.

###### Instanciation

The class must be instanciated with its name, then feed with its data context, as:

```js
    const tabbed = new Tabbed.Instance( this<BlazeInstance>, { name: name<String|Function> });

    // in order to be reactive to changes, the parms should be managed through a ReactiveVar
    this.autorun(() => {
        tabbed.setTabbedParms( reactiveParms.get());
    });
```

with at instanciation time:

- `this`: the current Blaze.TemplateInstance instance

- `name`

    The name which uniquely identifies this Tabbed instance at runtime

    This name is mandatory, and let us uniquely associate the `Tabbed.Instance` instance with the Blaze component view. This is the mechanism which let instance methods interact with the UI. It is read from the `Tabbed` template data context.

and when settings the `Tabbed.Instance` parameters:

- `dataContext`

    An optional common data context to be passed to all panes.

    Can be superseded on the per-pane basis via the `paneData` below parameter.

- `activateLastTab`

    Whether to keep the last active pane in local storage, defaulting to `true`.

- `activateTab`

    The tab to activate at startup, defaulting to last tab if the `activateLastTab` is set to `true`, defaulting to the first tab.

- `navClasses`

    Classes to be added to each `ul.nav` element.

- `navItemClasses`

    Classes to be added to each `li.nav-item` element.

- `navLinkClasses`

    Classes to be added to each `button.nav-link` element.

- `navPosition`

    Defines where the `navs` are relatively to the `panes`.
    
    May be one the following values:

    - `Tabbed.C.Position.TOP`
    - `Tabbed.C.Position.RIGHT`
    - `Tabbed.C.Position.BOTTOM`
    - `Tabbed.C.Position.LEFT`

    Defaults to `Tabbed.C.Position.TOP`.

- `paneClasses`

    Classes to be added to each `tab-pane` element.

- `paneSubTemplate`

    The name of a Blaze template to be added to the bottom of the `panes`.

- `paneSubData`

    A data context object to be passed to the above `paneSubTemplate` sub-template.

- `tabs`

    An optional array with the list of tabs.

    Each tab is defined with an object with following keys:

    - `name`

        The optional name of the tab.

        Defaults to paneTemplate name.

        Though all randomly generated names can be later be got by the application, this may be rather cumbersome. We strongly suggest to attribute a name to all tabs you want explicitely manage.

    - `enabled`

        Whether this `tab` is enabled, defaulting to `true`.

    - `navLabel`

        The optional `nav` label, as a HTML string.

        Defaults to the `tab` name.

    - `navAttributes`

        An optional object which define attributes to be added to the `nav-link` element where each attribute is expected to be defined as `{ name: value }`.

    - `navTemplate`

        The name of an optional template to be displayed as the `nav` content (besides of the label if one is specified).

    - `navData`

        An optional data context specific to be passed to the above `navTemplate`, defaulting to pane data context.

    - `navItemClasses`

        Classes to be added to this `li.nav-item` element.

    - `navLinkClasses`

        Classes to be added to this `button.nav-link` element.

    - `paneTemplate`

        The name of the pane template name.

        Defaults to none.

    - `paneData`

        An optional data context to be passed to the above `paneTemplate`, defaulting to `dataContext`, which itself defaults to the `Tabbed` component data context.

    - `shown`

        Whether this tab is shown, defaulting to `true`.

    `Tabbed` generates a unique random identifier for each tab, which is derived both in the nav and pane parts.

All above parameters can be specified either with the expected value, or with a function which returns such a value.

###### Tabbed.Instance.get( parm<String> )

`parm` is a dotted-string with following structure:

- the parameter to be set, or `tab` to address a particular tab, or `tabs` to address all the tabs as a whole

- maybe the name of the tab

- maybe the parameter to be set for this tab.

###### Tabbed.Instance.set( parm<String>, value<Any> )

###### Tabbed.Instance.setTabbedParms( parms<Object> )

Let the caller reactively update the parameters of the `Tabbed` Blaze component.

#### Functions

##### `Tabbed.configure()`

See [below](#configuration).

A reactive data source.

##### `Tabbed.i18n.namespace()`

Returns the i18n namespace used by the package. Used to add translations at runtime.

### Blaze components

#### `Tabbed`

A consistent tabbed Blaze component.

It accepts following parameters:

- `name`

    An optional name

    If the name actually addresses an already instanciated `Tabbed.Instance`, then all parameters are taken from the named instance, and other parameters passed in the component data context are just ignored.

If the name doesn't address any `Tabbed.Instance`, or the component is not named, then all parameters accepted at `Tabbed.Instance` class instanciation can be provided as the component data context.

#### Data context

This `Tabbed` component increases the data context passed to navTemplate's and paneTemplate's with datas:

- `tabbedId`: the identifier of the 'Tabbed' component
- `tabbedTabId`: the identifier of each tab, same whether we display a nav-link or a tab-pane

#### Events

The component handles following events:
- `tabbed-do-activate`, data={ tabbedId, index } ask to activate the tab by its index
- `tabbed-do-activate`, data={ tabbedId, label } ask to activate the tab by its current nav label
- `tabbed-do-activate`, data={ tabbedId, name } ask to activate the tab by its name
- `tabbed-do-activate`, data={ tabbedId, attribute } ask to activate the tab by the specified nav attribute
- `tabbed-do-activate-same`, data={ tabbedId } ask to re-send the activation event on the same tab
- `tabbed-do-enable`, data={ tabbedId, index, enabled } ask to enable/disable the tab by its index
- `tabbed-do-enable`, data={ tabbedId, label, enabled } ask to enable/disable the tab by its current nav label
- `tabbed-do-enable`, data={ tabbedId, name, enabled } ask to enable/disable the tab by its name
- `tabbed-do-enable`, data={ tabbedId, attribute, enabled } ask to enable/disable the tab by the specified nav attribute
- `tabbed-do-show`, data={ tabbedId, index, shown } ask to show/hide the tab by its index
- `tabbed-do-show`, data={ tabbedId, label, shown } ask to show/hide the tab by its current nav label
- `tabbed-do-show`, data={ tabbedId, name, shown } ask to show/hide the tab by its name
- `tabbed-do-show`, data={ tabbedId, attribute, shown } ask to show/hide the tab by the specified nav attribute
   where 'tabbed' is expected to be the internal identifier of this tabbed template

The component triggers following events:

- on itself (and bubble up to the parents)

    - `tabbed-rendered`, data={ tabbedId, tabbedName, $tabbed } when the Tabbed component has been rendered

    - `tabbed-changed`, data={ tabbedId, tabbedName, $tabbed } when the tabs population has changed

- on every `.tab-pane` first child, which happens to be the topmost component of the pane template:

    - `tabbed-pane-to-hide`, data={ tabbedId, tabbedName, tab:<tab_object>, next:<tab_object> } when about to leave a tab

    - `tabbed-pane-to-show`, data={ tabbedId, tabbedName, tab:<tab_object>, prev:<tab_object> } when a new tab is about to be shown

    - `tabbed-pane-hidden`, data={ tabbedId, tabbedName, tab:<tab_object>, next:<tab_object> } when a tab has left

    - `tabbed-pane-shown`, data={ tabbedId, tabbedName, tab:<tab_object>, prev:<tab_object> } when a tab has been shown

##### Identifiers management

We dynamically allocate random identifiers for:

- the `Tabbed` parent component itself, advertized as 'data-tabbed-id' in the DOM, and as `tabbedId` in events and children data contexts

- each tab, advertized as 'data-tabbed-tab-id' in the DOM, and as `tabbedTabId` in children data contexts.

##### Dynamically removing tabs

When dynamically removing tabs, because you have provided less tabs in the `Tabbed` data context, you should be conscious that Blaze introduces somes asynchronicities, and that - as such - the to-be-removed tab helpers will still be re-run before the view be actually destroyed.

When using such a feature, you should take care of protecting your code by checking that the tabs are still alive.

See, for example, `pwix:validity`.

## Configuration

The package's behavior can be configured through a call to the `Tabbed.configure()` method, with just a single javascript object argument, which itself should only contains the options you want override.

Known configuration options are:

- `verbosity`

    Define the expected verbosity level.

    The accepted value can be any or-ed combination of following:

    - `Tabbed.C.Verbose.NONE`

        Do not display any trace log to the console

    - `Tabbed.C.Verbose.CONFIGURE`

        Trace `Tabbed.configure()` calls and their result

    - `Tabbed.C.Verbose.FUNCTIONS`

        Trace all functions calls

    Defaults to `Tabbed.C.Verbose.CONFIGURE`.

Please note that `Tabbed.configure()` method should be called in the same terms both in client and server sides.

Remind too that Meteor packages are instanciated at application level. They are so only configurable once, or, in other words, only one instance has to be or can be configured. Additionnal calls to `Tabbed.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

`Tabbed.configure()` is a reactive data source.

## NPM peer dependencies

Starting with v 0.1.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`.

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.5.0:

```js
    'lodash': '^4.17.0'
```

Each of these dependencies should be installed at application level:

```sh
    meteor npm install <package> --save
```

## Translations

New and updated translations are willingly accepted, and more than welcome. Just be kind enough to submit a PR on the [Github repository](https://github.com/trychlos/pwix-core-app/pulls).

## Cookies and comparable technologies

On named tabs, `pwix:tabbed` uses `sessionStorage` to record the last activated tab.

Because this is dynamically done on a per tabbed display unit basis, and only if this later is named, the package doesn't advertize of this use, relying on the caller own declaration.

## Issues & help

In case of support or error, please report your issue request to our [Issues tracker](https://github.com/trychlos/pwix-tabbed/issues).

---
P. Wieser
- Last updated on 2024, Oct. 4th

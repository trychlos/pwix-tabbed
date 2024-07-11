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

In your .html template:

```html
    {{> Tabbled (parmsTabbed) }}
```

In your Blaze helper:

```js
    parmsTabbed(){
        ..
    }
```

## Provides

### `Tabbed`

The exported `Tabbed` global object provides following items:

#### Functions

##### `Tabbed.configure()`

See [below](#configuration).

A reactive data source.

##### `Tabbed.i18n.namespace()`

Returns the i18n namespace used by the package. Used to add translations at runtime.

### Blaze components

#### `Tabbed`

Display a consistent tabbed component.

It accepts following parameters:

- `tabs`, an array of the tabs, or a function which returns such an array, each item being an object:

    - `navLabel`: if set, the HTML nav label, or a function which returns such a string

    - `navAttributes`: if set, an object, or a function which returns such an object, which define attributes to be added to the `nav-link` element
        where each attribute is expected to be defined as `{ name: value }`

    - `navTemplate`: if set, a template to be attached as the nav content (besides of the label if one is specified)

    - `navData`: if set, the data to be attached to the navTemplate, or a function which returns such a thing

    - `navItemClasses`: classes to be added to this li.nav-item element

    - `navLinkClasses`: classes to be added to this button.nav-link element

    - `paneTemplate`: if set, the pane template name, or a function which returns such a name

    - `paneData`: if set, the data to be passed to the paneTemplate, or a function which returns such a thing

    - `tabName`: if set, the name of the tab, or a function which returns such a name

- `name`: if set, the name used to read/write active tab into/from local storage, or a function which returns such a name

- `navPosition`: may be 'bottom', 'top', 'left' or 'right'
    defaulting to 'top'

- `navClasses`: classes to be added to each ul.nav element

- `navItemClasses`: classes to be added to each li.nav-item element

- `navLinkClasses`: classes to be added to each button.nav-link element

- `paneSubTemplate`: if set, the name of a template to add below the panes

- `paneSubData`: if set, the data context to be passed to this sub-template, defaulting to this Tabbed data context

This `Tabbed` component increases the data context passed to navTemplate's and paneTemplate's with datas:

- `tabbedId`: the identifier of the 'Tabbed' component
- `tabbedTabId`: the identifier of each tab, same whether we display a nav-link or a tab-pane

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
   where 'tabbed' is expected to be the internal identifier of this tabbed template

The component triggers following events:
- on itself (and bubble up to the parents)
    - `tabbed-rendered`, data={ tabbedId, tabbedName, $tabbed } when the Tabbed component is rendered
    - `tabbed-changed`, data={ tabbedId, tabbedName, $tabbed } when the tabs population has changed

- on every .tab-pane first child
    - `tabbed-pane-to-hide`, data={ tabbedId, tabbedName, tab:<tab_object>, next:<tab_object> } when about to leave a tab
    - `tabbed-pane-to-show`, data={ tabbedId, tabbedName, tab:<tab_object>, prev:<tab_object> } when a new tab is about to be shown
    - `tabbed-pane-hidden`, data={ tabbedId, tabbedName, tab:<tab_object>, next:<tab_object> } when a tab has left
    - `tabbed-pane-shown`, data={ tabbedId, tabbedName, tab:<tab_object>, prev:<tab_object> } when a tab has been shown

##### Identifiers management

We dynamically allocate random identifiers for:
- the `Tabbed` component, advertized as 'data-tabbed-id' in the DOM, and as 'tabbedId' in children data contexts
- each tab, advertized as 'data-tabbed-tab-id' in the DOM, and as 'tabbedTabId' in children data contexts

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

Please note that `Tabbed.configure()` method should be called in the same terms both in client and server sides.

Remind too that Meteor packages are instanciated at application level. They are so only configurable once, or, in other words, only one instance has to be or can be configured. Addtionnal calls to `Tabbed.configure()` will just override the previous one. You have been warned: **only the application should configure a package**.

`Tabbed.configure()` is a reactive data source.

## NPM peer dependencies

Starting with v 0.1.0, and in accordance with advices from [the Meteor Guide](https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies), we no more hardcode NPM dependencies in the `Npm.depends` clause of the `package.js`.

Instead we check npm versions of installed packages at runtime, on server startup, in development environment.

Dependencies as of v 1.1.0:

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

`pwix:tabbed` may use `localStorage` to record ...

Because this is dynamically done on a per dialog basis, and only on the caller request, the package doesn't advertize of this use, relying on the caller own declaration.

## Issues & help

In case of support or error, please report your issue request to our [Issues tracker](https://github.com/trychlos/pwix-tabbed/issues).

---
P. Wieser
- Last updated on 2024, Jul. 1st

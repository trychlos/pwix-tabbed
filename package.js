Package.describe({
    name: 'pwix:tabbed',
    version: '1.5.0',
    summary: 'A Blaze component which provides a consistent tabbed display',
    git: 'https://github.com/trychlos/pwix-tabbed.git',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'Tabbed'
    ]);
    api.mainModule( 'src/client/js/index.js', 'client' );
    api.mainModule( 'src/server/js/index.js', 'server' );
});

Package.onTest( function( api ){
    configure( api );
    api.use( 'tinytest' );
    api.use( 'pwix:tabbed' );
    api.mainModule( 'test/js/index.js' );
});

function configure( api ){
    api.versionsFrom([ '2.9.0', '3.0' ]);
    api.use( 'check' );
    api.use( 'blaze-html-templates@2.0.0 || 3.0.0-alpha300.0', 'client' );
    api.use( 'ecmascript' );
    api.use( 'less@4.0.0', 'client' );
    api.use( 'pwix:ui-bootstrap5@2.0.0' );
    api.use( 'random' );
    api.use( 'reactive-var' );
    api.use( 'tmeasday:check-npm-versions@1.0.2 || 2.0.0-beta.0', 'server' );
    api.use( 'tracker' );
    //api.use( 'tracker', 'client' );
    api.addFiles( 'src/client/components/Tabbed/Tabbed.js', 'client' );
}

// NPM dependencies are checked in /src/server/js/check_npms.js
// See also https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies

/*
 * pwix:tabbed/src/common/js/trace.js
 */

_verbose = function( level ){
    if( Tabbed.configure().verbosity & level ){
        let args = [ ...arguments ];
        args.shift();
        console.debug( ...args );
    }
};

_trace = function( functionName ){
    _verbose( Tabbed.C.Verbose.FUNCTIONS, ...arguments );
};

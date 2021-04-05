"use strict";
///////////////////////////////////////////////////////////////////////////////
const jersi = { };
jersi.__initModuleCalled = false;

jersi.__initModule = function(){

    if ( jersi.__initModuleCalled ) return;
    jersi.__initModuleCalled = true;

    // Init required packages
    jersi.debug.__initModule();
    jersi.draw.__initModule();
    jersi.presenter.__initModule();
    jersi.rules.__initModule();

    // Init inner classes
    // None

    // Hide the pleaseWait message
    if ( true ) {
        document.getElementById( "jersi_text_pleaseWait" ).style.display = "none";
    }

    jersi.debug.writeMessage( "jersi.__initModule(): done" );
};
///////////////////////////////////////////////////////////////////////////////

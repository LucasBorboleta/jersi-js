"use strict";
///////////////////////////////////////////////////////////////////////////////
jersi.debug = { };
jersi.debug.__initModuleCalled = false;

jersi.debug.__initModule = function(){

    if ( jersi.debug.__initModuleCalled ) return;
    jersi.debug.__initModuleCalled = true;

    // Init required modules
    // None

    // Init inner classes
    // None

    jersi.debug.zone = document.getElementById( "jersi_debugZone" );
    jersi.debug.messages = document.getElementById( "jersi_debug_messages" );
    jersi.debug.mousePosition = document.getElementById( "jersi_debug_mousePosition" );

    jersi.debug.messageCount = 0;
    jersi.debug.is_enabled = false;
    jersi.debug.enable(jersi.debug.is_enabled);
};

jersi.debug.assert = function(condition, message){
    if ( typeof message === "undefined" ) {
        message = "[look at javascript console]";
    }

    console.assert(condition, message);
    if ( ! condition ) {
        jersi.debug.writeMessage("assertion failed: " + message);
    }
};

jersi.debug.clearMessages = function(){
    jersi.debug.messages.innerHTML = "" ;
};

jersi.debug.debug = function(){
    jersi.debug.is_enabled = ! jersi.debug.is_enabled;
    jersi.debug.enable(jersi.debug.is_enabled);
};

jersi.debug.enable = function(condition){
    jersi.debug.is_enabled = condition;

    if ( ! jersi.debug.is_enabled ) {
        jersi.debug.clearMessages();
    }

    if ( jersi.debug.is_enabled ) {
        jersi.debug.zone.style.display = "inherit";
    } else {
        jersi.debug.zone.style.display = "none";
    }
};

jersi.debug.writeMessage = function(text){
    if ( jersi.debug.is_enabled ) {
        jersi.debug.messageCount += 1 ;

        jersi.debug.messages.innerHTML = jersi.debug.messageCount + ":" +
                                              text + "<br/>" + jersi.debug.messages.innerHTML;
    }
};

jersi.debug.writeMousePosition = function(x, y){
    jersi.debug.mousePosition.innerHTML = "Mouse(x,y) = (" + x + ", " + y + ")" ;
};
///////////////////////////////////////////////////////////////////////////////

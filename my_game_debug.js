"use strict";
///////////////////////////////////////////////////////////////////////////////
my_game.debug = { };
my_game.debug.__initModuleCalled = false;

my_game.debug.__initModule = function(){

    if ( my_game.debug.__initModuleCalled ) return;
    my_game.debug.__initModuleCalled = true;

    // Init required modules
    // None

    // Init inner classes
    // None

    my_game.debug.zone = document.getElementById( "my_game_debugZone" );
    my_game.debug.messages = document.getElementById( "my_game_debug_messages" );
    my_game.debug.mousePosition = document.getElementById( "my_game_debug_mousePosition" );

    my_game.debug.messageCount = 0;
    my_game.debug.isEnabled = true;
};

my_game.debug.assert = function(condition, message){
    if ( typeof message === "undefined" ) {
        message = "[look at javascript console]";
    }

    console.assert(condition, message);
    if ( ! condition ) {
        my_game.debug.writeMessage("assertion failed: " + message);
    }
};

my_game.debug.clearMessages = function(){
    my_game.debug.messages.innerHTML = "" ;
};

my_game.debug.enable = function(condition){
    my_game.debug.isEnabled = condition;

    if ( ! my_game.debug.isEnabled ) {
        my_game.debug.clearMessages();
    }

    if ( my_game.debug.isEnabled ) {
        my_game.debug.zone.style.display = "inherit";
    } else {
        my_game.debug.zone.style.display = "none";
    }
};

my_game.debug.writeMessage = function(text){
    if ( my_game.debug.isEnabled ) {
        my_game.debug.messageCount += 1 ;

        my_game.debug.messages.innerHTML = my_game.debug.messageCount + ":" +
                                              text + "<br/>" + my_game.debug.messages.innerHTML;
    }
};

my_game.debug.writeMousePosition = function(x, y){
    my_game.debug.mousePosition.innerHTML = "Mouse(x,y) = (" + x + ", " + y + ")" ;
};
///////////////////////////////////////////////////////////////////////////////

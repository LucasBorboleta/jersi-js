"use strict";
///////////////////////////////////////////////////////////////////////////////
const my_game = { };
my_game.__initModuleCalled = false;

my_game.__initModule = function(){

    if ( my_game.__initModuleCalled ) return;
    my_game.__initModuleCalled = true;

    // Init required packages
    my_game.debug.__initModule();
    my_game.debug.enable( true );

    my_game.draw.__initModule();
    my_game.presenter.__initModule();
    my_game.rules.__initModule();

    // Init inner classes
    // None

    // Hide the pleaseWait message
    if ( true ) {
        document.getElementById( "my_game_text_pleaseWait" ).style.display = "none";
    }

    my_game.debug.writeMessage( "my_game.__initModule(): done" );
};

my_game.start = function(){
    my_game.presenter.start();
};
///////////////////////////////////////////////////////////////////////////////

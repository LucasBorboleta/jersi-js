"use strict";
/* JERSI-JS-COPYRIGHT-MD-BEGIN
# COPYRIGHT

The software JERSI-JS implements the rules of JERSI, which is an abstract/strategy board game. This copyright notice only covers the software JERSI-JS. The copyright of the JERSI rules and board game concept can be found at https://github.com/LucasBorboleta/jersi.

Copyright (C) 2021 Lucas Borboleta (lucas.borboleta@free.fr).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.

JERSI-JS-COPYRIGHT-MD-END */
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

jersi.debug.tryEncoding = function() {

    let padZero = function(s, n){
        if ( s.length < n ) {
            return (n - s.length)*'0' + s;
        } else {
            return s;
        }
    };

    const move_key = Math.floor(Math.random()*16*16);
    const move_type = Math.floor(Math.random()*10);
    const move_cells = [Math.floor(Math.random()*69), Math.floor(Math.random()*69), Math.floor(Math.random()*69), Math.floor(Math.random()*69)];
    jersi.debug.writeMessage( "move_key=" + move_key + ", move_type=" + move_type + ", move_cells=" + move_cells );

    // Encode the sequence move_type + move_cells in, respectiveley, 4 bits and 4*7bits
    let move_code = "";
    move_code = move_code + padZero(move_key.toString(2), 8);
    move_code = move_code + padZero(move_type.toString(2), 4);
    move_code = move_code + padZero(move_cells[0].toString(2), 7);
    move_code = move_code + padZero(move_cells[1].toString(2), 7);
    move_code = move_code + padZero(move_cells[2].toString(2), 7);
    //move_code = move_code + padZero(move_cells[3].toString(2), 7);

    // Convert as string hexadecimal
    const move_code_string = parseInt(move_code, 2).toString(36);
    jersi.debug.writeMessage( "move_code=" + move_code + ", length=" + move_code.length +
                            ", move_code_string=" + move_code_string + ", length=" + move_code_string.length);
    jersi.debug.writeMessage( move_code.substr(0, 8) );
    jersi.debug.writeMessage( move_code.substr(8, 4) );
    jersi.debug.writeMessage( move_code.substr(12, 7) );
    jersi.debug.writeMessage( move_code.substr(19, 7) );
    jersi.debug.writeMessage( move_code.substr(26, 7) );
    //jersi.debug.writeMessage( move_code.substr(33, 7) );
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

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
const jersi = { };
jersi.__initModuleCalled = false;

jersi.__initModule = function(){

    if ( jersi.__initModuleCalled ) return;
    jersi.__initModuleCalled = true;

    // Init required packages
    jersi.debug.__initModule();
    jersi.debug.enable (true);

    jersi.draw.__initModule();
    jersi.presenter.__initModule();
    jersi.rules.__initModule();

    // Init inner classes
    // None

    // Hide the pleaseWait message
    if ( true ) {
        document.getElementById( "jersi_text_pleaseWait" ).style.display = "none";
    }

    if ( false ) {
         jersi.debug.tryEncoding();
     }

    jersi.debug.writeMessage( "jersi.__initModule(): done" );
};
///////////////////////////////////////////////////////////////////////////////

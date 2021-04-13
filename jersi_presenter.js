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
jersi.presenter = { };
jersi.presenter.__initModuleCalled = false;

jersi.presenter.__initModule = function(){

    if ( jersi.presenter.__initModuleCalled ) return;
    jersi.presenter.__initModuleCalled = true;

    // Init required modules
    jersi.debug.__initModule();
    jersi.draw.__initModule();
    jersi.rules.__initModule();

    // Init inner classes
    // None

    jersi.presenter.source_cell = null;
    jersi.presenter.destination_cell = null;
    jersi.presenter.source_cube_selected = false;
    jersi.presenter.source_stack_selected = false;

    jersi.presenter.ok_button = document.getElementById( "jersi_button_ok" );
    jersi.presenter.undo_button = document.getElementById( "jersi_button_undo" );

    jersi.presenter.enable_ok_button(false);
    jersi.presenter.enable_undo_button(false);

    jersi.debug.writeMessage( "jersi.presenter.__initModule(): done" );
};

// --- JERSI_BEGIN: commands ---

jersi.presenter.clearSelection = function(){
    jersi.presenter.source_cell = null;
    jersi.presenter.destination_cell = null;

    jersi.presenter.source_cube_selected = false;
    jersi.presenter.source_stack_selected = false;
};

jersi.presenter.enable_ok_button = function(condition){
    this.ok_button.disabled = ( ! condition );
};

jersi.presenter.ok = function(){
    jersi.rules.saveGame();
    jersi.presenter.enable_ok_button(false);
    jersi.presenter.enable_undo_button(false);
};

jersi.presenter.restartGame = function(){
    jersi.presenter.clearSelection();
    jersi.rules.restartGame();
    jersi.draw.updateAllCellsDiv();
    jersi.presenter.enable_ok_button(false);
    jersi.presenter.enable_undo_button(false);
};

jersi.presenter.selectCell = function(cell_index){

    if ( ! jersi.rules.game_is_running ) {
        return;
    }

    const cell = jersi.rules.cells[cell_index];

    if ( jersi.presenter.source_cell == null && jersi.presenter.destination_cell == null ) {

        if ( jersi.rules.isSelectableSourceCell(cell) ) {

            jersi.presenter.source_cell = cell;
            jersi.draw.selectCellDiv(jersi.presenter.source_cell, true);

            if ( jersi.rules.cellHasSelectableStack(jersi.presenter.source_cell) ) {
                jersi.presenter.source_stack_selected = true;
                jersi.draw.selectCellStackDiv(jersi.presenter.source_cell, true);

            } else if ( jersi.rules.cellHasSelectableCube(jersi.presenter.source_cell) ) {
                jersi.presenter.source_cube_selected = true;
                jersi.draw.selectCellCubeDiv(jersi.presenter.source_cell, true);
            }
        }

    } else if ( jersi.presenter.destination_cell == null && jersi.presenter.source_cell != cell ) {

        if ( jersi.rules.isSelectableDestinationCell(cell) ) {

            jersi.presenter.destination_cell = cell;
            jersi.draw.selectCellDiv(jersi.presenter.destination_cell, true);

            if ( jersi.presenter.source_stack_selected ) {
                jersi.presenter.source_stack_selected = false;
                jersi.draw.selectCellStackDiv(jersi.presenter.source_cell, false);
                jersi.draw.playMoveSound();
                jersi.rules.moveStack(jersi.presenter.source_cell, jersi.presenter.destination_cell);
                jersi.presenter.enable_ok_button(true);
                jersi.presenter.enable_undo_button(true);

            } else if ( jersi.presenter.source_cube_selected ) {
                jersi.presenter.source_cube_selected = false;
                jersi.draw.selectCellCubeDiv(jersi.presenter.source_cell, false);
                jersi.draw.playMoveSound();
                jersi.rules.moveCube(jersi.presenter.source_cell, jersi.presenter.destination_cell);
                jersi.presenter.enable_ok_button(true);
                jersi.presenter.enable_undo_button(true);
            }

            jersi.draw.selectCellDiv(jersi.presenter.source_cell, false);
            jersi.draw.selectCellDiv(jersi.presenter.destination_cell, false);
            jersi.presenter.source_cell = null;
            jersi.presenter.destination_cell = null;

            jersi.draw.updateAllCellsDiv();
        }

    } else if ( jersi.presenter.source_cell == cell && jersi.presenter.destination_cell == null ) {

        if ( jersi.presenter.source_stack_selected ) {

            jersi.presenter.source_stack_selected = false;
            jersi.draw.selectCellStackDiv(jersi.presenter.source_cell, false);

            if ( jersi.rules.cellHasSelectableCube(jersi.presenter.source_cell) ) {
                jersi.presenter.source_cube_selected = true;
                jersi.draw.selectCellCubeDiv(jersi.presenter.source_cell, true);
            }

        } else if ( jersi.presenter.source_cube_selected ) {

            jersi.presenter.source_cube_selected = false;
            jersi.draw.selectCellCubeDiv(jersi.presenter.source_cell, false);
            jersi.draw.selectCellDiv(jersi.presenter.source_cell, false);
            jersi.presenter.source_cell = null;
        }
    }
};

jersi.presenter.startGame = function(){
    jersi.rules.startGame();

    jersi.draw.makeAllCellsDiv();
    jersi.draw.makeAllCubesDiv();

    jersi.presenter.restartGame();
};

jersi.presenter.undo = function(){
    jersi.presenter.clearSelection();
    jersi.rules.loadGame();
    jersi.draw.updateAllCellsDiv();
    jersi.presenter.enable_ok_button(false);
    jersi.presenter.enable_undo_button(false);
};

jersi.presenter.enable_undo_button = function(condition){
    this.undo_button.disabled = ( ! condition );
};

// --- JERSI_END: commands ---

//////////////////////////////////////////////////////////////////////////

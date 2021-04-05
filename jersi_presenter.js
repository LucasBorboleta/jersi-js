"use strict";
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

// --- JERSI_END: setters ---

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
                jersi.rules.moveStack(jersi.presenter.source_cell, jersi.presenter.destination_cell);
                jersi.presenter.enable_ok_button(true);
                jersi.presenter.enable_undo_button(true);

            } else if ( jersi.presenter.source_cube_selected ) {
                jersi.presenter.source_cube_selected = false;
                jersi.draw.selectCellCubeDiv(jersi.presenter.source_cell, false);
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

// --- JERSI_END: getters ---

// --- JERSI_BEGIN: starters and savers ---

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

// --- JERSI_END: starters and savers ---

jersi.presenter.clearSelection = function(){
    jersi.presenter.source_cell = null;
    jersi.presenter.destination_cell = null;

    jersi.presenter.source_cube_selected = false;
    jersi.presenter.source_stack_selected = false;
};
//////////////////////////////////////////////////////////////////////////

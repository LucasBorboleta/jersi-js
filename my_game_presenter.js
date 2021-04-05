"use strict";
///////////////////////////////////////////////////////////////////////////////
my_game.presenter = { };
my_game.presenter.__initModuleCalled = false;

my_game.presenter.__initModule = function(){

    if ( my_game.presenter.__initModuleCalled ) return;
    my_game.presenter.__initModuleCalled = true;

    // Init required modules
    my_game.debug.__initModule();
    my_game.draw.__initModule();
    my_game.rules.__initModule();

    // Init inner classes
    // None

    my_game.presenter.source_cell = null;
    my_game.presenter.destination_cell = null;
    my_game.presenter.source_cube_selected = false;
    my_game.presenter.source_stack_selected = false;

    my_game.presenter.ok_button = document.getElementById( "my_game_button_ok" );
    my_game.presenter.undo_button = document.getElementById( "my_game_button_undo" );

    my_game.presenter.enable_ok_button(false);
    my_game.presenter.enable_undo_button(false);

    my_game.debug.writeMessage( "my_game.presenter.__initModule(): done" );
};

// --- MY_GAME_END: setters ---

my_game.presenter.selectCell = function(cell_index){

    if ( ! my_game.rules.game_is_running ) {
        return;
    }

    const cell = my_game.rules.cells[cell_index];

    if ( my_game.presenter.source_cell == null && my_game.presenter.destination_cell == null ) {

        if ( my_game.rules.isSelectableSourceCell(cell) ) {

            my_game.presenter.source_cell = cell;
            my_game.draw.selectCellDiv(my_game.presenter.source_cell, true);

            if ( my_game.rules.cellHasSelectableStack(my_game.presenter.source_cell) ) {
                my_game.presenter.source_stack_selected = true;
                my_game.draw.selectCellStackDiv(my_game.presenter.source_cell, true);

            } else if ( my_game.rules.cellHasSelectableCube(my_game.presenter.source_cell) ) {
                my_game.presenter.source_cube_selected = true;
                my_game.draw.selectCellCubeDiv(my_game.presenter.source_cell, true);
            }
        }

    } else if ( my_game.presenter.destination_cell == null && my_game.presenter.source_cell != cell ) {

        if ( my_game.rules.isSelectableDestinationCell(cell) ) {

            my_game.presenter.destination_cell = cell;
            my_game.draw.selectCellDiv(my_game.presenter.destination_cell, true);

            if ( my_game.presenter.source_stack_selected ) {
                my_game.presenter.source_stack_selected = false;
                my_game.draw.selectCellStackDiv(my_game.presenter.source_cell, false);
                my_game.rules.moveStack(my_game.presenter.source_cell, my_game.presenter.destination_cell);
                my_game.presenter.enable_ok_button(true);
                my_game.presenter.enable_undo_button(true);

            } else if ( my_game.presenter.source_cube_selected ) {
                my_game.presenter.source_cube_selected = false;
                my_game.draw.selectCellCubeDiv(my_game.presenter.source_cell, false);
                my_game.rules.moveCube(my_game.presenter.source_cell, my_game.presenter.destination_cell);
                my_game.presenter.enable_ok_button(true);
                my_game.presenter.enable_undo_button(true);
            }

            my_game.draw.selectCellDiv(my_game.presenter.source_cell, false);
            my_game.draw.selectCellDiv(my_game.presenter.destination_cell, false);
            my_game.presenter.source_cell = null;
            my_game.presenter.destination_cell = null;

            my_game.draw.updateAllCellsDiv();
        }

    } else if ( my_game.presenter.source_cell == cell && my_game.presenter.destination_cell == null ) {

        if ( my_game.presenter.source_stack_selected ) {

            my_game.presenter.source_stack_selected = false;
            my_game.draw.selectCellStackDiv(my_game.presenter.source_cell, false);

            if ( my_game.rules.cellHasSelectableCube(my_game.presenter.source_cell) ) {
                my_game.presenter.source_cube_selected = true;
                my_game.draw.selectCellCubeDiv(my_game.presenter.source_cell, true);
            }

        } else if ( my_game.presenter.source_cube_selected ) {

            my_game.presenter.source_cube_selected = false;
            my_game.draw.selectCellCubeDiv(my_game.presenter.source_cell, false);
            my_game.draw.selectCellDiv(my_game.presenter.source_cell, false);
            my_game.presenter.source_cell = null;
        }
    }
};

// --- MY_GAME_END: getters ---

// --- MY_GAME_BEGIN: starters and savers ---

my_game.presenter.enable_ok_button = function(condition){
    this.ok_button.disabled = ( ! condition );
};

my_game.presenter.ok = function(){
    my_game.rules.saveGame();
    my_game.presenter.enable_ok_button(false);
    my_game.presenter.enable_undo_button(false);
};

my_game.presenter.restartGame = function(){
    my_game.presenter.clearSelection();
    my_game.rules.restartGame();
    my_game.draw.updateAllCellsDiv();
    my_game.presenter.enable_ok_button(false);
    my_game.presenter.enable_undo_button(false);
};

my_game.presenter.startGame = function(){
    my_game.rules.startGame();

    my_game.draw.makeAllCellsDiv();
    my_game.draw.makeAllCubesDiv();

    my_game.presenter.restartGame();
};

my_game.presenter.undo = function(){
    my_game.presenter.clearSelection();
    my_game.rules.loadGame();
    my_game.draw.updateAllCellsDiv();
    my_game.presenter.enable_ok_button(false);
    my_game.presenter.enable_undo_button(false);
};

my_game.presenter.enable_undo_button = function(condition){
    this.undo_button.disabled = ( ! condition );
};

// --- MY_GAME_END: starters and savers ---

my_game.presenter.clearSelection = function(){
    my_game.presenter.source_cell = null;
    my_game.presenter.destination_cell = null;

    my_game.presenter.source_cube_selected = false;
    my_game.presenter.source_stack_selected = false;
};
//////////////////////////////////////////////////////////////////////////

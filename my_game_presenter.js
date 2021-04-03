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

    my_game.debug.writeMessage( "my_game.presenter.__initModule(): done" );
};

my_game.presenter.start = function(){
    my_game.debug.writeMessage( "my_game.presenter.start(): done" );
};

my_game.presenter.selectCell = function(cell_index){
    const cell = my_game.rules.cells[cell_index];

    if ( my_game.presenter.source_cell == null && my_game.presenter.destination_cell == null ) {

        if ( my_game.rules.canBeSourceCell(cell) ) {

            my_game.presenter.source_cell = cell;
            my_game.draw.selectCell(my_game.presenter.source_cell, true);

            if ( my_game.rules.cellHasStack(my_game.presenter.source_cell) ) {
                my_game.draw.selectCellStack(my_game.presenter.source_cell, true);
                my_game.presenter.source_stack_selected = true;

            } else if ( my_game.rules.cellHasCube(my_game.presenter.source_cell) ) {
                my_game.draw.selectCellCube(my_game.presenter.source_cell, true);
                my_game.presenter.source_cube_selected = true;
            }
            my_game.debug.writeMessage( "my_game.presenter.selectCell(): source_cell cell.name=" + cell.name );

        } else {
            my_game.debug.writeMessage( "my_game.presenter.selectCell(): ignored empty cell.name=" + cell.name );
        }

    } else if ( my_game.presenter.destination_cell == null && my_game.presenter.source_cell != cell ) {

        if ( my_game.rules.canBeDestinationCell(cell) ) {

            my_game.presenter.destination_cell = cell;
            my_game.draw.selectCell(my_game.presenter.destination_cell, true);
            my_game.debug.writeMessage( "my_game.presenter.selectCell(): destination_cell cell.name=" + cell.name );

            if ( my_game.presenter.source_stack_selected ) {
                my_game.rules.moveStack(my_game.presenter.source_cell, my_game.presenter.destination_cell);

            } else if ( my_game.presenter.source_cube_selected ) {
                my_game.rules.moveCube(my_game.presenter.source_cell, my_game.presenter.destination_cell);
            }

            my_game.draw.selectCell(my_game.presenter.source_cell, false);
            my_game.draw.selectCell(my_game.presenter.destination_cell, false);
            my_game.presenter.source_cell = null;
            my_game.presenter.destination_cell = null;
            my_game.presenter.source_stack_selected = false;
            my_game.presenter.source_cube_selected = false;

            my_game.draw.updateAllCells();

        } else {
            my_game.debug.writeMessage( "my_game.presenter.selectCell(): ignored empty cell.name=" + cell.name );
        }

    } else if ( my_game.presenter.source_cell == cell && my_game.presenter.destination_cell == null ) {
        my_game.draw.selectCell(my_game.presenter.source_cell, false);

        if ( my_game.rules.cellHasStack(my_game.presenter.source_cell) ) {
            my_game.draw.selectCellStack(my_game.presenter.source_cell, false);

        } else {
            my_game.draw.selectCellCube(my_game.presenter.source_cell, false);
        }

        my_game.presenter.source_cell = null;
        my_game.debug.writeMessage( "my_game.presenter.selectCell(): source_cell null" );

    } else if ( my_game.presenter.destination_cell == cell && my_game.presenter.source_cell != null ) {
        my_game.draw.selectCell(my_game.presenter.destination_cell, false);
        my_game.presenter.destination_cell = null;
        my_game.debug.writeMessage( "my_game.presenter.selectCell(): destination_cell null" );

    } else {
        my_game.debug.writeMessage( "my_game.presenter.selectCell(): ignored cell.name=" + cell.name );
    }
};

//////////////////////////////////////////////////////////////////////////

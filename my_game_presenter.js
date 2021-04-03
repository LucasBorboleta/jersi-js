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
    my_game.presenter.source_top = null;
    my_game.presenter.source_bottom = null;
    my_game.presenter.destination_cell = null;

    my_game.debug.writeMessage( "my_game.presenter.__initModule(): done" );
};

my_game.presenter.start = function(){
    my_game.debug.writeMessage( "my_game.presenter.start(): done" );
};

my_game.presenter.selectCell = function(cell_index){
    const cell = my_game.rules.cells[cell_index];
    const cell_div = my_game.draw.cells_div[cell_index];

    if ( my_game.presenter.source_cell == null && my_game.presenter.destination_cell == null ) {

        if ( ! my_game.rules.iSEmptyCell(cell) ) {
            my_game.presenter.source_cell = cell;
            my_game.draw.selectedCellDiv(cell_div, true);
            if ( my_game.presenter.source_cell.top != null ) {
                my_game.draw.selectedCellCubesDiv(my_game.presenter.source_cell, true, true);

            } else {
                my_game.draw.selectedCellCubesDiv(my_game.presenter.source_cell, false, true);
            }
            my_game.debug.writeMessage( "my_game.presenter.selectCell(): source_cell cell.name=" + cell.name );

        } else {
            my_game.debug.writeMessage( "my_game.presenter.selectCell(): ignored empty cell.name=" + cell.name );
        }

    } else if ( my_game.presenter.destination_cell == null && my_game.presenter.source_cell != cell ) {

        if ( my_game.rules.iSEmptyCell(cell) ) {
            my_game.presenter.destination_cell = cell;
            my_game.draw.selectedCellDiv(cell_div, true);
            my_game.debug.writeMessage( "my_game.presenter.selectCell(): destination_cell cell.name=" + cell.name );

            my_game.rules.moveCell(my_game.presenter.source_cell, my_game.presenter.destination_cell);

            {
                const cell_source_div = my_game.draw.cells_div[my_game.presenter.source_cell.index];
                const cell_destination_div = my_game.draw.cells_div[my_game.presenter.destination_cell.index];
                my_game.draw.selectedCellDiv(cell_source_div, false);
                my_game.draw.selectedCellDiv(cell_destination_div, false);
            }

            my_game.presenter.source_cell = null;
            my_game.presenter.destination_cell = null;
            my_game.draw.setAllCellsDiv();

        } else {
            my_game.debug.writeMessage( "my_game.presenter.selectCell(): ignored empty cell.name=" + cell.name );
        }

    } else if ( my_game.presenter.source_cell == cell && my_game.presenter.destination_cell == null ) {
        my_game.draw.selectedCellDiv(cell_div, false);
        if ( my_game.presenter.source_cell.top != null ) {
            my_game.draw.selectedCellCubesDiv(my_game.presenter.source_cell, false, false);

        } else {
            my_game.draw.selectedCellCubesDiv(my_game.presenter.source_cell, false, false);
        }

        my_game.presenter.source_cell = null;
        my_game.debug.writeMessage( "my_game.presenter.selectCell(): source_cell null" );

    } else if ( my_game.presenter.destination_cell == cell && my_game.presenter.source_cell != null ) {
        my_game.presenter.destination_cell = null;
        my_game.draw.selectedCellDiv(cell_div, false);
        my_game.debug.writeMessage( "my_game.presenter.selectCell(): destination_cell null" );

    } else {
        my_game.debug.writeMessage( "my_game.presenter.selectCell(): ignored cell.name=" + cell.name );
    }
};

//////////////////////////////////////////////////////////////////////////

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
jersi.rules = { };
jersi.rules.__initModuleCalled = false;

jersi.rules.__initModule = function(){

    if ( jersi.rules.__initModuleCalled ) return;
    jersi.rules.__initModuleCalled = true;

    // Init required modules
    jersi.debug.__initModule();

    // Init inner classes
    // None

    jersi.rules.xLabels = "123456789".split("");
    jersi.rules.yLabels = "abcdefghi".split("").reverse();
    jersi.debug.assert(jersi.rules.xLabels.length === jersi.rules.yLabels.length, "xLabels.length === yLabels.length");

    jersi.rules.xIndices = Array.from(jersi.rules.xLabels.keys());
    jersi.rules.yIndices = Array.from(jersi.rules.yLabels.keys());

    jersi.rules.cellsPerSide = jersi.rules.xIndices.length;

    jersi.rules.CubeColor = { WHITE:0, BLACK:1 };
    jersi.rules.CubeSort = { FOOL:0, KING:1, MOUNTAIN:2, PAPER:3, ROCK:4, SCISSORS:5, WISE:6 };
    jersi.rules.CubeState = { ACTIVATED:0, CAPTURED:1, RESERVED:2 };

    jersi.rules.CubeLabel = []
    jersi.rules.CubeLabel[jersi.rules.CubeColor.WHITE] = []
    jersi.rules.CubeLabel[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.FOOL] = 'F';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.KING] = 'K';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.MOUNTAIN] = 'M';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.PAPER] = 'P';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.ROCK] = 'R';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.SCISSORS] = 'S';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.WISE] = 'W';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.BLACK] = []
    jersi.rules.CubeLabel[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.FOOL] = 'f';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.KING] = 'k';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.MOUNTAIN] = 'm';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.PAPER] = 'p';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.ROCK] = 'r';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.SCISSORS] = 's';
    jersi.rules.CubeLabel[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.WISE] = 'w';

    jersi.rules.cells = [];
    jersi.rules.cells_states = [];
    jersi.rules.saved_cells_states = null;

    jersi.rules.cubes = [];
    jersi.rules.cubes_states = [];
    jersi.rules.saved_cubes_states = null;

    jersi.rules.game_is_running = false;

    jersi.debug.writeMessage( "jersi.rules.__initModule(): done" );
};

// --- JERSI_BEGIN: getters ---

jersi.rules.cellHasCube = function(cell){
    const cell_state = jersi.rules.cells_states[cell.index];
    return cell_state.bottom != null || cell_state.top != null;
};

jersi.rules.cellHasSelectableCube = function(cell){
    return jersi.rules.cellHasCube(cell);
};

jersi.rules.cellHasSelectableStack = function(cell){
    return jersi.rules.cellHasStack(cell);
};

jersi.rules.cellHasStack = function(cell){
    const cell_state = jersi.rules.cells_states[cell.index];
    return cell_state.bottom != null && cell_state.top != null;
};

jersi.rules.getCell = function(cell_name){
    return jersi.rules.cells.find(function(cell, index, array){ return cell.name === cell_name; });
};

jersi.rules.getCube = function(cube_name){
    return jersi.rules.cubes.find(function(cube, index, array){ return cube.name === cube_name; });
};

jersi.rules.getCubeColorAndSort = function(cube_label){
    for ( const cube_color of Object.values(jersi.rules.CubeColor) ) {
        for ( const cube_sort of Object.values(jersi.rules.CubeSort) ) {
            if ( jersi.rules.CubeLabel[cube_color][cube_sort] === cube_label ) {
                return {color: cube_color, sort: cube_sort};
            }
        }
    }
    jersi.debug.assert(false, "jersi.rules.getCubeColorAndSort(): failed");
};

jersi.rules.iSEmptyCell = function(cell){
    const cell_state = jersi.rules.cells_states[cell.index];
    return cell_state.bottom == null && cell_state.top == null;
};

jersi.rules.isSelectableDestinationCell = function(cell){
    return jersi.rules.iSEmptyCell(cell);
};

jersi.rules.isSelectableSourceCell = function(cell){
    return ! jersi.rules.iSEmptyCell(cell);
};

// --- JERSI_END: getters ---

// --- JERSI_BEGIN: makers ---

jersi.rules.makeAllCells = function(){

    // Row "a"
    jersi.rules.makeCell( 'a1', [-1, -4] );
    jersi.rules.makeCell( 'a2', [-0, -4] );
    jersi.rules.makeCell( 'a3', [1, -4] );
    jersi.rules.makeCell( 'a4', [2, -4] );
    jersi.rules.makeCell( 'a5', [3, -4] );
    jersi.rules.makeCell( 'a6', [4, -4] );
    jersi.rules.makeCell( 'a7', [5, -4] );

    jersi.rules.makeCell( 'a', [6, -4], true);

    // Row "b"
    jersi.rules.makeCell( 'b1', [-2, -3] );
    jersi.rules.makeCell( 'b2', [-1, -3] );
    jersi.rules.makeCell( 'b3', [0, -3] );
    jersi.rules.makeCell( 'b4', [1, -3] );
    jersi.rules.makeCell( 'b5', [2, -3] );
    jersi.rules.makeCell( 'b6', [3, -3] );
    jersi.rules.makeCell( 'b7', [4, -3] );
    jersi.rules.makeCell( 'b8', [5, -3] );

    jersi.rules.makeCell( 'b', [6, -3], true);

    // Row "c"
    jersi.rules.makeCell( 'c1', [-2, -2] );
    jersi.rules.makeCell( 'c2', [-1, -2] );
    jersi.rules.makeCell( 'c3', [0, -2] );
    jersi.rules.makeCell( 'c4', [1, -2] );
    jersi.rules.makeCell( 'c5', [2, -2] );
    jersi.rules.makeCell( 'c6', [3, -2] );
    jersi.rules.makeCell( 'c7', [4, -2] );

    jersi.rules.makeCell( 'c', [5, -2], true);

    // Row "d"
    jersi.rules.makeCell( 'd1', [-3, -1] );
    jersi.rules.makeCell( 'd2', [-2, -1] );
    jersi.rules.makeCell( 'd3', [-1, -1] );
    jersi.rules.makeCell( 'd4', [0, -1] );
    jersi.rules.makeCell( 'd5', [1, -1] );
    jersi.rules.makeCell( 'd6', [2, -1] );
    jersi.rules.makeCell( 'd7', [3, -1] );
    jersi.rules.makeCell( 'd8', [4, -1] );

    jersi.rules.makeCell( 'd', [5, -1], true);

    // Row "e"
    jersi.rules.makeCell( 'e1', [-4, 0] );
    jersi.rules.makeCell( 'e2', [-3, 0] );
    jersi.rules.makeCell( 'e3', [-2, 0] );
    jersi.rules.makeCell( 'e4', [-1, 0] );
    jersi.rules.makeCell( 'e5', [0, 0] );
    jersi.rules.makeCell( 'e6', [1, 0] );
    jersi.rules.makeCell( 'e7', [2, 0] );
    jersi.rules.makeCell( 'e8', [3, 0] );
    jersi.rules.makeCell( 'e9', [4, 0] );

    // Row "f"

    jersi.rules.makeCell( 'f', [-5, 1], true);

    jersi.rules.makeCell( 'f1', [-4, 1] );
    jersi.rules.makeCell( 'f2', [-3, 1] );
    jersi.rules.makeCell( 'f3', [-2, 1] );
    jersi.rules.makeCell( 'f4', [-1, 1] );
    jersi.rules.makeCell( 'f5', [0, 1] );
    jersi.rules.makeCell( 'f6', [1, 1] );
    jersi.rules.makeCell( 'f7', [2, 1] );
    jersi.rules.makeCell( 'f8', [3, 1] );

    // Row "g"
    jersi.rules.makeCell( 'g', [-5, 2], true);

    jersi.rules.makeCell( 'g1', [-4, 2] );
    jersi.rules.makeCell( 'g2', [-3, 2] );
    jersi.rules.makeCell( 'g3', [-2, 2] );
    jersi.rules.makeCell( 'g4', [-1, 2] );
    jersi.rules.makeCell( 'g5', [0, 2] );
    jersi.rules.makeCell( 'g6', [1, 2] );
    jersi.rules.makeCell( 'g7', [2, 2] );

    // Row "h"
    jersi.rules.makeCell( 'h', [-6, 3], true);

    jersi.rules.makeCell( 'h1', [-5, 3] );
    jersi.rules.makeCell( 'h2', [-4, 3] );
    jersi.rules.makeCell( 'h3', [-3, 3] );
    jersi.rules.makeCell( 'h4', [-2, 3] );
    jersi.rules.makeCell( 'h5', [-1, 3] );
    jersi.rules.makeCell( 'h6', [0, 3] );
    jersi.rules.makeCell( 'h7', [1, 3] );
    jersi.rules.makeCell( 'h8', [2, 3] );

    // Row "i"
    jersi.rules.makeCell( 'i', [-6, 4], true);

    jersi.rules.makeCell( 'i1', [-5, 4] );
    jersi.rules.makeCell( 'i2', [-4, 4] );
    jersi.rules.makeCell( 'i3', [-3, 4] );
    jersi.rules.makeCell( 'i4', [-2, 4] );
    jersi.rules.makeCell( 'i5', [-1, 4] );
    jersi.rules.makeCell( 'i6', [0, 4] );
    jersi.rules.makeCell( 'i7', [1, 4] );
}

jersi.rules.makeCell = function(cell_name, position_uv, reserve){

    if ( typeof reserve === "undefined" ) {
        reserve = false;
    };

    const cell = {
        index: jersi.rules.cells.length,
        u: position_uv[0],
        v: position_uv[1],
        name: cell_name,
        reserve: reserve
    };

    const cell_state = {
        index: cell.index,
        bottom: null,
        top: null
    };

    jersi.rules.cells.push(cell);
    jersi.rules.cells_states.push(cell_state);

    return  cell;
};

jersi.rules.makeAllCubes = function(){
    for ( const cube_color of Object.values(jersi.rules.CubeColor) ) {
        for ( const cube_sort of Object.values(jersi.rules.CubeSort) ) {

            let cube_sort_count = 0;
            if ( cube_sort === jersi.rules.CubeSort.ROCK ||
                 cube_sort === jersi.rules.CubeSort.PAPER ||
                 cube_sort === jersi.rules.CubeSort.SCISSORS ||
                 cube_sort === jersi.rules.CubeSort.MOUNTAIN ) { cube_sort_count = 4; }

            else if ( cube_sort === jersi.rules.CubeSort.FOOL ||
                      cube_sort === jersi.rules.CubeSort.WISE ) { cube_sort_count = 2; }

            else if ( cube_sort === jersi.rules.CubeSort.KING ) { cube_sort_count = 1; }

            for ( let cube_sort_index=1; cube_sort_index <= cube_sort_count; cube_sort_index++ ) {
                const cube_label = jersi.rules.CubeLabel[cube_color][cube_sort];
                const cube_name = cube_label + cube_sort_index;

                const cube = { color: cube_color,
                               sort: cube_sort,
                               label: cube_label,
                               name: cube_name,
                               index: jersi.rules.cubes.length };
                jersi.rules.cubes.push(cube);
                jersi.rules.cubes_states.push(jersi.rules.CubeState.CAPTURED);
            }
        }
    }
};

// --- JERSI_END: makers ---

// --- JERSI_BEGIN: setters ---

jersi.rules.clearCell = function(cell){
    const cell_state = jersi.rules.cells_states[cell.index];
    cell_state.bottom = null;
    cell_state.top = null;
}

jersi.rules.clearAllCells = function(){
    jersi.rules.cells.forEach(jersi.rules.clearCell);
};

jersi.rules.moveCube = function(cell_source, cell_destination){
    jersi.debug.assert( jersi.rules.cellHasCube(cell_source), "cell_source has cube");
    jersi.debug.assert( jersi.rules.iSEmptyCell(cell_destination), "cell_destination is empty");

    const cell_source_status = jersi.rules.cells_states[cell_source.index];
    const cell_destination_status = jersi.rules.cells_states[cell_destination.index];

    if ( cell_source_status.top != null ) {
        cell_destination_status.bottom = cell_source_status.top;
        cell_source_status.top = null;

    } else {
        cell_destination_status.bottom = cell_source_status.bottom;
        cell_source_status.bottom = null;
    }
};

jersi.rules.moveStack = function(cell_source, cell_destination){
    jersi.debug.assert( jersi.rules.cellHasStack(cell_source), "cell_source has stack");
    jersi.debug.assert( jersi.rules.iSEmptyCell(cell_destination), "cell_destination is empty");

    const cell_source_status = jersi.rules.cells_states[cell_source.index];
    const cell_destination_status = jersi.rules.cells_states[cell_destination.index];

    cell_destination_status.bottom = cell_source_status.bottom;
    cell_destination_status.top = cell_source_status.top;

    cell_source_status.bottom = null;
    cell_source_status.top = null;
};

jersi.rules.setCube = function(cell, cube){
    const cell_state = jersi.rules.cells_states[cell.index];

    if ( cell_state.bottom === null ) { cell_state.bottom = cube; }
    else if  ( cell_state.top === null ) { cell_state.top = cube; }
    else {
        jersi.debug.assert(false, "jersi.rules.setCube(): failed");
    }

    if ( cell.reserve ) {
        jersi.rules.cubes_states[cube.index] = jersi.rules.CubeState.RESERVED;
    } else {
        jersi.rules.cubes_states[cube.index] = jersi.rules.CubeState.ACTIVATED;
    }
};

jersi.rules.setAllCubes = function(){

    // whites

    jersi.rules.setCubeByLabels("b1", "F1");
    jersi.rules.setCubeByLabels("b8", "F2");
    jersi.rules.setCubeByLabels("a4", "K1");

    jersi.rules.setCubeByLabels("b2", "R1");
    jersi.rules.setCubeByLabels("b3", "P1");
    jersi.rules.setCubeByLabels("b4", "S1");
    jersi.rules.setCubeByLabels("b5", "R2");
    jersi.rules.setCubeByLabels("b6", "P2");
    jersi.rules.setCubeByLabels("b7", "S2");

    jersi.rules.setCubeByLabels("a3", "R3");
    jersi.rules.setCubeByLabels("a2", "S3");
    jersi.rules.setCubeByLabels("a1", "P3");
    jersi.rules.setCubeByLabels("a5", "S4");
    jersi.rules.setCubeByLabels("a6", "R4");
    jersi.rules.setCubeByLabels("a7", "P4");

    // blacks

    jersi.rules.setCubeByLabels("h1", "f1");
    jersi.rules.setCubeByLabels("h8", "f2");
    jersi.rules.setCubeByLabels("i4", "k1");

    jersi.rules.setCubeByLabels("h7", "r1");
    jersi.rules.setCubeByLabels("h6", "p1");
    jersi.rules.setCubeByLabels("h5", "s1");
    jersi.rules.setCubeByLabels("h4", "r2");
    jersi.rules.setCubeByLabels("h3", "p2");
    jersi.rules.setCubeByLabels("h2", "s2");

    jersi.rules.setCubeByLabels("i5", "r3");
    jersi.rules.setCubeByLabels("i6", "s3");
    jersi.rules.setCubeByLabels("i7", "p3");
    jersi.rules.setCubeByLabels("i3", "s4");
    jersi.rules.setCubeByLabels("i2", "r4");
    jersi.rules.setCubeByLabels("i1", "p4");

    // white reserve

    jersi.rules.setCubeByLabels("a", "M1");
    jersi.rules.setCubeByLabels("a", "M2");
    jersi.rules.setCubeByLabels("b", "M3");
    jersi.rules.setCubeByLabels("b", "M4");
    jersi.rules.setCubeByLabels("c", "W1");
    jersi.rules.setCubeByLabels("c", "W2");

    // black reserve

    jersi.rules.setCubeByLabels("i", "m1");
    jersi.rules.setCubeByLabels("i", "m2");
    jersi.rules.setCubeByLabels("h", "m3");
    jersi.rules.setCubeByLabels("h", "m4");
    jersi.rules.setCubeByLabels("g", "w1");
    jersi.rules.setCubeByLabels("g", "w2");
};

jersi.rules.setCubeByLabels = function(cell_name, cube_name){
    const cell = jersi.rules.getCell(cell_name);
    const cube = jersi.rules.getCube(cube_name);
    jersi.rules.setCube(cell, cube);
};

// --- JERSI_END: setters ---

// --- JERSI_BEGIN: starters and savers ---

jersi.rules.startGame = function(){
    jersi.rules.makeAllCells();
    jersi.rules.makeAllCubes();
    jersi.rules.restartGame();
};

jersi.rules.restartGame = function(){
    jersi.rules.clearAllCells();
    jersi.rules.setAllCubes();
    jersi.rules.saveGame();
    jersi.rules.game_is_running = true;
};

jersi.rules.saveGame = function(){
    jersi.rules.saveAllCellsStates();
    jersi.rules.saveAllCubesStates();
};

jersi.rules.saveCellState = function(cell_state, cell_index){
    const saved_cell_state = {bottom:cell_state.bottom, top:cell_state.top};
    jersi.rules.saved_cells_states[cell_index] = saved_cell_state;
}

jersi.rules.saveAllCellsStates = function(){

    if  ( jersi.rules.saved_cells_states === null ) {
        jersi.rules.saved_cells_states = Array.from(jersi.rules.cells_states);
        jersi.rules.saved_cells_states.fill(null);
    }

    jersi.rules.cells_states.forEach(jersi.rules.saveCellState);
};

jersi.rules.saveCubeState = function(cube_state, cube_index){
    const saved_cube_state = cube_state;
    jersi.rules.saved_cubes_states[cube_index] = saved_cube_state;
}

jersi.rules.saveAllCubesStates = function(){

    if  ( jersi.rules.saved_cubes_states === null ) {
        jersi.rules.saved_cubes_states = Array.from(jersi.rules.cubes_states);
        jersi.rules.saved_cubes_states.fill(null);
    }

    jersi.rules.cubes_states.forEach(jersi.rules.saveCubeState);
};

jersi.rules.loadGame = function(){
    jersi.rules.loadAllCellsStates();
    jersi.rules.loadAllCubeStates();
};

jersi.rules.loadCellState = function(saved_cell_state, cell_index){
    const cell_state = jersi.rules.cells_states[cell_index];
    cell_state.bottom = saved_cell_state.bottom;
    cell_state.top = saved_cell_state.top;
}

jersi.rules.loadAllCellsStates = function(){
    jersi.rules.saved_cells_states.forEach(jersi.rules.loadCellState);
};

jersi.rules.loadCubeState = function(saved_cube_state, cube_index){
    jersi.rules.saved_cubes_states[cube_index] = saved_cube_state;
}

jersi.rules.loadAllCubeStates = function(){
    jersi.rules.saved_cubes_states.forEach(jersi.rules.loadCubeState);
};

// --- JERSI_END: starters and savers ---

//////////////////////////////////////////////////////////////////////////

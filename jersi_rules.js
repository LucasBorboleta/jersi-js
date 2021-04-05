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
    jersi.rules.cubes = [];

    jersi.rules.saved_cells = [];

    jersi.rules.game_is_running = false;

    jersi.debug.writeMessage( "jersi.rules.__initModule(): done" );
};

// --- JERSI_BEGIN: getters ---

jersi.rules.cellHasCube = function(cell){
    return cell.bottom != null || cell.top != null;
};

jersi.rules.cellHasSelectableCube = function(cell){
    return jersi.rules.cellHasCube(cell);
};

jersi.rules.cellHasSelectableStack = function(cell){
    return jersi.rules.cellHasStack(cell);
};

jersi.rules.cellHasStack = function(cell){
    return cell.bottom != null && cell.top != null;
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
    return cell.bottom == null && cell.top == null;
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

    for ( const x of jersi.rules.xIndices ) {
        for ( const y of jersi.rules.yIndices ) {
            const cell_name = jersi.rules.yLabels[y] + jersi.rules.xLabels[x];
            const cell = {  index: jersi.rules.cells.length,
                            x: x,
                            y: y,
                            name: cell_name,
                            bottom: null,
                            top: null };
            jersi.rules.cells.push(cell);
        }
    }
}

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
            }
        }
    }
};

// --- JERSI_END: makers ---

// --- JERSI_BEGIN: setters ---

jersi.rules.clearCell = function(cell){ cell.bottom = null;  cell.top = null; }

jersi.rules.clearAllCells = function(){
    jersi.rules.cells.forEach(jersi.rules.clearCell);
};

jersi.rules.moveCube = function(cell_source, cell_destination){
    jersi.debug.assert( jersi.rules.cellHasCube(cell_source), "cell_source has cube");
    jersi.debug.assert( jersi.rules.iSEmptyCell(cell_destination), "cell_destination is empty");

    if ( cell_source.top != null ) {
        cell_destination.bottom = cell_source.top;
        cell_source.top = null;

    } else {
        cell_destination.bottom = cell_source.bottom;
        cell_source.bottom = null;
    }
};

jersi.rules.moveStack = function(cell_source, cell_destination){
    jersi.debug.assert( jersi.rules.cellHasStack(cell_source), "cell_source has stack");
    jersi.debug.assert( jersi.rules.iSEmptyCell(cell_destination), "cell_destination is empty");

    cell_destination.bottom = cell_source.bottom;
    cell_destination.top = cell_source.top;

    cell_source.bottom = null;
    cell_source.top = null;
};

jersi.rules.setCube = function(cell, cube){
    if ( cell.bottom === null ) { cell.bottom = cube; }
    else if  ( cell.top === null ) { cell.top = cube; }
    else {
        jersi.debug.assert(false, "jersi.rules.setCube(): failed");
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

    jersi.rules.setCubeByLabels("a9", "M1");
    jersi.rules.setCubeByLabels("a9", "M2");
    jersi.rules.setCubeByLabels("b9", "M3");
    jersi.rules.setCubeByLabels("b9", "M4");
    jersi.rules.setCubeByLabels("c9", "W1");
    jersi.rules.setCubeByLabels("c9", "W2");

    // black reserve

    jersi.rules.setCubeByLabels("i9", "m1");
    jersi.rules.setCubeByLabels("i9", "m2");
    jersi.rules.setCubeByLabels("h9", "m3");
    jersi.rules.setCubeByLabels("h9", "m4");
    jersi.rules.setCubeByLabels("g9", "w1");
    jersi.rules.setCubeByLabels("g9", "w2");
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
    jersi.rules.saveAllCells();
};

jersi.rules.saveCell = function(cell){
    const saved_cell = {cell:cell, bottom:cell.bottom, top:cell.top};
    jersi.rules.saved_cells.push(saved_cell);
}

jersi.rules.saveAllCells = function(){
    jersi.rules.saved_cells = [];
    jersi.rules.cells.forEach(jersi.rules.saveCell);
};

jersi.rules.loadGame = function(){
    jersi.rules.loadAllCells();
};

jersi.rules.loadCell = function(saved_cell){
    const cell = saved_cell.cell;
    cell.bottom = saved_cell.bottom;
    cell.top = saved_cell.top;
}

jersi.rules.loadAllCells = function(){
    jersi.rules.saved_cells.forEach(jersi.rules.loadCell);
};

// --- JERSI_END: starters and savers ---

//////////////////////////////////////////////////////////////////////////

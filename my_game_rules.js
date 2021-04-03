"use strict";
///////////////////////////////////////////////////////////////////////////////
my_game.rules = { };
my_game.rules.__initModuleCalled = false;

my_game.rules.__initModule = function(){

    if ( my_game.rules.__initModuleCalled ) return;
    my_game.rules.__initModuleCalled = true;

    // Init required modules
    my_game.debug.__initModule();

    // Init inner classes
    // None

    my_game.rules.xLabels = "123456789".split("");
    my_game.rules.yLabels = "abcdefghi".split("").reverse();
    my_game.debug.assert(my_game.rules.xLabels.length === my_game.rules.yLabels.length, "xLabels.length === yLabels.length");

    my_game.rules.xIndices = Array.from(my_game.rules.xLabels.keys());
    my_game.rules.yIndices = Array.from(my_game.rules.yLabels.keys());

    my_game.rules.cellsPerSide = my_game.rules.xIndices.length;

    my_game.rules.CubeColor = { WHITE:0, BLACK:1 };
    my_game.rules.CubeSort = { FOOL:0, KING:1, MOUNTAIN:2, PAPER:3, ROCK:4, SCISSORS:5, WISE:6 };

    my_game.rules.CubeLabel = []
    my_game.rules.CubeLabel[my_game.rules.CubeColor.WHITE] = []
    my_game.rules.CubeLabel[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.FOOL] = 'F';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.KING] = 'K';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.MOUNTAIN] = 'M';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.PAPER] = 'P';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.ROCK] = 'R';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.SCISSORS] = 'S';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.WISE] = 'W';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.BLACK] = []
    my_game.rules.CubeLabel[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.FOOL] = 'f';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.KING] = 'k';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.MOUNTAIN] = 'm';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.PAPER] = 'p';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.ROCK] = 'r';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.SCISSORS] = 's';
    my_game.rules.CubeLabel[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.WISE] = 'w';

    my_game.rules.cells = [];
    my_game.rules.cubes = [];

    my_game.debug.writeMessage( "my_game.rules.__initModule(): done" );
};

my_game.rules.getCubeColorAndSort = function(cube_label){
    for ( const cube_color of Object.values(my_game.rules.CubeColor) ) {
        for ( const cube_sort of Object.values(my_game.rules.CubeSort) ) {
            if ( my_game.rules.CubeLabel[cube_color][cube_sort] === cube_label ) {
                return {color: cube_color, sort: cube_sort};
            }
        }
    }
    my_game.debug.assert(false, "my_game.rules.getCubeColorAndSort(): failed");
};

my_game.rules.getCell = function(cell_name){
    return my_game.rules.cells.find(function(cell, index, array){ return cell.name === cell_name; });
};

my_game.rules.getCube = function(cube_name){
    return my_game.rules.cubes.find(function(cube, index, array){ return cube.name === cube_name; });
};

my_game.rules.makeAllCells = function(){

    for ( const x of my_game.rules.xIndices ) {
        for ( const y of my_game.rules.yIndices ) {
            const cell_name = my_game.rules.yLabels[y] + my_game.rules.xLabels[x];
            const cell = {  index: my_game.rules.cells.length,
                            x: x,
                            y: y,
                            name: cell_name,
                            bottom: null,
                            top: null };
            my_game.rules.cells.push(cell);
        }
    }
}

my_game.rules.iSEmptyCell = function(cell){
    return cell.bottom == null && cell.top == null;
};

my_game.rules.moveCell = function(cell_source, cell_destination){
    my_game.debug.assert( ! my_game.rules.iSEmptyCell(cell_source), "cell_source");
    my_game.debug.assert( my_game.rules.iSEmptyCell(cell_destination), "cell_source");

    cell_destination.bottom = cell_source.bottom;
    cell_destination.top = cell_source.top;

    cell_source.bottom = null;
    cell_source.top = null;
};

my_game.rules.makeAllCubes = function(){
    for ( const cube_color of Object.values(my_game.rules.CubeColor) ) {
        for ( const cube_sort of Object.values(my_game.rules.CubeSort) ) {

            let cube_sort_count = 0;
            if ( cube_sort === my_game.rules.CubeSort.ROCK ||
                 cube_sort === my_game.rules.CubeSort.PAPER ||
                 cube_sort === my_game.rules.CubeSort.SCISSORS ||
                 cube_sort === my_game.rules.CubeSort.MOUNTAIN ) { cube_sort_count = 4; }

            else if ( cube_sort === my_game.rules.CubeSort.FOOL ||
                      cube_sort === my_game.rules.CubeSort.WISE ) { cube_sort_count = 2; }

            else if ( cube_sort === my_game.rules.CubeSort.KING ) { cube_sort_count = 1; }

            for ( let cube_sort_index=1; cube_sort_index <= cube_sort_count; cube_sort_index++ ) {
                const cube_label = my_game.rules.CubeLabel[cube_color][cube_sort];
                const cube_name = cube_label + cube_sort_index;

                const cube = { color: cube_color,
                               sort: cube_sort,
                               label: cube_label,
                               name: cube_name,
                               index: my_game.rules.cubes.length };
                my_game.rules.cubes.push(cube);
            }
        }
    }
};

my_game.rules.setAllCubes = function(){

    // whites

    my_game.rules.setCubeByLabels("b1", "F1");
    my_game.rules.setCubeByLabels("b8", "F2");
    my_game.rules.setCubeByLabels("a4", "K1");

    my_game.rules.setCubeByLabels("b2", "R1");
    my_game.rules.setCubeByLabels("b3", "P1");
    my_game.rules.setCubeByLabels("b4", "S1");
    my_game.rules.setCubeByLabels("b5", "R2");
    my_game.rules.setCubeByLabels("b6", "P2");
    my_game.rules.setCubeByLabels("b7", "S2");

    my_game.rules.setCubeByLabels("a3", "R3");
    my_game.rules.setCubeByLabels("a2", "S3");
    my_game.rules.setCubeByLabels("a1", "P3");
    my_game.rules.setCubeByLabels("a5", "S4");
    my_game.rules.setCubeByLabels("a6", "R4");
    my_game.rules.setCubeByLabels("a7", "P4");

    // blacks

    my_game.rules.setCubeByLabels("h1", "f1");
    my_game.rules.setCubeByLabels("h8", "f2");
    my_game.rules.setCubeByLabels("i4", "k1");

    my_game.rules.setCubeByLabels("h7", "r1");
    my_game.rules.setCubeByLabels("h6", "p1");
    my_game.rules.setCubeByLabels("h5", "s1");
    my_game.rules.setCubeByLabels("h4", "r2");
    my_game.rules.setCubeByLabels("h3", "p2");
    my_game.rules.setCubeByLabels("h2", "s2");

    my_game.rules.setCubeByLabels("i5", "r3");
    my_game.rules.setCubeByLabels("i6", "s3");
    my_game.rules.setCubeByLabels("i7", "p3");
    my_game.rules.setCubeByLabels("i3", "s4");
    my_game.rules.setCubeByLabels("i2", "r4");
    my_game.rules.setCubeByLabels("i1", "p4");

    // white reserve

    my_game.rules.setCubeByLabels("a9", "M1");
    my_game.rules.setCubeByLabels("a9", "M2");
    my_game.rules.setCubeByLabels("b9", "M3");
    my_game.rules.setCubeByLabels("b9", "M4");
    my_game.rules.setCubeByLabels("c9", "W1");
    my_game.rules.setCubeByLabels("c9", "W2");

    // black reserve

    my_game.rules.setCubeByLabels("i9", "m1");
    my_game.rules.setCubeByLabels("i9", "m2");
    my_game.rules.setCubeByLabels("h9", "m3");
    my_game.rules.setCubeByLabels("h9", "m4");
    my_game.rules.setCubeByLabels("g9", "w1");
    my_game.rules.setCubeByLabels("g9", "w2");
};

my_game.rules.setCubeByLabels = function(cell_name, cube_name){
    const cell = my_game.rules.getCell(cell_name);
    const cube = my_game.rules.getCube(cube_name);
    my_game.rules.setCube(cell, cube);
};

my_game.rules.setCube = function(cell, cube){
    if ( cell.bottom === null ) { cell.bottom = cube; }
    else if  ( cell.top === null ) { cell.top = cube; }
    else {
        my_game.debug.assert(false, "my_game.rules.setCube(): failed");
    }
};

//////////////////////////////////////////////////////////////////////////

"use strict";
///////////////////////////////////////////////////////////////////////////////
my_game.draw = { };
my_game.draw.__initModuleCalled = false;

my_game.draw.__initModule = function(){

    if ( my_game.draw.__initModuleCalled ) return;
    my_game.draw.__initModuleCalled = true;

    // Init required modules
    my_game.debug.__initModule();
    my_game.rules.__initModule();

    // Init inner classes
    // None

    my_game.draw.drawZone = document.getElementById( "my_game_drawZone" );

    my_game.debug.assert(my_game.draw.drawZone.clientWidth === my_game.draw.drawZone.clientHeight, "drawZone.clientWidth === drawZone.clientHeight");
    my_game.draw.board_size = my_game.draw.drawZone.clientWidth;
    my_game.draw.cell_size = my_game.draw.board_size / my_game.rules.cellsPerSide;
    my_game.draw.cell_epsilon = 3;
    my_game.draw.cube_size = ((my_game.draw.cell_size - 3*my_game.draw.cell_epsilon)/2);

    my_game.draw.CubeDivLocation = { BOTTOM:0, MIDDLE:1, TOP:2 };

    my_game.draw.cube_div_classes = []
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.WHITE] = []
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.FOOL] = 'my_game_cube_fool_white_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.KING] = 'my_game_cube_king_white_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.MOUNTAIN] = 'my_game_cube_mountain_white_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.PAPER] = 'my_game_cube_paper_white_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.ROCK] = 'my_game_cube_rock_white_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.SCISSORS] = 'my_game_cube_scissors_white_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.WHITE][my_game.rules.CubeSort.WISE] = 'my_game_cube_wise_white_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.BLACK] = []
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.FOOL] = 'my_game_cube_fool_black_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.KING] = 'my_game_cube_king_black_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.MOUNTAIN] = 'my_game_cube_mountain_black_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.PAPER] = 'my_game_cube_paper_black_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.ROCK] = 'my_game_cube_rock_black_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.SCISSORS] = 'my_game_cube_scissors_black_class';
    my_game.draw.cube_div_classes[my_game.rules.CubeColor.BLACK][my_game.rules.CubeSort.WISE] = 'my_game_cube_wise_black_class';

    my_game.draw.cells_div = [];
    my_game.draw.cubes_div = [];

    my_game.draw.labels_are_displayed = true;

    // Debug the mouse position when inside the drawZone
    my_game.draw.drawZone.addEventListener( "mousemove" ,
        function(event){
            var mousePosition = my_game.draw.getMousePosition(event);
            my_game.debug.writeMousePosition(Math.floor(mousePosition.x), Math.floor(mousePosition.y));
        },
        false);

    my_game.debug.writeMessage( "my_game.draw.__initModule(): done" );
};

my_game.draw.makeAllCellsDiv = function(){

    for ( const cell of my_game.rules.cells ) {
        my_game.draw.cells_div.push(my_game.draw.makeCellDiv(cell));
    }
    my_game.draw.toogleCellDivNames();
};

my_game.draw.makeCellDiv = function(cell){

    const cell_text = document.createTextNode(cell.name);

    const cell_paragraph = document.createElement("P");
    cell_paragraph.className  = "my_game_cell_name_class";
    cell_paragraph.appendChild(cell_text);

    const cell_div = document.createElement("DIV");
    cell_div.id = "my_game_cell_" + cell.name;
    cell_div.style.left = Math.floor(cell.x*my_game.draw.cell_size) + "px";
    cell_div.style.top = Math.floor(cell.y*my_game.draw.cell_size) + "px";
    cell_div.style.width = Math.floor(my_game.draw.cell_size) + "px";
    cell_div.style.height = Math.floor(my_game.draw.cell_size) + "px";

    cell_div.className = "my_game_cell_class";
    cell_div.className += " " + "my_game_cell_unselected_class";

    cell_div.appendChild(cell_paragraph);

    cell_div.onclick = function(){ my_game.presenter.selectCell(cell.index); };

    my_game.draw.drawZone.appendChild(cell_div);

    return cell_div;
};

my_game.draw.selectedCellDiv = function(cell_div, condition){
    if ( condition ) {
        cell_div.className = cell_div.className.replace("my_game_cell_unselected_class", "my_game_cell_selected_class")
    } else {
        cell_div.className = cell_div.className.replace("my_game_cell_selected_class", "my_game_cell_unselected_class")
    }
};

my_game.draw.selectedCellCubesDiv = function(cell, top_condition, bottom_condition){

    const cell_div_index = cell.index;

    const cube_div_top = my_game.draw.cubes_div[cell_div_index][my_game.draw.CubeDivLocation.TOP];
    const cube_div_middle = my_game.draw.cubes_div[cell_div_index][my_game.draw.CubeDivLocation.MIDDLE];
    const cube_div_bottom = my_game.draw.cubes_div[cell_div_index][my_game.draw.CubeDivLocation.BOTTOM];

    if ( cell.bottom !== null && cell.top !== null ) {
        my_game.draw.selectedCubeDiv(cube_div_top, top_condition);
        my_game.draw.selectedCubeDiv(cube_div_bottom, bottom_condition);

    } else if ( cell.bottom !== null && cell.top === null ) {
        my_game.draw.selectedCubeDiv(cube_div_middle, bottom_condition);

    } else {
        my_game.debug.assert(false, "my_game.draw.selectedCellCubesDiv(): failed");
    }
};

my_game.draw.selectedCubeDiv = function(cube_div, condition){
    if ( condition ) {
        cube_div.className = cube_div.className.replace("my_game_cube_unselected_class", "my_game_cube_selected_class")
    } else {
        cube_div.className = cube_div.className.replace("my_game_cube_selected_class", "my_game_cube_unselected_class")
    }
};

my_game.draw.makeAllCubesDiv = function(){

    for ( const cell of my_game.rules.cells ) {

        const cube_div_prefix = cell.name;
        const cell_div_index = cell.index;
        const cell_div = my_game.draw.cells_div[cell_div_index]

        my_game.draw.cubes_div[cell_div_index] = [];

        for ( const cube_div_location of Object.values(my_game.draw.CubeDivLocation) ) {
            my_game.draw.cubes_div[cell_div_index].push(my_game.draw.makeCubeDiv(cell_div, cube_div_location, cube_div_prefix));
        }
    }
};

my_game.draw.makeCubeDiv = function(cell_div, cube_div_location, cube_div_prefix){

    const cube_div_suffix = Object.keys(my_game.draw.CubeDivLocation)[cube_div_location];
    const cube_left = my_game.draw.cube_size/2;
    let cube_top = 0;

    if ( cube_div_location === my_game.draw.CubeDivLocation.BOTTOM ) {
        cube_top = my_game.draw.cell_size/2 + my_game.draw.cell_epsilon/2;

    } else if ( cube_div_location === my_game.draw.CubeDivLocation.MIDDLE ) {
        cube_top = my_game.draw.cell_size/2 - my_game.draw.cube_size/2;

    } else if ( cube_div_location === my_game.draw.CubeDivLocation.TOP ) {
        cube_top = my_game.draw.cell_epsilon;
    }

    const cube_div = document.createElement("DIV");
    cube_div.id = "my_game_cube_"  + cube_div_prefix + "_" + cube_div_suffix

    cube_div.style.left = Math.floor(cube_left) + "px";
    cube_div.style.top = Math.floor(cube_top) + "px";
    cube_div.style.width = Math.floor(my_game.draw.cube_size) + "px";
    cube_div.style.height = Math.floor(my_game.draw.cube_size) + "px";

    my_game.draw.clearCubeDiv(cube_div);

    cell_div.appendChild(cube_div);
    return cube_div;
};

my_game.draw.setAllCellsDiv = function(){

    for ( const cell of my_game.rules.cells ) {
        my_game.draw.setCellDiv(cell);
    }
};

my_game.draw.setCellDiv = function(cell){

    const cell_div_index = cell.index;

    const cube_div_top = my_game.draw.cubes_div[cell_div_index][my_game.draw.CubeDivLocation.TOP];
    const cube_div_middle = my_game.draw.cubes_div[cell_div_index][my_game.draw.CubeDivLocation.MIDDLE];
    const cube_div_bottom = my_game.draw.cubes_div[cell_div_index][my_game.draw.CubeDivLocation.BOTTOM];

    if ( cell.bottom === null && cell.top === null ) {
        my_game.draw.clearCubeDiv(cube_div_top);
        my_game.draw.clearCubeDiv(cube_div_middle);
        my_game.draw.clearCubeDiv(cube_div_bottom);

    } else if  ( cell.bottom !== null && cell.top === null ) {
        my_game.draw.clearCubeDiv(cube_div_top);
        my_game.draw.setCubeDiv(cube_div_middle, cell.bottom.color, cell.bottom.sort);
        my_game.draw.clearCubeDiv(cube_div_bottom);

    } else if  ( cell.bottom !== null && cell.top !== null ) {
        my_game.draw.setCubeDiv(cube_div_top, cell.top.color, cell.top.sort);
        my_game.draw.clearCubeDiv(cube_div_middle);
        my_game.draw.setCubeDiv(cube_div_bottom, cell.bottom.color, cell.bottom.sort);

    } else {
        my_game.debug.assert(false, "my_game.draw.setCellDiv(): failed");
    }
};

my_game.draw.setCubeDiv = function(cube_div, cube_color, cube_sort){
    const cube_class = "my_game_cube_class" + " " + "my_game_cube_unselected_class" +
                        " " + my_game.draw.cube_div_classes[cube_color][cube_sort];
    my_game.draw.setCubeDivClass(cube_div, cube_class);
};

my_game.draw.setCubeDivClass = function(cube_div, cube_class){
    cube_div.className = cube_class;
};

my_game.draw.clearCubeDiv = function(cube_div){
    my_game.draw.setCubeDivClass(cube_div, "my_game_cube_class" +  " " + "my_game_cube_unselected_class" +
        " " + "my_game_cube_void_class"  );
};

my_game.draw.showElement = function(element){ element.style.display = "inherit";}
my_game.draw.hideElement = function(element){ element.style.display = "none";}

my_game.draw.toogleCellDivNames = function(){

    const label_elements = document.getElementsByClassName("my_game_cell_name_class");

    my_game.draw.labels_are_displayed = ! my_game.draw.labels_are_displayed;

    if ( my_game.draw.labels_are_displayed ) {
        Array.from(label_elements).forEach(my_game.draw.showElement);
    } else {
        Array.from(label_elements).forEach(my_game.draw.hideElement);
    }
};

my_game.draw.getMousePosition = function(event){
    const drawZoneRectangle = my_game.draw.drawZone.getBoundingClientRect();
    return {
        x: event.clientX - drawZoneRectangle.left,
        y: event.clientY - drawZoneRectangle.top
    };
};
///////////////////////////////////////////////////////////////////////////////

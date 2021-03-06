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
jersi.draw = { };
jersi.draw.__initModuleCalled = false;

jersi.draw.__initModule = function(){

    if ( jersi.draw.__initModuleCalled ) return;
    jersi.draw.__initModuleCalled = true;

    // Init required modules
    jersi.debug.__initModule();
    jersi.rules.__initModule();

    // Init inner classes
    // None

    jersi.draw.draw_zone = document.getElementById( "jersi_drawZone" );

    jersi.draw.audio_slide = document.getElementById( "jersi_audio_slide" );
    jersi.draw.audio_click_light = document.getElementById( "jersi_audio_clickLight" );
    jersi.draw.audio_click_dark = document.getElementById( "jersi_audio_clickDark" );
    jersi.draw.audio_click_dark_filtered = document.getElementById( "jersi_audio_clickDarkFiltered" );

    {
        const width_height_ratio = jersi.draw.draw_zone.clientWidth/jersi.draw.draw_zone.clientHeight;
        const width_height_ratio_error = Math.abs(width_height_ratio - 3*Math.sqrt(3)/4)
        jersi.debug.assert(width_height_ratio_error <= 0.001, "drawZone: width_height_ratio");
    }

    jersi.draw.board_width = jersi.draw.draw_zone.clientWidth;

    jersi.draw.hexagon_width = jersi.draw.board_width/12;
    jersi.draw.hexagon_height = jersi.draw.hexagon_width*2*Math.sqrt(3)/3;
    jersi.draw.hexagon_side = jersi.draw.hexagon_height/2;
    jersi.draw.hexagon_epsilon = 0;

    jersi.draw.cell_epsilon = 4;
    jersi.draw.cube_size = (jersi.draw.hexagon_height - jersi.draw.cell_epsilon)/(2 + Math.sqrt(3)/3);
    jersi.draw.cell_width = jersi.draw.hexagon_width;
    jersi.draw.cell_height = jersi.draw.hexagon_height;

    jersi.draw.CubeDivLocation = { BOTTOM:0, MIDDLE:1, TOP:2 };

    jersi.draw.cube_div_classes = []
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.WHITE] = []
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.FOOL] = 'jersi_cube_fool_white_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.KING] = 'jersi_cube_king_white_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.MOUNTAIN] = 'jersi_cube_mountain_white_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.PAPER] = 'jersi_cube_paper_white_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.ROCK] = 'jersi_cube_rock_white_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.SCISSORS] = 'jersi_cube_scissors_white_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.WHITE][jersi.rules.CubeSort.WISE] = 'jersi_cube_wise_white_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.BLACK] = []
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.FOOL] = 'jersi_cube_fool_black_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.KING] = 'jersi_cube_king_black_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.MOUNTAIN] = 'jersi_cube_mountain_black_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.PAPER] = 'jersi_cube_paper_black_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.ROCK] = 'jersi_cube_rock_black_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.SCISSORS] = 'jersi_cube_scissors_black_class';
    jersi.draw.cube_div_classes[jersi.rules.CubeColor.BLACK][jersi.rules.CubeSort.WISE] = 'jersi_cube_wise_black_class';

    jersi.draw.cells_div = [];
    jersi.draw.cubes_div = [];

    jersi.draw.hexagons = [];

    jersi.draw.labels_are_displayed = true;

    // Debug the mouse position when inside the drawZone
    jersi.draw.draw_zone.addEventListener( "mousemove" ,
        function(event){
            const mouse_position = jersi.draw.getMousePosition(event);
            jersi.debug.writeMousePosition(Math.floor(mouse_position.x), Math.floor(mouse_position.y));
        },
        false);

    jersi.draw.draw_zone.addEventListener( "click" , jersi.draw.onHexagonClick, false);

    jersi.debug.writeMessage( "jersi.draw.__initModule(): done" );
};

// --- JERSI_BEGIN: commands ---

jersi.draw.onHexagonClick = function(event){

    const mouse_position = jersi.draw.getMousePosition(event);
    const x = mouse_position.x;
    const y = mouse_position.y;

    for ( const hexagon of jersi.draw.hexagons ) {

        let mouse_inside_hexagon = false;

        if ( x > hexagon.north_west.x + jersi.draw.hexagon_epsilon && x < hexagon.north_east.x - jersi.draw.hexagon_epsilon &&
             y > hexagon.north.y + jersi.draw.hexagon_epsilon && y < hexagon.south.y - jersi.draw.hexagon_epsilon ) {

            if ( y >= hexagon.north_west.y && y <= hexagon.south_west.y ) {
                mouse_inside_hexagon = true;

            } else if ( y <= hexagon.north_west.y && x <= hexagon.north.x ) {
                const y_limit = hexagon.north_west.y +
                                (hexagon.north.y - hexagon.north_west.y)/(hexagon.north.x - hexagon.north_west.x)*(x - hexagon.north_west.x);
                mouse_inside_hexagon = (y > y_limit);

            } else if ( y <= hexagon.north_west.y && x > hexagon.north.x ) {
                const y_limit = hexagon.north.y +
                                (hexagon.north_east.y - hexagon.north.y)/(hexagon.north_east.x - hexagon.north.x)*(x - hexagon.north.x);
                mouse_inside_hexagon = (y > y_limit);

            } else if ( y >= hexagon.south_west.y && x <= hexagon.north.x ) {
                const y_limit = hexagon.south_west.y +
                                (hexagon.south.y - hexagon.south_west.y)/(hexagon.south.x - hexagon.south_west.x)*(x - hexagon.south_west.x);
                mouse_inside_hexagon = (y < y_limit);

            } else if ( y >= hexagon.south_west.y && x > hexagon.north.x ) {
                const y_limit = hexagon.south.y +
                                (hexagon.south_east.y - hexagon.south.y)/(hexagon.south_east.x - hexagon.south.x)*(x - hexagon.south.x);
                mouse_inside_hexagon = (y < y_limit);
            }
        }

        if ( mouse_inside_hexagon ) {
            jersi.presenter.selectCell(hexagon.cell_index);
            break;
        }
    }
};

jersi.draw.playMoveSound = function(){
    //jersi.draw.playSlideSound();
    //jersi.draw.playSoundClickLight();
    //jersi.draw.playSoundClickDark(); // A bit of noisy tail
    jersi.draw.playSoundClickDarkFiltered(); // My favorite
};

jersi.draw.playRestartSound = function(){
    jersi.draw.playSlideSound();
};

jersi.draw.playSoundClickLight = function(){
    jersi.draw.audio_click_light.currentTime = 0.6 * jersi.draw.audio_click_light.duration;
    jersi.draw.audio_click_light.volume = 0.20;
    jersi.draw.audio_click_light.play();
};

jersi.draw.playSoundClickDark = function(){
    jersi.draw.audio_click_dark.currentTime = 0.7 * jersi.draw.audio_click_dark.duration;
    jersi.draw.audio_click_dark.volume = 0.40;
    jersi.draw.audio_click_dark.play();
};

jersi.draw.playSoundClickDarkFiltered = function(){
    jersi.draw.audio_click_dark_filtered.currentTime = 0.75 * jersi.draw.audio_click_dark_filtered.duration;
    jersi.draw.audio_click_dark_filtered.volume = 1.00;
    jersi.draw.audio_click_dark_filtered.play();
};

jersi.draw.playSlideSound = function(){
    jersi.draw.audio_slide.currentTime = 0.4 * jersi.draw.audio_slide.duration;
    jersi.draw.audio_slide.volume = 0.40;
    jersi.draw.audio_slide.play();
};

jersi.draw.playUndoSound = function(){
    jersi.draw.playSlideSound();
};

// --- JERSI_END: commands ---

// --- JERSI_BEGIN: makers ---

jersi.draw.makeAllCellsDiv = function(){

    for ( const cell of jersi.rules.cells ) {
        jersi.draw.cells_div.push(jersi.draw.makeCellDiv(cell));
    }
    jersi.draw.toogleCellDivNames();
};

jersi.draw.makeCellDiv = function(cell){

    const cell_div = document.createElement("DIV");
    cell_div.id = "jersi_cell_" + cell.name;

    const x_central_hexagon = 6*jersi.draw.hexagon_width;
    const y_central_hexagon = 5/2*jersi.draw.hexagon_height + 3*jersi.draw.hexagon_side;

    const x_hexagon = x_central_hexagon + (cell.u + cell.v/2)*jersi.draw.hexagon_width;
    const y_hexagon = y_central_hexagon - cell.v*Math.sqrt(3)/2*jersi.draw.hexagon_width;

    let x_shift = 0;
    if ( cell.reserve ) {
        if ( cell.name === 'a' || cell.name === 'b' || cell.name === 'c' || cell.name === 'd' ) {
            x_shift = jersi.draw.hexagon_width/2;
        } else if ( cell.name === 'i' || cell.name === 'h' || cell.name === 'g' || cell.name === 'f' ) {
            x_shift = -jersi.draw.hexagon_width/2;
        }
    }

    const x_cell_div = x_hexagon - jersi.draw.cell_width/2 + x_shift; // cell left
    const y_cell_div = y_hexagon - jersi.draw.cell_height/2; // cell top

    cell_div.style.left = Math.floor(x_cell_div) + "px";
    cell_div.style.top = Math.floor(y_cell_div) + "px";

    cell_div.style.width = Math.floor(jersi.draw.cell_width) + "px";
    cell_div.style.height = Math.floor(jersi.draw.cell_height) + "px";

    cell_div.className = "jersi_cell_class";
    cell_div.className += " " + "jersi_cell_unselected_class";

    if ( ! cell.reserve ) {
        const cell_text = document.createTextNode(cell.name);

        const cell_paragraph = document.createElement("P");
        cell_paragraph.className  = "jersi_cell_name_class";
        cell_paragraph.appendChild(cell_text);

        cell_div.appendChild(cell_paragraph);
    }

    jersi.draw.draw_zone.appendChild(cell_div);

    {
        const hexagon_x_min = x_cell_div;
        const hexagon_x_max = x_cell_div + jersi.draw.hexagon_width;

        const hexagon_y_min = y_cell_div;
        const hexagon_y_max = y_cell_div + jersi.draw.hexagon_height;

        const hexagon_y_first = (hexagon_y_min + hexagon_y_max)/2 - jersi.draw.hexagon_side/2;
        const hexagon_y_second = (hexagon_y_min + hexagon_y_max)/2 + jersi.draw.hexagon_side/2;

        const hexagon = {
            cell_index:cell.index,

            north:{x:(hexagon_x_min + hexagon_x_max)/2, y:hexagon_y_min},
            south:{x:(hexagon_x_min + hexagon_x_max)/2, y:hexagon_y_max},

            north_west:{x:hexagon_x_min, y:hexagon_y_first},
            north_east:{x:hexagon_x_max, y:hexagon_y_first},

            south_west:{x:hexagon_x_min, y:hexagon_y_second},
            south_east:{x:hexagon_x_max, y:hexagon_y_second}
        };

        jersi.draw.hexagons.push(hexagon);
    }

    return cell_div;
};

jersi.draw.makeAllCubesDiv = function(){

    for ( const cell of jersi.rules.cells ) {

        const cube_div_prefix = cell.name;
        const cell_div_index = cell.index;
        const cell_div = jersi.draw.cells_div[cell_div_index]

        jersi.draw.cubes_div[cell_div_index] = [];

        for ( const cube_div_location of Object.values(jersi.draw.CubeDivLocation) ) {
            jersi.draw.cubes_div[cell_div_index].push(jersi.draw.makeCubeDiv(cell_div, cube_div_location, cube_div_prefix));
        }
    }
};

jersi.draw.makeCubeDiv = function(cell_div, cube_div_location, cube_div_prefix){

    const cube_div_suffix = Object.keys(jersi.draw.CubeDivLocation)[cube_div_location];
    const cube_left = (jersi.draw.cell_width - jersi.draw.cube_size)/2;
    let cube_top = 0;

    if ( cube_div_location === jersi.draw.CubeDivLocation.BOTTOM ) {
        cube_top = (jersi.draw.cell_height + jersi.draw.cell_epsilon)/2;

    } else if ( cube_div_location === jersi.draw.CubeDivLocation.MIDDLE ) {
        cube_top = (jersi.draw.cell_height - jersi.draw.cube_size)/2;

    } else if ( cube_div_location === jersi.draw.CubeDivLocation.TOP ) {
        cube_top = (jersi.draw.cell_height - jersi.draw.cell_epsilon - 2*jersi.draw.cube_size)/2;
    }

    const cube_div = document.createElement("DIV");
    cube_div.id = "jersi_cube_"  + cube_div_prefix + "_" + cube_div_suffix

    cube_div.style.left = Math.floor(cube_left) + "px";
    cube_div.style.top = Math.floor(cube_top) + "px";
    cube_div.style.width = Math.floor(jersi.draw.cube_size) + "px";
    cube_div.style.height = Math.floor(jersi.draw.cube_size) + "px";

    jersi.draw.clearCubeDiv(cube_div);

    cell_div.appendChild(cube_div);
    return cube_div;
};

// --- JERSI_END: makers ---

// --- JERSI_BEGIN: getters ---

jersi.draw.getMousePosition = function(event){
    const drawZoneRectangle = jersi.draw.draw_zone.getBoundingClientRect();
    return {
        x: event.clientX - drawZoneRectangle.left,
        y: event.clientY - drawZoneRectangle.top
    };
};

// --- JERSI_END: getters ---

// --- JERSI_BEGIN: setters ---

jersi.draw.clearCubeDiv = function(cube_div){
    jersi.draw.setCubeDivClass(cube_div, "jersi_cube_class" +  " " + "jersi_cube_unselected_class" +
        " " + "jersi_cube_void_class"  );
};

jersi.draw.hideElement = function(element){ element.style.display = "none";}

jersi.draw.selectCellDiv = function(cell, condition){

    const cell_div = jersi.draw.cells_div[cell.index];

    if ( condition ) {
        cell_div.className = cell_div.className.replace("jersi_cell_unselected_class", "jersi_cell_selected_class")
    } else {
        cell_div.className = cell_div.className.replace("jersi_cell_selected_class", "jersi_cell_unselected_class")
    }
};

jersi.draw.selectCellCubeDiv = function(cell, condition){
    jersi.debug.assert( jersi.rules.cellHasCube(cell), "cell_source has cube");

    const cell_state = jersi.rules.cells_states[cell.index];

    if ( cell_state.top !== null ) {
        const cube_div_top = jersi.draw.cubes_div[cell.index][jersi.draw.CubeDivLocation.TOP];
        jersi.draw.selectCubeDiv(cube_div_top, condition);

    } else {
        const cube_div_middle = jersi.draw.cubes_div[cell.index][jersi.draw.CubeDivLocation.MIDDLE];
        jersi.draw.selectCubeDiv(cube_div_middle, condition);
    }
};

jersi.draw.selectCubeDiv = function(cube_div, condition){
    if ( condition ) {
        cube_div.className = cube_div.className.replace("jersi_cube_unselected_class", "jersi_cube_selected_class")
    } else {
        cube_div.className = cube_div.className.replace("jersi_cube_selected_class", "jersi_cube_unselected_class")
    }
};

jersi.draw.selectCellStackDiv = function(cell, condition){
    jersi.debug.assert( jersi.rules.cellHasStack(cell), "cell_source has stack");

    const cube_div_top = jersi.draw.cubes_div[cell.index][jersi.draw.CubeDivLocation.TOP];
    jersi.draw.selectCubeDiv(cube_div_top, condition);

    const cube_div_bottom = jersi.draw.cubes_div[cell.index][jersi.draw.CubeDivLocation.BOTTOM];
    jersi.draw.selectCubeDiv(cube_div_bottom, condition);
};

jersi.draw.setCubeDiv = function(cube_div, cube_color, cube_sort){
    const cube_class = "jersi_cube_class" + " " + "jersi_cube_unselected_class" +
                        " " + jersi.draw.cube_div_classes[cube_color][cube_sort];
    jersi.draw.setCubeDivClass(cube_div, cube_class);
};

jersi.draw.setCubeDivClass = function(cube_div, cube_class){
    cube_div.className = cube_class;
};

jersi.draw.showElement = function(element){ element.style.display = "inherit";}

jersi.draw.updateAllCellsDiv = function(){

    for ( const cell of jersi.rules.cells ) {
        jersi.draw.updateCellDiv(cell);
    }
};

jersi.draw.toogleCellDivNames = function(){

    const label_elements = document.getElementsByClassName("jersi_cell_name_class");

    jersi.draw.labels_are_displayed = ! jersi.draw.labels_are_displayed;

    if ( jersi.draw.labels_are_displayed ) {
        Array.from(label_elements).forEach(jersi.draw.showElement);
    } else {
        Array.from(label_elements).forEach(jersi.draw.hideElement);
    }
};

jersi.draw.updateCellDiv = function(cell){

    const cell_div_index = cell.index;

    const cube_div_top = jersi.draw.cubes_div[cell_div_index][jersi.draw.CubeDivLocation.TOP];
    const cube_div_middle = jersi.draw.cubes_div[cell_div_index][jersi.draw.CubeDivLocation.MIDDLE];
    const cube_div_bottom = jersi.draw.cubes_div[cell_div_index][jersi.draw.CubeDivLocation.BOTTOM];

    const cell_state = jersi.rules.cells_states[cell.index];

    if ( cell_state.bottom === null && cell_state.top === null ) {
        jersi.draw.clearCubeDiv(cube_div_top);
        jersi.draw.clearCubeDiv(cube_div_middle);
        jersi.draw.clearCubeDiv(cube_div_bottom);

    } else if  ( cell_state.bottom !== null && cell_state.top === null ) {
        jersi.draw.clearCubeDiv(cube_div_top);
        jersi.draw.setCubeDiv(cube_div_middle, cell_state.bottom.color, cell_state.bottom.sort);
        jersi.draw.clearCubeDiv(cube_div_bottom);

    } else if  ( cell_state.bottom !== null && cell_state.top !== null ) {
        jersi.draw.setCubeDiv(cube_div_top, cell_state.top.color, cell_state.top.sort);
        jersi.draw.clearCubeDiv(cube_div_middle);
        jersi.draw.setCubeDiv(cube_div_bottom, cell_state.bottom.color, cell_state.bottom.sort);

    } else {
        jersi.debug.assert(false, "jersi.draw.updateCellDiv(): failed");
    }
};

// --- JERSI_END: setters ---

///////////////////////////////////////////////////////////////////////////////

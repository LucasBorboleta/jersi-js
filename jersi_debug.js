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
jersi.debug = { };
jersi.debug.__initModuleCalled = false;

jersi.debug.__initModule = function(){

    if ( jersi.debug.__initModuleCalled ) return;
    jersi.debug.__initModuleCalled = true;

    // Init required modules
    // None

    // Init inner classes
    // None

    jersi.debug.zone = document.getElementById( "jersi_debugZone" );
    jersi.debug.messages = document.getElementById( "jersi_debug_messages" );
    jersi.debug.mousePosition = document.getElementById( "jersi_debug_mousePosition" );

    jersi.debug.messageCount = 0;
    jersi.debug.is_enabled = false;
    jersi.debug.enable(jersi.debug.is_enabled);
};

jersi.debug.assert = function(condition, message){
    if ( typeof message === "undefined" ) {
        message = "[look at javascript console]";
    }

    console.assert(condition, message);
    if ( ! condition ) {
        jersi.debug.writeMessage("assertion failed: " + message);
    }
};

jersi.debug.clearMessages = function(){
    jersi.debug.messages.innerHTML = "" ;
};

jersi.debug.debug = function(){
    jersi.debug.is_enabled = ! jersi.debug.is_enabled;
    jersi.debug.enable(jersi.debug.is_enabled);
};

jersi.debug.enable = function(condition){
    jersi.debug.is_enabled = condition;

    if ( ! jersi.debug.is_enabled ) {
        jersi.debug.clearMessages();
    }

    if ( jersi.debug.is_enabled ) {
        jersi.debug.zone.style.display = "inherit";
    } else {
        jersi.debug.zone.style.display = "none";
    }
};

jersi.debug.tryEncoding = function() {

    const BIT_COUNTS = [8, 4, 7, 7, 7, 7];
    const BIT_TOTAL_COUNT = BIT_COUNTS.reduce(function(sum, x){return sum + x}, 0);

    let padBitSequence = function(bit_sequence, bit_count){
        jersi.debug.assert( bit_sequence.length <= bit_count );

        if ( bit_sequence.length < bit_count ) {
            return "0".repeat(bit_count - bit_sequence.length) + bit_sequence;
        } else {
            return bit_sequence;
        }
    };

    let encodeAsBits = function(bit_counts, int_values){

        jersi.debug.assert( bit_counts.length === int_values.length );
        const value_count = bit_counts.length;

        let bit_sequence = "";

        for (let value_index=0; value_index < value_count; value_index++) {
            jersi.debug.assert( bit_counts[value_index] > 0 );
            jersi.debug.assert( int_values[value_index] >= 0 );

            const value_as_bits = int_values[value_index].toString(2);
            jersi.debug.assert( value_as_bits.length <= bit_counts[value_index] );

            bit_sequence += padBitSequence(value_as_bits, bit_counts[value_index]);
        }

        return bit_sequence;
    };


    let decodeAsBits = function(bit_counts, bit_sequence){

        jersi.debug.assert( bit_counts.reduce(function(sum, x){return sum + x}, 0) === bit_sequence.length );
        const value_count = bit_counts.length;

        let int_values = [];

        let bit_start = 0;
        for (let value_index=0; value_index < value_count; value_index++) {
            jersi.debug.assert( bit_counts[value_index] > 0 );

            const bit_chunck = bit_sequence.substr(bit_start, bit_counts[value_index]);
            const value = parseInt(bit_chunck, 2)
            int_values.push(value);

            bit_start += bit_counts[value_index];
        }

        return int_values;
    };

    let cipherBits = function(bit_sequence){
        jersi.debug.assert( bit_sequence.length % 8 === 0 );

        const byte_count = bit_sequence.length / 8;
        let bit_counts = [];
        for ( let byte_index=0; byte_index < byte_count; byte_index++ ) {
            bit_counts.push(8)
        }

        let byte_values = decodeAsBits(bit_counts, bit_sequence);
        const key = byte_values[0];

        for ( let byte_index=1; byte_index < byte_count; byte_index++ ) {
            const byte =  byte_values[byte_index];
            const ciphered_byte = (byte + key) % 256;
            byte_values[byte_index] = ciphered_byte;
        }

        const ciphered_bit_sequence = encodeAsBits(bit_counts, byte_values);

        return ciphered_bit_sequence;
    };

    let decipherBits = function(bit_sequence){
        jersi.debug.assert( bit_sequence.length % 8 === 0 );

        const byte_count = bit_sequence.length / 8;
        let bit_counts = [];
        for ( let byte_index=0; byte_index < byte_count; byte_index++ ) {
            bit_counts.push(8)
        }

        let byte_values = decodeAsBits(bit_counts, bit_sequence);
        const key = byte_values[0];

        for ( let byte_index=1; byte_index < byte_count; byte_index++ ) {
            const byte =  byte_values[byte_index];
            const ciphered_byte = (byte + 256 - key) % 256;
            byte_values[byte_index] = ciphered_byte;
        }

        const deciphered_bit_sequence = encodeAsBits(bit_counts, byte_values);

        return deciphered_bit_sequence;
    };

    let compressBits = function(bit_sequence){
        const group_size = 4;

        const compressed_sequence = parseInt(bit_sequence, 2).toString(36);
        let aligned_sequence = compressed_sequence;
        if ( aligned_sequence.length % group_size !== 0 ) {
            aligned_sequence = "0".repeat(group_size - (compressed_sequence.length % group_size)) + compressed_sequence;
        }

        const group_count = aligned_sequence.length/group_size;
        let decorated_sequence = "";
        for (let group_index=0; group_index < group_count ; group_index++) {
            decorated_sequence += aligned_sequence.substr(group_index*group_size, group_size);
            if ( group_index < group_count - 1 ) {
                decorated_sequence += "-";
            }
        }
        return decorated_sequence;
    };

    let uncompressBits = function(compressed_sequence){
        const undecorated_sequence = compressed_sequence.replace("-", "");
        const bit_sequence = padBitSequence(parseInt(undecorated_sequence, 36).toString(2), BIT_TOTAL_COUNT);
        return bit_sequence;
    };

    let key = Math.floor(Math.random()*16*16);

    const test_count = 256;
    for (let test_index=0; test_index <test_count ;  test_index++ )  {
        const action = [ key,
                         Math.floor(Math.random()*10),
                         Math.floor(Math.random()*69),
                         Math.floor(Math.random()*69),
                         Math.floor(Math.random()*69),
                         Math.floor(Math.random()*69)];

        //jersi.debug.writeMessage( "action=" + action );

        const action_bits = encodeAsBits( BIT_COUNTS, action);
        //jersi.debug.writeMessage( "action_bits=" + action_bits + ", action_bits.length=" + action_bits.length );

        const ciphered_action_bits = cipherBits(action_bits);
        //jersi.debug.writeMessage( "ciphered_action_bits=" + ciphered_action_bits + ", ciphered_action_bits.length=" + ciphered_action_bits.length );

        const compressed_ciphered_action = compressBits(ciphered_action_bits);
        //jersi.debug.writeMessage( "compressed_ciphered_action=" + compressed_ciphered_action );

        const uncompressed_ciphered_action_bits = uncompressBits(compressed_ciphered_action);
        //jersi.debug.writeMessage( "uncompressed_ciphered_action_bits=" + uncompressed_ciphered_action_bits + ", uncompressed_ciphered_action_bits.length=" + uncompressed_ciphered_action_bits.length );

        const deciphered_action_bits = decipherBits(uncompressed_ciphered_action_bits);
        //jersi.debug.writeMessage( "deciphered_action_bits=" + deciphered_action_bits + ", deciphered_action_bits.length=" + deciphered_action_bits.length );

        const retrieved_action = decodeAsBits( BIT_COUNTS, deciphered_action_bits);
        //jersi.debug.writeMessage( "retrieved_action=" + retrieved_action );

        jersi.debug.writeMessage( "sent action=" + action + ", message=" + compressed_ciphered_action + ", received action=" + retrieved_action);

        key = (3*key + 5) % 256;

    }
};

jersi.debug.writeMessage = function(text){
    if ( jersi.debug.is_enabled ) {
        jersi.debug.messageCount += 1 ;

        jersi.debug.messages.innerHTML = jersi.debug.messageCount + ":" +
                                              text + "<br/>" + jersi.debug.messages.innerHTML;
    }
};

jersi.debug.writeMousePosition = function(x, y){
    jersi.debug.mousePosition.innerHTML = "Mouse(x,y) = (" + x + ", " + y + ")" ;
};
///////////////////////////////////////////////////////////////////////////////

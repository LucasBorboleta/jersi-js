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

    const ACTION_BIT_SCHEMA = [8, 4, 7, 7, 7, 7];
    const ACTION_BIT_SCHEMA_LENGTH = ACTION_BIT_SCHEMA.reduce(function(sum, x){return sum + x}, 0);

    const BIT_RADIX = 2;
    const BITS_IN_BYTE = 8;
    const BYTE_RADIX = 256;
    const COMPRESSION_RADIX = 36;
    const COMPRESSION_SEPARATOR = "-";

    let firstKey = function(){
        const key = Math.floor(Math.random()*BYTE_RADIX);
        jersi.debug.assert( key >= 0 && key < BYTE_RADIX );
        return key;
    };

    let nextKey = function(key){
        jersi.debug.assert( key >= 0 && key < BYTE_RADIX );
        const a = 5;
        const c = 3;
        const m = BYTE_RADIX;

        /* We just want to ensure a maximal cycle length, no more.

           When c ≠ 0, correctly chosen parameters allow a period equal to m, for all seed values. This will occur if and only if
           1) m and c are relatively prime,
           2) (a - 1) is divisible by all prime factors of m,
           3) (a - 1) is divisible by 4 if m is divisible by 4.

           References:
           [1] Hull, T. E.; Dobell, A. R. (July 1962). "Random Number Generators"
           [2] Knuth, Donald (1997). Seminumerical Algorithms. The Art of Computer Programming. 2 (3rd ed.).
        */
        return (a*key + c) % m;
    };

    let alignBitSequence = function(bit_sequence, bit_length){
        jersi.debug.assert( bit_sequence.length <= bit_length );

        if ( bit_sequence.length < bit_length ) {
            return "0".repeat(bit_length - bit_sequence.length) + bit_sequence;
        } else {
            return bit_sequence;
        }
    };

    let encodeBits = function(bit_schema, int_values){

        jersi.debug.assert( bit_schema.length === int_values.length );
        const value_count = bit_schema.length;

        let bit_sequence = "";

        for (let value_index=0; value_index < value_count; value_index++) {
            jersi.debug.assert( bit_schema[value_index] > 0 );
            jersi.debug.assert( int_values[value_index] >= 0 );

            const value_as_bits = int_values[value_index].toString(BIT_RADIX);
            jersi.debug.assert( value_as_bits.length <= bit_schema[value_index] );

            bit_sequence += alignBitSequence(value_as_bits, bit_schema[value_index]);
        }

        return bit_sequence;
    };


    let decodeBits = function(bit_schema, bit_sequence){

        jersi.debug.assert( bit_schema.reduce(function(sum, x){return sum + x}, 0) === bit_sequence.length );
        const value_count = bit_schema.length;

        let int_values = [];

        let bit_start = 0;
        for (let value_index=0; value_index < value_count; value_index++) {
            jersi.debug.assert( bit_schema[value_index] > 0 );

            const bit_chunk = bit_sequence.substr(bit_start, bit_schema[value_index]);
            const value = parseInt(bit_chunk, BIT_RADIX)
            int_values.push(value);

            bit_start += bit_schema[value_index];
        }

        return int_values;
    };

    let cipherBits = function(bit_sequence){
        jersi.debug.assert( bit_sequence.length % BITS_IN_BYTE === 0 );

        const byte_count = bit_sequence.length / BITS_IN_BYTE;
        let bit_schema = [];
        for ( let byte_index=0; byte_index < byte_count; byte_index++ ) {
            bit_schema.push(BITS_IN_BYTE)
        }

        let byte_values = decodeBits(bit_schema, bit_sequence);
        const key = byte_values[0];

        for ( let byte_index=1; byte_index < byte_count; byte_index++ ) {
            const byte =  byte_values[byte_index];
            const ciphered_byte = (byte + key) % BYTE_RADIX;
            byte_values[byte_index] = ciphered_byte;
        }

        const ciphered_bit_sequence = encodeBits(bit_schema, byte_values);

        return ciphered_bit_sequence;
    };

    let decipherBits = function(bit_sequence){
        jersi.debug.assert( bit_sequence.length % BITS_IN_BYTE === 0 );

        const byte_count = bit_sequence.length / BITS_IN_BYTE;
        let bit_schema = [];
        for ( let byte_index=0; byte_index < byte_count; byte_index++ ) {
            bit_schema.push(BITS_IN_BYTE)
        }

        let byte_values = decodeBits(bit_schema, bit_sequence);
        const key = byte_values[0];

        for ( let byte_index=1; byte_index < byte_count; byte_index++ ) {
            const byte =  byte_values[byte_index];
            const ciphered_byte = (byte + BYTE_RADIX - key) % BYTE_RADIX;
            byte_values[byte_index] = ciphered_byte;
        }

        const deciphered_bit_sequence = encodeBits(bit_schema, byte_values);

        return deciphered_bit_sequence;
    };

    let compressBits = function(bit_sequence){
        const group_size = 4;

        const compressed_sequence = parseInt(bit_sequence, BIT_RADIX).toString(COMPRESSION_RADIX);
        let aligned_sequence = compressed_sequence;
        if ( aligned_sequence.length % group_size !== 0 ) {
            aligned_sequence = "0".repeat(group_size - (compressed_sequence.length % group_size)) + compressed_sequence;
        }

        const group_count = aligned_sequence.length/group_size;
        let decorated_sequence = "";
        for (let group_index=0; group_index < group_count ; group_index++) {
            decorated_sequence += aligned_sequence.substr(group_index*group_size, group_size);
            if ( group_index < group_count - 1 ) {
                decorated_sequence += COMPRESSION_SEPARATOR;
            }
        }
        return decorated_sequence;
    };

    let uncompressBits = function(compressed_sequence){
        const undecorated_sequence = compressed_sequence.replace(COMPRESSION_SEPARATOR, "");
        const bit_sequence = alignBitSequence(parseInt(undecorated_sequence, COMPRESSION_RADIX).toString(BIT_RADIX), ACTION_BIT_SCHEMA_LENGTH);
        return bit_sequence;
    };

    let compileMessage = function(action){
        const action_bits = encodeBits( ACTION_BIT_SCHEMA, action);
        const ciphered_action_bits = cipherBits(action_bits);
        const message = compressBits(ciphered_action_bits);
        return message;
    };

    let decompileMessage = function(message){
        const ciphered_action_bits = uncompressBits(message);
        const deciphered_action_bits = decipherBits(ciphered_action_bits);
        const action = decodeBits( ACTION_BIT_SCHEMA, deciphered_action_bits);
        return action;
    };

    const test_count = BYTE_RADIX + 1;
    let key = firstKey();
    for (let test_index=0; test_index <test_count ;  test_index++ )  {
        const action = [ key,
                         Math.floor(Math.random()*10),
                         Math.floor(Math.random()*69),
                         Math.floor(Math.random()*69),
                         Math.floor(Math.random()*69),
                         Math.floor(Math.random()*69)];

        const message = compileMessage(action);
        const retrieved_action = decompileMessage(message);
        jersi.debug.writeMessage( "sent action=" + action + ", message=" + message + ", received action=" + retrieved_action);

        key = nextKey(key);
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

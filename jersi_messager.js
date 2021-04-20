"use strict";
/* JERSI-JS-COPYRIGHT-MD-BEGIN
# COPYRIGHT

The software JERSI-JS implements the messager of JERSI, which is an abstract/strategy board game. This copyright notice only covers the software JERSI-JS. The copyright of the JERSI messager and board game concept can be found at https://github.com/LucasBorboleta/jersi.

Copyright (C) 2021 Lucas Borboleta (lucas.borboleta@free.fr).

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.

JERSI-JS-COPYRIGHT-MD-END */
///////////////////////////////////////////////////////////////////////////////
jersi.messager = { };
jersi.messager.private = { };
jersi.messager.__initModuleCalled = false;

jersi.messager.__initModule = function(){

    if ( jersi.messager.__initModuleCalled ) return;
    jersi.messager.__initModuleCalled = true;

    // Init required modules
    jersi.debug.__initModule();

    // Init inner classes
    // None

    jersi.messager.ACTION_BIT_SCHEMA = [8, 4, 7, 7, 7, 7]; // (key, action_type, cell_1, cell_2, cell_3, cell_4)
    jersi.messager.ACTION_BIT_SCHEMA_LENGTH = jersi.messager.ACTION_BIT_SCHEMA.reduce(function(sum, x){return sum + x}, 0);

    jersi.debug.assert( jersi.messager.ACTION_BIT_SCHEMA_LENGTH < 53 );
    /*
        A safe integer is an integer that can be exactly represented as an IEEE-754 double precision number
        (all integers from (2^53 - 1) to -(2^53 - 1))

        source: https://www.w3schools.com/ ; see also Number.isSafeInteger()
    */

    jersi.messager.BIT_RADIX = 2;
    jersi.messager.BITS_IN_BYTE = 8;
    jersi.messager.BYTE_RADIX = 256;
    jersi.messager.COMPRESSION_RADIX = 36;
    jersi.messager.COMPRESSION_SEPARATOR = "-";

    jersi.debug.writeMessage( "jersi.messager.__initModule(): done" );
};

// --- JERSI_BEGIN: public ---

jersi.messager.compileMessage = function(action){
    const action_bits = jersi.messager.private.encodeBits( jersi.messager.ACTION_BIT_SCHEMA, action);
    const ciphered_action_bits = jersi.messager.private.cipherBits(action_bits);
    const message = jersi.messager.private.compressBits(ciphered_action_bits);
    return message;
};

jersi.messager.decompileMessage = function(message){
    const ciphered_action_bits = jersi.messager.private.uncompressBits(message);
    const deciphered_action_bits = jersi.messager.private.decipherBits(ciphered_action_bits);
    const action = jersi.messager.private.decodeBits( jersi.messager.ACTION_BIT_SCHEMA, deciphered_action_bits);
    return action;
};

jersi.messager.testMessager = function(){

    const test_count = jersi.messager.BYTE_RADIX ;

    const initial_key = jersi.messager.private.firstKey();
    let key = initial_key;

    for ( let test_index=0; test_index <test_count ;  test_index++ )  {
        const action = [ key,
                         Math.floor(Math.random()*10),
                         Math.floor(Math.random()*69),
                         Math.floor(Math.random()*69),
                         Math.floor(Math.random()*69),
                         Math.floor(Math.random()*69)];

        const message = jersi.messager.compileMessage(action);
        const retrieved_action = jersi.messager.decompileMessage(message);

        if ( true && test_index < 3 ) {
            jersi.debug.writeMessage( "jersi.messager.testMessager: sent action=" + action +
            ", message=" + message + ", received action=" + retrieved_action);
        }

        jersi.debug.assert( retrieved_action[0] === action[0] ); // key
        jersi.debug.assert( retrieved_action[1] === action[1] ); // action type
        jersi.debug.assert( retrieved_action[2] === action[2] ); // cell 1
        jersi.debug.assert( retrieved_action[3] === action[3] ); // cell 2
        jersi.debug.assert( retrieved_action[4] === action[4] ); // cell 3
        jersi.debug.assert( retrieved_action[5] === action[5] ); // cell 4

        if ( test_index !== 0 ) {
            jersi.debug.assert( key !== initial_key );
        }

        key = jersi.messager.private.nextKey(key);
    }
    jersi.debug.assert( key === initial_key ); // key has cycled

    jersi.debug.writeMessage( "jersi.messager.testMessager: done" );
};

// --- JERSI_END: public ---

// --- JERSI_BEGIN: private ---

jersi.messager.private.alignBitSequence = function(bit_sequence, bit_length){
    jersi.debug.assert( bit_sequence.length <= bit_length );

    if ( bit_sequence.length < bit_length ) {
        return "0".repeat(bit_length - bit_sequence.length) + bit_sequence;
    } else {
        return bit_sequence;
    }
};

jersi.messager.private.cipherBits = function(bit_sequence){
    jersi.debug.assert( bit_sequence.length % jersi.messager.BITS_IN_BYTE === 0 );

    const byte_count = bit_sequence.length / jersi.messager.BITS_IN_BYTE;
    let bit_schema = [];
    for ( let byte_index=0; byte_index < byte_count; byte_index++ ) {
        bit_schema.push(jersi.messager.BITS_IN_BYTE)
    }

    let byte_values = jersi.messager.private.decodeBits(bit_schema, bit_sequence);
    const key = byte_values[0];

    for ( let byte_index=1; byte_index < byte_count; byte_index++ ) {
        const byte =  byte_values[byte_index];
        const ciphered_byte = (byte + key) % jersi.messager.BYTE_RADIX;
        byte_values[byte_index] = ciphered_byte;
    }

    const ciphered_bit_sequence = jersi.messager.private.encodeBits(bit_schema, byte_values);

    return ciphered_bit_sequence;
};

jersi.messager.private.compressBits = function(bit_sequence){
    const group_size = 4;

    const compressed_sequence = parseInt(bit_sequence, jersi.messager.BIT_RADIX).toString(jersi.messager.COMPRESSION_RADIX);
    let aligned_sequence = compressed_sequence;
    if ( aligned_sequence.length % group_size !== 0 ) {
        aligned_sequence = "0".repeat(group_size - (compressed_sequence.length % group_size)) + compressed_sequence;
    }

    const group_count = aligned_sequence.length/group_size;
    let decorated_sequence = "";
    for (let group_index=0; group_index < group_count ; group_index++) {
        decorated_sequence += aligned_sequence.substr(group_index*group_size, group_size);
        if ( group_index < group_count - 1 ) {
            decorated_sequence += jersi.messager.COMPRESSION_SEPARATOR;
        }
    }
    return decorated_sequence;
};

jersi.messager.private.decipherBits = function(bit_sequence){
    jersi.debug.assert( bit_sequence.length % jersi.messager.BITS_IN_BYTE === 0 );

    const byte_count = bit_sequence.length / jersi.messager.BITS_IN_BYTE;
    let bit_schema = [];
    for ( let byte_index=0; byte_index < byte_count; byte_index++ ) {
        bit_schema.push(jersi.messager.BITS_IN_BYTE)
    }

    let byte_values = jersi.messager.private.decodeBits(bit_schema, bit_sequence);
    const key = byte_values[0];

    for ( let byte_index=1; byte_index < byte_count; byte_index++ ) {
        const byte =  byte_values[byte_index];
        const ciphered_byte = (byte + jersi.messager.BYTE_RADIX - key) % jersi.messager.BYTE_RADIX;
        byte_values[byte_index] = ciphered_byte;
    }

    const deciphered_bit_sequence = jersi.messager.private.encodeBits(bit_schema, byte_values);

    return deciphered_bit_sequence;
};

jersi.messager.private.decodeBits = function(bit_schema, bit_sequence){

    jersi.debug.assert( bit_schema.reduce(function(sum, x){return sum + x}, 0) === bit_sequence.length );
    const value_count = bit_schema.length;

    let int_values = [];

    let bit_start = 0;
    for (let value_index=0; value_index < value_count; value_index++) {
        jersi.debug.assert( bit_schema[value_index] > 0 );

        const bit_chunk = bit_sequence.substr(bit_start, bit_schema[value_index]);
        const value = parseInt(bit_chunk, jersi.messager.BIT_RADIX)
        int_values.push(value);

        bit_start += bit_schema[value_index];
    }

    return int_values;
};

jersi.messager.private.encodeBits = function(bit_schema, int_values){

    jersi.debug.assert( bit_schema.length === int_values.length );
    const value_count = bit_schema.length;

    let bit_sequence = "";

    for (let value_index=0; value_index < value_count; value_index++) {
        jersi.debug.assert( bit_schema[value_index] > 0 );
        jersi.debug.assert( int_values[value_index] >= 0 );

        const value_as_bits = int_values[value_index].toString(jersi.messager.BIT_RADIX);
        jersi.debug.assert( value_as_bits.length <= bit_schema[value_index] );

        bit_sequence += jersi.messager.private.alignBitSequence(value_as_bits, bit_schema[value_index]);
    }

    return bit_sequence;
};

jersi.messager.private.firstKey = function(){
    const key = Math.floor(Math.random()*jersi.messager.BYTE_RADIX);
    jersi.debug.assert( key >= 0 && key < jersi.messager.BYTE_RADIX );
    return key;
};

jersi.messager.private.nextKey = function(key){
    jersi.debug.assert( key >= 0 && key < jersi.messager.BYTE_RADIX );
    const a = 5;
    const c = 3;
    const m = jersi.messager.BYTE_RADIX;

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

jersi.messager.private.uncompressBits = function(compressed_sequence){
    const separator_rule = new RegExp(jersi.messager.COMPRESSION_SEPARATOR, "g")
    const undecorated_sequence = compressed_sequence.replace(separator_rule, "");
    const bit_sequence = jersi.messager.private.alignBitSequence(
                            parseInt(undecorated_sequence, jersi.messager.COMPRESSION_RADIX)
                            .toString(jersi.messager.BIT_RADIX), jersi.messager.ACTION_BIT_SCHEMA_LENGTH);
    return bit_sequence;
};

// --- JERSI_END: private ---

//////////////////////////////////////////////////////////////////////////

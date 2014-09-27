
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Mock writing to a stream:
	mockWrite = require( 'flow-mock-write' ),

	// Mock reading from a stream:
	mockRead = require( 'flow-mock-read' ),

	// Module to be tested:
	stream = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'flow-to-string', function tests() {
	'use strict';

	it( 'should export a function', function test() {
		expect( stream ).to.be.a( 'function' );
	});

	it( 'should do something' );

});

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Transform stream class:
	Transform = require( 'stream' ).Transform,

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

	it( 'should throw an error if provided options is not an object', function test() {
		var values = [
				5,
				'5',
				true,
				NaN,
				null,
				undefined,
				[],
				function(){}
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				stream( value );
			};
		}
	});

	it( 'should throw an error if objectMode option is not a boolean', function test() {
		var values = [
				5,
				{},
				'5',
				NaN,
				undefined,
				[],
				function(){}
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				stream( {'objectMode': value} );
			};
		}
	});

	it( 'should throw an error if high watermark option is not a number greater than or equal to 0', function test() {
		var values = [
				-5,
				'5',
				{},
				true,
				NaN,
				null,
				undefined,
				[],
				function(){}
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				stream( {'highWaterMark': value} );
			};
		}
	});

	it( 'should throw an error if allowHalfOpen option is not a boolean', function test() {
		var values = [
				5,
				{},
				'5',
				NaN,
				undefined,
				[],
				function(){}
			];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}

		function badValue( value ) {
			return function() {
				stream( {'allowHalfOpen': value} );
			};
		}
	});

	it( 'should return a transform stream', function test() {
		var opts = {
				'objectMode': true,
				'highWaterMark': 16,
				'allowHalfOpen': true
			};
		assert.instanceOf( stream( opts ), Transform );
	});

	it( 'should convert each stream datum to a string when in object mode', function test( done ) {
		var data = [
				1,
				'2',
				false,
				NaN,
				undefined,
				function(){},
				{},
				[]
			],
			expected = [
				'1',
				'2',
				'false',
				'NaN',
				'undefined',
				'function (){}',
				'{}',
				'[]'
			];

		var s = stream({
				'objectMode': true
			});

		mockRead( s, onData );
		mockWrite( data, s );

		function onData( error, actual ) {
			if ( error ) {
				assert.notOk( true );
				return;
			}
			assert.deepEqual( expected, actual );
			done();
		}
	});

	it( 'should convert each stream buffer to a string when in not object mode', function test( done ) {
		var data = [
				new Buffer( 'beep,boop,bop')
			],
			expected = [
				'beep,boop,bop'
			];

		var s = stream();

		mockRead( s, onData );
		mockWrite( data, s );

		function onData( error, actual ) {
			if ( error ) {
				assert.notOk( true );
				return;
			}
			assert.deepEqual( expected, actual );
			done();
		}
	});

	it( 'should allow for undefined values to be arbitrarily defined', function test( done ) {
		var data = [
				undefined
			],
			expected = [
				'BEEP'
			];

		var s = stream({
				'objectMode': true,
				'isUndefined': 'BEEP'
			});

		mockRead( s, onData );
		mockWrite( data, s );

		function onData( error, actual ) {
			if ( error ) {
				assert.notOk( true );
				return;
			}
			assert.deepEqual( expected, actual );
			done();
		}
	});

});
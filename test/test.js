
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Transform stream class:
	Transform = require( 'readable-stream' ).Transform,

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

	describe( 'class', function tests() {

		it( 'should export a function', function test() {
			expect( stream ).to.be.a( 'function' );
		});

		it( 'should throw an error if not provided a bad option', function test() {
			expect( foo ).to.throw( TypeError );

			function foo() {
				stream({'objectMode': []});
			}
		});

		it( 'should return a transform stream', function test() {
			var opts = {
					'encoding': 'utf8',
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

		it( 'should honor alternative encodings', function test( done ) {
			var data = ' ',
				expected = ' ';

			var s = stream();

			s.on( 'data', onData );
			s.write( data, 'ascii' );

			function onData( actual ) {
				console.log( typeof actual );
				assert.strictEqual( expected, actual );
				done();
			}
		});

		it( 'can be destroyed', function test( done ) {
			var s = stream();
			s.on( 'close', function onClose() {
				assert.ok( true );
				done();
			});
			s.destroy();
		});

		it( 'can be destroyed more than once', function test( done ) {
			var s = stream();
			s.on( 'close', function onClose() {
				assert.ok( true );
				done();
			});
			s.destroy();
			s.destroy();
		});

		it( 'can be destroyed with an error', function test( done ) {
			var s = stream();
			s.on( 'error', function onError( error ) {
				if ( error ) {
					assert.ok( true );
					return;
				}
				assert.notOk( true );
			});
			s.on( 'close', function onClose() {
				assert.ok( true );
				done();
			});
			s.destroy( new Error('beep') );
		});

	});

	describe( 'objectMode', function tests() {

		it( 'should export a function to create streams only operating in objectMode', function test() {
			expect( stream.objectMode ).to.be.a( 'function' );
		});

		it( 'should return a stream in object mode', function test( done ) {
			var Stream = stream,
				toString = stream.objectMode,
				opts,
				s,
				data,
				expected;

			// Returns Stream instance:
			assert.instanceOf( toString(), Stream );

			// Sets the objectMode option:
			opts = {
				'objectMode': false
			};
			s = toString( opts );
			assert.strictEqual( opts.objectMode, true );

			// Behaves as expected:
			data = [1,2,3,4];
			expected = ['1', '2', '3', '4' ];

			s = toString();
			mockWrite( data, s );
			mockRead( s, onData );

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

	describe( 'factory', function tests() {

		it( 'should export a reusable stream factory', function test() {
			expect( stream.factory ).to.be.a('function' );
			expect( stream.factory() ).to.be.a( 'function' );
		});

		it( 'should return a stream from the factory', function test() {
			var Stream = stream,
				opts = {'objectMode': true},
				factory = stream.factory( opts );

			assert.instanceOf( factory(), Stream );
		});

	});

});
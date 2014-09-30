var toString = require( './../lib' ),
	append = require( 'flow-append' ).objectMode,
	fromArray = require( 'flow-from-array' );

// Create some data...
var data = new Array( 1000 );
for ( var i = 0; i < data.length; i++ ) {
	data[ i ] = Math.random();
}

// Create a readable stream:
var readableStream = fromArray( data );

// Pipe the data:
readableStream
	.pipe( toString() )
	.pipe( append( '\n' ) )
	.pipe( process.stdout );
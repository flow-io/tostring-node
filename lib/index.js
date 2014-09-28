/**
*
*	STREAM: to-string
*
*
*	DESCRIPTION:
*		- Transform stream which converts each datum to a string.
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var Transform = require( 'readable-stream' ).Transform,
		isObject = require( 'validate.io-object' ),
		validate = require( './validate.js' );


	// FUNCTIONS //

	/**
	* FUNCTION: copyOptions( options )
	*	Copies relevant stream options into a new object.
	*
	* @private
	* @param {Object} options - stream options
	* @returns {Object} options copy
	*/
	function copyOptions( options ) {
		var props = [
				'objectMode',
				'highWaterMark',
				'allowHalfOpen',
				'encoding',
				'decodeStrings',
				'isUndefined'
			],
			copy = {},
			prop;

		for ( var i = 0; i < props.length; i++ ) {
			prop = props[ i ];
			if ( options.hasOwnProperty( prop ) ) {
				copy[ prop ] = options[ prop ];
			}
		}
		return copy;
	} // end FUNCTION copyOptions()

	/**
	* FUNCTION: setOptions( options )
	*	Sets stream specific options.
	*
	* @private
	* @param {Object} options - stream options
	*/
	function setOptions( options ) {
		options.decodeStrings = false;
		if ( !options.hasOwnProperty( 'isUndefined' ) ) {
			options.isUndefined = 'undefined';
		}
	} // end FUNCTION setOptions()


	// STREAM //

	/**
	* FUNCTION: Stream( [options] )
	*	Transform stream constructor.
	*
	* @constructor
	* @param {Object} [options] - Transform stream options
	* @returns {Stream} Transform stream
	*/
	function Stream( options ) {
		if ( !arguments.length ) {
			options = {};
		}
		if ( !( this instanceof Stream ) ) {
			return new Stream( options );
		}
		var err = validate( options );
		if ( err ) {
			throw err;
		}
		setOptions( options );
		this._isUndefined = options.isUndefined;

		Transform.call( this, options );
		this._readableState.objectMode = true;
		this._destroyed = false;

		return this;
	} // end FUNCTION Stream()

	/**
	* Create a prototype which inherits from the parent prototype.
	*/
	Stream.prototype = Object.create( Transform.prototype );

	/**
	* Set the constructor.
	*/
	Stream.prototype.constructor = Stream;

	/**
	* METHOD: _transform( chunk, encoding, clbk )
	*	Implements the `_transform` method to accept input and produce output.
	*
	* @private
	* @param {Buffer|String} chunk - the chunk to be transformed
	* @param {String} encoding - chunk encoding
	* @param {Function} clbk - callback invoking after transforming a chunk
	*/
	Stream.prototype._transform = function( chunk, encoding, clbk ) {
		if ( Buffer.isBuffer( chunk ) ) {
			this.push( chunk.toString() );
		}
		else if ( isObject( chunk ) || Array.isArray( chunk ) ) {
			this.push( JSON.stringify( chunk ) );
		}
		else if ( chunk === undefined ) {
			this.push( '' + this._isUndefined );
		}
		else if ( typeof chunk === 'string' ) {
			this.push( chunk.toString( encoding ) );
		}
		else {
			this.push( chunk.toString() );
		}
		clbk();
	}; // end METHOD _transform()

	/**
	* METHOD: _flush( clbk )
	*	Implements the `_flush` method to handle any remaining data.
	*
	* @private
	* @param {Function} clbk - callback to invoke after handling remaining data
	*/
	Stream.prototype._flush = function( clbk ) {
		clbk();
	}; // end METHOD _flush()

	/**
	* METHOD: destroy( [error] )
	*	Gracefully destroys a stream, providing backwards compatibility.
	*
	* @param {Object} [error] - optional error message
	* @returns {Stream} Stream instance
	*/
	Stream.prototype.destroy = function( error ) {
		if ( this._destroyed ) {
			return;
		}
		var self = this;
		this._destroyed = true;
		process.nextTick( function destroy() {
			if ( error ) {
				self.emit( 'error', error );
			}
			self.emit( 'close' );
		});
		return this;
	}; // end METHOD destroy()


	// OBJECT MODE //

	/**
	* FUNCTION: objectMode( [options] )
	*	Returns a stream with `objectMode` set to `true`.
	*
	* @param {Object} [options] - Transform stream options
	* @returns {Stream} Transform stream
	*/
	function objectMode( options ) {
		if ( !arguments.length ) {
			options = {};
		}
		options.objectMode = true;
		return new Stream( options );
	} // end FUNCTION objectMode()


	// FACTORY //

	/**
	* FUNCTION: streamFactory( [options] )
	*	Creates a reusable stream factory.
	*
	* @param {Object} [options] - Transform stream options
	* @returns {Function} stream factory
	*/
	function streamFactory( options ) {
		if ( !arguments.length ) {
			options = {};
		}
		options = copyOptions( options );
		/**
		* FUNCTION: createStream()
		*	Creates a stream.
		*
		* @returns {Stream} Transform stream
		*/
		return function createStream() {
			return new Stream( options );
		};
	} // end METHOD streamFactory()


	// EXPORTS //

	module.exports = Stream;
	module.exports.objectMode = objectMode;
	module.exports.factory = streamFactory;

})();
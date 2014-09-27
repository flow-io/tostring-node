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

	var Transform = require( 'stream' ).Transform,
		isObject = require( 'validate.io-object' );


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
		var mode, hwMark, half;
		if ( arguments.length ) {
			if ( !isObject( options ) ) {
				throw new TypeError( 'Stream()::invalid input argument. Options must be an object.' );
			}
		} else {
			options = {};
		}

		if ( !( this instanceof Stream ) ) {
			return new Stream( options );
		}

		if ( options.hasOwnProperty( 'objectMode' ) ) {
			mode = options.objectMode;
			if ( typeof mode !== 'boolean' ) {
				throw new TypeError( 'Stream()::invalid input argument. objectMode must be a boolean.' );
			}
		}
		if ( options.hasOwnProperty( 'highWaterMark' ) ) {
			hwMark = options.highWaterMark;
			if ( typeof hwMark !== 'number' || hwMark !== hwMark || hwMark < 0 ) {
				throw new TypeError( 'Stream()::invalid input argument. High watermark must be numeric and greater than 0.' );
			}
		}
		if ( options.hasOwnProperty( 'allowHalfOpen' ) ) {
			half = options.allowHalfOpen;
			if ( typeof half !== 'boolean' ) {
				throw new TypeError( 'Stream()::invalid input argument. allowHalfOpen option must be a boolean.' );
			}
		}

		options.decodeStrings = false;

		Transform.call( this, options );
		this._readableState.objectMode = true;

		this._isUndefined = 'undefined';
		if ( options.hasOwnProperty( 'isUndefined' ) ) {
			this._isUndefined = options.isUndefined;
		}
		
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


	// EXPORTS //

	module.exports = Stream;

})();
to-string
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> [Transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform) which converts each datum to a string.


## Installation

``` bash
$ npm install flow-to-string
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

To use the module,

``` javascript
var toString = require( 'flow-to-string' );
```

#### toString( [options] )

Returns a transform `stream` where each `chunk` is converted to a `string`. 

A few notes:
* 	the output (readable) stream __always__ operates in `objectMode`
* 	the input (writable) stream __never__ decodes strings (`decodeStrings=false`)
* 	all other Transform `options` are honored: `encoding`, `highWaterMark`, `allowHalfOpen`, and `objectMode` (writable)

One additional option is provided: `isUndefined`. The `isUndefined` option specifies how to represent `undefined` values as `strings`. By default, an `undefined` value is represented as `"undefined"`.

To create a stream,

``` javascript
var stream = toString();
```

The default options are as follows:
*	`highWaterMark=16`
*	`encoding=null`
*	`allowHalfOpen=true`
*	`isUndefined="undefined"`
* 	`objectMode=false`

To set the `options` when creating a stream,

``` javascript
var opts = {
		'encoding': 'utf8',
		'highWaterMark': 8,
		'allowHalfOpen': false,
		'objectMode': true,
		'isUndefined': 'BEEP'
	};

stream = toString( opts );
```


#### toString.factory( [options] )

Returns a reusable stream factory. The factory method ensures streams are configured identically by using the same set of provided `options`.

``` javascript
var opts = {
		'encoding': 'utf8',
		'highWaterMark': 8,
		'allowHalfOpen': false,
		'objectMode': true,
		'isUndefined': 'BEEP'
	};

var factory = toString.factory( opts );

var streams = new Array( 10 );

// Create many streams configured identically but may each be independently written to...
for ( var i = 0; i < streams.length; i++ ) {
	streams[ i ] = factory();
}
```


#### toString.objectMode( [options] )

This method is a convenience function to create transform streams which always operate in `objectMode`. The method will __always__ override the `objectMode` option in `options`.

``` javascript
var readArray, toString;

readArray = require( 'flow-read-array' ).objectMode;
toString = require( 'flow-to-string' ).objectMode;

readArray( [1,2,3,4] )
	.pipe( toString() )
	.pipe( process.stdout );
```



## Examples

``` javascript
var toString = require( 'flow-to-string' ),
	newline = require( 'flow-newline' ),
	readArray = require( 'flow-read-array' );

// Create some data...
var data = new Array( 1000 );
for ( var i = 0; i < data.length; i++ ) {
	data[ i ] = Math.random();
}

// Create a readable stream:
var readStream = readArray( data );

// Pipe the data:
readStream
	.pipe( toString() )
	.pipe( newline() )
	.pipe( process.stdout );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ open reports/coverage/lcov-report/index.html
```


## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/flow-to-string.svg
[npm-url]: https://npmjs.org/package/flow-to-string

[travis-image]: http://img.shields.io/travis/flow-io/to-string-node/master.svg
[travis-url]: https://travis-ci.org/flow-io/to-string-node

[coveralls-image]: https://img.shields.io/coveralls/flow-io/to-string-node/master.svg
[coveralls-url]: https://coveralls.io/r/flow-io/to-string-node?branch=master

[dependencies-image]: http://img.shields.io/david/flow-io/to-string-node.svg
[dependencies-url]: https://david-dm.org/flow-io/to-string-node

[dev-dependencies-image]: http://img.shields.io/david/dev/flow-io/to-string-node.svg
[dev-dependencies-url]: https://david-dm.org/dev/flow-io/to-string-node

[github-issues-image]: http://img.shields.io/github/issues/flow-io/to-string-node.svg
[github-issues-url]: https://github.com/flow-io/to-string-node/issues
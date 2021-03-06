toString
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> [Transform stream](http://nodejs.org/api/stream.html#stream_class_stream_transform) which converts each datum to a string.


## Installation

``` bash
$ npm install flow-tostring
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

To use the module,

``` javascript
var toString = require( 'flow-tostring' );
```

#### toString( [options] )

Returns a transform `stream` where each `chunk` is converted to a `string`. To create a new stream,

``` javascript
var stream = toString();
```

The default options are as follows:
*	`highWaterMark=16`
*	`encoding=null`
*	`allowHalfOpen=true`
* 	`objectMode=false`
*	`decodeStrings=true`

To set the `options` when creating a stream,

``` javascript
var opts = {
		'encoding': 'utf8',
		'highWaterMark': 8,
		'allowHalfOpen': false,
		'objectMode': true,
		'decodeStrings': false
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
		'decodeStrings': false
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
var fromArray, toString;

fromArray = require( 'flow-from-array' ).objectMode;
toString = require( 'flow-tostring' ).objectMode;

fromArray( [1,2,3,4] )
	.pipe( toString() )
	.pipe( process.stdout );
```



## Examples

``` javascript
var toString = require( 'flow-tostring' ),
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
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Notes

The output (readable) stream __always__ operates in `objectMode`.

When in `objectMode`, anything which is not a `buffer` or a `string` is coerced into being a `string`. Values are stringified according to the following conventions:

*	`undefined`: `"undefined"`
*	`number`: `<number>.toString()`
*	`boolean`: `<boolean>.toString()`
*	`function`: `<function>.toString()`
*	`array`: `JSON.stringify( <array> )`
*	`object`: `JSON.stringify( <object> )`

The only value which cannot be converted to a `string` is `null` due to the special status `null` has in Node.js streams.

With the exception of `arrays` and `objects`, the conventions follow the [ES5 specification](http://es5.github.io/#x9.8). `arrays` and `objects` are more conveniently stringified.

Note that the stringified values are buffered according to the `encoding` option. If the `encoding` is `null` (default), buffering assumes `utf8` encoding. 


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

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


[npm-image]: http://img.shields.io/npm/v/flow-tostring.svg
[npm-url]: https://npmjs.org/package/flow-tostring

[travis-image]: http://img.shields.io/travis/flow-io/tostring-node/master.svg
[travis-url]: https://travis-ci.org/flow-io/tostring-node

[coveralls-image]: https://img.shields.io/coveralls/flow-io/tostring-node/master.svg
[coveralls-url]: https://coveralls.io/r/flow-io/tostring-node?branch=master

[dependencies-image]: http://img.shields.io/david/flow-io/tostring-node.svg
[dependencies-url]: https://david-dm.org/flow-io/tostring-node

[dev-dependencies-image]: http://img.shields.io/david/dev/flow-io/tostring-node.svg
[dev-dependencies-url]: https://david-dm.org/dev/flow-io/tostring-node

[github-issues-image]: http://img.shields.io/github/issues/flow-io/tostring-node.svg
[github-issues-url]: https://github.com/flow-io/tostring-node/issues

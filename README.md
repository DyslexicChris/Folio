folio.js
=====

[![npm version](https://img.shields.io/npm/v/folio.js.svg?style=flat)](https://www.npmjs.com/package/folio.js)
[![License](https://img.shields.io/npm/l/folio.js.svg?style=flat)](https://www.npmjs.com/package/folio.js)
[![Build Status](https://travis-ci.org/DyslexicChris/Folio.svg?branch=master)](https://travis-ci.org/DyslexicChris/Folio)
[![Dependency Status](https://david-dm.org/DyslexicChris/Folio.svg)](https://david-dm.org/DyslexicChris/Folio)
[![devDependency Status](https://david-dm.org/DyslexicChris/Folio/dev-status.svg)](https://david-dm.org/DyslexicChris/Folio#info=devDependencies)
[![Code Climate](https://codeclimate.com/github/DyslexicChris/Folio/badges/gpa.svg)](https://codeclimate.com/github/DyslexicChris/Folio)
[![Coverage Status](https://img.shields.io/coveralls/DyslexicChris/Folio.svg)](https://coveralls.io/r/DyslexicChris/Folio)

A fluent Node.js HTTP API framework inspired by express

## Install

The best way to add folio.js to your project is to use ```npm```. 

```bash
npm install folio.js --save
```

## Basic Example
```javascript
// Require folio.js
var Folio = require('folio.js');

// Create a new folio.js application
var myApp = new Folio();

/*
 * Define a route for GET /hello-world/:variableA/with/:variableB where
 * :variableA and :variableB are variable components. The route is to use
 * three middleware and should use the given handler.
 */
myApp.get('/hello-world/:variableA/with/:variableB')
	.middleware(myMiddlewareA, myMiddlewareB, myMiddlewareC)
	.handler(myHelloWorldHandler);

/*
 * Define a route for POST /hello-world with no route specific middleware,
 * but given a handler.
 */
myApp.post('/hello-world').handler(myPostHandler);

// Specify a set of middleware to use for all routes.
myApp.use(myGlobalMiddlewareA, myGlobalMiddlewareB).forAllRoutes();

// Specify a set of middleware to use for GET routes.
myApp.use(myGlobalPostMiddleware).forAllPosts();

// Start the server, and have it listen for requests on port 3000.
myapp.start(3000);
```

## Middleware Functions

```javascript
var exampleMiddleware = function(request, response, next) {
	
	/* 
	 * Do what the middleware needs to do, then call next() if the
	 * handling chain should be continued - otherwise terminate
	 * the response.
	 */

	if(authorised(request)) {
		// Continue with handling chain.
		next();
	} else {
		// Terminate response.
		response.statusCode = 401;
		response.end();
	}
};
```

## Handler Functions

```javascript
var exampleHandler = function(request, response) {
	
	var variableA = request.params['variableA'];
	var variableB = request.params['variableB'];

	myDatabase.findMyObject(variableA, variableB, function(result){
	    response.send(result);
	});
};
```

# License
```
The MIT License (MIT)

Copyright (c) 2014 Chris Hargreaves

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
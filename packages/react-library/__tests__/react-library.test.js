'use strict';

const reactLibrary = require('..');
const assert = require('assert').strict;

assert.strictEqual(reactLibrary(), 'Hello from reactLibrary');
console.info('reactLibrary tests passed');

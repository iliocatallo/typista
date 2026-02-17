/* jshint node: true, esversion: 6 */
'use strict';

const {test}    = require('node:test'),
      assert    = require('node:assert/strict'),
      {data, $} = require('../lib/data');

test('A structured type must have a name', function () {
    assert.throws(() => data());
});

test('A structured type can be inhabited by 0-arity constructors', function () {
    const Level = data('Level');
    Level.$ = $.High
            | $.Medium
            | $.Low;

    assert.ok(Level.High);
});

test('A structured type can be inhabited by n-arity constructors', function () {
    const Result = data('Result');
    Result.$ = $.Ok('x')
             | $.Error('err');

    assert.ok(Result.Ok);
    assert.ok(Result.Error);
});

test('A structured type can be inhabited by constructors of different arities', function () {
    const Maybe = data('Maybe');
    Maybe.$ = $.Nothing
            | $.Just('x');

    assert.ok(Maybe.Nothing);
    assert.ok(Maybe.Just);
});

test('A structured type is inhabitable exactly once', function () {
    const Void = data('Void');
    Void.$ = $.Void;

    assert.throws(() => Void.$ = $.Void);
});

test('A structured type can only be inhabited by constructors', function () {
    const Level = data('Level');

    assert.throws(() => Level.$ = 5);
});

test('A structured type is a named constructor function', function () {
    const Level = data('Level');
    Level.$ = $.High
            | $.Medium
            | $.Low;

    assert.equal(typeof Level, 'function');
    assert.equal(Level.name, 'Level');
});

test('A structured type cannot be instantied', function () {
    const Level = data('Level');
    Level.$ = $.High
            | $.Medium
            | $.Low;

    assert.throws(() => new Level(), err => err instanceof TypeError);
});

test('A constructor of a structured type is a named constructor function', function () {
    const Maybe = data('Maybe');
    Maybe.$ = $.Nothing
            | $.Just('x');

    assert.equal(typeof Maybe.Nothing, 'function');
    assert.equal(typeof Maybe.Just, 'function');
    assert.equal(Maybe.Nothing.name, 'Nothing');
    assert.equal(Maybe.Just.name, 'Just');
    assert.equal(Maybe.Nothing.length, 0);
    assert.equal(Maybe.Just.length, 1);
});

test('A constructor of a structured type can be invoked with or without new', function () {
    const Maybe = data('Maybe');
    Maybe.$ = $.Nothing
            | $.Just('x');

    assert.doesNotThrow(() => new Maybe.Nothing());
    assert.doesNotThrow(() => Maybe.Nothing());
    assert.doesNotThrow(() => new Maybe.Just(5));
    assert.doesNotThrow(() => Maybe.Just(5));
});

test('A constructor of a structured type creates instances of itself', function () {
    const Maybe = data('Maybe');
    Maybe.$ = $.Nothing
            | $.Just('x');

    assert(Maybe.Just(5) instanceof Maybe.Just);
    assert(Maybe.Nothing() instanceof Maybe.Nothing);
});

test('A constructor of a structured type creates instances of its structured type', function () {
    const Maybe = data('Maybe');
    Maybe.$ = $.Nothing
            | $.Just('x');

    assert(Maybe.Just(5) instanceof Maybe);
    assert(Maybe.Nothing() instanceof Maybe);
});

test('A constructor of a structured type includes the structured type in its prototype chain', function () {
    const Maybe = data('Maybe');
    Maybe.$ = $.Nothing
            | $.Just('x');

    assert.ok(Maybe.isPrototypeOf(Maybe.Nothing));
    assert.ok(Maybe.isPrototypeOf(Maybe.Just));
});

test('A value of a structured type is deconstructible to its components', function () {
    const These = data('These');
    These.$ = $.This('x')
            | $.That('y')
            | $.Both('x', 'y');

    const {x, y} = These.Both(1, 2);
    assert.equal(x, 1);
    assert.equal(y, 2);
});
/* jshint node: true, esversion: 6 */
/* jshint -W030 */
'use strict';

const {test}    = require('uvu'),
      {data, $} = require('../lib/data'),
      {expect}  = require('chai');

test('A structured type must have a name', function () {
    expect(() => data()).to.throw();
});

test('can be inhabited by 0-arity constructors', function () {
    const Level = data('Level');
    Level.$ = $.High
            | $.Medium
            | $.Low;

    expect(Level.High).to.exist;
});

test('A structured type can be inhabited by n-arity constructors', function () {
    const Result = data('Result');
    Result.$ = $.Ok('x')
             | $.Error('err');

    expect(Result.Ok).to.exist;
    expect(Result.Error).to.exist;
});

test('A structured type can be inhabited by constructors of different arities', function () {
    const Maybe = data('Maybe');
    Maybe.$ = $.Nothing
            | $.Just('x');

    expect(Maybe.Nothing).to.exist;
    expect(Maybe.Just).to.exist;
});

test('A structured type is inhabitable exactly once', function () {
    const Void = data('Void');
    Void.$ = $.Void;
    expect(() => Void.$ = $.Void).to.throw();
});

test('A structured type can only be inhabited by constructors', function () {
    const Level = data('Level');
    expect(() => Level.$ = 5).to.throw();
});

test('A structured type is a named constructor function', function () {
    const Level = data('Level');
    Level.$ = $.High
            | $.Medium
            | $.Low;

    expect(Level).to.be.a('function');
    expect(Level.name).to.be.equal('Level');
});

test('A structured type cannot be instantied', function () {
    const Level = data('Level');
    Level.$ = $.High
            | $.Medium
            | $.Low;

    expect(() => new Level()).to.throw(TypeError);
});

test('A constructor of a structured type is a named constructor function', function () {
    const Maybe = data('Maybe');
    Maybe.$ = $.Nothing
            | $.Just('x');

    expect(Maybe.Nothing).to.be.a('function');
    expect(Maybe.Just).to.be.a('function');
    expect(Maybe.Nothing.name).to.equal('Nothing');
    expect(Maybe.Just.name).to.equal('Just');
    expect(Maybe.Nothing.length).to.equal(0);
    expect(Maybe.Just.length).to.equal(1);
});

test('A constructor of a structured type can be invoked with or without new', function () {
    const Maybe = data('Maybe');
    Maybe.$ = $.Nothing
            | $.Just('x');

    expect(() => new Maybe.Nothing()).to.not.throw;
    expect(() => Maybe.Nothing()).to.not.throw;
    expect(() => new Maybe.Just(5)).to.not.throw;
    expect(() => Maybe.Just(5)).to.not.throw;
});

test('A constructor of a structured type creates instances of itself', function () {
    const Maybe = data('Maybe');
    Maybe.$ = $.Nothing
            | $.Just('x');

    expect(Maybe.Just(5)).to.be.instanceof(Maybe.Just);
    expect(Maybe.Nothing()).to.be.instanceof(Maybe.Nothing);
});

test('A constructor of a structured type creates instances of its structured type', function () {
    const Maybe = data('Maybe');
    Maybe.$ = $.Nothing
            | $.Just('x');

    expect(Maybe.Just(5)).to.be.instanceof(Maybe);
    expect(Maybe.Nothing()).to.be.instanceof(Maybe);
});

test('A constructor of a structured type includes the structured type in its prototype chain', function () {
    const Maybe = data('Maybe');
    Maybe.$ = $.Nothing
            | $.Just('x');

    expect(Maybe.isPrototypeOf(Maybe.Nothing)).to.be.true;
    expect(Maybe.isPrototypeOf(Maybe.Just)).to.be.true;
});

test('A value of a structured type is deconstructible to its components', function () {
    const These = data('These');
    These.$ = $.This('x')
            | $.That('y')
            | $.Both('x', 'y');

    const {x, y} = These.Both(1, 2);
    expect(x).to.equal(1);
    expect(y).to.equal(2);
});

test.run();
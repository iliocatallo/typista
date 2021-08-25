/* jshint node: true, esversion: 6 */
/* jshint -W030 */
/* global describe, it */
'use strict';

const {data, $} = require('../lib/data'),
      {expect}  = require('chai');

describe('A structured type', function () {

    it('must have a name', function () {
        expect(() => data()).to.throw();
    });

    it('can be inhabited by 0-arity constructors', function () {
        const Level = data('Level');
        Level.$ = $.High
                | $.Medium
                | $.Low;

        expect(Level.High).to.exist;
    });

    it('can be inhabited by n-arity constructors', function () {
        const Result = data('Result');
        Result.$ = $.Ok('x')
                 | $.Error('err');

        expect(Result.Ok).to.exist;
        expect(Result.Error).to.exist;
    });

    it('can be inhabited by constructors of different arities', function () {
        const Maybe = data('Maybe');
        Maybe.$ = $.Nothing
                | $.Just('x');

        expect(Maybe.Nothing).to.exist;
        expect(Maybe.Just).to.exist;
    });

    it('is inhabitable exactly once', function () {
        const Void = data('Void');
        Void.$ = $.Void;
        expect(() => Void.$ = $.Void).to.throw();
    });

    it('can only be inhabited by constructors', function () {
        const Level = data('Level');
        expect(() => Level.$ = 5).to.throw();
    });

    it('is a named constructor function', function () {
        const Level = data('Level');
        Level.$ = $.High
                | $.Medium
                | $.Low;

        expect(Level).to.be.a('function');
        expect(Level.name).to.be.equal('Level');
    });

    it('cannot be instantied', function () {
        const Level = data('Level');
        Level.$ = $.High
                | $.Medium
                | $.Low;

        expect(() => new Level()).to.throw(TypeError);
    });
});

describe('A constructor of a structured type', function () {

    it('is a named constructor function', function () {
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

    it('can be invoked with or without new', function () {
        const Maybe = data('Maybe');
        Maybe.$ = $.Nothing
                | $.Just('x');

        expect(() => new Maybe.Nothing()).to.not.throw;
        expect(() => Maybe.Nothing()).to.not.throw;
        expect(() => new Maybe.Just(5)).to.not.throw;
        expect(() => Maybe.Just(5)).to.not.throw;
    });

    it('creates instances of itself', function () {
        const Maybe = data('Maybe');
        Maybe.$ = $.Nothing
                | $.Just('x');

        expect(Maybe.Just(5)).to.be.instanceof(Maybe.Just);
        expect(Maybe.Nothing()).to.be.instanceof(Maybe.Nothing);
    });

    it('creates instances of its structured type', function () {
        const Maybe = data('Maybe');
        Maybe.$ = $.Nothing
                | $.Just('x');

        expect(Maybe.Just(5)).to.be.instanceof(Maybe);
        expect(Maybe.Nothing()).to.be.instanceof(Maybe);
    });

    it('includes the structured type in its prototype chain', function () {
        const Maybe = data('Maybe');
        Maybe.$ = $.Nothing
                | $.Just('x');

        expect(Maybe.isPrototypeOf(Maybe.Nothing)).to.be.true;
        expect(Maybe.isPrototypeOf(Maybe.Just)).to.be.true;
    });
});

describe('A value of a structured type', function () {
    it('is deconstructible to its components', function () {
        const These = data('These');
        These.$ = $.This('x')
                | $.That('y')
                | $.Both('x', 'y');

        const {x, y} = These.Both(1, 2);
        expect(x).to.equal(1);
        expect(y).to.equal(2);
    });
});

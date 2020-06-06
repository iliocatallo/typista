/* jshint node: true, esversion: 6 */
/* jshint -W030 */
/* global describe, it */
'use strict';

const {data, $} = require('../lib/data'),
      {expect}  = require('chai');

describe('[data] A structured type', function () {

    it('should be inhabitable by 0-arity constructors', function () {
        const Level = data('Level');
        Level.$ = $.High
                | $.Medium
                | $.Low;

        expect(Level.High).to.exist;
    });

    it('should be inhabitable by n-arity constructors', function () {
        const Result = data('Result');
        Result.$ = $.Ok('x')
                 | $.Error('err');

        expect(Result.Ok).to.exist;
        expect(Result.Error).to.exist;
    });

    it('should be inhabitable by constructors of different arities', function () {
        const Maybe = data('Maybe');
        Maybe.$ = $.Nothing
                | $.Just('x');

        expect(Maybe.Nothing).to.exist;
        expect(Maybe.Just).to.exist;
    });

    it('should be inhabitable exactly once', function () {
        const Void = data('Void');
        Void.$ = $.Void;
        expect(() => Void.$ = $.Void).to.throw();
    });

    it('should not be inhabited without specifying a name for it', function () {
        expect(() => data()).to.throw();
    });

    it('should not be inhabited without specifying at least one constructor', function () {
        const Level = data('Level');
        expect(() => Level.$ = 5).to.throw();
    });

    it('should be a named constructor function', function () {
        const Level = data('Level');
        Level.$ = $.High
                | $.Medium
                | $.Low;

        expect(Level).to.be.a('function');
        expect(Level.name).to.be.equal('Level');
    });

    it('should not be instantiable', function () {
        const Level = data('Level');
        Level.$ = $.High
                | $.Medium
                | $.Low;

        expect(() => new Level()).to.throw(TypeError);
    });
});

describe('[data] A constructor of a structured type', function () {

    it('should be a named constructor function', function () {
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

    it('should be callable with or without new', function () {
        const Maybe = data('Maybe');
        Maybe.$ = $.Nothing
                | $.Just('x');

        expect(() => new Maybe.Nothing()).to.not.throw;
        expect(() => Maybe.Nothing()).to.not.throw;
        expect(() => new Maybe.Just(5)).to.not.throw;
        expect(() => Maybe.Just(5)).to.not.throw;
    });

    it('should create instances of itself', function () {
        const Maybe = data('Maybe');
        Maybe.$ = $.Nothing
                | $.Just('x');

        expect(Maybe.Just(5)).to.be.instanceof(Maybe.Just);
        expect(Maybe.Nothing()).to.be.instanceof(Maybe.Nothing);
    });

    it('should create instances of its structured type', function () {
        const Maybe = data('Maybe');
        Maybe.$ = $.Nothing
                | $.Just('x');

        expect(Maybe.Just(5)).to.be.instanceof(Maybe);
        expect(Maybe.Nothing()).to.be.instanceof(Maybe);
    });

    it('should include the structured type function in its prototype chain', function () {
        const Maybe = data('Maybe');
        Maybe.$ = $.Nothing
                | $.Just('x');

        expect(Maybe.isPrototypeOf(Maybe.Nothing)).to.be.true;
        expect(Maybe.isPrototypeOf(Maybe.Just)).to.be.true;
    });
});

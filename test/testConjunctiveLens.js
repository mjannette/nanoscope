"use strict";

var _ = require('lodash'),
    nanoscope = require('../index'),

    IndexedLens = nanoscope.IndexedLens,
    PathLens = nanoscope.PathLens,
    ConjunctiveLens = nanoscope.ConjunctiveLens,
    Compose = nanoscope.Compose;

describe('ConjunctiveLens', function () {
    var foobar = { foo: 1, bar: 2},
        lens = nanoscope(foobar),
        conjunctiveLens = new ConjunctiveLens(
            new PathLens('foo'),
            new PathLens('bar')
        );

    describe('#get', function () {
        it('should return the right stuff', function () {
            expect(conjunctiveLens.get(foobar)).to.eql([1, 2]);
        });
    });

    describe('#set', function () {
        it('should set foo and bar to 10', function () {
            expect(conjunctiveLens.set(foobar, 11)).to.eql({ foo: 11, bar: 11 });
        });
    });

    describe('#map', function () {
        it('should add 10 to foo and bar', function () {
            expect(conjunctiveLens.map(foobar, function (el) { return el + 10; })).to.eql({ foo: 11, bar: 12 });
        });
    });
});
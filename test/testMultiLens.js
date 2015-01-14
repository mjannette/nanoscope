"use strict";

var _ = require('lodash'),
    MultiLens = require('../src/MultiLens'),
    IndexedLens = require('../src/IndexedLens'),

    utils = require('./utils');

describe('MultiLens', function () {
    var testArr = [1, 2, 3, 4, 5],
        arrayLenses = [
            new IndexedLens(0),
            new IndexedLens(1)
        ],
        objectLenses = {
            head: new IndexedLens(0),
            last: new IndexedLens(-1)
        },
        arrayMultiLens = new MultiLens(arrayLenses),
        objectMultiLens = new MultiLens(objectLenses);

    describe('#MultiLens', function () {
        it('should have the correct array of lenses', function () {
            utils.testArrayEquals(arrayMultiLens._lenses, arrayLenses);
        });

        it('should have the right object of lenses', function () {
            JSON.stringify(objectMultiLens._lenses)
                .should.equal(JSON.stringify(objectLenses));
        });
    });

    describe('#get', function () {
        it('should return the correct array of values for an array MultiLens', function () {
            utils.testArrayEquals(arrayMultiLens.get(testArr), [1, 2]);
        });

        it('should return the correct object of values for an object MultiLens', function () {
            JSON.stringify(objectMultiLens.get(testArr))
                .should.equal(JSON.stringify({ head: 1, last: 5 }));
        });
    });

    describe('#set', function () {
        it('should set the first and second values of the array', function () {
            utils.testArrayEquals(arrayMultiLens.set(testArr, 0), [0, 0, 3, 4, 5]);
        });

        it('should set the first and last values of the array', function () {
            utils.testArrayEquals(objectMultiLens.set(testArr, 0), [0, 2, 3, 4, 0]);
        });
    });

    describe('#map', function () {
        var addTen = function (val) { return val + 10; };

        it('should add 10 to the first and second values of the array', function () {
            utils.testArrayEquals(arrayMultiLens.map(testArr, addTen), [11, 12, 3, 4, 5]);
        });

        it('should add 10 to the first and last values of the array', function () {
            utils.testArrayEquals(objectMultiLens.map(testArr, addTen), [11, 2, 3, 4, 15]);
        });
    });
});
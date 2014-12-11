var _ = require('lodash'),
    Lens = require('../src/Lens');

describe('Lens', function () {
    var testJS, testLens;

    beforeEach(function () {
        testJS = {
            a: {
                b: 'c'
            }
        };
        testLens = new Lens(
            function (obj) {
                return obj.a.b;
            },
            function (obj, func) {
                var newObj = _.cloneDeep(obj);
                newObj.a.b = func(newObj.a.b);
                return newObj;
            },
            { _extra: 'extra' }
        );
    });

    describe('#get', function () {
        it('should return c', function () {
            testLens.get(testJS).should.equal('c');
            testLens.focus(testJS).get().should.equal('c');
        });
    });

    describe('#set', function () {
        it('should return a new object with modified obj.a.b', function () {
            testLens.set(testJS, 9).a.b.should.equal(9);
            testLens.focus(testJS).set(9).a.b.should.equal(9);
        });
    });

    describe('#over', function () {
        it('should turn testJS.a.b into cat', function () {
            testLens.over(testJS, function (attr) { return attr + 'at'; }).a.b.should.equal('cat');
            testLens.focus(testJS).over(function (attr) { return attr + 'at'; }).a.b.should.equal('cat');
        });
    });

    describe('#focus', function () {
        it('should set the focus to 10', function () {
            testLens.focus(10)._focus.should.equal(10);
        });
    });

    describe('#blur', function () {
        it('should reset the focus to null', function () {
            testLens.focus(10);
            (testLens.blur()._focus === null).should.be.true;
        });
    });

    describe('#getFlags', function () {
        it('should return all custom options', function () {
            JSON.stringify(testLens.getFlags())
                .should.equal(JSON.stringify({ _extra: 'extra' }));
        });
    });
});
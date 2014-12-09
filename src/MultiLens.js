"use strict";

var _ = require('lodash'),
    Lens = require('./Lens'),

    MultiLens;

/**
 * A `MultiLens` is a `Lens` that can focus on multiple things at once. It takes
 * an array of `Lens`es or an object with `Lens`es as values; `get`, `set` and `over`
 * run corresponding functions over the input object for each internal lens.
 *
 * @param {object|Array} lenses Lenses used to focus on input objects.
 * @param {object} options Additional flags to add to the Lens instance
 * @returns {MultiLens}
 * @constructor
 */
MultiLens = function (lenses, options) {
    // Guard against no 'new'
    if (!this instanceof MultiLens) {
        return new MultiLens(lenses, options);
    }

    _.forEach(_.keys(options), function (key) {
        this[key] = options[key];
    });

    this._multi = true;

    if (_.isObject(lenses)) {
        _.forEach(_.keys(lenses), function (key) {
            if (!((lenses[key] instanceof Lens) || (lenses[key] instanceof MultiLens))) {
                throw new Error('Cannot construct MultiLens from non-lens');
            }
        });

        this._lenses = lenses;
    }

    if (_.isArray(lenses)) {
        _.forEach(lenses, function (lens) {
            if (!((lens instanceof Lens) || (lens instanceof MultiLens))) {
                throw new Error('Cannot construct MultiLens from non-lens');
            }
        });

        this._lenses = lenses;
    }

    return this;
};

MultiLens.prototype.get = function (obj) {
    var lenses = this._lenses,
        gets;

    if (_.isArray(lenses)) {
        gets = [];

        _.forEach(lenses, function (lens) {
            gets.push(lens.get(obj));
        });
    } else {
        if (_.isObject(lenses)) {
            gets = {};

            _.forEach(_.keys(lenses), function (key) {
                gets[key] = lenses[key].get(obj);
            });
        }
    }

    return gets;
};

MultiLens.prototype.over = function (obj, func) {
    var newObj = _.cloneDeep(obj);

    if (_.isArray(this._lenses)) {
        _.forEach(this._lenses, function (lens) {
            newObj = lens.over(newObj, func);
        });
    } else {
        if (_.isObject(this._lenses)) {
            _.forEach(_.values(this._lenses), function (lens) {
                newObj = lens.over(newObj, func);
            });
        }
    }

    return newObj;
};

MultiLens.prototype.set = function (obj, val) {
    return this.over(obj, _.constant(val));
};

module.exports = MultiLens;
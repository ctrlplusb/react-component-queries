'use strict';

var _mergeWith = require('../mergeWith');

var _mergeWith2 = _interopRequireDefault(_mergeWith);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('When mering props with `mergeWith`', function () {
  describe('and we are using "apply left prop" as resolver', function () {
    var resolver = function resolver(x) {
      return x;
    };
    it('it should keep all defined values on left side.', function () {
      var a = {
        string: 'string',
        zero: 0,
        negaive: -1,
        float: 0.555555,
        deep: {
          er: 'foo'
        },
        array: [0, 1],
        emptyArray: []
      };
      expect((0, _mergeWith2.default)(a, {}, resolver)).toMatchObject({
        string: 'string',
        zero: 0,
        negaive: -1,
        float: 0.555555,
        deep: {
          er: 'foo'
        },
        array: [0, 1],
        emptyArray: []
      });
    });

    it('it should keep all defined values on right side.', function () {
      var b = {
        string: 'string',
        zero: 0,
        negaive: -1,
        float: 0.555555,
        deep: {
          er: 'foo'
        },
        array: [0, 1],
        emptyArray: []
      };
      expect((0, _mergeWith2.default)({}, b, resolver)).toMatchObject({
        string: 'string',
        zero: 0,
        negaive: -1,
        float: 0.555555,
        deep: {
          er: 'foo'
        },
        array: [0, 1],
        emptyArray: []
      });
    });

    it('it should copy existing values and use left one on conflict.', function () {
      var a = {
        string: 'string'
      };
      var b = {
        string: 'my string'
      };
      expect((0, _mergeWith2.default)(a, b, resolver)).toMatchObject({
        string: 'string'
      });
    });
  });
});
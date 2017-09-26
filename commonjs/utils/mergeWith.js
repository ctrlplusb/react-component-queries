"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// :: (Object, Object, (any, any) => any) => Object
var mergeWith = function mergeWith(x, y, fn) {
  var result = Object.assign({}, x);

  Object.keys(y).forEach(function (key) {
    if (x[key] && y[key]) {
      result[key] = fn(x[key], y[key], key);
    } else {
      result[key] = y[key];
    }
  });

  return result;
};

exports.default = mergeWith;
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("prop-types"), require("react"), require("react-sizeme"));
	else if(typeof define === 'function' && define.amd)
		define(["prop-types", "react", "react-sizeme"], factory);
	else if(typeof exports === 'object')
		exports["react-component-queries"] = factory(require("prop-types"), require("react"), require("react-sizeme"));
	else
		root["react-component-queries"] = factory(root["PropTypes"], root["React"], root["SizeMe"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__, __WEBPACK_EXTERNAL_MODULE_8__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(6);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _invariant = __webpack_require__(5);

var _invariant2 = _interopRequireDefault(_invariant);

var _reactSizeme = __webpack_require__(8);

var _reactSizeme2 = _interopRequireDefault(_reactSizeme);

var _mergeWith = __webpack_require__(3);

var _mergeWith2 = _interopRequireDefault(_mergeWith);

var _getDisplayName = __webpack_require__(2);

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

var _shallowEqual = __webpack_require__(4);

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultConfig = {
  monitorHeight: false,
  monitorWidth: true,
  refreshRate: 16,
  pure: true,
  noPlaceholder: false
};

var defaultConflictResolver = function defaultConflictResolver(x, y) {
  return y;
};

var defaultSizeMeConfig = function defaultSizeMeConfig() {
  return {
    monitorWidth: defaultConfig.monitorWidth,
    monitorHeight: defaultConfig.monitorHeight,
    refreshRate: defaultConfig.refreshRate
  };
};

/**
 * :: Queries -> Component -> Component
 *
 * This is a HOC that provides you with the mechanism to specify Component
 * queries. A Component query is a similar concept to media queries except it
 * operates on the Component's width/height rather than the entire viewport
 * width/height.
 */
function componentQueries() {
  var queries = void 0;
  var sizeMeConfig = void 0;
  var pure = void 0;
  var conflictResolver = void 0;

  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  if (params.length === 1 && params[0].queries) {
    queries = params[0].queries || [];
    if (params[0].sizeMeConfig) {
      // Old school config style.
      sizeMeConfig = params[0].sizeMeConfig || defaultSizeMeConfig();
      pure = defaultConfig.pure; // this didn't exist before, so we default it.
    } else if (params[0].config) {
      // New school config style.
      pure = params[0].config.pure;
      var _params$0$config = params[0].config,
          monitorHeight = _params$0$config.monitorHeight,
          monitorWidth = _params$0$config.monitorWidth,
          refreshRate = _params$0$config.refreshRate,
          refreshMode = _params$0$config.refreshMode,
          noPlaceholder = _params$0$config.noPlaceholder;

      sizeMeConfig = {
        monitorHeight: monitorHeight != null ? monitorHeight : defaultConfig.monitorHeight,
        monitorWidth: monitorWidth != null ? monitorWidth : defaultConfig.monitorWidth,
        refreshRate: refreshRate != null ? refreshRate : defaultConfig.refreshRate,
        refreshMode: refreshMode != null ? refreshMode : defaultConfig.refreshMode,
        noPlaceholder: noPlaceholder != null ? noPlaceholder : defaultConfig.noPlaceholder
      };
    }
    conflictResolver = conflictResolver || params[0].conflictResolver || defaultConflictResolver;
    (0, _invariant2.default)(typeof conflictResolver === 'function', 'The conflict resolver you provide to ComponentQueries should be a function.');
    (0, _invariant2.default)(Array.isArray(queries), '"queries" must be provided as an array when using the complex configuration.');
  } else {
    queries = params;
  }

  // TODO: Consider removing this check.  Perhaps it's best to just silently
  // pass through if no queries were provided?  Maybe a development based
  // warning would be the most useful.
  (0, _invariant2.default)(queries.length > 0, 'You must provide at least one query to ComponentQueries.');
  (0, _invariant2.default)(queries.filter(function (q) {
    return typeof q !== 'function';
  }).length === 0, 'All provided queries for ComponentQueries should be functions.');

  // We will default out any configuration if it wasn't set.
  sizeMeConfig = sizeMeConfig || defaultSizeMeConfig();
  conflictResolver = conflictResolver || defaultConflictResolver;
  pure = pure != null ? pure : defaultConfig.pure;

  var mergeWithCustomizer = function mergeWithCustomizer(x, y, key) {
    if (x === undefined) return undefined;
    return conflictResolver(x, y, key);
  };

  return function WrapComponent(WrappedComponent) {
    var ComponentWithComponentQueries = function (_Component) {
      _inherits(ComponentWithComponentQueries, _Component);

      function ComponentWithComponentQueries() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ComponentWithComponentQueries);

        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ComponentWithComponentQueries.__proto__ || Object.getPrototypeOf(ComponentWithComponentQueries)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
          queryResult: {}
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(ComponentWithComponentQueries, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          var _props = this.props,
              size = _props.size,
              otherProps = _objectWithoutProperties(_props, ['size']);

          this.runQueries(size, otherProps);
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
          var size = this.props.size;

          var nextSize = nextProps.size,
              nextOtherProps = _objectWithoutProperties(nextProps, ['size']);

          if (!(0, _shallowEqual2.default)(size, nextSize)) {
            this.runQueries(nextSize, nextOtherProps);
          }
        }
      }, {
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps, nextState) {
          var _props2 = this.props,
              size = _props2.size,
              otherProps = _objectWithoutProperties(_props2, ['size']);

          var nextSize = nextProps.size,
              nextOtherProps = _objectWithoutProperties(nextProps, ['size']);

          return !pure || !(0, _shallowEqual2.default)(otherProps, nextOtherProps) || !(0, _shallowEqual2.default)(this.state.queryResult, nextState.queryResult);
        }
      }, {
        key: 'runQueries',
        value: function runQueries(_ref2, otherProps) {
          var width = _ref2.width,
              height = _ref2.height;

          var queryResult = queries.reduce(function (acc, cur) {
            return (0, _mergeWith2.default)(acc, cur({
              width: sizeMeConfig.monitorWidth ? width : null,
              height: sizeMeConfig.monitorHeight ? height : null
            }, otherProps), mergeWithCustomizer);
          }, {});

          this.setState({ queryResult: queryResult });
        }
      }, {
        key: 'render',
        value: function render() {
          var _props3 = this.props,
              size = _props3.size,
              otherProps = _objectWithoutProperties(_props3, ['size']);

          var allProps = (0, _mergeWith2.default)(this.state.queryResult, otherProps, mergeWithCustomizer);

          return _react2.default.createElement(WrappedComponent, allProps);
        }
      }]);

      return ComponentWithComponentQueries;
    }(_react.Component);

    ComponentWithComponentQueries.displayName = 'ComponentQueries(' + (0, _getDisplayName2.default)(WrappedComponent) + ')';
    ComponentWithComponentQueries.propTypes = {
      size: _propTypes2.default.shape({
        width: _propTypes2.default.number, // eslint-disable-line react/no-unused-prop-types
        height: _propTypes2.default.number // eslint-disable-line react/no-unused-prop-types
      }).isRequired
    };
    ComponentWithComponentQueries.WrappedComponent = WrappedComponent;


    return (0, _reactSizeme2.default)(sizeMeConfig)(ComponentWithComponentQueries);
  };
}

exports.default = componentQueries;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _componentQueries = __webpack_require__(0);

var _componentQueries2 = _interopRequireDefault(_componentQueries);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _componentQueries2.default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// :: Component => String
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

exports.default = getDisplayName;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = shallowEqual;
// Taken from react-redux.  Thanks Dan!

function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var hasOwn = Object.prototype.hasOwnProperty;
  for (var i = 0; i < keysA.length; i += 1) {
    // eslint-disable-line no-plusplus
    if (!hasOwn.call(objB, keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_8__;

/***/ })
/******/ ]);
});
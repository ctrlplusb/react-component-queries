'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _reactSizeme = require('react-sizeme');

var _reactSizeme2 = _interopRequireDefault(_reactSizeme);

var _mergeWith = require('./utils/mergeWith');

var _mergeWith2 = _interopRequireDefault(_mergeWith);

var _getDisplayName = require('./utils/getDisplayName');

var _getDisplayName2 = _interopRequireDefault(_getDisplayName);

var _shallowEqual = require('./utils/shallowEqual');

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
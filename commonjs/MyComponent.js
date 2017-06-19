'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// $FlowFixMe - using propTypes
function MyComponent(_ref) {
  var msg = _ref.msg;

  return _react2.default.createElement(
    'h1',
    null,
    msg
  );
}

MyComponent.propTypes = {
  msg: _react.PropTypes.string.isRequired
};

exports.default = MyComponent;